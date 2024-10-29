import { setupTest } from 'frontend-timekeeper/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Model | project', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('project', {});
    assert.ok(model, 'model exists');
  });
});
