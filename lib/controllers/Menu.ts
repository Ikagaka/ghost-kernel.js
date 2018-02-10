// tslint:disable max-classes-per-file

import { ContextMenuEvent, Named } from "cuttlebone";
import { EventRoutingDefiner } from "lazy-event-router";
import { SakuraScriptExecuter } from "sakurascript-executer";
import { GhostKernel } from "../GhostKernel";
import { KernelPhase } from "../index";
import { GhostKernelController } from "./GhostKernelController";

export class Menu {
  private readonly kernel: GhostKernel;

  constructor(kernel: GhostKernel) {
    this.kernel = kernel;
  }

  contextmenu(_event: ContextMenuEvent) {
    // const scopeId = _event.scopeId;
    return {
      items: {
        // changeGhost:   {name: "ゴースト切り替え", items: this.changeGhost()},
        // callGhost:     {name: "他のゴーストを呼ぶ", items: this.callGhost()},
        // changeShell:   {name: "シェル", items: this.changeShell()},
        // changeBalloon: {name: "バルーン", items: this.changeBalloon()},
        inputScript:   {name: "開発用 スクリプト入力",
                        callback:
                          () => this.kernel.component(SakuraScriptExecuter).execute(window.prompt("send") || "")},
        quit:          {name: "終了", callback: () => this.kernel.closeBy.close("user")},
        // quitAll:       {name: "全て終了", callback: () => this.kernel.components.NamedKernelManager.close("user")},
      },
    };
  }

  /*
  changeGhost() {
    const namedKernelManager = this.kernel.component(NamedKernelManager);
    const ghosts = namedKernelManager.components.GhostList.list;
    const menu = {};
    ghosts.forEach(([name, dirpath]) => {
      const disabled = namedKernelManager.isKernelExists(dirpath) && !this.kernel.namedId === dirpath;
      menu[`changeGhost-${dirpath}`] = {
        name,
        disabled,
        callback: () => namedKernelManager.changeNamed(dirpath, this.kernel.namedId),
      };
    });
    return menu;
  }

  callGhost() {
    const namedKernelManager = this.kernel.components.NamedKernelManager;
    const ghosts = namedKernelManager.components.GhostList.list;
    const menu = {};
    ghosts.forEach(([name, dirpath]) => {
      const disabled = namedKernelManager.isKernelExists(dirpath);
      menu[`callGhost-${dirpath}`] = {
        name,
        disabled,
        callback: () => namedKernelManager.bootNamed(dirpath),
      };
    });
    return menu;
  }

  changeShell() {
    const namedKernelManager = this.kernel.components.NamedKernelManager;
    const shells = namedKernelManager.components.ShellList.list[this.kernel.namedId];
    const menu = {};
    if (!shells) return menu;
    const currentShellName = this.kernel.components.Named.shell.descript.name;
    shells.forEach(([name, dirpath]) => {
      const disabled = currentShellName === name;
      menu[`callShell-${dirpath}`] = {
        name,
        disabled,
        callback: () => this.kernel.changeShell(dirpath),
      };
    });
    return menu;
  }

  changeBalloon() {
    const namedKernelManager = this.kernel.components.NamedKernelManager;
    const balloons = namedKernelManager.components.BalloonList.list;
    const menu = {};
    const currentBalloonName = this.kernel.components.Named.balloon.descript.name;
    balloons.forEach(([name, dirpath]) => {
      const disabled = currentBalloonName === name;
      menu[`changeBalloon-${dirpath}`] = {
        name,
        disabled,
        callback: () => this.kernel.changeBalloon(dirpath),
      };
    });
    return menu;
  }
  */
}

export const MenuRouting: EventRoutingDefiner = (routes) => {
  routes.controller(MenuController, (_routes) => {
    _routes.from(KernelPhase, (from, controller) => {
      // TODO: 仕様上shellの右クリックを捕捉するべきだが現状のcuttlebone実装上マネージャのstartでハンドラを登録する
      from.on("materialized", controller.start);
    });
  });
};

export class MenuController extends GhostKernelController {
  start() {
    const menu = new Menu(this.kernel);
    this.kernel.component(Named).contextmenu(menu.contextmenu.bind(menu));
  }
}
