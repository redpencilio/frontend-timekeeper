import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class ToasterComponent extends Component {
  @service toaster;

  closeToast = (toast) => {
    this.toaster.close(toast);
  };
}
