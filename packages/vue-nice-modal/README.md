# Vue Nice Modal

vue-nice-modal is a utility library that converts Vue.js modal components into a Promise-based API.

Inspired By [@ebay/nice-modal-react](https://github.com/eBay/nice-modal-react) and [vant](https://github.com/youzan/vant).

Support for Vue 2.x via [vue-demi](https://github.com/vueuse/vue-demi)

English | [简体中文](https://github.com/worldzhao/vue-nice-modal/blob/main/README.zh-CN.md)

## Examples

You can see a list of examples at: `examples/*` folder.

## Install

```bash
npm install vue-nice-modal
# or
yarn add vue-nice-modal
# or
pnpm add vue-nice-modal
```

## Usage

```javascript
import { create } from 'vue-nice-modal';
import MyModal from './MyModal.vue';

const myModal = create(MyModal);

myModal
  .show({
    title: 'Hello, world!',
    content: 'This is a nice modal.',
  })
  .then((result) => {
    console.log('Confirmed! Result:', result);
  })
  .catch((error) => {
    console.error('Rejected! Error:', error);
  });
```

## Create Your Modal Component

```vue
<script setup lang="ts">
import { Dialog } from 'vant';
import { INiceModalHandlers } from 'vue-nice-modal';
// inject hide/remove/callback methods by vue-nice-modal
interface IProps extends INiceModalHandlers<number> {
  visible: boolean;
  // props you need
  title: string;
  content: string;
}

interface IEmits {
  (e: 'update:visible', visible: boolean): void;
}

const props = defineProps<IProps>();

// @ts-ignore
const emit = defineEmits<IEmits>();

const handleCancel = () => {
  props.hide(); // or emit('update:visible', false)
  props.callback('cancel'); // reject the promise
};

const handleConfirm = async () => {
  // mock async function call
  const sleep = (ms: number): Promise<number> =>
    new Promise((res) =>
      setTimeout(() => {
        res(ms);
      }, ms)
    );

  const payload = await sleep(1000);

  // resolve the promise with payload
  props.callback('confirm', payload);
};
</script>

<template>
  <Dialog
    :show="visible"
    @update:show="$emit('update:visible', false)"
    @cancel="handleCancel"
    @confirm="handleConfirm"
    @closed="remove"
    :title="title"
    :content="content"
    show-cancel-button
    class="demo-dialog"
  >
    <div>Hello,Vue Nice Modal</div>
  </Dialog>
</template>
```

<details>
<summary>Click to expand for detailed explanation</summary>

This section provides an example of how to create a custom modal component using the vue-nice-modal library. The example uses the Dialog component from the vant UI library as an example, but you can use any custom modal component that you prefer.

To create your own modal component, you need to define an interface that extends the INiceModalHandlers interface. This interface should include any props that are relevant for your modal component, such as a title prop and a content prop. You can also include any additional props or methods that you need for your component.

In the example, the visible prop and the update:visible event are injected into the custom modal component by vue-nice-modal. These are used to control the visibility of the modal component. The visible prop should be a Boolean that determines whether the modal is visible or not, and the update:visible event should be emitted when the visibility of the modal changes.

The hide(), remove(), and callback() methods are also injected into the custom modal component by vue-nice-modal. These methods are used to hide or remove the modal component, and to handle the user's confirmation or cancellation of the modal.

Once you have defined your custom modal component, you can use the create() function provided by vue-nice-modal to create a Modal object that exposes the show(), hide(), and remove() methods. You can then use the show() method to display your custom modal component and handle the user's confirmation or cancellation of the modal using the Promise-based API provided by vue-nice-modal.

</details>

### Plugin for sharing context(Vue@^3 only)

```javascript
import { createApp } from 'vue';
import { VueNiceModalPluginForVue3 } from 'vue-nice-modal';
import App from './App.vue';

const app = createApp(App);

app.use(VueNiceModalPluginForVue3);

app.mount('#app');
```

Vue Nice Modal creates a new Vue application instance internally and mounts the user-created component to that instance. This allows it to run properly inside a modal without conflicting with the state and logic of the main application.

However, if you need to access data or methods from the main application inside the modal, you can use the plugin to achieve shared context.

> you can differentiate between multiple applications by passing a appKey as an option in the plugin options and passing it when creating the modal instance.

```javascript
app.use(VueNiceModalPluginForVue3, { appKey: 'another app key' });

create(MyModal, 'another app key');
```

## API

### create(Comp: Component): Modal

The create function takes a Vue.js component and returns a Modal object with the following methods:

### show(options: ExtractOptions<ComponentProps<C>>): Promise<any>

Shows the modal component and returns a Promise that resolves if the user confirms the modal, or rejects if the user cancels it.

The options parameter is an object that should contain the props that are relevant to the modal component(Excluding the common properties and methods injected by vue-nice-modal, only include custom properties required by the component itself). The ComponentProps and INiceModalHandlers types are used to ensure that the options object is properly typed and that any errors related to prop usage are caught at compile-time.

Here's how the show method's type hinting is implemented:

```typescript
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
  // ...

  const show = (options: ExtractOptions<ComponentProps<C>>) => {
    // ...
  };

  return {
    show,
    // ...
  };
}
```

### hide(): void

Hides the modal component.

### remove(): void

Removes the modal component from the DOM.

## Types

vue-nice-modal provides some TypeScript type definitions:

### Modal

The Modal interface defines the methods of the object returned by create.

```typescript
interface Modal {
  show: (options: ExtractOptions<ComponentProps<C>>) => Promise<any>;
  hide: () => void;
  remove: () => void;
}
```

### ComponentProps<C extends Component>

The ComponentProps type defines the props of a Vue.js component.

```typescript
type ComponentProps<C extends Component> = C extends new (...args: any) => any
  ? Omit<
      InstanceType<C>['$props'],
      keyof VNodeData | keyof AllowedComponentProps
    >
  : never;
```

### INiceModalHandlers

The INiceModalHandlers interface defines the methods that are used to handle the user's confirmation or cancellation of the modal.

```typescript
export interface INiceModalHandlers<T = any> {
  callback: (action: 'confirm' | 'cancel', payload?: T) => void;
  remove: () => void;
  hide: () => void;
}
```

> These methods, as well as visible and update:visible event, will be injected into the user's custom modal component, and even if not using Promise-based function calls, related props can be passed in based on v-model(visible and update:visible) to control the visibility of the component. This allows users to control the display and hiding of the modal component in their own preferred way, while also ensuring the flexibility of the vue-nice-modal library

### ExtractOptions<T extends Record<string, any>>

The ExtractOptions type is used to extract the options that are relevant to the modal component(Excluding the common properties and methods injected by vue-nice-modal, only include custom properties required by the component itself).

```typescript
type ExtractOptions<T extends Record<string, any>> = Omit<
  T,
  keyof INiceModalHandlers | 'visible' | 'onUpdate:visible'
>;
```

## Notes

- The modal component must have a visible prop and an update:visible event to control its visibility. Check MyModal.vue for an example.
- vue-nice-modal adds a root element div.vue-nice-modal-root to the DOM. Make sure the styles are compatible.
