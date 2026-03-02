import { NCard, NModal } from 'naive-ui';
import { PropType } from 'vue';

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
  showOkButton: {
    type: Boolean,
    default: true,
  },
  okButtonOptions: Object,
  okType: {
    type: String as PropType<Type>,
    default: 'primary',
  },
  showCancelButton: {
    type: Boolean,
    default: true,
  },
  cancelButtonOptions: Object,
  confirmLoading: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
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
