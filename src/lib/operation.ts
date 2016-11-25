import {EventEmitter} from "events";
import {GhostKernel} from "./ghost-kernel";

/**
 * カーネルの操作
 *
 * イベントはNamedKernelManagerなどから取得できることも多いが
 * ゴースト単体はNamedKernelManagerなしでも成立するので
 * NamedKernelManagerなしでも必要なものを用意する。
 */
export class Operation extends EventEmitter {
  /** カーネル */
  protected readonly kernel: GhostKernel;

  /**
   * コンストラクタ
   * @param kernel カーネル
   */
  constructor(kernel: GhostKernel) {
    super();
    this.kernel = kernel;
  }

  /**
   * start kernel (emits start event)
   * @param by source event
   */
  start(by: "firstBoot" | "boot" | "changed") {
    this.emit("start", by);
  }

  /**
   * emits change event
   * @param dirpath ゴーストディレクトリ名
   */
  change(dirpath: string) {
    this.emit("change", dirpath);
  }

  /**
   * emits changeShell event
   * @param shellname シェル名
   */
  changeShell(shellName: string) {
    this.emit("changeShell", shellName);
  }

  /**
   * emits changeBalloon event
   * @param balloonname バルーン名
   */
  changeBalloon(balloonName: string) {
    this.emit("changeBalloon", balloonName);
  }

  /**
   * emits close event
   * @param reason 理由
   * @param all OnCloseAllにあたるならtrue
   */
  close(reason: "user" | "system", all: boolean) {
    this.emit("close", reason, all);
  }

  /**
   * emits halt event
   * @param reason 理由
   */
  halt(reason: "user" | "system") {
    this.emit("halt", reason);
    this.kernel.unregisterComponent(Operation);
  }

  on(event: "start", listener: (by: "firstBoot" | "boot" | "changed") => void): this;
  on(event: "change", listener: (dirpath: string) => void): this;
  on(event: "changeShell", listener: (shellName: string) => void): this;
  on(event: "changeBalloon", listener: (balloonName: string) => void): this;
  on(event: "close", listener: (reason: "user" | "system", all: boolean) => void): this;
  on(event: "halt", listener: (reason: "user" | "system") => void): this;
  on(event: string | symbol, listener: Function) { return super.on(event, listener); }

  emit(event: "start", by: "firstBoot" | "boot" | "changed"): boolean;
  emit(event: "change", dirpath: string): boolean;
  emit(event: "changeShell", shellName: string): boolean;
  emit(event: "changeBalloon", balloonName: string): boolean;
  emit(event: "close", reason: "user" | "system", all: boolean): boolean;
  emit(event: "halt", reason: "user" | "system"): boolean;
  emit(event: string | symbol, ...args: any[]) { return super.emit(event, ...args); }
}
