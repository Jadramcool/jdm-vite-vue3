import type { ButtonProps, DrawerContentProps, DrawerProps } from 'naive-ui';

export interface NewDrawerProps extends DrawerProps, DrawerContentProps, DrawerFooterProps {
  closeFunc?: () => Promise<any>; // 关闭抽屉的函数
}

export interface DrawerFooterProps {
  showOkBtn?: boolean;
  showCancelBtn?: boolean;
  cancelText?: string;
  okText?: string;
  okType?:
    | 'default'
    | 'tertiary'
    | 'primary'
    | 'success'
    | 'info'
    | 'warning'
    | 'error'
    | undefined;
  okButtonProps?: { props: ButtonProps; on: object };
  cancelButtonProps?: { props: ButtonProps; on: object };
  confirmLoading?: boolean;
  showFooter?: boolean;
  footerHeight?: string | number;
}
