import { module, test } from 'qunit';

import { setupTest } from 'frontend-timekeeper/tests/helpers';

module('Unit | Transform | duration', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let transform = this.owner.lookup('transform:duration');
    assert.ok(transform);
  });
});
