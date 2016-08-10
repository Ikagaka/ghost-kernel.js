import {RoutableComponent, RoutableComponentRoutes} from 'routable-component';

/**
 * ルーティング設定クラスのリスト
 * @type {RoutableComponentRouting[]}
 */
export const GhostKernelRoutings = [];

/**
 * コントローラクラスの連想配列
 * @type {Object<GhostKernelController>}
 */
export const GhostKernelControllers = {};

/** Ukagaka baseware ghost instance kernel */
export class GhostKernel extends RoutableComponent {
  /**
   * constructor
   * @param {Object<EventEmitter>} components components
   * @param {Shiorif} components.Shiorif SHIORI interface
   * @param {Named} components.Named Shell Named interface
   * @param {NamedKernelManager} components.NamedKernelManager Named Kernel Manager
   * @param {TimerEventSource} components.TimerEventSource Timer event source
   * @param {RoutableComponentRoutes} [routes] ルーティング
   * @param {Object<class<GhostKernelController>>} [controller_classes] コントローラ
   */
  constructor(components, routes = new RoutableComponentRoutes(GhostKernelRoutings), controllerClasses = GhostKernelControllers) {
    super(components, routes, controllerClasses);
    this.registerComponent('GhostKernel', this);
  }

  /**
   * start kernel (emits start event)
   * @return {void}
   */
  async start() {
    this._ghostDescript = await this.components.NanikaStorage.ghost_descript(this.namedId);
    this._namedId = this.components.NamedKernelManager.namedId(this);
    this.emit('start');
  }

  /**
   * emits change_shell event
   * @param {string} shellname シェル名
   * @return {void}
   */
  changeShell(shellname) {
    this.emit('change_shell', shellname);
  }

  /**
   * emits change_balloon event
   * @param {string} balloonname バルーン名
   * @return {void}
   */
  changeBalloon(balloonname) {
    this.emit('change_balloon', balloonname);
  }

  /**
   * emits close event
   * @param {string} reason 理由
   * @param {boolean} all OnCloseAllにあたるならtrue
   * @return {void}
   */
  close(reason, all) {
    this.emit('close', reason, all);
  }

  /**
   * emits halt event
   * @param {string} reason 理由
   * @return {void}
   */
  halt(reason) {
    this.emit('halt', reason);
  }

  get namedId() { return this._namedId; }

  get ghostDescript() { return this._ghostDescript; }
  get shellDescript() { return this.components.Named.shell.descript; }
  get balloonDescript() { return this.components.Named.balloon.descript; }

  profile(newProfile) {
    return this.components.NanikaStorage.ghost_profile(this.namedId, newProfile);
  }
}

/**
 * カーネル用のコントローラ
 * @implements {RoutableComponentController}
 */
export class GhostKernelController {
  /**
   * コンストラクタ
   * @param {GhostKernel} kernel カーネル
   */
  constructor(kernel) {
    this._kernel = kernel;
  }

  /**
   * カーネル
   * @type {GhostKernel}
   */
  get kernel() { return this._kernel; }
}
