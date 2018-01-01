// tslint:disable max-classes-per-file

declare module "cuttlebone" {
  import { EventEmitter } from "events";

  export type NamedId = number;
  export type ScopeId = number;

  export class NamedManager {
    element: HTMLDivElement;
    destructor(): void;
    materialize(shell: Shell, balloon: Balloon): NamedId;
    materialize2(shell: Shell, balloon: Balloon): Named;
    vanish(namedId: NamedId): void;
    named(namedId: NamedId): Named;
  }

  export class Named extends EventEmitter {
    namedId: NamedId;
    scopes: Scope[];
    scope(scopeId?: ScopeId): Scope;
    openInputBox(id: string, placeHolder?: string): void;
    openCommunicateBox(placeHolder?: string): void;
    contextmenu(callback: (ev: ContextMenuEvent) => ContextMenuObject): void;
    on(event: "mousedown" | "mousemove" | "mouseup" | "mouseclick" | "mousedblclick", callback: (ev: SurfaceMouseEvent) => void): this;
    on(event: "balloonclick" | "balloondblclick" | "mousemove" | "mouseup" | "mousedown", callback: (ev: BalloonMouseEvent) => void): this;
    on(event: "userinput" | "communicateinput", callback: (ev: BalloonInputEvent) => void): this;
    on(event: "anchorselect" | "choiceselect", callback: (ev: BalloonSelectEvent) => void): this;
    on(event: "filedrop", callback: (ev: FileDropEvent) => void): this;
    changeShell(shell: Shell): void;
    changeBalloon(balloon: Balloon): void;
  }

  // swisnl/jQuery-contextMenu

  export interface ContextMenuEvent {
    type: string;
    scopeId: number;
    event: UIEvent;
  }
  export interface ContextMenuObject {
    callback?(itemId: string): void;
    items: {[itemId: string]: Item | SubGroup};
  }
  export interface Item {
    name: string;
    callback?(itemId: string): void;
  }
  export interface SubGroup {
    name: string;
    items: {[key: string]: Item | SubGroup};
  }

  export type NamedEvent =
    SurfaceMouseEvent | BalloonMouseEvent | BalloonInputEvent | BalloonSelectEvent | FileDropEvent;

  export interface SurfaceMouseEvent {
    type: "mousedown" | "mousemove" | "mouseup" | "mouseclick" | "mousedblclick";
    transparency: boolean; // true
    button: number; // マウスのボタン。 https://developer.mozilla.org/ja/docs/Web/API/MouseEvent/button
    offsetX: number; // canvas左上からのx座標
    offsetY: number; // canvas左上からのy座標
    region: string; // collisionの名前,"Bust","Head","Face"など
    scopeId: number; // このサーフェスのスコープ番号
    wheel: number; // mousewheel実装したら使われるかも
    event: UIEvent; // 生のDOMイベント。 https://developer.mozilla.org/ja/docs/Web/API/UIEvent
  }

  export interface BalloonMouseEvent {
    type: "click" | "dblclick" | "mousemove" | "mouseup" | "mousedown";
    scopeId: number; // \p[n]
    balloonId: number; // \b[n]
  }

  export interface BalloonInputEvent {
    type: "userinput" | "communicateinput";
    id: string;
    content: string;
  }

  export interface BalloonSelectEvent {
    type: "anchorselect" | "choiceselect";
    id: string;
    text: string;
    args: string[];
  }

  export interface FileDropEvent {
    type: "filedrop";
    scopeId: number;
    event: UIEvent;
  }

  export class Scope {
    surface(surfaceId?: number | string): Surface;
    blimp(blimpId?: number): Blimp;
    position(pos?: {right: number; bottom: number}): {right: number; bottom: number};
    bind(category: string, parts: string): void;
    bind(scopeId: number, bindgroupId: number): void;
    unbind(category: string, parts: string): void;
    unbind(scopeId: number, bindgroupId: number): void;
  }

  export class Shell extends EventEmitter {
    descript: { [key: string]: string; };
    constructor(directory: { [path: string]: ArrayBuffer; });
    load(): Promise<this>;
    unload(): void;
    attatchSurface(div: HTMLDivElement, scopeId: number, surfaceId: number | string): Surface | null;
    detachSurface(div: HTMLDivElement): void;
    bind(category: string, parts: string): void;
    bind(scopeId: number, bindgroupId: number): void;
    unbind(category: string, parts: string): void;
    unbind(scopeId: number, bindgroupId: number): void;
    showRegion(): void;
    hideRegion(): void;
    on(event: "mouse", callback: (event: SurfaceMouseEvent)=> void): this;
    getBindGroups(scopeId: number): {category: string, parts: string, thumbnail: string}[];
  }

  export class Surface {
    render(): void;
    yenE(): void;
    play(id: number): void;
  }

  export class Balloon {
    constructor(directory: { [path: string]: ArrayBuffer; });
    load(): Promise<this>;
    unload(): void;
  }

  export class Blimp {
    isBalloonLeft: boolean;
    width: number;
    height: number;
    render(): void;
    surface(balloonId: number): void;
    left(): void;
    right(): void;
    anchorBegin(...args: string[]): void;
    anchorEnd(): void;
    choice(...args: string[]): void;
    choiceBegin(...args: string[]): void;
    choiceEnd(): void;
    talk(text: string): void;
    marker(): void;
    clear(): void;
    br(radio?: number): void;
    showWait(): void;
    font(name: string, ...values: string[]): void;
    location( x: string, y?: string ): void;
  }
}
