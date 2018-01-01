import { EventRoutingDefiner } from "lazy-event-router";
import { Shiorif } from "shiorif";
import { TimerEventSource } from "ukagaka-timer-event-source";
import { KernelPhase } from "../components";
import { TimerEventState } from "../components/TimerEventState";
import { GhostKernelController } from "./GhostKernelController";

export const TimeEventRouting: EventRoutingDefiner = (routes) => {
  routes.controller(TimeEventController, (routes2) => {
    routes2.from(KernelPhase, (from, controller) => {
      from.on("versionFixed", controller.start); // TODO: いつが最初なのが正しい?
      from.on("halted", controller.halt);
    });
    routes2.from(TimerEventSource, (from, controller) => {
      from.on("second_change", controller.secondChange);
      from.on("minute_change", controller.minuteChange);
    });
  });
};

export class TimeEventController extends GhostKernelController {
  start() {
    this.kernel.registerComponent(new TimerEventState());
    this.enableTimeEvents();
  }

  enableTimeEvents() {
    this.timerEventState.enabled = true;
  }

  disableTimeEvents() {
    this.timerEventState.enabled = false;
  }

  halt() {
    this.disableTimeEvents();
    this.kernel.unregisterComponent(TimerEventState);
  }

  async secondChange() {
    if (!this.timerEventState.enabled) return;
    const shiorif = this.kernel.component(Shiorif);
    if (this._cantalk()) {
      await shiorif.get3("OnSecondChange", this._timeHeaders()).then(this.kernel.executeSakuraScript);
    } else {
      await shiorif.notify3("OnSecondChange", this._timeHeaders()); // TODO: error handling
    }
  }

  async minuteChange() {
    if (!this.timerEventState.enabled) return;
    const shiorif = this.kernel.component(Shiorif);
    if (this._cantalk()) {
      await shiorif.get3("OnMinuteChange", this._timeHeaders()).then(this.kernel.executeSakuraScript);
    } else {
      await shiorif.notify3("OnMinuteChange", this._timeHeaders()); // TODO: error handling
    }
  }

  private get timerEventState() {
    return this.kernel.component(TimerEventState) as TimerEventState;
  }

  private _timeHeaders() {
    const uptime = 0; // TODO: ブラウザでOSのuptimeは取得できない
    const mikire = 0; // TODO: Shell modelを参照する
    const overlapped = 0; // TODO: Shell modelを参照する
    const cantalk = this._cantalk();
    const leftTime = 0; // TODO: SSPでのOSの放置時間の処理方法依存

    return {
      Reference0: uptime.toString(),
      Reference1: mikire.toString(),
      Reference2: overlapped.toString(),
      Reference3: cantalk.toString(),
      Reference4: leftTime.toString(),
    };
  }

  // tslint:disable-next-line prefer-function-over-method
  private _cantalk() {
    // TODO: status modelを参照する
    // const shellState = this.kernel.component(ShellState);
    // return shellState.timeCritical ? 0 : 1;
    return 1;
  }
}
