export class TimerEventState {
  enabled: boolean;
  initializedTime: Date;
  constructor(initializedTime = new Date()) {
    this.enabled = false;
    this.initializedTime = initializedTime;
  }
}
