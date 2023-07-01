import { create } from 'vue-nice-modal';
import MyModal from './MyModal.vue';

export const { show, hide, remove } = create(MyModal);
