import {
  ComponentClass,
  EventRoutes,
  LazyEventRouter,
} from "lazy-event-router";
import { NanikaGhostDirectory, NanikaStorage } from "nanika-storage";
import { SakuraScriptExecuter } from "sakurascript-executer";
import { ShioriTransaction } from "shiori_transaction";
import { Shiorif } from "shiorif";
import {
  KernelChangeOperation,
  KernelCloseOperation,
  KernelPhase,
  KernelStartOperation,
  SakuraScriptState,
} from "./components";
import { routings } from "./routings";
import { SakuraScriptExecuterService } from "./services/SakuraScriptExecuterService";

/** カーネルに必ず存在するコンポーネント */
export type GhostKernelRequiredComponent =
  KernelStartOperation |
  KernelCloseOperation |
  KernelChangeOperation |
  KernelPhase |
  SakuraScriptExecuter |
  SakuraScriptState |
  NanikaStorage |
  NanikaGhostDirectory |
  Shiorif;

/** Ukagaka baseware ghost instance kernel */
export class GhostKernel extends LazyEventRouter {
  private sakuraScriptExecuterService: SakuraScriptExecuterService;

  /**
   * constructor
   * @param components コンポーネント NanikaStorage, NanikaGhostDirectory, Shiorif必須
   * @param routes ルーティング
   */
  constructor(components: any[] = [], routes = new EventRoutes(routings)) {
    super(components, routes);
    this.registerComponent(new KernelPhase());
    this.registerComponent(new KernelStartOperation());
    this.registerComponent(new KernelCloseOperation());
    this.registerComponent(new KernelChangeOperation());
    // TODO: さくらスクリプトはここでinitすべきなのか？
    this.registerComponent(new SakuraScriptExecuter({talkWait: 50})); // TODO: 設定を読む
    this.registerComponent(new SakuraScriptState());
    this.sakuraScriptExecuterService =
      new SakuraScriptExecuterService(this.component(Shiorif), this.component(SakuraScriptExecuter));
    this.component(KernelPhase).on("halted", () => {
      this.component(SakuraScriptState).clearAllTimerRaise();
      this.component(SakuraScriptExecuter).abortExecute();
      this.unregisterComponent(SakuraScriptState);
      this.unregisterComponent(SakuraScriptExecuter);
      this.unregisterComponent(KernelStartOperation);
      this.unregisterComponent(KernelCloseOperation);
      this.unregisterComponent(KernelChangeOperation);
      this.unregisterComponent(KernelPhase);
    });
    this.executeSakuraScript = this.executeSakuraScript.bind(this);
  }

  /**
   * Component
   */
  component<T extends GhostKernelRequiredComponent>(componentClass: ComponentClass<T>): T;
  component<T>(componentClass: ComponentClass<T>): T | undefined;
  component<T>(componentClass: ComponentClass<T>) {
    return super.component(componentClass);
  }

  /** カーネルの開始操作 */
  get startBy() { return this.component(KernelStartOperation); }
  /** カーネルの終了操作 */
  get closeBy() { return this.component(KernelCloseOperation); }
  /** カーネルの変更操作 */
  get change() { return this.component(KernelChangeOperation); }
  /** SHIORIトランザクションからさくらスクリプトを実行する */
  async executeSakuraScript(transaction: ShioriTransaction) {
    await this.sakuraScriptExecuterService.execute(transaction);
  }
}
