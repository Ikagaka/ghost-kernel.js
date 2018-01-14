import { EventRoutingDefiner } from "lazy-event-router";
import { Shiorif } from "shiorif";
import { KernelPhase, KernelStartOperation } from "../components";
import { ShioriVersionInfo } from "../components/ShioriVersionInfo";
import { VersionService } from "../services/VersionService";
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
