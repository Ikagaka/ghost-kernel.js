import {
  BalloonInputEvent,
  BalloonMouseEvent,
  BalloonSelectEvent,
  FileDropEvent,
  Named,
  SurfaceMouseEvent,
} from "cuttlebone";
import { EventRoutingDefiner } from "lazy-event-router";
import { SakuraScriptExecuter } from "sakurascript-executer";
import { Shiorif } from "shiorif";
import { KernelPhase, KernelStartOperation } from "../components";
import { GhostKernelController } from "./GhostKernelController";

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

export const ShellRouting: EventRoutingDefiner = (routes) => {
  routes.controller(ShellController, (routes2) => {
    routes2.from(KernelStartOperation, (from, controller) => {
      from.on("start", controller.start);
    });
    routes2.from(KernelPhase, (from, controller) => {
      from.on("halted", controller.halt);
    });
    routes2.from(Named, (from, controller) => {
      from.on("choiceselect", controller.choiceselect);
      from.on("anchorselect", controller.anchorselect);
      from.on("userinput", controller.userinput);
      from.on("communicateinput", controller.communicateinput);
      from.on("mousedown", controller.mousedown);
      from.on("mousemove", controller.mousemove);
      from.on("mouseup", controller.mouseup);
      from.on("mouseclick", controller.mouseclick);
      from.on("mousedblclick", controller.mousedblclick);
      from.on("balloonclick", controller.balloonclick);
      from.on("balloondblclick", controller.balloondblclick);
      from.on("filedrop", controller.filedrop);
    });
  });
};

// tslint:disable max-classes-per-file

export class ShellController extends GhostKernelController {
  start() {
    const shellState = new ShellState(this.kernel.component(Named));
    this.kernel.registerComponent(shellState);
  }

  halt() {
    const shellState = this.kernel.component(ShellState);
    if (shellState) shellState.clearBalloonTimeout();
    this.kernel.unregisterComponent(ShellState);
  }

  choiceselect(event: BalloonSelectEvent) {
    const shiorif = this.kernel.component(Shiorif);
    if (/^On/.test(event.id)) { // On
      shiorif.get3(event.id, event.args).then(this.kernel.executeSakuraScript);
    } else if (/^script:/.test(event.id)) { // script:
      this.kernel.component(SakuraScriptExecuter).execute(event.id.replace(/^script:/, ""));
    } else if (event.args.length) { // Ex
      shiorif.get3("OnChoiceSelectEx", [event.text, event.id, ...event.args]).then(this.kernel.executeSakuraScript);
    } else { // normal
      shiorif.get3("OnChoiceSelectEx", [event.text, event.id]).then((transaction) => {
        const value = transaction.response.to("3.0").headers.Value;
        // tslint:disable-next-line no-null-keyword
        if (value != null && value.length) {
          this.kernel.executeSakuraScript(transaction);
        } else {
          shiorif.get3("OnChoiceSelect", [event.id]).then(this.kernel.executeSakuraScript);
        }
      });
    }
  }

  anchorselect(event: BalloonSelectEvent) {
    const shiorif = this.kernel.component(Shiorif);
    if (/^On/.test(event.id)) { // On
      shiorif.get3(event.id, event.args).then(this.kernel.executeSakuraScript);
    } else if (/^script:/.test(event.id)) { // Script:
      this.kernel.component(SakuraScriptExecuter).execute(event.id.replace(/^script:/, ""));
    } else if (event.args.length) { // Ex
      shiorif.get3("OnAnchorSelectEx", [event.text, event.id, ...event.args]).then(this.kernel.executeSakuraScript);
    } else { // Normal
      shiorif.get3("OnAnchorSelectEx", [event.text, event.id]).then((transaction) => {
        const value = transaction.response.to("3.0").headers.Value;
        // tslint:disable-next-line no-null-keyword
        if (value != null && value.length) {
          this.kernel.executeSakuraScript(transaction);
        } else {
          shiorif.get3("OnAnchorSelect", [event.id]).then(this.kernel.executeSakuraScript);
        }
      });
    }
  }

  userinput(event: BalloonInputEvent) {
    const shiorif = this.kernel.component(Shiorif);
    // tslint:disable-next-line no-null-keyword
    if (event.content != null) {
      shiorif.get3("OnUserInput", [event.id, event.content]).then(this.kernel.executeSakuraScript);
    } else {
      const reason = "close"; // TODO: reason
      shiorif.get3("OnUserInputCancel", [event.id, reason]).then(this.kernel.executeSakuraScript);
    }
  }

  communicateinput(event: BalloonInputEvent) {
    const shiorif = this.kernel.component(Shiorif);
    // tslint:disable-next-line no-null-keyword
    if (event.content != null) {
      // TODO: 拡張情報?
      shiorif.get3("OnCommunicate", ["user", event.content]).then(this.kernel.executeSakuraScript);
    } else {
      const reason = "cancel"; // TODO: reason
      shiorif.get3("OnCommunicateInputCancel", ["", reason]).then(this.kernel.executeSakuraScript);
    }
  }

  mousedown(event: SurfaceMouseEvent) {
    this._mouseEvent(event, "OnMouseDown");
  }

  mousemove(event: SurfaceMouseEvent) {
    this._mouseEvent(event, "OnMouseMove");
  }

  mouseup(event: SurfaceMouseEvent) {
    this._mouseEvent(event, "OnMouseUp");
  }

  mouseclick(event: SurfaceMouseEvent) {
    this._mouseEvent(event, "OnMouseClick");
  }

  mousedblclick(event: SurfaceMouseEvent) {
    this._mouseEvent(event, "OnMouseDoubleClick");
  }

  _mouseEvent(event: SurfaceMouseEvent, id: string) {
    if (this._timeCritical) return;
    const shiorif = this.kernel.component(Shiorif);
    shiorif.get3(id, this._mouseEventHeaders(event)).then(this.kernel.executeSakuraScript);
  }

  balloonclick(_event: BalloonMouseEvent) { // TODO: refactor
    const named = this.kernel.component(Named);
    const shellState = this.kernel.component(ShellState);
    if (!shellState) return;
    this.kernel.component(SakuraScriptExecuter).balloonClicked();
    if (shellState.hasChoice) return; // 選択肢があればクリアされない
    if (!shellState.talking) { // 喋っていない状態でシングルクリックされたら
      named.scopes.forEach((scope) => scope.blimp(-1).clear()); // バルーンをクリア&非表示
      shellState.clearBalloonTimeout();
    }
  }

  balloondblclick(event: BalloonMouseEvent) {
    const shellState = this.kernel.component(ShellState);
    if (!shellState) return;
    if (shellState.hasChoice) return; // 選択肢があればクリアされない
    if (shellState.talking) { // 喋っている状態でダブルクリックされたら
      const sakuraScriptExecuter = this.kernel.component(SakuraScriptExecuter);
      sakuraScriptExecuter.abortExecute();
    } else {
      this.balloonclick(event);
    }
  }

  // tslint:disable-next-line prefer-function-over-method
  filedrop(_event: FileDropEvent) {
    // TODO: NamedKernelManagerがないのであとで
    /*
    // TODO: インストール以外
    const namedKernelManager = this.kernel.component(NamedKernelManager);
    // TODO: jQuery / DOM操作系は何処でするのが良いのか
    event.event.stopPropagation();
    event.event.preventDefault();
    event.event.originalEvent.dataTransfer.dropEffect = "copy";
    const files = event.event.originalEvent.dataTransfer.files;
    for (const file of files) {
      namedKernelManager.installNamed(file, this.kernel);
    }
    */
  }

  get _timeCritical() {
    const shellState = this.kernel.component(ShellState);

    return shellState && shellState.timeCritical;
  }

  // tslint:disable-next-line prefer-function-over-method
  _mouseEventHeaders(event: SurfaceMouseEvent) {
    return [
      event.offsetX.toString(),
      event.offsetY.toString(),
      event.wheel.toString(),
      event.scopeId.toString(),
      event.region.toString(),
      event.button.toString(),
      event.type.toString(),
    ];
  }
}
