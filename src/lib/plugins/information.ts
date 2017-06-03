import {EventEmitter} from "events";
import {
  EventRouteSetter,
  EventRouting,
} from "lazy-event-router";
import {Shiorif} from "shiorif";
import {
  GhostKernel,
  GhostKernelController,
  GhostKernelRoutings,
  Operation,
} from "../ghost-kernel";
import {NotifyInformation} from "./notify_information";

export class InformationRouting implements EventRouting {
  setup(routes: EventRouteSetter) {
    routes.controller(InformationController, (r2) => {
      r2.from(NotifyInformation, (from, controller) => {
        from.on("completed", controller.getInformations);
      });
      r2.from(Operation, (from, controller) => {
        from.on("halt", controller.halt);
      });
    });
  }
}

export class InformationController extends GhostKernelController {
  constructor(kernel: GhostKernel) {
    super(kernel);
    kernel.registerComponent(new Information(kernel.component(Shiorif)));
  }

  async getInformations() {
    const kernel = this.kernel;
    const information = kernel.component(Information);
    await information.getUsername();
    await information.getSites("sakura.recommendsites");
    await information.getSites("sakura.portalsites");
    await information.getSites("kero.recommendsites");
    information.emit("fixed");
  }

  halt() {
    this.kernel.unregisterComponent(Information);
  }
}

export class Information extends EventEmitter {
  /** ユーザー名 */
  username?: string;

  /** さくら側 */
  sakura: {
    /** おすすめサイト */
    recommendsites: Sites,
    /** ポータルサイト */
    portalsites: Sites,
  } = {
    recommendsites: new Sites(),
    portalsites: new Sites(),
  };

  /** うにゅう側 */
  kero: {
    /** おすすめサイト */
    recommendsites: Sites,
  } = {
    recommendsites: new Sites(),
  };

  private _shiorif: Shiorif;

  constructor(shiorif: Shiorif) {
    super();
    this._shiorif = shiorif;
  }

  /** さくら側おすすめサイト */
  get ["sakura.recommendsites"]() { return this.sakura.recommendsites; }

  /** さくら側ポータルサイト */
  get ["sakura.portalsites"]() { return this.sakura.portalsites; }

  /** うにゅう側おすすめサイト */
  get ["kero.recommendsites"]() { return this.kero.recommendsites; }

  on(event: "fixed", listener: () => void) {
    return super.on(event, listener);
  }
  emit(event: "fixed") {
    return super.emit(event);
  }

  async getUsername() {
    this.username = (await this._shiorif.request3("GET", "username")).response.to("3.0").headers.Value;
  }

  async getSites(type: "sakura.recommendsites" | "sakura.portalsites" | "kero.recommendsites") {
    let sites: Sites;
    switch (type) {
      case "sakura.recommendsites": sites = this.sakura.recommendsites; break;
      case "sakura.portalsites": sites = this.sakura.portalsites; break;
      default: sites = this.kero.recommendsites; break;
    }
    sites.length = 0; // clear
    for (const site of (await this._shiorif.get3(type)).response.headers.ValueSeparated2()) {
      sites.push(new SiteMenu(site[0], site[1], site[2], site[3]));
    }
  }
}

/** サイトリスト */
export class Sites extends Array<SiteMenu> {
}

/** サイト情報 */
export class SiteMenu {
  private _name: string;
  private _url: string;
  private _banner: string;
  private _script: string;

  /**
   * @param name 項目名
   * @param url URL
   * @param banner バナー画像パス
   * @param script 選択時トークスクリプト
   */
  constructor(name: string, url: string, banner: string, script: string) {
    this._name = name;
    this._url = url;
    this._banner = banner;
    this._script = script;
  }

  /** 項目名 */
  get name() { return this._name; }

  /** URL */
  get url() { return this._url; }

  /** バナー画像パス */
  get banner() { return this._banner; }

  /** 選択時トークスクリプト */
  get script() { return this._script; }
}

GhostKernelRoutings.push(InformationRouting);
