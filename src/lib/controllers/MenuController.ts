/*
import {GhostKernelController, GhostKernelControllers, GhostKernelRoutings} from "ghost-kernel";

export class Menu {
  constructor(kernel) {
    this.kernel = kernel;
  }

  contextmenu(event) {
    const scopeId = event.scopeId;
    return {
      items: {
        changeGhost:   {name: "ゴースト切り替え", items: this.changeGhost()},
        callGhost:     {name: "他のゴーストを呼ぶ", items: this.callGhost()},
        changeShell:   {name: "シェル", items: this.changeShell()},
        changeBalloon: {name: "バルーン", items: this.changeBalloon()},
        inputScript:   {name: "開発用 スクリプト入力", callback: () => this.kernel.components.SakuraScriptExecuter.execute(window.prompt("send"))},
        quit:          {name: "終了", callback: () => this.kernel.close("user")},
        quitAll:       {name: "全て終了", callback: () => this.kernel.components.NamedKernelManager.close("user")},
      },
    };
  }

  changeGhost() {
    const namedKernelManager = this.kernel.components.NamedKernelManager;
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
}

export class MenuRouting {
  setup(routes) {
    routes.controller("MenuController", (routes) => {
      routes.event("GhostKernel", "start");
      // TODO: 仕様上shellの右クリックを捕捉するべきだが現状のcuttlebone実装上マネージャのstartでハンドラを登録する
    });
  }
}

export class MenuController extends GhostKernelController {
  constructor(kernel) {
    super(kernel);
  }

  start() {
    const menu = new Menu(this.kernel);
    this.kernel.component(Named).contextmenu(menu.contextmenu.bind(menu));
  }
}

GhostKernelControllers.MenuController = MenuController;
GhostKernelRoutings.push(MenuRouting);
*/
