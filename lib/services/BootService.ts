import { NanikaGhostDirectory } from "nanika-storage";
import { Shiorif } from "shiorif";
import { GhostKernel } from "../GhostKernel";
import { KernelPhase, KernelStartOperation } from "../index";

export class BootService {
  private kernel: GhostKernel;

  constructor(kernel: GhostKernel) {
    this.kernel = kernel;
  }

  private get shiorif() { return this.kernel.component(Shiorif); }
  private get kernelPhase() { return this.kernel.component(KernelPhase); }
  private get kernelStartOperation() { return this.kernel.component(KernelStartOperation); }
  private get nanikaGhostMasterDirectory() { return this.kernel.component(NanikaGhostDirectory).master(); }

  async perform() {
    const kernelStartOperation = this.kernelStartOperation;
    const nanikaGhostMasterDirectory = this.nanikaGhostMasterDirectory;
    const profile = await nanikaGhostMasterDirectory.readProfile();
    const bootCount = profile.bootCount as number || 0;
    profile.bootCount = bootCount + 1;
    if (bootCount === 1) {
      await this.firstBoot(profile);
      // tslint:disable-next-line prefer-switch
    } else if (kernelStartOperation.startedBy === "boot") {
      await this.boot(profile);
    } else if (kernelStartOperation.startedBy === "changed") {
      await this.changed(profile);
    } else if (kernelStartOperation.startedBy === "called") {
      await this.called(profile);
    } else {
      await this.vanished(profile);
    }
    await nanikaGhostMasterDirectory.writeProfile(profile); // 起動が成功してから保存
  }

  private async firstBoot(profile: {[name: string]: any}) {
    const shiorif = this.shiorif;
    const kernelPhase = this.kernelPhase;
    const vanishCount = profile.vanishCount || 0;
    const transaction = await shiorif.get3("OnFirstBoot", [vanishCount]);
    if (transaction.response.to("3.0").status_line.code === 200) {
      kernelPhase.materialized();
      await this.kernel.executeSakuraScript(transaction);
    } else {
      const transaction2 = await shiorif.get3("OnBoot", this.bootHeaders(profile.shellname));
      kernelPhase.materialized();
      await this.kernel.executeSakuraScript(transaction2);
    }
    kernelPhase.bootCompleted();
  }

  private async boot(profile: {[name: string]: any}) {
    const shiorif = this.shiorif;
    const kernelPhase = this.kernelPhase;
    const transaction = await shiorif.get3("OnBoot", this.bootHeaders(profile.shellname));
    kernelPhase.materialized();
    await this.kernel.executeSakuraScript(transaction);
    kernelPhase.bootCompleted();
  }

  // tslint:disable-next-line prefer-function-over-method
  private bootHeaders(shellname: string) {
    return {
      Reference0: shellname,
      Reference6: "", // TODO: 前回の処理中で落ちた時にhalt
      Reference7: "", // TODO: 前回の処理中で落ちたゴースト名
    };
  }

  private async changed(profile: {[name: string]: any}) {
    await this.changedCore("OnGhostChanged", profile);
  }

  private async called(profile: {[name: string]: any}) {
    await this.changedCore("OnGhostCalled", profile);
  }

  private async vanished(profile: {[name: string]: any}) {
    await this.changedCore("OnVanished", profile);
  }

  private async changedCore(event: "OnGhostChanged" | "OnGhostCalled" | "OnVanished", profile: any) {
    const shiorif = this.shiorif;
    const kernelPhase = this.kernelPhase;
    const from = this.kernelStartOperation.from;
    const transaction = await shiorif.get3(event, {
      Reference0: from.sakuraName,
      Reference1: from.script,
      Reference2: from.name,
      Reference3: from.path,
      Reference7: profile.shellname, // TODO: 現シェル名取得これでいい？
    });
    if (transaction.response.to("3.0").status_line.code === 200) {
      kernelPhase.materialized();
      await this.kernel.executeSakuraScript(transaction);
    } else {
      const transaction2 = await shiorif.get3("OnBoot", this.bootHeaders(profile.shellname));
      kernelPhase.materialized();
      await this.kernel.executeSakuraScript(transaction2);
    }
    kernelPhase.bootCompleted();
  }
}
