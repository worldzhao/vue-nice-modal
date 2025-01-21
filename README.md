# Vue Nice Modal

Vue version of [@ebay/nice-modal-react](https://github.com/eBay/nice-modal-react).

vue-nice-modal is a utility library that converts Vue.js modal components into Promise-based APIs.

Supports Vue 2.x via [vue-demi](https://github.com/vueuse/vue-demi).

English | [简体中文](https://github.com/worldzhao/vue-nice-modal/blob/main/README.zh-CN.md)

An elegant Vue modal state management solution, supporting both Vue 2 and Vue 3.

## Features

- 🎯 Simple and intuitive API
- 🔄 Promise-based modal operations
- 🎨 Framework agnostic - works with any UI library
- ⚡️ Lightweight, zero dependencies
- 🔌 Supports both Vue 2 and Vue 3
- 📦 Full TypeScript support

## Installation

```bash
# npm
npm install vue-nice-modal

# pnpm
pnpm add vue-nice-modal
```

## Usage

### 1. Wrap application with Provider

```html
<!-- App.vue -->
<template>
  <NiceModalProvider>
    <router-view />
  </NiceModalProvider>
</template>

<script setup>
  import { Provider as NiceModalProvider } from '@gt/nice-modal-vue';
</script>
```

### 2. Create modal component

```html
<!-- my-modal.vue -->
<template>
  <van-dialog
    show-cancel-button
    :value="modal.visible.value"
    :close-on-click-overlay="false"
    :title="title"
    :message="content"
    @closed="modal.remove"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup>
  import { useModal } from '@gt/nice-modal-vue';

  const modal = useModal();
  defineProps(['title', 'content']);

  const handleCancel = () => {
    modal.reject('cancel');
    modal.hide();
  };

  const handleConfirm = () => {
    modal.resolve('confirm');
    modal.hide();
  };
</script>
```

> Can be used with any UI library, such as element-ui

```html
<!-- my-modal.vue -->
<template>
  <el-dialog
    :title="title"
    :visible="modal.visible.value"
    append-to-body
    @closed="modal.remove"
  >
    <span>{{ content }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">Cancel</el-button>
      <el-button type="primary" @click="handleConfirm">Confirm</el-button>
    </span>
  </el-dialog>
</template>
```

> Create modal higher-order component using NiceModal.create

```js
// my-modal.js
import NiceModal from '@gt/nice-modal-vue';

import _MyModal from './my-modal.vue';

export const MyModal = NiceModal.create(_MyModal);
```

### 3. Using modals

#### 3.1 Basic usage - directly using component

```js
const showModal = async () => {
  try {
    const res = await NiceModal.show(MyModal, {
      title: 'Title',
      content: 'Content',
    });
    console.log('Result:', res);
  } catch (error) {
    console.log('Cancelled:', error);
  }
};
```

#### 3.2 Declarative usage - referencing declared modal via ID

> Can inherit context from declaration

```html
<template>
  <MyModal id="my-modal" />
</template>

<script setup>
  const showModal = async () => {
    try {
      const res = await NiceModal.show('my-modal', {
        title: 'Title',
        content: 'Content',
      });
      console.log('Result:', res);
    } catch (error) {
      console.log('Cancelled:', error);
    }
  };
</script>
```

#### 3.3 Hook usage - using useModal composition API

```js
const modal = NiceModal.useModal(MyModal);

const showModal = async () => {
  try {
    const res = await modal.show({
      title: 'Title',
      content: 'Content',
    });
    console.log('Result:', res);
  } catch (error) {
    console.log('Cancelled:', error);
  }
};
```

#### 3.4 Registration usage - using ID after registration

```js
// Pre-register modal
NiceModal.register('register-modal', MyModal);

const showModal = async () => {
  try {
    const res = await NiceModal.show('register-modal', {
      title: 'Title',
      content: 'Content',
    });
    console.log('Result:', res);
  } catch (error) {
    console.log('Cancelled:', error);
  }
};
```

## API Reference

### Components

#### `NiceModal.Provider`

Modal container component, needs to wrap the outermost layer of the application.

#### `NiceModal.create(Component)`

Higher-order component for creating modal components.

### Methods

#### `show(modalId, args?)`

Show modal, supports passing parameters.

- `modalId`: Modal ID or component
- `args`: Parameters passed to modal
- Returns: Promise

#### `hide(modalId)`

Hide modal.

- `modalId`: Modal ID or component
- Returns: Promise

#### `remove(modalId)`

Remove modal from DOM.

- `modalId`: Modal ID or component

#### `register(id, component, props?)`

Register modal component.

- `id`: Modal ID
- `component`: Modal component
- `props`: Default props

#### `unregister(id)`

Unregister modal component.

- `id`: Modal ID

### Hook

#### `useModal(modal?, args?)`

Return values:

- `id`: Modal ID
- `args`: Modal parameters
- `visible`: Visibility state
- `show(args?)`: Show modal
- `hide()`: Hide modal
- `remove()`: Remove modal
- `resolve(value)`: Resolve modal Promise
- `reject(reason)`: Reject modal Promise
- `resolveHide(value)`: Resolve hide Promise

## Type Support

This package provides complete TypeScript type declarations, supporting type inference for props and parameters.

## Build Output

- Supports Tree Shaking
- Provides both ESM/CJS formats

```bash
dist/
  ├── esm/           # ES Module format
  └── lib/           # CommonJS format
```

## Browser Compatibility

- iOS >= 9
- Android >= 4.4
- Latest two versions of modern browsers

## License

MIT
