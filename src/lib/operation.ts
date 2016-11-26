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
  /** 何によってスタートしたか */
  startedBy: Operation.StartedBy;
  /** 何によって終了するか */
  closeBy: Operation.CloseBy;
  /** 交代元情報 */
  from: ChangeTransactionInfo;
  /** 交代先情報 */
  to: ChangeTransactionInfo;
  /** 終了処理トリガー */
  closeTrigger: Operation.CloseTrigger;
  /** 交代処理トリガー */
  changingTrigger: Operation.ChangingTrigger;
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
   * OnFirstBootによってカーネルをスタートする
   */
  firstBoot() {
    this.emit("start", (this.startedBy = "firstBoot"));
  }

  /**
   * OnBootによってカーネルをスタートする
   */
  boot() {
    this.emit("start", (this.startedBy = "boot"));
  }

  /**
   * OnGhostChangedによってカーネルをスタートする
   * @param from 交代元情報
   */
  changed(from: ChangeTransactionInfo) {
    this.from = from;
    this.emit("start", (this.startedBy = "changed"));
  }

  /**
   * OnGhostCalledによってカーネルをスタートする
   * @param from 交代元情報
   */
  called(from: ChangeTransactionInfo) {
    this.from = from;
    this.emit("start", (this.startedBy = "called"));
  }

  /**
   * OnVanishedによってカーネルをスタートする
   * @param from 交代元情報
   */
  vanished(from: ChangeTransactionInfo) {
    this.from = from;
    this.emit("start", (this.startedBy = "vanished"));
  }

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

  /**
   * OnGhostChangingによってカーネルを終了する
   * @param to 交代先情報
   * @param trigger 交代処理トリガー
   */
  changing(to: ChangeTransactionInfo, trigger: Operation.ChangingTrigger) {
    this.to = to;
    this.changingTrigger = trigger;
    this.emit("close", (this.closeBy = "changing"));
  }

  /**
   * OnCloseによってカーネルを終了する
   * @param trigger 終了処理トリガー
   */
  close(trigger: Operation.CloseTrigger) {
    this.closeTrigger = trigger;
    this.emit("close", (this.closeBy = "close"));
  }

  /**
   * OnCloseAllによってカーネルを終了する
   * @param trigger 終了処理トリガー
   */
  closeAll(trigger: Operation.CloseTrigger) {
    this.closeTrigger = trigger;
    this.emit("close", (this.closeBy = "closeAll"));
  }

  /**
   * OnVanishSelectedによってカーネルを終了する
   */
  vanish() {
    this.emit("close", (this.closeBy = "vanish"));
  }

  /**
   * 終了処理を開始する
   */
  halt() {
    this.emit("halt");
  }

  /**
   * 終了処理が完了した
   */
  halted() {
    this.emit("halted");
    this.kernel.unregisterComponent(Operation);
  }

  on(event: "start", listener: (by: Operation.StartedBy) => void): this;
  on(event: "started", listener: (by: Operation.StartedBy) => void): this;
  on(event: "changeShell", listener: (shellName: string) => void): this;
  on(event: "changeBalloon", listener: (balloonName: string) => void): this;
  on(event: "close", listener: (by: Operation.CloseBy) => void): this;
  on(event: "halt", listener: () => void): this;
  on(event: "halted", listener: () => void): this;
  on(event: string | symbol, listener: Function) { return super.on(event, listener); }

  emit(event: "start", by: Operation.StartedBy): boolean;
  emit(event: "started", by: Operation.StartedBy): boolean;
  emit(event: "changeShell", shellName: string): boolean;
  emit(event: "changeBalloon", balloonName: string): boolean;
  emit(event: "close", by: Operation.CloseBy): boolean;
  emit(event: "halt"): boolean;
  emit(event: "halted"): boolean;
  emit(event: string | symbol, ...args: any[]) { return super.emit(event, ...args); }
}

export namespace Operation {
  /** 何によってスタートしたか */
  export type StartedBy = "firstBoot" | "boot" | "changed" | "called" | "vanished";
  /** 何によって終了するか */
  export type CloseBy = "close" | "closeAll" | "changing" | "vanish";
  /** 終了処理トリガー */
  export type CloseTrigger = "user" | "system";
  /** 交代処理トリガー */
  export type ChangingTrigger = "manual" | "automatic";
}

/** 交代時情報 */
export type ChangeTransactionInfo = {
  /** ID */
  id: string,
  /** 交代時スクリプト */
  script: string,
  /** ゴースト名 */
  name: string,
  /** さくら側名 */
  sakuraName: string,
  /** 交代時シェル名 */
  shellName: string,
  /** ゴーストディレクトリパス */
  path: string,
};
