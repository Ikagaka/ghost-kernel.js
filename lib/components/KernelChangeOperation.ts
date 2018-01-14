import { EventEmitter } from "events";

/**
 * カーネルの変更操作
 */
export class KernelChangeOperation extends EventEmitter {
  /**
   * シェルを変更する
   * @param shellname シェル名
   */
  changeShell(shellName: string) {
    this.emit("changeShell", shellName);
  }

  /**
   * バルーンを変更する
   * @param balloonname バルーン名
   */
  changeBalloon(balloonName: string) {
    this.emit("changeBalloon", balloonName);
  }

  on(event: "changeShell" | "changeBalloon", listener: (name: string) => void) {
    return super.on(event, listener);
  }

  emit(event: "changeShell" | "changeBalloon", name: string) {
    return super.emit(event, name);
  }
}
