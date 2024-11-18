import type { ModalProps } from 'naive-ui';

export interface NewModalProps extends ModalProps {
  closeFunc?: () => Promise<any>; // 关闭模态框的函数
}
