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
   * @param {Shell} components.View Shell interface
   * @param {SakuraScriptRunner} components.SakuraScriptRunner SakuraScript Runner
   * @param {NamedKernelManager} components.NamedKernelManager Named Kernel Manager
   * @param {TimerEventSource} components.Time Timer event source
   * @param {RoutableComponentRoutes} [routes] ルーティング
   * @param {Object<GhostKernelController>} [controllers] コントローラ
   */
  constructor(components, routes = new RoutableComponentRoutes(GhostKernelRoutings), controllers = GhostKernelControllers) {
    super(components);
    this.components.GhostKernel = this;
    this._routes = routes;
    this.routes.setup_to(this, controllers);
  }

  /**
   * Kernel event routes
   * @type {RoutableComponentRoutes}
   */
  get routes() { return this._routes; }

  /**
   * start kernel (emits start event)
   * @return {void}
   */
  start() {
    this.emit('start');
  }

  /**
   * emits protocol version fixed event
   * @return {void}
   */
  protocol_version_fixed() {
    this.emit('protocol_version_fixed');
  }

  /**
   * emits close event
   * @return {void}
   */
  close() {
    this.emit('close');
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
