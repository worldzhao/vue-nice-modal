import type { ComponentPublicInstance } from 'vue';

import { extend, inBrowser } from './basic';
import { mountComponent } from './mount-component';
import { usePopupState } from './use-popup-state';

function initInstance(Comp: any) {
  const Wrapper = {
    setup() {
      const { state, toggle } = usePopupState();
      return () => <Comp {...state} onUpdate:show={toggle} />;
    },
  };

  return mountComponent(Wrapper);
}

export function create<T extends Record<string, any>>(Comp: any) {
  let instance: ComponentPublicInstance<{}, any>;
  let destroy: () => void = () => {
    //
  };
  return {
    show: (options: T) => {
      if (!inBrowser) return Promise.resolve();
      return new Promise((resolve, reject) => {
        if (!instance) {
          const { instance: _instance, unmount } = initInstance(Comp);
          instance = _instance;
          destroy = unmount;
        }

        instance.open(
          extend({}, options, {
            onConfirm: (val: unknown) => {
              options?.onConfirm(val);
              resolve(val);
            },
            onCancel: () => {
              options?.onCancel();
              reject();
            },
          }),
        );
      });
    },
    hide: () => {
      instance.toggle(false);
    },
    destroy,
  };
}
