/*
import {EventEmitter} from "events";
import { EventRoutingDefiner } from "lazy-event-router";
import {SakuraScriptToken} from "sakurascript";
import {SakuraScriptExecuter} from "sakurascript-executer";
import {ShioriTransaction} from "shiori_transaction";
import {Shiorif} from "shiorif";
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
  constructor(named: Named) {
    this.named = named;
    this.talking = false;
    this.synchronized = false;
    this.timeCritical = false;
    this.hasChoice = false;
    this.balloonTimeout = 10000; // TODO
    this.choiceTimeout = 20000; // TODO
  }

  timeout() {
    const timeout = this.hasChoice ? this.choiceTimeout : this.balloonTimeout;
    return timeout >= 1 ? timeout : null;
  }

  setBalloonTimeout(callback) {
    const timeout = this.timeout();
    if (timeout) { // タイムアウトありならタイムアウトイベントを設定
      this.breakTimeoutId = setTimeout(callback, timeout);
    }
  }

  clearBalloonTimeout() {
    if (this.breakTimeoutId) {
      clearTimeout(this.breakTimeoutId);
      this.breakTimeoutId = null;
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
      routes.event("choiceselect");
      routes.event("anchorselect");
      routes.event("userinput");
      routes.event("communicateinput");
      routes.event("mousedown");
      routes.event("mousemove");
      routes.event("mouseup");
      routes.event("mouseclick");
      routes.event("mousedblclick");
      routes.event("balloonclick");
      routes.event("balloondblclick");
      routes.event("filedrop");
    });
  });
};

export class ShellController extends GhostKernelController {
  start() {
    const shellState = new ShellState(this.kernel.component(Named));
    this.kernel.registerComponent(shellState);
  }

  halt() {
    this.kernel.component(ShellState)!.clearBalloonTimeout();
    this.kernel.unregisterComponent(ShellState);
  }

  choiceselect(event) {
    const shiorif = this.kernel.component(Shiorif);
    if (/^On/.test(event.id)) { // On
      shiorif.get3(event.id, event.args).then(this.kernel.executeSakuraScript);
    } else if (/^script:/.test(event.id)) { // script:
      this.kernel.component(SakuraScriptExecuter).execute(event.id.replace(/^script:/, ""));
    } else if (event.args.length) { // Ex
      shiorif.get3("OnChoiceSelectEx", [event.label, event.id, ...event.args]).then(this.kernel.executeSakuraScript);
    } else { // normal
      shiorif.get3("OnChoiceSelectEx", [event.text, event.id]).then((transaction) => {
        const value = transaction.response.to("3.0").headers.Value;
        if (value != null && value.length) {
          this.kernel.executeSakuraScript(transaction);
        } else {
          shiorif.get3("OnChoiceSelect", [event.id]).then(this.kernel.executeSakuraScript);
        }
      });
    }
  }

  anchorselect(event) {
    const shiorif = this.kernel.component(Shiorif);
    if (/^On/.test(event.id)) { // On
      shiorif.get3(event.id, event.args).then(this.kernel.executeSakuraScript);
    } else if (/^script:/.test(event.id)) { // Script:
      this.kernel.component(SakuraScriptExecuter).execute(event.id.replace(/^script:/, ""));
    } else if (event.args.length) { // Ex
      shiorif.get3("OnAnchorSelectEx", [event.label, event.id, ...event.args]).then(this.kernel.executeSakuraScript);
    } else { // Normal
      shiorif.get3("OnAnchorSelectEx", [event.text, event.id]).then((transaction) => {
        const value = transaction.response.to("3.0").headers.Value;
        if (value != null && value.length) {
          this.kernel.executeSakuraScript(transaction);
        } else {
          shiorif.get3("OnAnchorSelect", [event.id]).then(this.kernel.executeSakuraScript);
        }
      });
    }
  }

  userinput(event) {
    const shiorif = this.kernel.component(Shiorif);
    if (event.content != undefined) {
      shiorif.get3("OnUserInput", [event.id, event.content]).then(this.kernel.executeSakuraScript);
    } else {
      const reason = "close"; // TODO reason
      shiorif.get3("OnUserInputCancel", [event.id, reason]).then(this.kernel.executeSakuraScript);
    }
  }

  communicateinput(event) {
    const shiorif = this.kernel.component(Shiorif);
    if (event.content != undefined) {
      // TODO: 拡張情報?
      shiorif.get3("OnCommunicate", ["user", event.content]).then(this.kernel.executeSakuraScript);
    } else {
      const reason = "cancel"; // TODO reason
      shiorif.get3("OnCommunicateInputCancel", ["", reason]).then(this.kernel.executeSakuraScript);
    }
  }

  mousedown(event) {
    this._mouseEvent(event, "OnMouseDown");
  }

  mousemove(event) {
    this._mouseEvent(event, "OnMouseMove");
  }

  mouseup(event) {
    this._mouseEvent(event, "OnMouseUp");
  }

  mouseclick(event) {
    this._mouseEvent(event, "OnMouseClick");
  }

  mousedblclick(event) {
    this._mouseEvent(event, "OnMouseDoubleClick");
  }

  _mouseEvent(event, id) {
    if (this._timeCritical) return;
    const shiorif = this.kernel.component(Shiorif);
    shiorif.get3(id, this._mouseEventHeaders(event)).then(this.kernel.executeSakuraScript);
  }

  balloonclick(event) { // TODO refactor
    const named = this.kernel.component(Named) as {};
    const shellState = this.kernel.component(ShellState);
    this.kernel.component(SakuraScriptExecuter).balloonClicked();
    if (shellState.hasChoice) return; // 選択肢があればクリアされない
    if (!shellState.talking) { // 喋っていない状態でシングルクリックされたら
      named.scopes.forEach((scope) => scope.blimp(-1).clear()); // バルーンをクリア&非表示
      shellState.clearBalloonTimeout();
    }
  }

  balloondblclick(event) {
    const shellState = this.kernel.component(ShellState);
    if (shellState.hasChoice) return; // 選択肢があればクリアされない
    if (shellState.talking) { // 喋っている状態でダブルクリックされたら
      const sakuraScriptExecuter = this.kernel.component(SakuraScriptExecuter);
      sakuraScriptExecuter.abortExecute();
    } else {
      this._balloonClick("event");
    }
  }

  filedrop(event) {
    // TODO: インストール以外
    const namedKernelManager = this.kernel.component(NamedKernelManager);
    // TODO: jQuery / DOM操作系は何処でするのが良いのか
    event.event.stopPropagation();
    event.event.preventDefault();
    event.event.originalEvent.dataTransfer.dropEffect = "copy";
    const files = event.event.originalEvent.dataTransfer.files;
    for (let i = 0; i < files.length; ++i) {
      const file = files[i];
      namedKernelManager.installNamed(file, this.kernel);
    }
  }

  get _timeCritical() {
    const shellState = this.kernel.component(ShellState);
    return shellState.timeCritical;
  }

  _mouseEventHeaders(event) {
    return [
      event.offsetX,
      event.offsetY,
      event.wheel,
      event.scope,
      event.region,
      event.button,
      event.type,
    ];
  }
}

GhostKernelRoutings.push(ShellRouting);
*/
