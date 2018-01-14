import { EventEmitter } from "events";
import { ChangeTransactionInfo } from "./ChangeTransactionInfo";

/**
 * カーネルの終了操作
 */
export class KernelCloseOperation extends EventEmitter {
  /** 何によって終了するか */
  closeBy: KernelCloseOperation.CloseBy;
  /** 交代先情報 */
  to: ChangeTransactionInfo;
  /** 終了処理トリガー */
  closeTrigger: KernelCloseOperation.CloseTrigger;
  /** 交代処理トリガー */
  changingTrigger: KernelCloseOperation.ChangingTrigger;

  /**
   * OnGhostChangingによってカーネルを終了する
   * @param to 交代先情報
   * @param trigger 交代処理トリガー
   */
  changing(to: ChangeTransactionInfo, trigger: KernelCloseOperation.ChangingTrigger) {
    const by = "changing";
    this.closeBy = by;
    this.to = to;
    this.changingTrigger = trigger;
    this.emit("close", {by, trigger, to});
  }

  /**
   * OnCloseによってカーネルを終了する
   * @param trigger 終了処理トリガー
   */
  close(trigger: KernelCloseOperation.CloseTrigger) {
    const by = "close";
    this.closeBy = by;
    this.closeTrigger = trigger;
    this.emit("close", {by, trigger});
  }

  /**
   * OnCloseAllによってカーネルを終了する
   * @param trigger 終了処理トリガー
   */
  closeAll(trigger: KernelCloseOperation.CloseTrigger) {
    const by = "closeAll";
    this.closeBy = by;
    this.closeTrigger = trigger;
    this.emit("close", {by, trigger});
  }

  /**
   * OnVanishSelectedによってカーネルを終了する
   */
  vanish() {
    this.emit("close", {by: (this.closeBy = "vanish")});
  }

  on(event: "close", listener: (by: KernelCloseOperation.AllEvent) => void) { return super.on(event, listener); }

  emit(event: "close", by: KernelCloseOperation.AllEvent) { return super.emit(event, by); }
}

export namespace KernelCloseOperation {
  /** 何によって終了するか */
  export type CloseBy = "close" | "closeAll" | "changing" | "vanish";
  /** 終了処理トリガー */
  export type CloseTrigger = "user" | "system";
  /** 交代処理トリガー */
  export type ChangingTrigger = "manual" | "automatic";

  export type AllEvent = CloseEvent | ChangingEvent | VanishEvent;

  export interface CloseEvent {
    by: "close" | "closeAll";
    trigger: CloseTrigger;
  }

  export interface ChangingEvent {
    by: "changing";
    trigger: ChangingTrigger;
    to: ChangeTransactionInfo;
  }

  export interface VanishEvent {
    by: "vanish";
  }
}
