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
} from "../ghost-kernel";
import {ShioriVersionInfo} from "./version";

export class NotifyInformationRouting implements EventRouting {
  setup(routes: EventRouteSetter) {
    routes.fromAndController(ShioriVersionInfo, NotifyInformationController, (from, controller) => {
      from.on("fixed", controller.initialize);
    });
  }
}

export class NotifyInformation extends EventEmitter {
  on(event: "completed", listener: () => void) {
    return super.on(event, listener);
  }
  emit(event: "completed") {
    return super.emit(event);
  }
}

export class NotifyInformationController extends GhostKernelController {
  constructor(kernel: GhostKernel) {
    super(kernel);
    kernel.registerComponent(new NotifyInformation());
  }

  async initialize() {
    await this.ownerghostname();
    await this.otherghostname();
    await this.basewareversion();
    await this.capability();
    await this.OnNotifyOSInfo();
    await this.OnNotifyFontInfo();
    await this.OnNotifySelfInfo();
    await this.OnNotifyBalloonInfo();
    await this.OnNotifyShellInfo();
    await this.OnNotifyUserInfo();
    await this.OnNotifyDressupInfo();
    await this.OnNotifyBrowserInfo();
    await this.ghostpathlist();
    await this.balloonpathlist();
    await this.installedghostname();
    await this.installedballoonname();
    await this.installedshellname();
    await this.rateofusegraph();
    await this.uniqueid();
    this._notifyInformation.emit("completed");
  }

  async ownerghostname() {
    const descriptInfo = await this.kernel.component(NanikaGhostDirectory).descriptInfo();
    await this._shiorif.notify3("ownerghostname", [descriptInfo.name]);
  }

  otherghostname() {
    // TODO ここでこの実装してよいのか
    const namedKernelManager = this.kernel.components.NamedKernelManager;
    const names = namedKernelManager.namedIds()
      .map((namedId) => namedKernelManager.kernel(namedId))
      .filter((kernel) => kernel.ghostDescript)
      .map((kernel) => [
        kernel.ghostDescript.name,
        kernel.components.Named.scopes[0].surface().surfaceId,
        kernel.components.Named.scopes[1] ? kernel.components.Named.scopes[1].surface().surfaceId : "",
      ].join("\u0001"));
    return this.kernel.component(Shiorif).notify3("otherghostname", [names]);
  }

  async basewareversion() {
    // TODO バージョンとか
    await this._shiorif.notify3("basewareversion", ["0.1.0", "Ikagaka"]);
  }

  async capability() {
    await this._shiorif.notify3("capability", [
      "response.requestcharset",
    ]);
  }

  async OnNotifyOSInfo() {
    // TODO
  }

  async OnNotifyFontInfo() {
    // TODO
    // https://github.com/Pomax/Font.js or http://www.lalit.org/lab/javascript-css-font-detect/
  }

  async OnNotifySelfInfo() {
    const nanikaGhostDirectory = this.kernel.component(NanikaGhostDirectory);
    const ghostDescript = await nanikaGhostDirectory.descriptInfo();
    const shellDescript = this.kernel.component(Named).shell.descript;
    const balloonDescript = this.kernel.component(Named).balloon.descript;
    // TODO abs path
    await this._shiorif.notify3("OnNotifySelfInfo", [
      ghostDescript.name,
      ghostDescript.sakura.name,
      ghostDescript.kero.name || "",
      shellDescript.name,
      null,
      balloonDescript.name,
      null,
    ]);
  }

  async OnNotifyBalloonInfo() {
    // TODO
    await this._shiorif.notify3("OnNotifyBalloonInfo", [
      this.kernel.balloonDescript.name,
      null,
      null,
    ]);
  }

  async OnNotifyShellInfo() {
    // TODO
    await this._shiorif.notify3("OnNotifyShellInfo", [
      this.kernel.shellDescript.name,
      null,
      null,
    ]);
  }

  async OnNotifyUserInfo() {
    // TODO
  }

  async OnNotifyDressupInfo() {
    // TODO
  }

  OnNotifyBrowserInfo() {
    // TODO
  }

  async ghostpathlist() {
    // TODO
  }

  async balloonpathlist() {
    // TODO
  }

  async installedghostname() {
    const names = await this.kernel.components.NanikaStorage.ghost_names();
    return this.kernel.components.Shiorif.notify3("installedghostname", names);
  }

  async installedballoonname() {
    const names = await this.kernel.components.NanikaStorage.balloon_names();
    return this.kernel.components.Shiorif.notify3("installedballoonname", names);
  }

  async installedshellname() {
    const names = await this.kernel.components.NanikaStorage.shell_names(this.kernel.namedId);
    return this.kernel.components.Shiorif.notify3("installedshellname", names);
  }

  async rateofusegraph() {
    // TODO
  }

  async uniqueid() {
    // TODO
  }

  private get _shiorif() { return this.kernel.component(Shiorif); }
  private get _notifyInformation() { return this.kernel.component(NotifyInformation); }
}

GhostKernelRoutings.push(NotifyInformationRouting);
