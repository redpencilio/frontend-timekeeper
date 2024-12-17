import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class MuChangePasswordComponent extends Component {
  @tracked oldPassword = null;
  @tracked newPassword = null;
  @tracked newPasswordConfirmation = null;
  @tracked errorMessage = null;
  @tracked successMessage = null;

  changePassword = task(async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/accounts/current/changePassword', {
        method: 'PATCH',
        body: JSON.stringify({
          data: {
            type: 'accounts',
            id: 'current',
            attributes: {
              'old-password': this.oldPassword,
              'new-password': this.newPassword,
              'new-password-confirmation': this.newPasswordConfirmation,
            },
          },
        }),
        headers: {
          'content-type': 'application/vnd.api+json'
        }
      });
      if (!response.ok) {
        this.errorMessage = response.statusText;
      } else {
        this.successMessage = "Password was changed successfully"
        this.oldPassword = null;
        this.newPassword = null;
        this.newPasswordConfirmation = null;
      }
    } catch (e) {
      this.errorMessage = e.message;
    }
  });
}
