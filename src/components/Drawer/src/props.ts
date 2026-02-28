import { NDrawer, NDrawerContent } from 'naive-ui';

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
  ...NDrawer.props,
  ...NDrawerContent.props,
  ...footerProps,
  width: {
    type: [String, Number] as PropType<string | number>,
    default: 500,
  },
  closeFunc: {
    type: [Function, Object] as PropType<any>,
    default: null,
  },
  headTitle: {
    type: String,
    default: '',
  },
};
