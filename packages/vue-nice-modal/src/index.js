/* eslint-disable vue/one-component-per-file */
import {
  computed,
  defineComponent,
  h,
  inject,
  isVue2,
  onMounted,
  onUnmounted,
  provide,
  ref,
} from 'vue-demi';

// Modal state store
const initialState = {};
const MODAL_REGISTRY = {};
const ALREADY_MOUNTED = {};

let uidSeed = 0;

// Symbol for modal ID
const symModalId = Symbol('NiceModalId');

// Context keys
const NICE_MODAL_KEY = Symbol('NiceModal');
const NICE_MODAL_ID_KEY = Symbol('NiceModalId');

// Generate unique modal ID
const getUid = () => `_nice_modal_${uidSeed++}`;

// Get modal ID helper
const getModalId = (modal) => {
  if (typeof modal === 'string') return modal;
  if (!modal[symModalId]) {
    modal[symModalId] = getUid();
  }
  return modal[symModalId];
};

// Modal callbacks store
const modalCallbacks = {};
const hideModalCallbacks = {};

let globalStore = null;

const createStore = () => {
  const state = ref(initialState);

  const dispatch = (action) => {
    const { type, payload } = action;

    switch (type) {
      case 'nice-modal/show': {
        const { modalId, args } = payload;
        state.value = {
          ...state.value,
          [modalId]: {
            ...state.value[modalId],
            id: modalId,
            args,
            // If modal is not mounted, mount it first then make it visible.
            // There is logic inside HOC wrapper to make it visible after its first mount.
            // This mechanism ensures the entering transition.
            visible: !!ALREADY_MOUNTED[modalId],
            delayVisible: !ALREADY_MOUNTED[modalId],
          },
        };
        break;
      }
      case 'nice-modal/hide': {
        const { modalId } = payload;
        if (!state.value[modalId]) return;
        state.value = {
          ...state.value,
          [modalId]: {
            ...state.value[modalId],
            visible: false,
          },
        };
        break;
      }
      case 'nice-modal/remove': {
        const { modalId } = payload;
        const newState = { ...state.value };
        delete newState[modalId];
        state.value = newState;
        break;
      }
      case 'nice-modal/set-flags': {
        const { modalId, flags } = payload;
        state.value = {
          ...state.value,
          [modalId]: {
            ...state.value[modalId],
            ...flags,
          },
        };
        break;
      }
      default:
        return state;
    }
  };

  return { state, dispatch };
};

// 添加一个检查 provider 是否可用的工具函数
const useModalContext = (error = true) => {
  const store = inject(NICE_MODAL_KEY, null);

  if (!store && error) {
    throw new Error(
      '[nice-modal-vue] No provider found. ' +
        'Make sure to wrap your app with NiceModalProvider.'
    );
  }

  return store || initialState;
};

export const Provider = defineComponent({
  name: 'NiceModalProvider',
  setup(_, { slots }) {
    const store = createStore();
    // 保存全局 store 实例
    globalStore = store;
    provide(NICE_MODAL_KEY, store);

    return () => {
      const props = {
        class: {},
        style: {},
      };

      return h('div', props, [slots.default?.(), h(NiceModalPlaceholder)]);
    };
  },
});

export const show = (modal, args) => {
  const modalId = getModalId(modal);
  if (typeof modal !== 'string' && !MODAL_REGISTRY[modalId]) {
    register(modalId, modal);
  }

  if (!globalStore) {
    throw new Error(
      'No store found. Did you forget to wrap your app with NiceModal.Provider?'
    );
  }

  globalStore.dispatch({ type: 'nice-modal/show', payload: { modalId, args } });

  if (!modalCallbacks[modalId]) {
    let theResolve;
    let theReject;
    const promise = new Promise((resolve, reject) => {
      theResolve = resolve;
      theReject = reject;
    });
    modalCallbacks[modalId] = {
      resolve: theResolve,
      reject: theReject,
      promise,
    };
  }

  return modalCallbacks[modalId].promise;
};

export const hide = (modal) => {
  const modalId = getModalId(modal);

  if (!globalStore) {
    throw new Error(
      'No store found. Did you forget to wrap your app with NiceModal.Provider?'
    );
  }

  globalStore.dispatch({ type: 'nice-modal/hide', payload: { modalId } });
  delete modalCallbacks[modalId];

  if (!hideModalCallbacks[modalId]) {
    let theResolve;
    let theReject;
    const promise = new Promise((resolve, reject) => {
      theResolve = resolve;
      theReject = reject;
    });
    hideModalCallbacks[modalId] = {
      resolve: theResolve,
      reject: theReject,
      promise,
    };
  }
  return hideModalCallbacks[modalId].promise;
};

export const remove = (modal) => {
  const modalId = getModalId(modal);

  if (!globalStore) {
    throw new Error(
      'No store found. Did you forget to wrap your app with NiceModal.Provider?'
    );
  }

  globalStore.dispatch({ type: 'nice-modal/remove', payload: { modalId } });
  delete modalCallbacks[modalId];
  delete hideModalCallbacks[modalId];
};

// Register modal component
export const register = (id, comp, props = {}) => {
  if (!MODAL_REGISTRY[id]) {
    MODAL_REGISTRY[id] = { comp, props };
  } else {
    MODAL_REGISTRY[id].props = props;
  }
};

// Unregister modal component
export const unregister = (id) => {
  delete MODAL_REGISTRY[id];
};

// Create modal component with HOC
export const create = (Comp) => {
  return defineComponent({
    name: 'NiceModalWrapper',
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props, { attrs }) {
      const store = useModalContext();
      const { state } = store;
      const modalInfo = computed(() => state.value[props.id]);

      provide(NICE_MODAL_ID_KEY, props.id);
      const { show, args } = useModal(props.id);
      onMounted(() => {
        ALREADY_MOUNTED[props.id] = true;
        if (modalInfo.value?.delayVisible) {
          show(args.value);
        }
      });

      onUnmounted(() => {
        delete ALREADY_MOUNTED[props.id];
      });

      return () => {
        if (!modalInfo.value) return null;

        const componentProps = {
          ...modalInfo.value?.args,
        };

        if (isVue2) {
          return h(Comp, {
            props: { ...attrs, ...componentProps },
          });
        }

        return h(Comp, {
          ...attrs,
          ...componentProps,
        });
      };
    },
  });
};

// Modal placeholder component for auto rendering modals
const NiceModalPlaceholder = defineComponent({
  name: 'NiceModalPlaceholder',
  setup() {
    const store = useModalContext();
    const { state } = store;

    // 获取所有需要渲染的模态框ID
    const visibleModalIds = computed(() => {
      return Object.keys(state.value).filter((id) => !!state.value[id]);
    });

    visibleModalIds.value.forEach((id) => {
      if (!MODAL_REGISTRY[id] && !ALREADY_MOUNTED[id]) {
        console.warn(
          `No modal found for id: ${id}. Please check the id or if it is registered or declared via JSX.`
        );
        return;
      }
    });

    return () => {
      const toRender = visibleModalIds.value
        .filter((id) => MODAL_REGISTRY[id])
        .map((id) => {
          const registry = MODAL_REGISTRY[id];
          return {
            id,
            comp: registry.comp,
            props: registry.props || {},
          };
        });

      return h(
        'div',
        {},
        toRender.map((t) => {
          const componentProps = {
            id: t.id,
            ...(t.props || {}),
          };

          if (isVue2) {
            return h(t.comp, {
              key: t.id,
              props: componentProps,
            });
          }

          return h(t.comp, { key: t.id, ...componentProps });
        })
      );
    };
  },
});

export const useModal = (modal, args) => {
  const store = useModalContext(false);
  const { state } = store;

  const isUseComponent = modal && typeof modal !== 'string';
  const modalId = modal ? getModalId(modal) : inject(NICE_MODAL_ID_KEY);

  if (!modalId) {
    throw new Error('[nice-modal-vue] No modal id found in useModal');
  }

  if (isUseComponent && !MODAL_REGISTRY[modalId]) {
    register(modalId, modal, args);
  }

  const modalInfo = computed(() => state.value[modalId]);

  const api = {
    id: modalId,
    args: computed(() => modalInfo.value?.args),
    visible: computed(() => !!modalInfo.value?.visible),
    show: (args) => show(modalId, args),
    hide: () => hide(modalId),
    remove: () => remove(modalId),
    resolve: (args) => {
      modalCallbacks[modalId]?.resolve(args);
      delete modalCallbacks[modalId];
    },
    reject: (args) => {
      modalCallbacks[modalId]?.reject(args);
      delete modalCallbacks[modalId];
    },
    resolveHide: (args) => {
      hideModalCallbacks[modalId]?.resolve(args);
      delete hideModalCallbacks[modalId];
    },
  };

  return api;
};

export default {
  Provider,
  create,
  register,
  unregister,
  show,
  hide,
  remove,
  useModal,
};
