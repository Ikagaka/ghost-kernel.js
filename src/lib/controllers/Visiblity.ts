import { EventRoutingDefiner } from "lazy-event-router";
import { Shiorif } from "shiorif";
import { KernelPhase, KernelStartOperation } from "../components";
import { Visibility } from "../components/Visibility";
import { GhostKernelController } from "./GhostKernelController";

export const VisibilityRouting: EventRoutingDefiner = (routes) => {
  routes.controller(VisibilityController, (routes2) => {
    routes2.from(KernelStartOperation, (from, controller) => {
      from.on("start", controller.start);
    });
    routes2.from(KernelPhase, (from, controller) => {
      from.on("halted", controller.halt);
    });
    routes2.from(Visibility, (from, controller) => {
      from.on("visibilityChange", controller.visibilityChange);
    });
  });
};

export class VisibilityController extends GhostKernelController {
  start() {
    this.kernel.registerComponent(new Visibility());
  }

  halt() {
    this.visibility.unwatchVisibility();
    this.kernel.unregisterComponent(Visibility);
  }

  async visibilityChange(visibility: boolean) {
    const shiorif = this.kernel.component(Shiorif);
    if (visibility) {
      await shiorif.get3("OnWindowStateRestore").then(this.kernel.executeSakuraScript);
    } else {
      await shiorif.get3("OnWindowStateMinimize").then(this.kernel.executeSakuraScript);
    }
  }

  private get visibility() {
    const component = this.kernel.component(Visibility);
    if (!component) throw new Error("Visibility not initialized");
    return component;
  }
}
