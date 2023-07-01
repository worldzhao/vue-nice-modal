import type {
  ComponentPublicInstance,
  Component,
  VNodeProps,
  AllowedComponentProps,
} from 'vue-demi';
import { h, isVue2 } from 'vue-demi';
import { extend, inBrowser, noop } from './utils';
import { mountComponent } from './mount-component';
import { useModalState } from './use-modal-state';

function initInstance(Comp: any, options: Record<string, unknown>) {
  const Wrapper = {
    setup() {
      const { state, toggle } = useModalState(options);
      return () => {
        if (isVue2) {
          return h(Comp, {
            on: { 'update:visible': toggle },
            props: { ...state },
          });
        }
        return h(Comp, {
          ...state,
          'onUpdate:visible': toggle,
        });
      };
    },
  };

  return mountComponent(Wrapper);
}

export type INiceModalHandlers<T = any> = {
  callback: (action: 'confirm' | 'cancel', payload?: T) => void;
  remove: () => void;
  hide: () => void;
};

type ComponentProps<C extends Component> = C extends new (...args: any) => any
  ? Omit<
      InstanceType<C>['$props'],
      keyof VNodeProps | keyof AllowedComponentProps
    >
  : never;

type ExtractOptions<T extends Record<string, any>> = Omit<
  T,
  keyof INiceModalHandlers | 'visible' | 'onUpdate:visible'
>;

export function create<C extends Component>(Comp: C) {
  let instance: ComponentPublicInstance<{}, any> | null = null;
  let remove = noop;
  let hide = noop;

  const show = (options: ExtractOptions<ComponentProps<C>>) => {
    if (!inBrowser) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const handler: INiceModalHandlers = {
        callback: (action: 'confirm' | 'cancel', payload: unknown) => {
          action === 'confirm' ? resolve(payload) : reject(payload);
        },
        remove: () => remove(),
        hide: () => hide(),
      };

      const _options = {
        ...options,
        ...handler,
      };

      if (!instance) {
        const { instance: _instance, unmount } = initInstance(Comp, _options);
        instance = _instance;
        remove = () => {
          instance = null;
          unmount();
        };
        hide = () => {
          if (instance) {
            instance.toggle(false);
          }
        };
        instance.open();
      } else {
        instance.open(extend({}, _options));
      }
    });
  };

  return {
    show,
    hide: () => hide(),
    remove: () => remove(),
  };
}
