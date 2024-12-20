import { NDescriptions } from 'naive-ui';

export const basicProps = {
  ...NDescriptions.props, // 这里继承原 UI 组件的 props
  bordered: {
    type: Boolean,
    default: true,
  },
  column: {
    type: Number,
    default: 2,
  },
  labelPlacement: {
    type: String,
    default: 'left',
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  schemas: {
    type: [Array],
    default: () => [],
    required: true,
  },
};
