import {GhostKernel} from '../src/lib/ghost-kernel';

import assert from 'power-assert';

/** @test {GhostKernel} */
describe('GhostKernel', function() {
  lazy('instance', function() { return new GhostKernel({a: 1}) });
  /** @test {GhostKernel#constructor} */
  context('constructor', function() {
    it('basic', function() { assert(this.instance instanceof GhostKernel) });
  });
});
