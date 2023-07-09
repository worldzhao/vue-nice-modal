import type {
  ComponentPublicInstance,
  Component,
  VNodeProps,
  AllowedComponentProps,
  App,
  AppContext,
} from 'vue-demi';
import { h, isVue2, createApp, isVue3 } from 'vue-demi';
import { extend, inBrowser, noop } from './utils';
import { useModalState } from './use-modal-state';

let appContextMap: Record<string, AppContext> = {};
const DEFAULT_APP_KEY = 'default';

function mountComponent(RootComponent: Component, appKey: string) {
  const app = createApp(RootComponent);

  if (isVue3) {
    const inheritContext = appContextMap[appKey];
    inheritContext && extend(app._context, inheritContext);
  }

  const root = document.createElement('div');
  const container = document.createElement('div');
  root.className = 'vue-nice-modal-root';
  root.appendChild(container);

  document.body.appendChild(root);

  return {
    instance: app.mount(container),
    unmount() {
      app.unmount();
      document.body.removeChild(root);
    },
  };
}

function initInstance(
  Comp: any,
  options: Record<string, unknown>,
  appKey: string
) {
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

  return mountComponent(Wrapper, appKey);
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

export function create<C extends Component>(Comp: C, appKey = DEFAULT_APP_KEY) {
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
        const { instance: _instance, unmount } = initInstance(
          Comp,
          _options,
          appKey
        );
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

export const VueNiceModalPluginForVue3 = {
  install: (
    app: App,
    options: { appKey: string } = { appKey: DEFAULT_APP_KEY }
  ) => {
    if (
      typeof appContextMap[options.appKey] !== 'undefined' &&
      process.env.NODE_ENV === 'development'
    ) {
      console.warn(
        `[Vue Nice Modal]: The current app <${options.appKey}> has registered the relevant context in Vue Nice Modal. Please confirm if you need to override it. If not, please provide a unique app key for registering the context and inject the key when calling the create method.`
      );
    }
    appContextMap[options.appKey] = app._context;
  },
};
