<template>
  <div class="wave-wrapper">
    <div class="wave-header" :style="backgroundStyle">
      <canvas ref="canvasRef" class="wave-canvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import defaultBgImage from '@/assets/images/blog/home_bg.png';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

defineOptions({ name: 'WaveComponent' });

/**
 * 波浪配置接口
 */
interface WaveConfig {
  /** 波浪颜色数组，支持多层波浪 */
  colors: string[];
  /** 波浪高度（振幅） */
  waveHeight: number;
  /** 波浪基准位置（距离顶部的百分比，0-1） */
  wavePosition: number;
  /** 动画速度 */
  speed: number;
  /** 波浪频率（影响波浪的密度） */
  frequency: number;
  /** 相位差（每层波浪之间的偏移角度） */
  phaseOffset: number;
  /** 波浪类型：'sine' | 'bezier' */
  waveType: 'sine' | 'bezier';
  /** 是否启用动画 */
  animated: boolean;
  /** 波浪方向：'left' | 'right' */
  direction: 'left' | 'right';
}

/**
 * 组件Props
 */
interface Props {
  /** 容器高度 */
  height?: number;
  /** 背景颜色或图片URL */
  backgroundColor?: string;
  /** 背景图片URL（优先级高于backgroundColor） */
  backgroundImage?: string;
  /** 波浪颜色数组 */
  colors?: string[];
  /** 波浪高度倍数（相对于容器高度的比例） */
  amplitudeRatio?: number;
  /** 波浪位置（距离顶部的百分比，0-1） */
  position?: number;
  /** 动画速度 */
  speed?: number;
  /** 波浪频率 */
  frequency?: number;
  /** 波浪类型 */
  waveType?: 'sine' | 'bezier';
  /** 是否启用动画 */
  animated?: boolean;
  /** 波浪方向 */
  direction?: 'left' | 'right';
}

// 定义Props默认值
const props = withDefaults(defineProps<Props>(), {
  height: 400,
  backgroundColor: '#6689e2',
  backgroundImage: defaultBgImage,
  colors: () => [
    'rgba(255, 255, 255, 0.3)',
    'rgba(255, 255, 255, 0.5)',
    'rgba(255, 255, 255, 0.7)',
  ],
  amplitudeRatio: 0.08,
  position: 0.8,
  speed: 1,
  frequency: 0.8,
  waveType: 'bezier',
  animated: true,
  direction: 'right',
});

/**
 * 计算背景样式
 */
const backgroundStyle = computed(() => {
  const style: Record<string, string> = {
    height: `${props.height}px`,
  };

  // 优先使用背景图片
  if (props.backgroundImage) {
    style.backgroundImage = `url('${props.backgroundImage}')`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = 'center';
    style.backgroundRepeat = 'no-repeat';
  } else {
    style.backgroundColor = props.backgroundColor;
  }

  return style;
});

// Canvas引用和状态
const canvasRef = ref<HTMLCanvasElement>();
const animationId = ref<number | null>(null);
const isAnimating = ref(false);
const isResizing = ref(false);

// 缓存变量
let step = 0;
let canvasWidth = 0;
let canvasHeight = 0;
let ctx: CanvasRenderingContext2D | null = null;

/**
 * 计算波浪配置
 */
const waveConfig = computed<WaveConfig>(() => ({
  colors: props.colors,
  waveHeight: props.height * props.amplitudeRatio,
  wavePosition: props.height * props.position,
  speed: props.speed,
  frequency: props.frequency,
  phaseOffset: 120, // 每层波浪相位差120度
  waveType: props.waveType,
  animated: props.animated,
  direction: props.direction,
}));

/**
 * 初始化Canvas
 */
const initCanvas = (): void => {
  const canvas = canvasRef.value;
  if (!canvas || isResizing.value) return;

  // 获取Canvas父容器尺寸
  const container = canvas.parentElement;
  if (!container) return;

  const containerRect = container.getBoundingClientRect();
  if (containerRect.width === 0 || containerRect.height === 0) return;

  // 缓存Canvas上下文
  if (!ctx) {
    ctx = canvas.getContext('2d');
    if (!ctx) return;
  }

  const dpr = window.devicePixelRatio || 1;
  const newWidth = containerRect.width;
  const newHeight = containerRect.height;
  // 只有尺寸变化时才重新设置Canvas
  if (canvasWidth !== newWidth || canvasHeight !== newHeight) {
    canvasWidth = newWidth;
    canvasHeight = newHeight;
    // 设置Canvas实际像素尺寸（支持高DPI屏幕）
    canvas.width = newWidth * dpr;
    canvas.height = newHeight * dpr;

    // 缩放绘图上下文以匹配设备像素比
    ctx.scale(dpr, dpr);

    // 设置Canvas显示尺寸
    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
  }

  // 启动渲染
  if (waveConfig.value.animated && !isAnimating.value) {
    isAnimating.value = true;
    startAnimation();
  } else if (!waveConfig.value.animated) {
    renderStaticWaves();
  }
};

/**
 * 绘制单层波浪
 * @param color - 波浪颜色
 * @param offset - 相位偏移
 * @param layerIndex - 层级索引
 */
const drawWave = (color: string, offset: number, layerIndex: number = 0): void => {
  if (!ctx || !canvasWidth || !canvasHeight) return;

  const config = waveConfig.value;

  // 计算方向系数（左右方向）
  const directionMultiplier = config.direction === 'right' ? 1 : -1;

  // 计算当前步数（考虑方向和速度）
  const currentStep = step * directionMultiplier * config.speed;

  // 计算角度（加入频率和偏移）
  const angle = ((currentStep + offset) * Math.PI * config.frequency) / 180;

  // 计算波浪的垂直偏移
  const deltaHeight = Math.sin(angle) * config.waveHeight;
  const deltaHeightRight = Math.cos(angle + Math.PI / 4) * config.waveHeight;

  // 设置填充颜色
  ctx.fillStyle = color;
  ctx.beginPath();

  if (config.waveType === 'sine') {
    // 正弦波类型 - 更自然的波浪
    drawSineWave(config, angle, layerIndex);
  } else {
    // 贝塞尔曲线类型 - 更平滑的波浪
    drawBezierWave(config, deltaHeight, deltaHeightRight);
  }

  ctx.fill();
  ctx.closePath();
};

/**
 * 绘制正弦波类型的波浪
 */
const drawSineWave = (config: WaveConfig, baseAngle: number, layerIndex: number): void => {
  if (!ctx) return;

  const points = 100; // 波浪精度
  const amplitude = config.waveHeight * (1 + layerIndex * 0.1); // 每层略有不同的振幅

  ctx.moveTo(0, canvasHeight);

  // 绘制波浪曲线
  for (let i = 0; i <= points; i++) {
    const x = (canvasWidth / points) * i;
    const angle = baseAngle + (i / points) * Math.PI * 2 * config.frequency;
    const y = config.wavePosition + Math.sin(angle) * amplitude;

    if (i === 0) {
      ctx.lineTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  // 闭合路径
  ctx.lineTo(canvasWidth, canvasHeight);
  ctx.lineTo(0, canvasHeight);
};

/**
 * 绘制贝塞尔曲线类型的波浪
 */
const drawBezierWave = (
  config: WaveConfig,
  deltaHeight: number,
  deltaHeightRight: number,
): void => {
  if (!ctx) return;

  ctx.moveTo(0, config.wavePosition + deltaHeight);

  // 使用贝塞尔曲线创建平滑的波浪
  ctx.bezierCurveTo(
    canvasWidth * 0.25,
    config.wavePosition + deltaHeight - config.waveHeight * 0.5,
    canvasWidth * 0.75,
    config.wavePosition + deltaHeightRight - config.waveHeight * 0.5,
    canvasWidth,
    config.wavePosition + deltaHeightRight,
  );

  // 闭合路径到底部
  ctx.lineTo(canvasWidth, canvasHeight);
  ctx.lineTo(0, canvasHeight);
  ctx.lineTo(0, config.wavePosition + deltaHeight);
};

/**
 * 开始动画循环
 */
const startAnimation = (): void => {
  if (!ctx || !canvasWidth || !canvasHeight) return;

  const animate = (): void => {
    if (!isAnimating.value || !ctx) return;

    // 清除画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 渲染所有波浪层
    renderWaveLayers();

    // 更新动画步数
    step += waveConfig.value.speed;

    // 请求下一帧动画
    animationId.value = requestAnimationFrame(animate);
  };

  animate();
};

/**
 * 渲染所有波浪层
 */
const renderWaveLayers = (): void => {
  if (!ctx || !canvasWidth || !canvasHeight) return;

  const config = waveConfig.value;

  // 绘制每一层波浪
  config.colors.forEach((color, i) => {
    const phaseOffset = i * config.phaseOffset;
    drawWave(color, phaseOffset, i);
  });
};

/**
 * 渲染静态波浪（不动画）
 */
const renderStaticWaves = (): void => {
  if (!ctx || !canvasWidth || !canvasHeight) return;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  renderWaveLayers();
};

/**
 * 停止动画
 */
const stopAnimation = (): void => {
  isAnimating.value = false;
  if (animationId.value) {
    cancelAnimationFrame(animationId.value);
    animationId.value = null;
  }
};

/**
 * 重新开始动画
 */
const restartAnimation = (): void => {
  stopAnimation();
  nextTick(() => {
    initCanvas();
  });
};

// 防抖定时器
let resizeTimer: number | null = null;

/**
 * 处理窗口大小变化
 */
const handleResize = (): void => {
  // 清除之前的定时器
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }

  // 设置resize状态，防止重复初始化
  isResizing.value = true;

  // 设置防抖延迟
  resizeTimer = window.setTimeout(() => {
    isResizing.value = false;
    // 重置Canvas尺寸缓存，强制重新计算
    canvasWidth = 0;
    canvasHeight = 0;
    ctx = null;

    nextTick(() => {
      initCanvas();
    });
  }, 150); // 150ms防抖延迟
};

// 监听关键配置变化，重新渲染
watch(
  () => [
    props.animated,
    props.speed,
    props.frequency,
    props.waveType,
    props.direction,
    props.colors,
  ],
  () => {
    restartAnimation();
  },
);

// 监听尺寸相关配置变化
watch(
  () => [props.height, props.amplitudeRatio, props.position],
  () => {
    // 重置Canvas尺寸缓存，强制重新计算
    canvasWidth = 0;
    canvasHeight = 0;
    nextTick(() => {
      initCanvas();
    });
  },
);

// 监听背景相关配置变化
watch(
  () => [props.backgroundColor, props.backgroundImage],
  () => {
    // 背景变化不需要重新初始化Canvas，只需要重新渲染
    // 这里可以添加额外的逻辑，比如背景变化时的动画效果
  },
);

// 生命周期钩子
onMounted(() => {
  nextTick(() => {
    initCanvas();
    window.addEventListener('resize', handleResize, { passive: true });
  });
});

onUnmounted(() => {
  stopAnimation();
  window.removeEventListener('resize', handleResize);

  // 清理防抖定时器
  if (resizeTimer) {
    clearTimeout(resizeTimer);
    resizeTimer = null;
  }

  // 清理缓存
  ctx = null;
  canvasWidth = 0;
  canvasHeight = 0;
});
</script>

<style scoped>
.wave-wrapper {
  width: 100%;
}

.wave-header {
  position: relative;
  overflow: hidden;
}

.wave-canvas {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
