import {EventEmitter} from "events";
import {
  EventRouteSetter,
  EventRouting,
} from "lazy-event-router";
import {Shiorif} from "shiorif";
import {
  GhostKernelController,
  GhostKernelRoutings,
  Operation,
} from "../ghost-kernel";
import {SakuraScriptPlayer} from "./sakura_script";

export class VisibilityRouting implements EventRouting {
  setup(routes: EventRouteSetter) {
    routes.controller(VisibilityController, (routes2) => {
      routes2.from(Operation, (from, controller) => {
        from.on("start", controller.start);
        from.on("halt", controller.halt);
      });
      routes2.from(Visibility, (from, controller) => {
        from.on("visibilityChange", controller.visibilityChange);
      });
    });
  }
}

/** 可視性モデル */
export class Visibility extends EventEmitter {
  document?: Document;
  hiddenProperty: string;
  visibilityChangeProperty: string;
  private _visibility: boolean;

  /**
   * @param initialVisibility 初期可視状態 autoが真の時は無視される
   * @param auto 自動で可視性を判定する Page Visibility APIがある場合はデフォルトで真
   */
  constructor(initialVisibility = true, auto = typeof document !== "undefined" ? document : undefined) {
    super();
    this._nativeVisibilityChange = this._nativeVisibilityChange.bind(this);
    if (initialVisibility !== undefined) {
      this._visibility = initialVisibility;
    }
    this.document = auto;
    if (auto) this.watchVisibility();
  }

  watchVisibility() {
    if (!this.document) return;
    // hidden プロパティおよび可視性の変更イベントの名前を設定
    if (typeof this.document.hidden !== "undefined") { // Opera 12.10 や Firefox 18 以降でサポート
      this.hiddenProperty = "hidden";
      this.visibilityChangeProperty = "visibilitychange";
    } else if (typeof (<any> this.document).mozHidden !== "undefined") {
      this.hiddenProperty = "mozHidden";
      this.visibilityChangeProperty = "mozvisibilitychange";
    } else if (typeof (<any> this.document).msHidden !== "undefined") {
      this.hiddenProperty = "msHidden";
      this.visibilityChangeProperty = "msvisibilitychange";
    } else if (typeof (<any> this.document).webkitHidden !== "undefined") {
      this.hiddenProperty = "webkitHidden";
      this.visibilityChangeProperty = "webkitvisibilitychange";
    }
    if (typeof (<any> this.document)[this.hiddenProperty] !== "undefined") {
      this.document.addEventListener(this.visibilityChangeProperty, this._nativeVisibilityChange, false);
      this._visibility = !(<any> this.document)[this.hiddenProperty];
    }
  }

  unwatchVisibility() {
    if (!this.document) return;
    this.document.removeEventListener(this.visibilityChangeProperty, this._nativeVisibilityChange, false);
  }

  _nativeVisibilityChange() {
    this.visibility = !(<any> this.document)[this.hiddenProperty];
  }

  set visibility(visibility) {
    const needEmit = this._visibility !== Boolean(visibility);
    this._visibility = Boolean(visibility);
    if (needEmit) this.emit("visibilityChange", this._visibility);
  }

  get visibility() {
    return this._visibility;
  }

  on(event: "visibilityChange", listener: (visibility: boolean) => void) {
    return super.on(event, listener);
  }

  emit(event: "visibilityChange", visibility: boolean) {
    return super.emit(event, visibility);
  }
}

export class VisibilityController extends GhostKernelController {
  start() {
    this.kernel.registerComponent(new Visibility());
  }

  halt() {
    this.kernel.component(Visibility).unwatchVisibility();
    this.kernel.unregisterComponent(Visibility);
  }

  async visibilityChange(visibility: boolean) {
    const shiorif = this.kernel.component(Shiorif);
    const execute = this.kernel.component(SakuraScriptPlayer).execute;
    if (visibility) {
      await shiorif.get3("OnWindowStateRestore").then(execute);
    } else {
      await shiorif.get3("OnWindowStateMinimize").then(execute);
    }
  }
}

GhostKernelRoutings.push(VisibilityRouting);
