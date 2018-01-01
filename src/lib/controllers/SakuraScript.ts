import { Named } from "cuttlebone";
import { EventRoutingDefiner } from "lazy-event-router";
import { SakuraScriptToken } from "sakurascript";
import { SakuraScriptExecuter } from "sakurascript-executer";
import { Shiorif } from "shiorif";
import { SakuraScriptState } from "../index";
// import { KernelPhase, KernelStartOperation } from "../components";
import { GhostKernelController } from "./GhostKernelController";
import { ShellState } from "./shell";

export const SakuraScriptRouting: EventRoutingDefiner = (routes) => {
  routes.controller(SakuraScriptController, (routes2) => {
    // routes2.from(KernelStartOperation, (from, controller) => {
    //   from.on("start", controller.start);
    // });
    // routes2.from(KernelPhase, (from, controller) => {
    //   from.on("halted", controller.halt);
    // });
    routes2.from(SakuraScriptExecuter, (from, controller) => {
      from.on("beginExecute", controller.beginExecute);
      from.on("execute", controller.execute);
      from.on("endExecute", controller.endExecute);
    });
  });
};

export class SakuraScriptController extends GhostKernelController {
  // カーネルがやってくれるようになった
  /*
  async start() {
    const sakurascriptExecuter = new SakuraScriptExecuter({talkWait: 50}); // TODO: 設定を読む
    this.kernel.registerComponent(sakurascriptExecuter);
    this.kernel.registerComponent(new SakuraScriptState());
  }

  halt() {
    this.kernel.sakuraScriptExecuter.abortExecute();
    this.kernel.component(SakuraScriptState)!.clearAllTimerRaise();
    this.kernel.unregisterComponent(SakuraScriptExecuter);
    this.kernel.unregisterComponent(SakuraScriptState);
  }
  */

  beginExecute() {
    // TODO: これShellStateにメソッドもうけてやることでは？
    const shellState = this.kernel.component(ShellState);
    if (!shellState) return;
    shellState.clearBalloonTimeout();
    shellState.talking = true;
    shellState.synchronized = false;
    shellState.timeCritical = false;
    shellState.hasChoice = false;
    // tslint:disable-next-line no-magic-numbers
    shellState.balloonTimeout = 10000; // TODO: 設定を読む
    // tslint:disable-next-line no-magic-numbers
    shellState.choiceTimeout = 20000; // TODO: 設定を読む
    this.kernel.component(Named).scopes.forEach((scope) => {
      scope.blimp(0); // 初期化
      scope.blimp(-1).clear(); // 非表示
    });
  }

  endExecute(aborted: boolean) {
    const named = this.kernel.component(Named);
    const shellState = this.kernel.component(ShellState);
    if (!shellState) return;
    shellState.talking = false;
    if (aborted) {
      named.scopes.forEach((scope) => scope.blimp(-1)); // 再生中断なら即座にバルーンをクリア&非表示
    } else {
      shellState.setBalloonTimeout(this._break.bind(this)); // 再生中断でなくタイムアウトありならタイムアウトイベントを設定
    }
  }

  _break() {
    const named = this.kernel.component(Named);
    const shellState = this.kernel.component(ShellState);
    named.scopes.forEach((scope) => scope.blimp(-1));
    if (shellState && shellState.hasChoice) {
      named.emit("choicetimeout"); // TODO: named?
    } else {
      named.emit("balloontimeout"); // TODO: named?
    }
    if (shellState) shellState.breakTimeoutId = undefined;
  }

  execute(token: SakuraScriptToken) {
    return this._handle_view(token)
      || this._handle_wait(token)
      || this._handle_state(token)
      || this._handle_balloon(token)
      || this._handle_other(token);
  }

  _handle_view(token: SakuraScriptToken) {
    const named = this.kernel.component(Named) as any;
    const scope = named.scope();
    const surface = scope.surface();
    if (token instanceof SakuraScriptToken.Scope) {
      named.scope(token.scope);
    } else if (token instanceof SakuraScriptToken.Surface) {
      scope.surface(token.surface);
    } else if (token instanceof SakuraScriptToken.SurfaceAlias) {
      scope.surface(token.surfaceAlias);
    } else if (token instanceof SakuraScriptToken.Balloon) {
      scope.blimp(token.balloon);
    } else if (token instanceof SakuraScriptToken.PlayAnimation) {
      surface.play(token.animation);
    } else if (token instanceof SakuraScriptToken.PlayAnimationWait) {
      surface.play(token.animation);
    } else if (token instanceof SakuraScriptToken.Animation) {
      // TODO: cuttlebone not implemented
    } else if (token instanceof SakuraScriptToken.Bind) {
      // tslint:disable-next-line no-null-keyword
      if (token.dressUp == null) {
        // TODO: toggle
      } else if (token.dressUp) {
        scope.bind(token.category, token.parts);
      } else {
        scope.unbind(token.category, token.parts);
      }
    } else {
      return false;
    }

    return true;
  }

  // tslint:disable-next-line prefer-function-over-method
  _handle_wait(token: SakuraScriptToken) {
    if (token instanceof SakuraScriptToken.SimpleWait) {
      return true;
    } else if (token instanceof SakuraScriptToken.PreciseWait) {
      return true;
    } else if (token instanceof SakuraScriptToken.WaitFromBeginning) {
      return true;
    } else if (token instanceof SakuraScriptToken.ResetBeginning) {
      return true;
    } else if (token instanceof SakuraScriptToken.WaitAnimationEnd) {
      return true;
    } else if (token instanceof SakuraScriptToken.ToggleQuick) {
      return true;
    } else {
      return false;
    }
  }

  _handle_state(token: SakuraScriptToken) {
    const shellState = this.kernel.component(ShellState);
    if (!shellState) return false;
    if (token instanceof SakuraScriptToken.ToggleSynchronize) {
      shellState.synchronized = shellState.synchronized ? false : token.scopes;
    } else if (token instanceof SakuraScriptToken.TimeCritical) {
      shellState.timeCritical = !shellState.timeCritical;
    } else if (token instanceof SakuraScriptToken.NoChoiceTimeout) {
      shellState.choiceTimeout = 0;
    } else {
      return false;
    }

    return true;
  }

  // tslint:disable-next-line cyclomatic-complexity
  _handle_balloon(token: SakuraScriptToken) {
    const named = this.kernel.component(Named);
    const scope = named.scope();
    const blimp = scope.blimp();
    const shellState = this.kernel.component(ShellState);
    if (!shellState) return false;
    if (token instanceof SakuraScriptToken.WaitClick) {
      named.scope(0).blimp().showWait();
    } else if (token instanceof SakuraScriptToken.EventChoice) {
      shellState.hasChoice = true;
      blimp.choice(token.text, token.event, ...token.references);
    } else if (token instanceof SakuraScriptToken.ReferencesChoice) {
      shellState.hasChoice = true;
      blimp.choice(token.text, ...token.references);
    } else if (token instanceof SakuraScriptToken.ScriptChoice) {
      shellState.hasChoice = true;
      blimp.choice(token.text, `script:${token.script}`);
    } else if (token instanceof SakuraScriptToken.OldReferenceChoice) {
      shellState.hasChoice = true;
      blimp.choice(token.text, token.reference);
      blimp.br();
    } else if (token instanceof SakuraScriptToken.BeginEventChoice) {
      shellState.hasChoice = true;
      blimp.choiceBegin(token.event, ...token.references);
    } else if (token instanceof SakuraScriptToken.BeginReferencesChoice) {
      shellState.hasChoice = true;
      blimp.choiceBegin(...token.references);
    } else if (token instanceof SakuraScriptToken.BeginScriptChoice) {
      shellState.hasChoice = true;
      blimp.choiceBegin(`script:${token.script}`);
    } else if (token instanceof SakuraScriptToken.EndChoice) {
      blimp.choiceEnd();
    } else if (token instanceof SakuraScriptToken.BeginEventAnchor) {
      blimp.anchorBegin(token.event, ...token.references);
    } else if (token instanceof SakuraScriptToken.BeginReferencesAnchor) {
      blimp.anchorBegin(...token.references);
    } else if (token instanceof SakuraScriptToken.BeginScriptAnchor) {
      blimp.anchorBegin(`script:${token.script}`);
    } else if (token instanceof SakuraScriptToken.EndAnchor) {
      blimp.anchorEnd();
    } else if (token instanceof SakuraScriptToken.LineBreak) {
      blimp.br();
    } else if (token instanceof SakuraScriptToken.HalfLineBreak) {
      // tslint:disable-next-line no-magic-numbers
      blimp.br(0.5);
    } else if (token instanceof SakuraScriptToken.PercentLineBreak) {
      // tslint:disable-next-line no-magic-numbers
      blimp.br(token.percent / 100);
    } else if (token instanceof SakuraScriptToken.ToggleNoAutoLineBreak) {
      // TODO: cuttlebone not implemented
    } else if (token instanceof SakuraScriptToken.Location) {
      blimp.location(token.x, token.y);
    } else if (token instanceof SakuraScriptToken.Image) {
      // TODO: cuttlebone not implemented
    } else if (token instanceof SakuraScriptToken.InlineImage) {
      // TODO: cuttlebone not implemented
    } else if (token instanceof SakuraScriptToken.Font.FontBase) {
      // TODO: 沢山あるので後で
      // blimp.font(token.name, ...token.args);
    } else if (token instanceof SakuraScriptToken.Marker) {
      blimp.marker();
    } else if (token instanceof SakuraScriptToken.Char) {
      if (shellState.synchronized) {
        const scopes =
          typeof shellState.synchronized === "boolean" ?
          named.scopes :
          shellState.synchronized.map((scopeId) => named.scopes[scopeId]).filter((_scope) => _scope);
        scopes.forEach((_scope) => _scope.blimp().talk(token.char));
      } else {
        blimp.talk(token.char);
      }
    } else {
      return false;
    }

    return true;
  }

  // tslint:disable-next-line cyclomatic-complexity
  _handle_other(token: SakuraScriptToken) {
    const named = this.kernel.component(Named);
    const scope = named.scope();
    const surface = scope.surface();
    const blimp = scope.blimp();
    const shiorif = this.kernel.component(Shiorif);
    const sakuraScriptState = this.kernel.component(SakuraScriptState);
    const shellState = this.kernel.component(ShellState);
    if (!shellState) return false;
    if (token instanceof SakuraScriptToken.BeFar) {
      // TODO: cuttlebone not implemented
    } else if (token instanceof SakuraScriptToken.BeNear) {
      // TODO: cuttlebone not implemented
    } else if (token instanceof SakuraScriptToken.Clear) {
      blimp.clear();
      shellState.hasChoice = false;
    } else if (token instanceof SakuraScriptToken.End) {
      surface.yenE();
    } else if (token instanceof SakuraScriptToken.OldChoiceEnd) {
      surface.yenE();
    } else if (token instanceof SakuraScriptToken.OpenCommunicateBox) {
      named.openCommunicateBox();
    } else if (token instanceof SakuraScriptToken.OpenTeachBox) {
      // TODO: cuttlebone not implemented
    } else if (token instanceof SakuraScriptToken.Halt) {
      surface.yenE();
      this.kernel.closeBy.close("user"); // TODO: userで良い？
    } else if (token instanceof SakuraScriptToken.LockRepaint) {
      // TODO: cuttlebone not implemented
    } else if (token instanceof SakuraScriptToken.UnlockRepaint) {
      // TODO: cuttlebone not implemented
    } else if (token instanceof SakuraScriptToken.Move) {
      // TODO
    } else if (token instanceof SakuraScriptToken.MoveAsync) {
      // TODO
    } else if (token instanceof SakuraScriptToken.MoveAsyncCancel) {
      // TODO
    } else if (token instanceof SakuraScriptToken.Raise) {
      shiorif.get3(token.event, token.references).then(this.kernel.executeSakuraScript);
    } else if (token instanceof SakuraScriptToken.TimerRaise) {
      if (token.period && token.period >= 1) {
        let repeatCount = token.repeatCount || 0;
        sakuraScriptState.timerRaiseTimerId[token.event] = setInterval(() => {
          shiorif.get3(token.event, token.references).then(this.kernel.executeSakuraScript);
          if (repeatCount > 0) repeatCount--;
          if (!repeatCount) sakuraScriptState.clearTimerRaise(token.event);
        },                                                             token.period);
      } else {
        sakuraScriptState.clearTimerRaise(token.event);
      }
    } else if (token instanceof SakuraScriptToken.Notify) {
      shiorif.notify3(token.event, token.references); // TODO: catch error
    } else if (token instanceof SakuraScriptToken.Set) {
      const handler = SakuraScriptController._setHandler[token.id as "balloontimeout" | "choicetimeout"];
      if (handler) handler.bind(this)(token);
    } else if (token instanceof SakuraScriptToken.Open) {
      const handler = SakuraScriptController._openHandler[token.command as "communicatebox" | "inputbox"];
      if (handler) handler.bind(this)(token);
    } else if (token instanceof SakuraScriptToken.Close) {
      const handler = SakuraScriptController._closeHandler[token.command];
      if (handler) handler.bind(this)(token);
    } else if (token instanceof SakuraScriptToken.NotImplemented) {
      return true;
    } else {
      return false;
    }

    return true;
  }

  static _setHandler = {
    balloontimeout(this: SakuraScriptController, token: SakuraScriptToken.Set) {
      // tslint:disable-next-line no-non-null-assertion
      this.kernel.component(ShellState)!.balloonTimeout = Number(token.args[0]);
    },
    choicetimeout(this: SakuraScriptController, token: SakuraScriptToken.Set) {
      // tslint:disable-next-line no-non-null-assertion
      this.kernel.component(ShellState)!.choiceTimeout = Number(token.args[0]);
    },
  };

  static _openHandler = {
    communicatebox(this: SakuraScriptController, token: SakuraScriptToken.Open) {
      this.kernel.component(Named).openCommunicateBox(token.args[0]);
    },
    inputbox(this: SakuraScriptController, token: SakuraScriptToken.Open) {
      // cuttleboneが表示時間などに未対応
      // tslint:disable-next-line no-magic-numbers
      this.kernel.component(Named).openInputBox(token.args[0], token.args[2]);
    },
  };

  static _closeHandler: {[name: string]: any} = {};
}
