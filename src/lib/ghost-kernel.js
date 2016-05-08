import {RoutableComponent, RoutableComponentRoutes} from 'routable-component';

// shim
require('core-js/fn/array/iterator');
require('core-js/fn/symbol');

/**
 * ルーティング設定クラスのリスト
 * @type {RoutableComponentRouting[]}
 */
export const GhostKernelRoutings = [];

/**
 * コントローラクラスの連想配列
 * @type {Hash<GhostKernelController>}
 */
export const GhostKernelControllers = {};

/** Ukagaka baseware ghost instance kernel */
export class GhostKernel extends RoutableComponent {
  /**
   * constructor
   * @param {Object} event_source - Event source
   * @param {Shiorif} event_source.shiorif - SHIORI interface
   * @param {Shell} event_source.view - Shell interface
   * @param {SakuraScriptPlayer} event_source.ssp - Sakura Script runner
   * @param {NamedKernelManager} event_source.manager - Named Kernel Manager
   * @param {TimerEventSource} event_source.time - Timer event source
   * @param {RoutableComponentRoutes} [routes] - ルーティング
   * @param {Hash<GhostKernelController>} [controllers] - コントローラ
   */
  constructor(event_source, routes = new RoutableComponentRoutes(GhostKernelRoutings), controllers = GhostKernelControllers) {
    const {shiorif, view, ssp, manager, time} = event_source;
    super();

    this._shiorif = shiorif;
    this._view = view;
    this._ssp = ssp;
    this._manager = manager;
    this._time = time;

    this._routes = routes;
    this.routes.setup_to(this, controllers);
  }

  /**
   * SHIORI Interface
   * @type {Shiorif}
   */
  get shiorif() { return this._shiorif; }

  /**
   * View Interface
   * @type {Shell}
   */
  get view() { return this._view; }

  /**
   * Sakura Script Player
   * @type {SakuraScriptPlayer}
   */
  get ssp() { return this._ssp; }

  /**
   * Kernel Manager
   * @type {NamedKernelManager}
   */
  get manager() { return this._manager; }

  /**
   * Timer event source
   * @type {TimerEventSource}
   */
  get time() { return this._time; }

  /**
   * Kernel
   * @type {GhostKernel} kernel
   */
  get kernel() { return this; }

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
   * emits version complete event
   * @return {void}
   */
  version_complete() {
    this.emit('version_complete');
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
