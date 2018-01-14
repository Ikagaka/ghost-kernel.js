import { EventRoutingDefiner } from "lazy-event-router";
import { KernelPhase } from "../components/KernelPhase";
import { NotifyInformationService } from "../services/NotifyInformationService";
import { GhostKernelController } from "./GhostKernelController";

export const NotifyInformationRouting: EventRoutingDefiner = (routes) => {
  routes.fromAndController(KernelPhase, NotifyInformationController, (from, controller) => {
    from.on("versionFixed", controller.initialize);
  });
};

export class NotifyInformationController extends GhostKernelController {
  async initialize() {
    const notifyInformation = new NotifyInformationService(this.kernel);
    await notifyInformation.ownerghostname();
    await notifyInformation.otherghostname();
    await notifyInformation.basewareversion();
    await notifyInformation.capability();
    await notifyInformation.OnNotifyOSInfo();
    await notifyInformation.OnNotifyFontInfo();
    await notifyInformation.OnNotifySelfInfo();
    await notifyInformation.OnNotifyBalloonInfo();
    await notifyInformation.OnNotifyShellInfo();
    await notifyInformation.OnNotifyUserInfo();
    await notifyInformation.OnNotifyDressupInfo();
    await notifyInformation.OnNotifyBrowserInfo();
    await notifyInformation.ghostpathlist();
    await notifyInformation.balloonpathlist();
    await notifyInformation.installedghostname();
    await notifyInformation.installedballoonname();
    await notifyInformation.installedshellname();
    await notifyInformation.rateofusegraph();
    await notifyInformation.uniqueid();
    this.kernel.component(KernelPhase).initialNotifyFinished();
  }
}
