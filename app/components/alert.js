import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class AlertComponent extends Component {
  @service store;

  colors = {
    error: {
      background: 'bg-red-50',
      icon: 'text-red-500',
      title: 'text-red-800',
      message: 'text-red-700',
    },
    success: {
      background: 'bg-green-50',
      icon: 'text-green-400',
      title: 'text-green-800',
      message: 'text-green-700',
    },
    warning: {
      background: 'bg-yellow-50',
      icon: 'text-yellow-400',
      title: 'text-yellow-800',
      message: 'text-yellow-700',
    },
    info: {
      background: 'bg-zinc-50',
      icon: 'text-zinc-500',
      title: 'text-zinc-800',
      message: 'text-zinc-700',
    },
  };

  get skin() {
    return this.args.skin ?? 'success';
  }

  get backgroundColor() {
    return this.colors[this.skin].background;
  }

  get iconColor() {
    return this.colors[this.skin].icon;
  }

  get titleColor() {
    return this.colors[this.skin].title;
  }

  get messageColor() {
    return this.colors[this.skin].message;
  }
}
