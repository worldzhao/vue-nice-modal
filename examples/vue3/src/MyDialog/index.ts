import { create } from 'vue-nice-modal';
import MyDialog from './MyDialog.vue';

export const { show, hide, remove } = create(MyDialog);
