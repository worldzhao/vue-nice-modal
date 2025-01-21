<script setup lang="ts">
import { MyDialog } from './VantDialog';
import { MyModal } from './ArcoModal';
import NiceModal from 'vue-nice-modal';
import { Cell } from 'vant';

// 基础用法
const handleBasicClick = async () => {
  try {
    const res = await NiceModal.show(MyDialog, {
      title: '基础用法',
      content: '直接使用组件方式调用模态框',
    });
    console.log('基础用法结果:', res);
  } catch (error) {
    console.log('基础用法取消:', error);
  }
};

// 声明式用法
const handleDeclarationClick = async () => {
  try {
    const res = await NiceModal.show('declaration-modal', {
      title: '声明式用法',
      content: '通过 ID 引用已在模板中声明的模态框',
    });
    console.log('声明式用法结果:', res);
  } catch (error) {
    console.log('声明式用法取消:', error);
  }
};

// Hook 用法
const hookModal = NiceModal.useModal(MyDialog);

const handleHookClick = async () => {
  try {
    const res = await hookModal.show({
      title: 'Hook 用法',
      content: '使用 useModal 组合式 API 调用模态框',
    });
    console.log('Hook 用法结果:', res);
  } catch (error) {
    console.log('Hook 用法取消:', error);
  }
};

// 注册用法
NiceModal.register('register-modal', MyDialog);
const handleRegisterClick = async () => {
  try {
    const res = await NiceModal.show('register-modal', {
      title: '注册用法',
      content: '通过预先注册后使用 ID 调用模态框',
    });
    console.log('注册用法结果:', res);
  } catch (error) {
    console.log('注册用法取消:', error);
  }
};
</script>

<template>
  <div class="demo">
    <!-- 基础用法 -->
    <Cell
      title="推荐-基础用法（Vant Dialog）"
      label="直接使用组件"
      is-link
      :class="$style.cell"
      @click="handleBasicClick"
    />

    <!-- 声明式用法 -->
    <Cell
      title="声明式用法（Arco Modal）"
      label="通过 ID 引用已声明的模态框"
      is-link
      :class="$style.cell"
      @click="handleDeclarationClick"
    />
    <!-- 声明式用法需要的模态框声明 -->
    <MyModal id="declaration-modal" />

    <!-- Hook 用法 -->
    <Cell
      title="Hook 用法（Vant Dialog）"
      label="使用 useModal 组合式 API"
      is-link
      :class="$style.cell"
      @click="handleHookClick"
    />

    <!-- 注册用法 -->
    <Cell
      title="注册用法（Vant Dialog）"
      label="通过注册后使用 ID 调用"
      is-link
      :class="$style.cell"
      @click="handleRegisterClick"
    />
  </div>
</template>

<style module>
.cell {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.cell :global(.van-cell__title) {
  margin-right: 12px;
}

.cell :global(.van-cell__label) {
  color: #666;
}
</style>
