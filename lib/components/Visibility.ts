import { EventEmitter } from "events";

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
  // tslint:disable-next-line strict-type-predicates
  constructor(initialVisibility = true, auto = typeof document !== "undefined" ? document : undefined) {
    super();
    // tslint:disable-next-line no-null-keyword tslint:disable-next-line strict-type-predicates
    if (initialVisibility != null) {
      this._visibility = initialVisibility;
    }
    this.document = auto;
    if (auto) this.watchVisibility();
  }

  watchVisibility() {
    if (!this.document) return;
    // hidden プロパティおよび可視性の変更イベントの名前を設定
    // tslint:disable-next-line strict-type-predicates
    if (typeof this.document.hidden !== "undefined") { // Opera 12.10 や Firefox 18 以降でサポート
      this.hiddenProperty = "hidden";
      this.visibilityChangeProperty = "visibilitychange";
    } else if (typeof (this.document as any).mozHidden !== "undefined") {
      this.hiddenProperty = "mozHidden";
      this.visibilityChangeProperty = "mozvisibilitychange";
    } else if (typeof (this.document as any).msHidden !== "undefined") {
      this.hiddenProperty = "msHidden";
      this.visibilityChangeProperty = "msvisibilitychange";
    } else if (typeof (this.document as any).webkitHidden !== "undefined") {
      this.hiddenProperty = "webkitHidden";
      this.visibilityChangeProperty = "webkitvisibilitychange";
    }
    if (typeof (this.document as any)[this.hiddenProperty] !== "undefined") {
      this.document.addEventListener(this.visibilityChangeProperty, this._nativeVisibilityChange, false);
      this._visibility = !(this.document as any)[this.hiddenProperty];
    }
  }

  unwatchVisibility() {
    if (!this.document) return;
    this.document.removeEventListener(this.visibilityChangeProperty, this._nativeVisibilityChange, false);
  }

  _nativeVisibilityChange = () => {
    this.visibility = !(this.document as any)[this.hiddenProperty];
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
