import {EventEmitter} from "events";
import {
  EventRouteSetter,
  EventRouting,
} from "lazy-event-router";
import {NanikaGhostDirectory} from "nanika-storage";
import {Shiorif} from "shiorif";
import {
  GhostKernel,
  GhostKernelController,
  GhostKernelRoutings,
  Operation,
} from "../ghost-kernel";
import {Information} from "./information";

export class OperationRouting implements EventRouting {
  setup(routes: EventRouteSetter) {
    routes.controller(OperationController, (routes2) => {
      routes2.from(Information, (from, controller) => {
        from.on("fixed", controller.boot);
      });
      routes2.from(Operation, (from, controller) => {
        from.on("changeShell", controller.change_shell);
        from.on("changeBalloon", controller.change_balloon);
        from.on("close", controller.close);
        from.on("halt", controller.halt);
      });
    });
  }
}

// TODO 分け方がざっくりしている
export class OperationController extends GhostKernelController {
  constructor(kernel: GhostKernel) {
    super(kernel);
  }

  async boot() {
    const shiorif = this.kernel.component(Shiorif);
    const profile = await this.kernel.component(NanikaGhostDirectory).readProfile();
    const bootCount = profile["bootCount"] || 0;
    profile["bootCount"] = bootCount + 1;
    if (bootCount === 1) {
      const vanishCount = profile["vanishCount"] || 0;
      const transaction = await shiorif.get3("OnFirstBoot", [vanishCount]);
      if (transaction.response.to("3.0").status_line.code === 200) {
        await this.kernel.executeSakuraScript(transaction);
      } else {
        await shiorif.get3("OnBoot", this._bootHeaders(profile.shellname)).then(this.kernel.executeSakuraScript);
      }
      this.kernel.emit("boot_complete");
    } else {
      const transaction = await shiorif.get3("OnBoot", this._bootHeaders(profile.shellname));
      this.kernel.emit("boot_done");
      await this.kernel.executeSakuraScript(transaction);
      this.kernel.emit("boot_complete");
    }
    await this.kernel.profile(profile); // 起動が成功してから保存
  }

  _bootHeaders(shellname) {
    return {
      Reference0: shellname,
      Reference6: "", // TODO
      Reference7: "", // TODO
    };
  }

  async close() {
    const shiorif = this.kernel.components.Shiorif;
    if (all) {
      const transaction = await shiorif.get3("OnCloseAll", [reason]);
      if (transaction.response.to("3.0").status_line.code === 200) {
        await this.kernel.executeSakuraScript(transaction);
      } else {
        await shiorif.get3("OnClose", [reason]).then(this.kernel.executeSakuraScript);
      }
    } else {
      await shiorif.get3("OnClose", [reason]).then(this.kernel.executeSakuraScript);
    }
    if (this.halting) return;
    this.kernel.halt(reason); // スクリプトが\-を返さなかったとき対策
  }

  async halt() {
    this.halting = true; // TODO

    this.kernel.unregisterComponent("TimerEventSource");
    this.kernel.components.NamedKernelManager.components.NamedManager.vanish(this.kernel.components.Named.namedId);
    this.kernel.unregisterComponent("Named");
    await this.kernel.components.Shiorif.unload();
    this.kernel.unregisterComponent("Shiorif");
    this.kernel.components.NamedKernelManager.unregisterKernel(this.kernel.namedId);
    this.kernel.unregisterComponent("NamedKernelManager");
    this.kernel.unregisterComponent(Operation);
  }

  async change_shell(shellname) {
    const shiorif = this.kernel.components.Shiorif;
    const shellViewName = await this.kernel.components.NanikaStorage.shell_name(this.kernel.namedId, shellname);
    await shiorif.get3("OnShellChanging", [shellViewName, this.kernel.components.Named.shell.descript.name, ""]).then(this.kernel.executeSakuraScript);  // TODO: path

    const shell = await this.kernel.components.NamedKernelManager._get_shell(this.kernel.namedId, shellname);
    this.kernel.components.Named.changeShell(shell);

    const profile = await this.kernel.profile();
    profile.shellname = shellname;
    await this.kernel.profile(profile);

    await shiorif.get3("OnShellChanged", [shellViewName, this.kernel.ghostDescript.name, ""]).then(this.kernel.executeSakuraScript);  // TODO: path
  }

  async change_balloon(balloonname) {
    const balloon = await this.kernel.components.NamedKernelManager._get_balloon(balloonname);
    this.kernel.components.Named.changeBalloon(balloon);

    const profile = await this.kernel.profile();
    profile.balloonname = balloonname;
    await this.kernel.profile(profile);

    const shiorif = this.kernel.components.Shiorif;
    const balloonViewName = await this.kernel.components.NanikaStorage.balloon_name(balloonname);
    await shiorif.get3("OnBalloonChange", [balloonViewName, ""]).then(this.kernel.executeSakuraScript);  // TODO: path
  }
}

GhostKernelControllers.OperationController = OperationController;
GhostKernelRoutings.push(OperationRouting);
