<template>
  <div class="captcha-container flex items-center space-x-10px">
    <n-input
      v-model:value="inputValue"
      :placeholder="placeholder"
      class="flex-1"
      @input="handleInput"
      @keyup.enter="handleEnter"
    >
      <template #prefix>
        <JayIcon :icon="'solar:shield-check-line-duotone'" />
      </template>
    </n-input>
    <div
      class="captcha-image cursor-pointer select-none"
      @click="refreshCaptcha"
      :title="'点击刷新验证码'"
    >
      <canvas
        ref="canvasRef"
        :width="canvasWidth"
        :height="canvasHeight"
        class="border border-gray-300 rounded"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  placeholder?: string;
  canvasWidth?: number;
  canvasHeight?: number;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string, isValid: boolean): void;
  (e: 'enter', value: string, isValid: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入验证码',
  canvasWidth: 120,
  canvasHeight: 40,
});

const emit = defineEmits<Emits>();

const canvasRef = ref<HTMLCanvasElement>();
const inputValue = ref('');
const captchaCode = ref('');

/**
 * 生成随机字符串作为验证码
 * @param length 验证码长度
 * @returns 验证码字符串
 */
const generateCaptchaCode = (length: number = 4): string => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * 生成随机颜色
 * @returns RGB颜色字符串
 */
const getRandomColor = (): string => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
};

/**
 * 绘制验证码到画布
 */
const drawCaptcha = (): void => {
  if (!canvasRef.value) return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 清空画布
  ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight);

  // 设置背景
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, props.canvasWidth, props.canvasHeight);

  // 生成新的验证码
  captchaCode.value = generateCaptchaCode();

  // 绘制验证码文字
  const fontSize = 20;
  ctx.font = `${fontSize}px Arial`;
  ctx.textBaseline = 'middle';

  const charWidth = props.canvasWidth / captchaCode.value.length;

  for (let i = 0; i < captchaCode.value.length; i++) {
    const char = captchaCode.value[i];
    const x = charWidth * i + charWidth / 2;
    const y = props.canvasHeight / 2;

    // 随机颜色
    ctx.fillStyle = getRandomColor();

    // 轻微随机旋转角度
    const angle = (Math.random() - 0.5) * 0.2;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }

  // 添加少量干扰线
  for (let i = 0; i < 2; i++) {
    ctx.strokeStyle = getRandomColor();
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.random() * props.canvasWidth, Math.random() * props.canvasHeight);
    ctx.lineTo(Math.random() * props.canvasWidth, Math.random() * props.canvasHeight);
    ctx.stroke();
  }

  // 添加少量干扰点
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = getRandomColor();
    ctx.beginPath();
    ctx.arc(
      Math.random() * props.canvasWidth,
      Math.random() * props.canvasHeight,
      1,
      0,
      2 * Math.PI,
    );
    ctx.fill();
  }
};

/**
 * 刷新验证码
 */
const refreshCaptcha = (): void => {
  drawCaptcha();
  inputValue.value = '';
  emit('update:modelValue', '');
};

/**
 * 验证输入的验证码是否正确
 * @param input 用户输入的验证码
 * @returns 是否验证通过
 */
const validateCaptcha = (input: string): boolean => {
  return input.toLowerCase() === captchaCode.value.toLowerCase();
};

/**
 * 处理输入变化
 * @param value 输入值
 */
const handleInput = (value: string): void => {
  inputValue.value = value;
  emit('update:modelValue', value);
  const isValid = validateCaptcha(value);
  emit('change', value, isValid);
};

/**
 * 处理回车键
 */
const handleEnter = (): void => {
  const isValid = validateCaptcha(inputValue.value);
  emit('enter', inputValue.value, isValid);
};

/**
 * 获取验证结果
 * @returns 验证是否通过
 */
const getValidationResult = (): boolean => {
  return validateCaptcha(inputValue.value);
};

/**
 * 重置验证码组件
 */
const reset = (): void => {
  refreshCaptcha();
};

// 组件挂载时初始化验证码
onMounted(() => {
  nextTick(() => {
    drawCaptcha();
  });
});

// 暴露方法给父组件
defineExpose({
  refreshCaptcha,
  validateCaptcha,
  getValidationResult,
  reset,
});
</script>

<style lang="scss" scoped>
.captcha-container {
  display: flex;
  align-items: center;
  gap: 12px;

  .captcha-image {
    width: 100px;
    height: 40px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    background: var(--card-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--text-color-3);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px var(--primary-color-hover);
      transform: translateY(-1px);
    }

    canvas {
      border-radius: 6px;
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}

/* 暗色主题适配 */
.dark .captcha-image {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.dark .captcha-image:hover {
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 0.08);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .captcha-container {
    gap: 8px;

    .captcha-image {
      width: 100px;
      height: 36px;
    }
  }
}
</style>
