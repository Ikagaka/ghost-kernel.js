import { EventController } from "lazy-event-router";
import { GhostKernel } from "../GhostKernel";

/** カーネル用のコントローラ */
export class GhostKernelController implements EventController {
  /** カーネル */
  protected readonly kernel: GhostKernel;

  /**
   * コンストラクタ
   * @param states カーネル
   */
  constructor(kernel: GhostKernel) {
    this.kernel = kernel;
  }
}
