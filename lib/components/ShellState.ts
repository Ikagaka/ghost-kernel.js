import { Named } from "cuttlebone";

export class ShellState {
  named: Named;
  talking: boolean;
  synchronized: number[] | boolean;
  timeCritical: boolean;
  hasChoice: boolean;
  balloonTimeout: number;
  choiceTimeout: number;
  breakTimeoutId: any;

  constructor(named: Named) {
    this.named = named;
    this.talking = false;
    this.synchronized = false;
    this.timeCritical = false;
    this.hasChoice = false;
    // tslint:disable-next-line no-magic-numbers
    this.balloonTimeout = 10000; // TODO: 設定から読む
    // tslint:disable-next-line no-magic-numbers
    this.choiceTimeout = 20000; // TODO: 設定から読む
  }

  timeout() {
    const timeout = this.hasChoice ? this.choiceTimeout : this.balloonTimeout;

    return timeout >= 1 ? timeout : undefined;
  }

  setBalloonTimeout(callback: () => void) {
    const timeout = this.timeout();
    if (timeout) { // タイムアウトありならタイムアウトイベントを設定
      this.breakTimeoutId = setTimeout(callback, timeout);
    }
  }

  clearBalloonTimeout() {
    if (this.breakTimeoutId) {
      clearTimeout(this.breakTimeoutId);
      this.breakTimeoutId = undefined;
    }
  }
}
