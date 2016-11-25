/// <reference types="mocha" />
import {GhostKernel} from "../src/lib/ghost-kernel";

import * as assert from "power-assert";

describe("GhostKernel", () => {
  describe("#constructor", () => {
    it("basic", () => {
      assert(new GhostKernel() instanceof GhostKernel);
    });
  });
});
