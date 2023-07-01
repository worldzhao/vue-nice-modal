import { reactive } from 'vue-demi';

import { extend } from './utils';
import { useExpose } from './use-expose';

export function useModalState(initOptions: Record<string, unknown>) {
  const state = reactive<{
    visible: boolean;
    [key: string]: any;
  }>({
    visible: false,
    ...initOptions,
  });

  const toggle = (visible: boolean) => {
    state.visible = visible;
  };

  const open = (options: Record<string, any>) => {
    extend(state, options);
    toggle(true);
  };

  const close = () => toggle(false);

  useExpose({ open, close, toggle });

  return {
    open,
    close,
    state,
    toggle,
  };
}
