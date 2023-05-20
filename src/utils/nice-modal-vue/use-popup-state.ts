import { reactive } from 'vue';

import { extend } from './basic';
import { useExpose } from './use-expose';

export function usePopupState() {
  const state = reactive<{
    show: boolean;
    [key: string]: any;
  }>({
    show: false,
  });

  const toggle = (show: boolean) => {
    state.show = show;
  };

  const open = (props: Record<string, any>) => {
    extend(state, props);
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
