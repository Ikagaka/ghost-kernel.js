import { EventRoutingDefiner } from "lazy-event-router";
import { Shiorif } from "shiorif";
import { KernelPhase, KernelStartOperation } from "../components";
import { ShioriVersionInfo } from "../components/ShioriVersionInfo";
import { GhostKernelController } from "./GhostKernelController";

export const VersionRouting: EventRoutingDefiner = (routes) => {
  routes.controller(VersionController, (r) => {
    r.from(KernelStartOperation, (from, controller) => {
      from.on("start", controller.start);
    });
    r.from(KernelPhase, (from, controller) => {
      from.on("halted", controller.halt);
    });
  });
};

export class VersionController extends GhostKernelController {
  async start() {
    const kernel = this.kernel;
    const shiorif = kernel.component(Shiorif);
    // shiorif.allowAsyncRequest = false; // 将来的に非同期リクエストをサポートする場合
    shiorif.autoAdjustToResponseCharset = true;
    shiorif.defaultHeaders = { Sender: "ikagaka" };
    const shioriVersionInfo = await VersionService.getShioriVersionInfo(shiorif);
    kernel.registerComponent(shioriVersionInfo);
    kernel.component(KernelPhase).versionFixed();
  }

  halt() {
    this.kernel.unregisterComponent(ShioriVersionInfo);
  }
}

export class VersionService {
  /**
   * SSPと同様の方式でバージョン情報を取得する
   *
   * 注意: このメソッドはshiorif.autoConvertRequestVersionを変更します。
   */
  static async getShioriVersionInfo(shiorif: Shiorif) {
    shiorif.autoConvertRequestVersion = "2.6";
    // SHIORI/2.6 GET Versionを問い合わせる
    const { response } = await shiorif.getVersion2();
    const code = response.status_line.code;
    const version = response.status_line.version;
    if (!version) throw new Error("no shiori protocol version");
    if (code === 200 && /2\.\d/.test(version)) {
      // SHIORI/2.6で返ってきたらそのまま読む
      const header = response.headers.header;
      const _version = "2.6";
      const name = header["ID"];
      const craftman = header["Craftman"];
      return new ShioriVersionInfo(name, _version, craftman, craftman);
    } else if (/3\.\d/.test(version)) {
      // SHIORI/3.0で返ってきたら以後SHIORI/3.0で通信することにし、取り直す
      shiorif.autoConvertRequestVersion = "3.0";
      const [_version, name, craftman, craftmanw] = await Promise.all([
        (await shiorif.request3("GET", "version")).response.headers.Value as string,
        (await shiorif.request3("GET", "name")).response.headers.Value as string,
        (await shiorif.request3("GET", "craftman")).response.headers.Value as string,
        (await shiorif.request3("GET", "craftmanw")).response.headers.Value as string,
      ]);
      return new ShioriVersionInfo(name, _version, craftman, craftmanw);
    } else {
      throw new Error(`unknown shiori protocol version: ${version}`);
    }
  }
}
