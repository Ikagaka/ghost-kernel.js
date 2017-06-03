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

export class VersionRouting implements EventRouting {
  setup(routes: EventRouteSetter) {
    routes.fromAndController(Operation, VersionController, (from, controller) => {
      from.on("start", controller.start);
      from.on("halt", controller.halt);
    });
  }
}

export class ShioriVersionInfo extends EventEmitter {
  private _name?: string;
  private _version?: string;
  private _craftman?: string;
  private _craftmanw?: string;

  private _shiorif: Shiorif;

  constructor(shiorif: Shiorif) {
    super();
    this._shiorif = shiorif;
  }

  get name() { return this._name; }

  set name(value) { this._name = value; }

  get version() { return this._version; }

  set version(value) { this._version = value; }

  get craftman() { return this._craftman; }

  set craftman(value) { this._craftman = value; }

  get craftmanw() { return this._craftmanw; }

  set craftmanw(value) { this._craftmanw = value; }

  on(event: "fixed", listener: () => void): this;
  on(event: string, listener: Function) { return super.on(event, listener); }

  fixed() { this.emit("fixed"); }

  /**
   * SSPと同様の方式でバージョン情報を取得する
   *
   * 注意: このメソッドはshiorif.autoConvertRequestVersionを変更します。
   */
  async getVersionInfo() {
    const shiorif = this._shiorif;
    shiorif.autoConvertRequestVersion = "2.6";
    const {response} = await shiorif.getVersion2();
    const code = response.status_line.code;
    const version = response.status_line.version;
    // support 2.6 not 1.x
    if (code === 200 && version !== "3.0" && version !== "4.0") {
      const header = response.headers.header;
      this.version = "2.6";
      this.name = header["ID"];
      this.craftman = header["Craftman"];
      this.craftmanw = header["Craftman"];
    } else {
      // support 3.0 or 4.0
      if (version !== "4.0") {
        shiorif.autoConvertRequestVersion = "3.0";
      } else {
        shiorif.autoConvertRequestVersion = "4.0";
      }
      const [_version, name, craftman, craftmanw] = await Promise.all([
        (await shiorif.request3("GET", "version")).response.headers.Value,
        (await shiorif.request3("GET", "name")).response.headers.Value,
        (await shiorif.request3("GET", "craftman")).response.headers.Value,
        (await shiorif.request3("GET", "craftmanw")).response.headers.Value,
      ]);
      this.version = _version;
      this.name = name;
      this.craftman = craftman;
      this.craftmanw = craftmanw;
    }
    this.fixed();
  }
}

export class VersionController extends GhostKernelController {
  constructor(kernel: GhostKernel) {
    super(kernel);
    kernel.registerComponent(new ShioriVersionInfo(kernel.component(Shiorif)));
  }

  async start() {
    const kernel = this.kernel;
    const shiorif = kernel.component(Shiorif);
    // shiorif.allowAsyncRequest = false; // 将来的に非同期リクエストをサポートする場合
    shiorif.autoAdjustToResponseCharset = true;
    shiorif.defaultHeaders = {Sender: "ikagaka"};
    const shioriVersionInfo = kernel.component(ShioriVersionInfo);
    await shioriVersionInfo.getVersionInfo();
  }

  halt() {
    this.kernel.unregisterComponent(ShioriVersionInfo);
  }
}

GhostKernelRoutings.push(VersionRouting);
