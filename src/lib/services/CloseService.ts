import { Shiorif } from "shiorif";
import { GhostKernel } from "../GhostKernel";
import { KernelCloseOperation, KernelPhase } from "../index";

export class CloseService {
  private kernel: GhostKernel;

  constructor(kernel: GhostKernel) {
    this.kernel = kernel;
  }

  private get shiorif() { return this.kernel.component(Shiorif); }

  async perform(event: KernelCloseOperation.AllEvent) {
    const kernelPhase = this.kernel.component(KernelPhase);
    switch (event.by) {
      case "closeAll": await this.closeAll(event); break;
      case "close": await this.close(event); break;
      case "changing": await this.changing(event); break;
      default: await this.vanish(event);
    }
    // 仕様上はスクリプトが\-を返してくれるはず（そこでclosed立てる）
    // そうでなかったとき対策(SSPゆるさ)
    if (kernelPhase.phase < KernelPhase.Phase.closed) kernelPhase.closed();
  }

  private async closeAll(event: KernelCloseOperation.CloseEvent) {
    const shiorif = this.shiorif;
    const transaction = await shiorif.get3("OnCloseAll", [event.trigger]);
    if (transaction.response.to("3.0").status_line.code === 200) {
      await this.kernel.executeSakuraScript(transaction);
    } else {
      await shiorif.get3("OnClose", [event.trigger]).then(this.kernel.executeSakuraScript);
    }
  }

  private async close(event: KernelCloseOperation.CloseEvent) {
    await this.shiorif.get3("OnClose", [event.trigger]).then(this.kernel.executeSakuraScript);
  }

  private async changing(event: KernelCloseOperation.ChangingEvent) {
    const shiorif = this.shiorif;
    const transaction = await shiorif.get3("OnGhostChanging", [event.trigger, event.to.sakuraName, event.to.path]);
    if (transaction.response.to("3.0").status_line.code === 200) {
      await this.kernel.executeSakuraScript(transaction);
    } else {
      await shiorif.get3("OnClose", [event.trigger]).then(this.kernel.executeSakuraScript);
    }
  }

  // tslint:disable-next-line prefer-function-over-method
  private async vanish(_event: KernelCloseOperation.VanishEvent) {
    // TODO: vanishはselecting、selectedどっちで発生するのかとか未定
    throw new Error("cannot vanish (not implemented)");
  }
}
