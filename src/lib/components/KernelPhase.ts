import {EventEmitter} from "events";

export class KernelPhaseChangeError extends Error {
  constructor(from: KernelPhase.Phase, to: KernelPhase.Phase) {
    super(`Kernel Phase cannot changed from ${KernelPhase.Phase[from]} to ${KernelPhase.Phase[to]}`);
  }
}

export class KernelPhase extends EventEmitter {
  private _phase: KernelPhase.Phase = KernelPhase.Phase.init;

  on(event: keyof typeof KernelPhase.Phase, listener: () => void) {
    return super.on(event, listener);
  }

  emit(event: keyof typeof KernelPhase.Phase) {
    return super.emit(event);
  }

  get phase() { return this._phase; }

  /** SHIORIバージョンが取れた */
  versionFixed() { this.changePhase(KernelPhase.Phase.versionFixed); }
  /** 最初の情報通知が完了した */
  initialNotifyFinished() { this.changePhase(KernelPhase.Phase.initialNotifyFinished); }
  /** 最初の情報取得が完了した */
  initialInformationFixed() { this.changePhase(KernelPhase.Phase.initialInformationFixed); }
  /** 起動発話に到達した */
  materialized() { this.changePhase(KernelPhase.Phase.materialized); }
  /** 起動発話が完了した */
  bootCompleted() { this.changePhase(KernelPhase.Phase.bootCompleted); }
  /** `\\-`まで到達した */
  closed() { this.changePhase(KernelPhase.Phase.closed); }
  /** 終了した */
  halted() { this.changePhase(KernelPhase.Phase.halted); }

  private changePhase(phase: KernelPhase.Phase) {
    if (phase - this._phase !== 1) {
      throw new KernelPhaseChangeError(this._phase, phase);
    }
    this._phase = phase;
    this.emit(KernelPhase.Phase[phase] as keyof typeof KernelPhase.Phase);
  }
}

export namespace KernelPhase {
  export enum Phase {
    init,
    versionFixed,
    initialNotifyFinished,
    initialInformationFixed,
    materialized,
    bootCompleted,
    closed,
    halted,
  }
}
