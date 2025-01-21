import {
  Component,
  ComputedRef,
  VNodeProps,
  AllowedComponentProps,
} from 'vue-demi';

export interface NiceModalState {
  id: string;
  args?: Record<string, unknown>;
  visible?: boolean;
  delayVisible?: boolean;
}

export interface NiceModalStore {
  [key: string]: NiceModalState;
}

export interface NiceModalAction {
  type: string;
  payload: {
    modalId: string;
    args?: Record<string, unknown>;
    flags?: Record<string, unknown>;
  };
}

/**
 * The handler to manage a modal returned by useModal hook.
 */
export interface NiceModalHandler<Props = Record<string, unknown>> {
  /**
   * Modal ID
   */
  id: string;

  /**
   * Modal arguments passed when showing
   */
  args: ComputedRef<Record<string, unknown> | undefined>;

  /**
   * Whether a modal is visible
   */
  visible: ComputedRef<boolean>;

  /**
   * Show the modal
   * @param args - an object passed to modal component as props
   */
  show: (args?: Props) => Promise<unknown>;

  /**
   * Hide the modal
   */
  hide: () => Promise<unknown>;

  /**
   * Remove the modal component from component tree
   */
  remove: () => void;

  /**
   * Resolve the promise returned by show method
   */
  resolve: (args?: unknown) => void;

  /**
   * Reject the promise returned by show method
   */
  reject: (args?: unknown) => void;

  /**
   * Resolve the promise returned by hide method
   */
  resolveHide: (args?: unknown) => void;
}

export interface NiceModalHocProps {
  id: string;
}

/**
 * Create a modal component with HOC
 */
export function create<T extends Component>(
  Comp: T
): Component<NiceModalHocProps>;

/**
 * Register a modal component
 */
export function register<T extends Component>(
  id: string,
  comp: T,
  props?: Partial<NiceModalHocProps>
): void;

/**
 * Unregister a modal component
 */
export function unregister(id: string): void;

type ComponentProps<C extends Component> = C extends new (...args: any) => any
  ? Omit<
      InstanceType<C>['$props'],
      keyof VNodeProps | keyof AllowedComponentProps
    >
  : never;

type Simplify<T> = T extends any ? { [P in keyof T]: T[P] } : never;

type RemoveReadonly<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Show a modal
 * @param modal - Modal component or modal ID
 * @param args - Props to pass to the modal component
 */
export function show<T = unknown>(
  modal: string,
  args?: Record<string, unknown>
): Promise<T>;
export function show<T = unknown, C extends Component = Component>(
  modal: C,
  args?: Simplify<RemoveReadonly<ComponentProps<C>>>
): Promise<T>;

/**
 * Hide a modal
 */
export function hide<T = unknown>(modal: Component | string): Promise<T>;

/**
 * Remove a modal
 */
export function remove(modal: Component | string): void;

/**
 * Modal Provider component
 */
export const Provider: Component;

/**
 * Hook for using modal
 */
export function useModal(): NiceModalHandler;
export function useModal<T extends Component, P = Record<string, unknown>>(
  modal: string,
  args?: P
): NiceModalHandler<P>;
export function useModal<T extends Component, P = Record<string, unknown>>(
  modal: T,
  args?: P
): NiceModalHandler<P>;

declare const _default: {
  Provider: Component;
  create: typeof create;
  register: typeof register;
  unregister: typeof unregister;
  show: typeof show;
  hide: typeof hide;
  remove: typeof remove;
  useModal: typeof useModal;
};

export default _default;
