import { EventEmitter } from "events";
import { ChangeTransactionInfo } from "./ChangeTransactionInfo";

/**
 * カーネルの起動操作
 */
export class KernelStartOperation extends EventEmitter {
  /** 何によってスタートしたか */
  startedBy: KernelStartOperation.StartedBy;
  /** 交代元情報 */
  from: ChangeTransactionInfo;

  /**
   * OnFirstBootによってカーネルをスタートする
   */
  firstBoot() {
    this.emit("start", {by: (this.startedBy = "firstBoot")});
  }

  /**
   * OnBootによってカーネルをスタートする
   */
  boot() {
    this.emit("start", {by: (this.startedBy = "boot")});
  }

  /**
   * OnGhostChangedによってカーネルをスタートする
   * @param from 交代元情報
   */
  changed(from: ChangeTransactionInfo) {
    const by = "changed";
    this.startedBy = by;
    this.from = from;
    this.emit("start", {by, from});
  }

  /**
   * OnGhostCalledによってカーネルをスタートする
   * @param from 交代元情報
   */
  called(from: ChangeTransactionInfo) {
    const by = "called";
    this.startedBy = by;
    this.from = from;
    this.emit("start", {by, from});
  }

  /**
   * OnVanishedによってカーネルをスタートする
   * @param from 交代元情報
   */
  vanished(from: ChangeTransactionInfo) {
    const by = "vanished";
    this.startedBy = by;
    this.from = from;
    this.emit("start", {by, from});
  }

  on(event: "start", listener: (by: KernelStartOperation.AllEvent) => void) { return super.on(event, listener); }

  emit(event: "start", by: KernelStartOperation.AllEvent) { return super.emit(event, by); }
}

export namespace KernelStartOperation {
  /** 何によってスタートしたか */
  export type StartedBy = "firstBoot" | "boot" | "changed" | "called" | "vanished";

  export type AllEvent = BootEvent | ChangedEvent;

  export interface BootEvent {
    by: "firstBoot" | "boot";
  }

  export interface ChangedEvent {
    by: "changed" | "called" | "vanished";
    from: ChangeTransactionInfo;
  }
}
