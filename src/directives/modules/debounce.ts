import type { Directive } from 'vue';

interface DebounceBinding {
  value: (() => void) | { handler: () => void; delay?: number };
}

interface CustomElement extends HTMLElement {
  debounceTimer?: ReturnType<typeof setTimeout>;
  debounceHandler?: () => void;
}

/**
 * v-debounce 防抖指令
 * 在指定时间间隔内只执行最后一次点击操作
 *
 * @example
 * // 简单用法（默认300ms）
 * <button v-debounce="handleClick">点击</button>
 *
 * // 自定义延迟时间
 * <button v-debounce="{ handler: handleClick, delay: 500 }">点击</button>
 */
export const debounce: Directive = {
  mounted(el: CustomElement, binding: DebounceBinding): void {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const handler = () => {
      if (typeof binding.value === 'function') {
        binding.value();
      } else {
        binding.value.handler?.();
      }
    };

    const debouncedHandler = () => {
      if (timer) clearTimeout(timer);

      const delay = typeof binding.value === 'object' ? binding.value.delay : 300;
      timer = setTimeout(handler, delay);
    };

    el.addEventListener('click', debouncedHandler);

    el.debounceTimer = timer;
    el.debounceHandler = debouncedHandler;
  },

  unmounted(el: CustomElement): void {
    if (el.debounceTimer) {
      clearTimeout(el.debounceTimer);
    }
    el.debounceTimer = undefined;
    el.debounceHandler = undefined;
  },
};
