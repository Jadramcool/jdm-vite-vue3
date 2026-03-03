import type { Directive, DirectiveBinding } from 'vue';

interface CopyDirectiveBinding extends DirectiveBinding {
  value: string | { text: string; successMsg?: string };
}

/**
 * v-copy 复制指令
 * 点击元素复制指定内容到剪贴板
 *
 * @example
 * 复制字符串
 * <n-button v-copy="'要复制的内容'">复制</n-button>
 *
 * 复制对象（自定义提示文案）
 * <n-button v-copy="{ text: '内容', successMsg: '复制成功啦' }">复制</n-button>
 *
 *  复制变量
 * <span v-copy="copiedText">{{ copiedText }}</span>
 */
export const copy: Directive = {
  mounted(el: HTMLElement, binding: CopyDirectiveBinding): void {
    el.addEventListener('click', async () => {
      let text = '';
      let successMsg = '复制成功';

      if (typeof binding.value === 'string') {
        text = binding.value;
      } else {
        text = binding.value.text;
        successMsg = binding.value.successMsg || successMsg;
      }

      try {
        await navigator.clipboard.writeText(text);
        window.$message.success(successMsg);
      } catch {
        window.$message.error('复制失败');
      }
    });
  },
};
