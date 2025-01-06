import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class ToasterComponent extends Component {
  @service toaster;

  get containerClass() {
    return 'z-50 fixed bottom-0 left-1/2 transform -translate-x-1/2 shadow';
  }

  closeToast = (toast) => {
    this.toaster.close(toast);
  };
}
