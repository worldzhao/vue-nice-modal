# Vue Nice Modal

**[@ebay/nice-modal-react](https://github.com/eBay/nice-modal-react) Vue 版本。**

vue-nice-modal 是一个工具库,可以将 Vue.js 的 modal 组件转换为基于 Promise 的 API。

支持 Vue 2.x,通过 [vue-demi](https://github.com/vueuse/vue-demi)。

[English](https://github.com/worldzhao/vue-nice-modal/blob/main/README.md) | 简体中文

一个优雅的 Vue 模态框状态管理方案，支持 Vue 2 和 Vue 3。

## 特性

- 🎯 简单直观的 API
- 🔄 基于 Promise 的模态框操作
- 🎨 框架无关 - 可配合任何 UI 库使用
- ⚡️ 轻量级，零依赖
- 🔌 支持 Vue 2 和 Vue 3
- 📦 完整的 TypeScript 支持

## 安装

```bash
# npm
npm install vue-nice-modal

# pnpm
pnpm add vue-nice-modal
```

## 使用方式

### 1. Provider 包裹应用

```html
<!-- App.vue -->
<template>
  <NiceModalProvider>
    <router-view />
  </NiceModalProvider>
</template>

<script setup>
  import { Provider as NiceModalProvider } from 'vue-nice-modal';
</script>
```

### 2. 创建模态框组件

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
  import { useModal } from 'vue-nice-modal';

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

> 可与任何 UI 库配合使用，如 element-ui

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
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
```

> 使用 NiceModal.create 创建模态框高阶组件

```js
// my-modal.js
import NiceModal from 'vue-nice-modal';

import _MyModal from './my-modal.vue';

export const MyModal = NiceModal.create(_MyModal);
```

### 3. 使用模态框

#### 3.1 基础用法 - 直接使用组件

```js
const showModal = async () => {
  try {
    const res = await NiceModal.show(MyModal, {
      title: '标题',
      content: '内容',
    });
    console.log('结果:', res);
  } catch (error) {
    console.log('取消:', error);
  }
};
```

#### 3.2 声明式用法 - 通过 ID 引用已声明的模态框

> 可继承声明处上下文

```html
<template>
  <MyModal id="my-modal" />
</template>

<script setup>
  const showModal = async () => {
    try {
      const res = await NiceModal.show('my-modal', {
        title: '标题',
        content: '内容',
      });
      console.log('结果:', res);
    } catch (error) {
      console.log('取消:', error);
    }
  };
</script>
```

#### 3.3 Hook 用法 - 使用 useModal 组合式 API

```js
const modal = NiceModal.useModal(MyModal);

const showModal = async () => {
  try {
    const res = await modal.show({
      title: '标题',
      content: '内容',
    });
    console.log('结果:', res);
  } catch (error) {
    console.log('取消:', error);
  }
};
```

#### 3.4 注册用法 - 通过注册后使用 ID 调用

```js
// 预先注册模态框
NiceModal.register('register-modal', MyModal);

const showModal = async () => {
  try {
    const res = await NiceModal.show('register-modal', {
      title: '标题',
      content: '内容',
    });
    console.log('结果:', res);
  } catch (error) {
    console.log('取消:', error);
  }
};
```

## API 参考

### 组件

#### `NiceModal.Provider`

模态框容器组件，需要包裹在应用最外层。

#### `NiceModal.create(Component)`

高阶组件，用于创建模态框组件。

### 方法

#### `show(modalId, args?)`

显示模态框，支持传入参数。

- `modalId`: 模态框 ID 或组件
- `args`: 传递给模态框的参数
- 返回: Promise

#### `hide(modalId)`

隐藏模态框。

- `modalId`: 模态框 ID 或组件
- 返回: Promise

#### `remove(modalId)`

从 DOM 中移除模态框。

- `modalId`: 模态框 ID 或组件

#### `register(id, component, props?)`

注册模态框组件。

- `id`: 模态框 ID
- `component`: 模态框组件
- `props`: 默认 props

#### `unregister(id)`

注销模态框组件。

- `id`: 模态框 ID

### Hook

#### `useModal(modal?, args?)`

返回值:

- `id`: 模态框 ID
- `args`: 模态框参数
- `visible`: 可见状态
- `show(args?)`: 显示模态框
- `hide()`: 隐藏模态框
- `remove()`: 移除模态框
- `resolve(value)`: 解析模态框 Promise
- `reject(reason)`: 拒绝模态框 Promise
- `resolveHide(value)`: 解析隐藏 Promise

## 类型支持

本包提供完整的 TypeScript 类型声明，支持 props 和参数的类型推导。

## 构建产物

- 支持 Tree Shaking
- 提供 ESM/CJS 两种格式

```bash
dist/
  ├── esm/           # ES Module 格式
  └── lib/           # CommonJS 格式
```

## 浏览器兼容性

- iOS >= 9
- Android >= 4.4
- 现代浏览器的最新两个版本

## License

MIT
