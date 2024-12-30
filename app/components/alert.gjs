import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { concat } from '@ember/helper';
import { eq } from 'ember-truth-helpers';
import { localCopy } from 'tracked-toolbox';
import selectOn from 'frontend-timekeeper/modifiers/select-on';
import disabled from 'frontend-timekeeper/modifiers/disabled';

export default class ButtonComponent extends Component {
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

  <template>
    <div class={{concat 'p-4 rounded-md ' this.backgroundColor}}>
      <div class='flex'>
        <div class='shrink'>
          <IconSvg @skin={{this.skin}} @iconColor={{this.iconColor}} />
        </div>
        <div class='ml-3'>
          {{#if @title}}
            <h3 class={{concat 'font-medium text-sm ' this.titleColor}}>
              {{@title}}
            </h3>
          {{/if}}
          {{#if @message}}
            <div
              class={{concat
                'text-sm '
                (if @title 'mt-2 ' '')
                this.messageColor
              }}
            >
              <p>{{@message}}</p>
            </div>
          {{/if}}
        </div>
      </div>
    </div>
  </template>
}

const IconSvg = <template>
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    fill='currentColor'
    aria-hidden='true'
    data-slot='icon'
    class={{concat 'size-5 ' @iconColor}}
  >
    {{#if (eq @skin 'error')}}
      <path
        fill-rule='evenodd'
        d='M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z'
        clip-rule='evenodd'
      >
      </path>
    {{else if (eq @skin 'warning')}}
      <path
        fill-rule='evenodd'
        d='M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'
        clip-rule='evenodd'
      ></path>
    {{else if (eq @skin 'success')}}
      <path
        fill-rule='evenodd'
        d='M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z'
        clip-rule='evenodd'
      ></path>
    {{else if (eq @skin 'info')}}
      <path
        fill-rule='evenodd'
        d='M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z'
        clip-rule='evenodd'
      ></path>
    {{/if}}
  </svg>
</template>;
