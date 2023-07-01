# Vue Nice Modal

vue-nice-modal 是一个工具库,可以将 Vue.js 的 modal 组件转换为基于 Promise 的 API。

灵感来源于 [@ebay/nice-modal-react](https://github.com/eBay/nice-modal-react) 和 [vant](https://github.com/youzan/vant)。

支持 Vue 2.x,通过 [vue-demi](https://github.com/vueuse/vue-demi)。

[English](https://github.com/worldzhao/vue-nice-modal/blob/main/README.md) | 简体中文

## Examples

你可以在 examples/\* 文件夹中查看示例。

## 安装

```bash
npm install vue-nice-modal
# or
yarn add vue-nice-modal
# or
pnpm add vue-nice-modal
```

## 使用

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

## 自定义 Modal 组件

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
<summary>点击展开详细说明</summary>

本节提供了一个使用 vue-nice-modal 库创建自定义 modal 组件的示例。该示例使用 vant UI 库的 Dialog 组件作为示例,但您可以使用任何自定义 modal 组件。

要创建自己的 modal 组件,您需要定义一个继承 INiceModalHandlers 接口的接口。该接口应包括与您的 modal 组件相关的任何属性,例如标题属性和内容属性。您还可以包括任何其他需要的属性或方法。

在示例中,visible 属性和 update:visible 事件由 vue-nice-modal 注入到自定义 modal 组件中。这些用于控制 modal 组件的可见性。visible 属性应是一个布尔值,用于确定 modal 是可见的还是不可见,update:visible 事件应在 modal 的可见性改变时触发。

hide()、remove() 和 callback() 方法也由 vue-nice-modal 注入到自定义 modal 组件中。这些方法用于隐藏或删除 modal 组件,以及处理用户确认或取消 modal 操作。

一旦您定义了自己的自定义 modal 组件,您可以使用 vue-nice-modal 提供的 create() 函数来创建一个 Modal 对象,该对象公开 show()、hide() 和 remove() 方法。然后,您可以使用 show() 方法显示自定义 modal 组件,并使用 vue-nice-modal 提供的基于 Promise 的 API 处理用户确认或取消 modal 操作。

</details>

## API

### create(Comp: Component): Modal

create 函数接受 Vue.js 组件并返回一个带有以下方法的 Modal 对象:

### show(options: ExtractOptions<ComponentProps<C>>): Promise<any>

显示 modal 组件并返回一个 Promise,如果用户确认 modal 则 resolve,如果用户取消则 reject。

options 参数是一个对象,包含与 modal 组件相关的属性(除去 vue-nice-modal 注入的通用属性与方法，仅包含用户自定义的所需 props)。ComponentProps 和 INiceModalHandlers 类型用于确保 options 对象的类型正确,并在编译时捕获与属性使用相关的任何错误。

以下是 show 方法的类型提示实现:

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

隐藏 modal 组件。

### remove(): void

从 DOM 中删除 modal 组件。

## 类型定义

vue-nice-modal 提供了一些 TypeScript 类型定义:

### Modal

Modal 接口定义了 create 返回的对象的方法。

```typescript
interface Modal {
  show: (options: ExtractOptions<ComponentProps<C>>) => Promise<any>;
  hide: () => void;
  remove: () => void;
}
```

### ComponentProps<C extends Component>

ComponentProps 工具泛型用于获取 Vue 组件的属性。

```typescript
type ComponentProps<C extends Component> = C extends new (...args: any) => any
  ? Omit<
      InstanceType<C>['$props'],
      keyof VNodeData | keyof AllowedComponentProps
    >
  : never;
```

### INiceModalHandlers

INiceModalHandlers 接口定义了用于处理用户确认或取消 modal 的方法。

```typescript
export interface INiceModalHandlers<T = any> {
  callback: (action: 'confirm' | 'cancel', payload?: T) => void;
  remove: () => void;
  hide: () => void;
}
```

> 这些方法以及 visible 和 update:visible 事件将被注入用户的自定义 modal 组件中,即使不使用基于 Promise 的函数调用,相关属性也可以通过 v-model(visible 和 update:visible)传递从而控制组件的可见性。这允许用户按自己喜欢的方式控制 modal 组件的显示和隐藏,同时也确保了 vue-nice-modal 库的灵活性。

### ExtractOptions<T extends Record<string, any>>

ExtractOptions 类型用于提取与 modal 组件相关的选项（除去 vue-nice-modal 注入的通用属性与方法）。

```typescript
type ExtractOptions<T extends Record<string, any>> = Omit<
  T,
  keyof INiceModalHandlers | 'visible' | 'onUpdate:visible'
>;
```

## 注意

- modal 组件必须具有 visible 属性和 update:visible 事件以控制其可见性。请参阅 MyModal.vue 作为示例。
- vue-nice-modal 会在 DOM 中添加一个根元素 div.vue-nice-modal-root。请确保样式兼容。
