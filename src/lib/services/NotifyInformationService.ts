import { NanikaGhostDirectory, NanikaStorage } from "nanika-storage";
import { Shiorif } from "shiorif";
import { GhostKernel } from "../GhostKernel";

export class NotifyInformationService {
  private kernel: GhostKernel;

  constructor(kernel: GhostKernel) {
    this.kernel = kernel;
  }

  async ownerghostname() {
    const descriptInfo = await this.kernel.component(NanikaGhostDirectory).descriptInfo();
    await this.kernel.component(Shiorif).notify3("ownerghostname", [descriptInfo.name]);
  }

  async otherghostname() {
    // TODO: ここでこの実装してよいのか
    /*
    const namedKernelManager = this.kernel.component(NamedKernelManager);
    const names = namedKernelManager.namedIds()
      .map((namedId) => namedKernelManager.kernel(namedId))
      .filter((kernel) => kernel.ghostDescript)
      .map((kernel) => [
        kernel.ghostDescript.name,
        kernel.components.Named.scopes[0].surface().surfaceId,
        kernel.components.Named.scopes[1] ? kernel.components.Named.scopes[1].surface().surfaceId : "",
      ].join("\u0001"));
    await this.kernel.shiorif.notify3("otherghostname", [names]);
    */
  }

  async basewareversion() {
    // TODO: バージョンとか
    await this.kernel.component(Shiorif).notify3("basewareversion", ["0.1.0", "Ikagaka"]);
  }

  async capability() {
    await this.kernel.component(Shiorif).notify3("capability", [
      "response.requestcharset",
    ]);
  }

  async OnNotifyOSInfo() {
    // TODO:
  }

  async OnNotifyFontInfo() {
    // TODO:
    // https://github.com/Pomax/Font.js or http://www.lalit.org/lab/javascript-css-font-detect/
  }

  async OnNotifySelfInfo() {
    /*
    const nanikaGhostDirectory = this.kernel.nanikaGhostDirectory;
    const ghostDescript = await nanikaGhostDirectory.descriptInfo();
    const shellDescript = this.kernel.component(Named).shell.descript;
    const balloonDescript = this.kernel.component(Named).balloon.descript;
    // TODO: abs path
    await this.kernel.shiorif.notify3("OnNotifySelfInfo", [
      ghostDescript.name,
      ghostDescript.sakura.name,
      ghostDescript.kero.name || "",
      shellDescript.name,
      null,
      balloonDescript.name,
      null,
    ]);
    */
  }

  async OnNotifyBalloonInfo() {
    // TODO:
    /*
    await this.kernel.shiorif.notify3("OnNotifyBalloonInfo", [
      this.kernel.balloonDescript.name,
      null,
      null,
    ]);
    */
  }

  async OnNotifyShellInfo() {
    // TODO:
    /*
    await this.kernel.shiorif.notify3("OnNotifyShellInfo", [
      this.kernel.shellDescript.name,
      null,
      null,
    ]);
    */
  }

  async OnNotifyUserInfo() {
    // TODO:
  }

  async OnNotifyDressupInfo() {
    // TODO:
  }

  OnNotifyBrowserInfo() {
    // TODO:
  }

  async ghostpathlist() {
    // TODO:
  }

  async balloonpathlist() {
    // TODO:
  }

  async installedghostname() {
    const names = await this.kernel.component(NanikaStorage).ghostNames();
    await this.kernel.component(Shiorif).notify3("installedghostname", names);
  }

  async installedballoonname() {
    const names = await this.kernel.component(NanikaStorage).balloonNames();
    await this.kernel.component(Shiorif).notify3("installedballoonname", names);
  }

  async installedshellname() {
    /*
    const names = await this.kernel.nanikaStorage.shellNames(this.kernel.namedId);
    await this.kernel.shiorif.notify3("installedshellname", names);
    */
  }

  async rateofusegraph() {
    // TODO:
  }

  async uniqueid() {
    // TODO:
  }
}
