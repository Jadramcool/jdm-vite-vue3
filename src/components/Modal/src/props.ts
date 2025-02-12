import { NCard, NModal } from 'naive-ui';

type Type = 'default' | 'tertiary' | 'primary' | 'info' | 'success' | 'warning' | 'error';

export const footerProps = {
  showFooter: {
    type: Boolean,
    default: true,
  },
  footerHeight: {
    type: [String, Number] as PropType<string | number>,
    default: 60,
  },
  // 展示footer确认按钮
  showOkButton: {
    type: Boolean,
    default: true,
  },
  // 确认按钮配置
  okButtonOptions: Object,

  okType: {
    type: String as PropType<Type>,
    default: 'primary',
  },
  // 展示footer取消按钮
  showCancelButton: {
    type: Boolean,
    default: true,
  },
  // 取消按钮配置
  cancelButtonOptions: Object,
  // 确认按钮loading状态
  confirmLoading: {
    type: Boolean,
  },
};

export const basicProps = {
  ...NModal.props,
  ...NCard.props,
  ...footerProps,
  closeFunc: {
    type: [Function, Object] as PropType<any>,
    default: null,
  },
  cardWidth: {
    type: [String, Number] as PropType<string | number>,
    default: '800px',
  },
  cardHeight: {
    type: [String, Number] as PropType<string | number>,
    default: '420px',
  },
  draggable: {
    type: Boolean,
    default: true,
  },
};
