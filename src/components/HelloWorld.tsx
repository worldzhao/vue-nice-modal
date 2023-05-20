import { defineComponent } from 'vue';

import { Dialog } from './Dialog';

export const HelloWorldTSX = defineComponent({
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    return () => (
      <div
        onClick={async () => {
          const data = await Dialog.show({
            msg: 'custom prop - msg',
            title: 'dialog prop - title',
            onConfirm: () => {
              console.log('hello world');
            },
          });
          console.log('async dialog data', data);
          emit('click', 'emit message');
        }}
      >
        hello {props.msg}
      </div>
    );
  },
});
