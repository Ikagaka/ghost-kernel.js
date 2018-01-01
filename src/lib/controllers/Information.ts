import { EventRoutingDefiner } from "lazy-event-router";
import { Shiorif } from "shiorif";
import { KernelPhase } from "../components/KernelPhase";
import { ShioriResources } from "../components/ShioriResources";
import { ShioriResourcesService } from "../services/ShioriResourcesService";
import { GhostKernelController } from "./GhostKernelController";

export const InformationRouting: EventRoutingDefiner = (routes) => {
  routes.controller(InformationController, (r2) => {
    r2.from(KernelPhase, (from, controller) => {
      from.on("initialNotifyFinished", controller.getInformations);
      from.on("halted", controller.halt);
    });
  });
};

export class InformationController extends GhostKernelController {
  async getInformations() {
    const shioriResources = new ShioriResources();
    const service = new ShioriResourcesService(this.kernel.component(Shiorif), shioriResources);
    await service.getUsername();
    await service.getSites("sakura.recommendsites");
    await service.getSites("sakura.portalsites");
    await service.getSites("kero.recommendsites");
    this.kernel.registerComponent(shioriResources);
    this.kernel.component(KernelPhase).initialInformationFixed();
  }

  halt() {
    this.kernel.unregisterComponent(ShioriResources);
  }
}
