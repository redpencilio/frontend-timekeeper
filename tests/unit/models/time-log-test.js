import { setupTest } from 'frontend-timekeeper/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Model | time log', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('time-log', {});
    assert.ok(model, 'model exists');
  });
});
