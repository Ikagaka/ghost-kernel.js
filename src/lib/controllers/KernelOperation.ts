import { EventRoutingDefiner } from "lazy-event-router";
// import { NanikaGhostDirectory, NanikaStorage } from "nanika-storage";
import {Shiorif} from "shiorif";
// import { UkagakaDescriptInfo } from "ukagaka-install-descript-info";
import { TimerEventSource } from "ukagaka-timer-event-source";
import { /*KernelChangeOperation,*/ KernelCloseOperation, KernelPhase } from "../components";
import { BootService } from "../services/BootService";
import { CloseService } from "../services/CloseService";
import { GhostKernelController } from "./GhostKernelController";

export const KernelOperationRouting: EventRoutingDefiner = (routes) => {
  routes.controller(KernelOperationController, (routes2) => {
    routes2.from(KernelPhase, (from, controller) => {
      from.on("initialInformationFixed", controller.boot);
      from.on("closed", controller.closed);
    });
    /* routes2.from(KernelChangeOperation, (from, controller) => {
      from.on("changeShell", controller.changeShell);
      from.on("changeBalloon", controller.changeBalloon);
    }); */
    routes2.from(KernelCloseOperation, (from, controller) => {
      from.on("close", controller.close);
    });
  });
};

// TODO: 分け方がざっくりしている
export class KernelOperationController extends GhostKernelController {
  async boot() {
    await new BootService(this.kernel).perform();
  }

  async close(event: KernelCloseOperation.AllEvent) {
    await new CloseService(this.kernel).perform(event);
  }

  async closed() {
    // TODO: 色々実装されてない
    // this.kernel.component(NamedKernelManager).component(NamedManager).vanish(this.kernel.component(Named).namedId);
    // this.kernel.unregisterComponent(Named);
    // this.kernel.component(NamedKernelManager).unregisterKernel(this.kernel.component(UkagakaDescriptInfo)!.name);
    // this.kernel.unregisterComponent(NamedKernelManager);
    this.kernel.unregisterComponent(TimerEventSource);
    await this.kernel.component(Shiorif).unload();
    this.kernel.unregisterComponent(Shiorif);
    await this.kernel.component(KernelPhase).halted();
  }

  // TODO: 色々実装されてないので一旦全面未実装とする
  /*
  async changeShell(shellName: string) {
    const shiorif = this.kernel.component(Shiorif);
    const nanikaStorage = this.kernel.component(NanikaStorage);
    const descriptInfo = await this.kernel.component(NanikaGhostDirectory).descriptInfo();
    const shellViewName = await nanikaStorage.shellName(descriptInfo.id, shellName);
    // TODO: path
    await shiorif.get3("OnShellChanging", [shellViewName, this.kernel.component(Named).shell.descript.name, ""]).
      then(this.kernel.executeSakuraScript);

    const shell = await this.kernel.component(NamedKernelManager)._get_shell(this.kernel.namedId, shellName);
    this.kernel.component(Named).changeShell(shell);

    const profile = await this.kernel.profile();
    profile.shellname = shellName;
    await this.kernel.profile(profile);

    // TODO: path
    await shiorif.get3("OnShellChanged", [shellViewName, this.kernel.ghostDescript.name, ""]).
      then(this.kernel.executeSakuraScript);
  }

  async changeBalloon(balloonName: string) {
    const balloon = await this.kernel.component(NamedKernelManager)._get_balloon(balloonName);
    this.kernel.component(Named).changeBalloon(balloon);

    const profile = await this.kernel.profile();
    profile.balloonname = balloonName;
    await this.kernel.profile(profile);

    const shiorif = this.kernel.component(Shiorif);
    const balloonViewName = await this.kernel.component(NanikaStorage).balloonName(balloonName);
    await shiorif.get3("OnBalloonChange", [balloonViewName, ""]).then(this.kernel.executeSakuraScript);  // TODO: path
  }
  */
}
