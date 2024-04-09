import { NIcon } from 'naive-ui';
import { Icon } from '@iconify/vue';

export function renderIcon(icon: string, props: any = { size: 20 }) {
  return () => h(NIcon, props, { default: () => h(Icon, { icon }) });
}
