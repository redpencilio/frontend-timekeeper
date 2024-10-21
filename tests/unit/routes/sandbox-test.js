import { module, test } from 'qunit';
import { setupTest } from 'frontend-timekeeper/tests/helpers';

module('Unit | Route | sandbox', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:sandbox');
    assert.ok(route);
  });
});
