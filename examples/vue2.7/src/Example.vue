<template>
  <div>
    <el-card header="推荐-基础用法 直接使用组件">
      <el-button @click="handleBasicClick">打开模态框</el-button>
    </el-card>

    <el-button @click="handleDeclarationClick">打开模态框</el-button>

    <!-- 声明式用法需要的模态框声明 -->
    <MyDialog id="declaration-modal" />

    <el-card header="Hook 用法">
      <el-button @click="handleHookClick">打开模态框</el-button>
    </el-card>

    <el-card header="注册 用法">
      <el-button @click="handleRegisterClick">打开模态框</el-button>
    </el-card>
  </div>
</template>

<script setup>
// 基础用法
import NiceModal from 'vue-nice-modal';
import { MyDialog } from './components/MyDialog';
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
