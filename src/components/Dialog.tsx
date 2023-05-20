import { Dialog as VantDialog } from 'vant';
import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';

import { HelloWorldTSX } from './HelloWorld';
import { create } from '@/utils/nice-modal-vue';

type IVantDialogProps = InstanceType<typeof VantDialog>['$props'];
const dialogProps = { msg: { type: String } };
type IDialogProps = ExtractPropTypes<typeof dialogProps>;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const Dialog = create<IVantDialogProps & IDialogProps>(
  defineComponent({
    props: { msg: { type: String, required: true } },
    emits: ['confirm', 'update:show'],
    setup(props, { emit }) {
      return () => (
        <VantDialog
          beforeClose={() => {
            return false;
          }}
          onConfirm={async () => {
            await sleep(2000);
            emit('confirm', [1, 2, 3, 4, 5, 6]);
            emit('update:show', false);
          }}
        >
          {{
            default: () => {
              return <HelloWorldTSX msg={props.msg}></HelloWorldTSX>;
            },
          }}
        </VantDialog>
      );
    },
  }),
);
