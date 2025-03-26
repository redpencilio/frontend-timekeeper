import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { trackedFunction } from 'reactiveweb/function';
import constants from '../constants';
import { service } from '@ember/service';

export default class UserEditComponent extends Component {
  @service store;

  @tracked newAccountSelection = null;

  isKimaiAccount = (account) =>
    account.accountServiceHomepage === constants.KIMAI_SERVICE_HOMEPAGE;

  get person() {
    return this.args.person;
  }

  get selectedAccount() {
    return this.newAccountSelection || this.currentAccount.value;
  }

  currentAccount = trackedFunction(this, async () => {
    const accounts = await this.person.accounts;
    const kimaiAccount = accounts.find((account) =>
      this.isKimaiAccount(account),
    );
    return kimaiAccount;
  });

  accountLinkOptions = trackedFunction(this, async () => {
    return await this.store.queryAll('account', {
      'filter[:exact:account-service-homepage]':
        constants.KIMAI_SERVICE_HOMEPAGE,
      'filter[:has-no:person]': true,
      sort: 'account-name',
    });
  });

  selectNewAccount = async (selectedAccount) => {
    const accounts = await this.person.accounts;
    const oldKimaiAccount = accounts.find((account) =>
      this.isKimaiAccount(account),
    );
    if (oldKimaiAccount) {
      oldKimaiAccount.person = null;
      await oldKimaiAccount.save();
    }
    selectedAccount.person = this.person;
    selectedAccount.save();
  };
}
