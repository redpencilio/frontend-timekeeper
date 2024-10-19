import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend-timekeeper/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | time-log-popover', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<TimeLogPopover />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <TimeLogPopover>
        template block text
      </TimeLogPopover>
    `);

    assert.dom().hasText('template block text');
  });
});
