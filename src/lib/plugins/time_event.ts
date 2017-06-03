import {EventEmitter} from "events";
import {
  EventRouteSetter,
  EventRouting,
} from "lazy-event-router";
import {Shiorif} from "shiorif";
import {TimerEventSource} from "ukagaka-timer-event-source";
import {
  GhostKernel,
  GhostKernelController,
  GhostKernelRoutings,
  Operation,
} from "../ghost-kernel";

export class TimeEventRouting implements EventRouting {
  setup(routes: EventRouteSetter) {
    routes.controller(TimeEventController, (routes2) => {
      routes2.from(Operation, (from, controller) => {
        from.on("started", controller.enableTimeEvents); // TODO いつが最初なのが正しい?
        from.on("halt", controller.halt);
      });
      routes2.from(TimerEventSource, (from, controller) => {
        from.on("second_change", controller.secondChange);
        from.on("minute_change", controller.minuteChange);
      });
    });
  }
}

export class TimerEventState {
  enabled: boolean;
  initializedTime: Date;
  constructor(initializedTime = new Date()) {
    this.enabled = false;
    this.initializedTime = initializedTime;
  }
}

export class TimeEventController extends GhostKernelController {
  constructor(kernel: GhostKernel) {
    super(kernel);
    kernel.registerComponent(new TimerEventState());
  }

  enableTimeEvents() {
    this.kernel.component(TimerEventState).enabled = true;
  }

  disableTimeEvents() {
    this.kernel.component(TimerEventState).enabled = false;
  }

  halt() {
    this.disableTimeEvents();
    this.kernel.unregisterComponent(TimerEventState);
  }

  async secondChange() {
    if (!this.kernel.component(TimerEventState).enabled) return;
    const shiorif = this.kernel.component(Shiorif);
    if (this._cantalk()) {
      await shiorif.get3("OnSecondChange", this._timeHeaders()).then(this.kernel.executeSakuraScript);
    } else {
      await shiorif.notify3("OnSecondChange", this._timeHeaders()); // TODO: error handling
    }
  }

  async minuteChange() {
    if (!this.kernel.component(TimerEventState).enabled) return;
    const shiorif = this.kernel.component(Shiorif);
    if (this._cantalk()) {
      await shiorif.get3("OnMinuteChange", this._timeHeaders()).then(this.kernel.executeSakuraScript);
    } else {
      await shiorif.notify3("OnMinuteChange", this._timeHeaders()); // TODO: error handling
    }
  }

  private _timeHeaders() {
    const uptime = 0; // TODO: ブラウザでOSのuptimeは取得できない
    const mikire = 0; // TODO: Shell modelを参照する
    const overlapped = 0; // TODO: Shell modelを参照する
    const cantalk = this._cantalk(); // TODO: status modelを参照する
    const leftTime = 0; // TODO: SSPでのOSの放置時間の処理方法依存
    return {
      Reference0: uptime.toString(),
      Reference1: mikire.toString(),
      Reference2: overlapped.toString(),
      Reference3: cantalk.toString(),
      Reference4: leftTime.toString(),
    };
  }

  private _cantalk() {
    const shellState = this.kernel.components.ShellState;
    return shellState.timeCritical ? 0 : 1;
  }
}

GhostKernelControllers.TimeEventController = TimeEventController;
GhostKernelRoutings.push(TimeEventRouting);
