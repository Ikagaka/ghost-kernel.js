export class SakuraScriptState {
  timerRaiseTimerId: {[event: string]: NodeJS.Timer};

  constructor() {
    this.timerRaiseTimerId = {};
  }

  clearTimerRaise(event: string) {
    const id = this.timerRaiseTimerId[event];
    if (id) clearInterval(id);
    delete this.timerRaiseTimerId[event]; // tslint:disable-line no-dynamic-delete
  }

  clearAllTimerRaise() {
    Object.keys(this.timerRaiseTimerId).forEach((event) => this.clearTimerRaise(event));
  }
}
