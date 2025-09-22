// UnoCSS 配置文件 - 原子化 CSS 框架配置
// UnoCSS 是一个即时按需的原子化 CSS 引擎，提供高性能的样式生成

// rem 转 px 预设 - 将 rem 单位自动转换为 px 单位
import presetRemToPx from '@unocss/preset-rem-to-px';
import {
  defineConfig, // UnoCSS 配置定义函数
  presetAttributify, // 属性化模式预设 - 支持将样式写在 HTML 属性中
  presetIcons, // 图标预设 - 支持各种图标库
  presetUno, // 默认预设 - 提供类似 Tailwind CSS 的工具类
  transformerAttributifyJsx, // JSX 属性化转换器
  transformerDirectives, // 指令转换器 - 支持 @apply 等指令
  transformerVariantGroup, // 变体组转换器 - 支持 hover:(bg-red text-white) 语法
} from 'unocss';
// 主题变量导入 - 包含项目的颜色、字体等主题配置
import { themeVars } from './src/utils/theme/vars';

// 自定义图标加载器 - 用于加载本地图标文件
// 如需自定义图标，可取消注释
// import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';

export default defineConfig({
  // === 预设配置 ===
  // 预设是 UnoCSS 的核心功能模块，提供不同的样式生成规则
  presets: [
    // 默认预设 - 提供类似 Tailwind CSS 的原子化工具类
    presetUno(),

    // 属性化预设 - 允许在 HTML 属性中直接写样式
    // 例如: <div bg="red-500" text="white center">内容</div>
    presetAttributify(),

    // 图标预设 - 支持 Iconify 图标库中的所有图标
    presetIcons({
      scale: 1, // 图标缩放比例
      warn: true, // 开启警告提示
      prefix: ['i-'], // 图标类名前缀，使用 i-iconify:name 格式
      extraProperties: {
        display: 'inline-block', // 图标默认显示方式
      },
      // 自定义图标集合配置
      // 可以加载本地图标文件作为图标集
      // collections: {
      //   me: FileSystemIconLoader('./src/assets/icons/isme'),     // 个人图标集
      //   fe: FileSystemIconLoader('./src/assets/icons/feather'),  // Feather 图标集
      // },
    }),

    // rem 转 px 预设 - 自动将 rem 单位转换为 px
    // baseFontSize: 16 表示 1rem = 16px
    presetRemToPx({ baseFontSize: 16 }),
  ],

  // === 转换器配置 ===
  // 转换器用于扩展 UnoCSS 的语法支持和功能
  transformers: [
    // 指令转换器 - 支持 CSS 指令语法
    // 支持 @apply、@screen、@variants 等指令
    // 例如: .btn { @apply px-4 py-2 bg-blue-500 text-white; }
    transformerDirectives(),

    // 变体组转换器 - 支持简化的变体组语法
    // 例如: hover:(bg-red-500 text-white) 等价于 hover:bg-red-500 hover:text-white
    transformerVariantGroup(),

    // JSX 属性化转换器 - 在 JSX 中支持属性化模式
    // 例如: <div bg-red-500 text-white>内容</div>
    transformerAttributifyJsx(),
  ],

  // === 快捷方式配置 ===
  // shortcuts 允许定义自定义的 CSS 类组合，提高开发效率
  // 将常用的样式组合封装成语义化的类名
  shortcuts: {
    // === 布局相关快捷方式 ===
    'wh-full': 'w-full h-full box-border', // 全宽高 + 边框盒模型
    'flex-center': 'flex justify-center items-center', // 水平垂直居中
    'flex-between': 'flex justify-between items-center', // 两端对齐，垂直居中
    'flex-around': 'flex justify-around items-center', // 环绕分布，垂直居中
    'flex-evenly': 'flex justify-evenly items-center', // 均匀分布，垂直居中
    'flex-row': 'flex flex-row', // 水平排列
    'flex-col': 'flex flex-col', // 垂直排列
    'flex-y-center': 'flex justify-center', // 水平居中
    'flex-x-center': 'flex items-center', // 垂直居中
    'flex-x-end': 'flex items-end', // 垂直底部对齐
    'flex-x-start': 'flex items-start', // 垂直顶部对齐
    'flex-y-end': 'flex justify-end', // 水平底部对齐
    'flex-y-start': 'flex justify-start', // 水平顶部对齐
    'absolute-center': 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2', // 绝对定位居中

    // === 边框相关快捷方式 ===
    'card-border': 'border border-solid border-light_border dark:border-dark_border', // 卡片边框（支持暗色模式）
    bordered: 'border border-solid border-light_border dark:border-dark_border', // 通用边框（支持暗色模式）
    'border-dashed-gray': 'border-2 border-dashed border-gray-300', // 灰色虚线边框

    // === 背景相关快捷方式 ===
    'auto-bg': 'bg-white dark:bg-#18181C', // 自适应背景（亮色/暗色模式）

    // === 文字相关快捷方式 ===
    'text-primary': 'text-gray-900 dark:text-gray-100', // 主要文字颜色
    'text-secondary': 'text-gray-600 dark:text-gray-400', // 次要文字颜色
    'text-muted': 'text-gray-500 dark:text-gray-500', // 弱化文字颜色
    'divider-style': 'font-bold text-gray-700 dark:text-gray-300', // 分割线样式文字
    'card-header': 'font-bold text-base text-gray-800 dark:text-gray-200', // 卡片标题样式

    // === 阴影相关快捷方式 ===
    'box-shadow': 'shadow-[0_2px_8px_rgba(0,0,0,0.2)]', // 标准盒子阴影
    'shadow-soft': 'shadow-[0_2px_12px_rgba(0,0,0,0.08)]', // 柔和阴影
    'shadow-medium': 'shadow-[0_4px_16px_rgba(0,0,0,0.12)]', // 中等阴影
    'shadow-strong': 'shadow-[0_8px_24px_rgba(0,0,0,0.16)]', // 强烈阴影

    // === 交互效果快捷方式 ===
    // 主要按钮样式 - 蓝色主题按钮
    'btn-primary':
      'px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 cursor-pointer',
    // 次要按钮样式 - 灰色主题按钮
    'btn-secondary':
      'px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 cursor-pointer',

    // === 卡片悬停效果快捷方式 ===
    // 基础卡片悬停 - 阴影变化效果
    'card-hover': 'hover:shadow-[var(--box-shadow-1)] transition-all duration-500 cursor-pointer',
    // 卡片上浮效果 - 悬停时向上移动并增强阴影
    'card-hover-lift':
      'hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer',
    // 卡片发光效果 - 悬停时产生蓝色光晕
    'card-hover-glow':
      'hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:border-blue-400 transition-all duration-400 cursor-pointer border-2 border-transparent',
    // 卡片缩放效果 - 悬停时轻微放大
    'card-hover-scale': 'hover:scale-105 transition-all duration-300 cursor-pointer',
    // 卡片旋转效果 - 悬停时轻微旋转
    'card-hover-rotate': 'hover:rotate-1  transition-all duration-300 cursor-pointer',
    // 卡片浮动效果 - 悬停时轻微上浮
    'card-hover-float': 'hover:-translate-y-1  transition-all duration-200 cursor-pointer',

    // === 动画效果快捷方式 ===
    'animate-fade-in': 'animate-[fadeIn_0.5s_ease-in-out]', // 淡入动画
    'animate-slide-up': 'animate-[slideUp_0.3s_ease-out]', // 向上滑入动画
    'animate-bounce-in': 'animate-[bounceIn_0.6s_ease-out]', // 弹跳进入动画

    // === 响应式容器快捷方式 ===
    'container-sm': 'max-w-screen-sm mx-auto px-4', // 小屏容器 (640px)
    'container-md': 'max-w-screen-md mx-auto px-4', // 中屏容器 (768px)
    'container-lg': 'max-w-screen-lg mx-auto px-4', // 大屏容器 (1024px)
    'container-xl': 'max-w-screen-xl mx-auto px-4', // 超大屏容器 (1280px)

    // === 表单相关快捷方式 ===
    // 基础输入框样式 - 包含边框、圆角、焦点效果
    'input-base':
      'px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    'input-error': 'border-red-500 focus:ring-red-500', // 错误状态输入框
    'input-success': 'border-green-500 focus:ring-green-500', // 成功状态输入框
  },
  // === 主题配置 ===
  // 主题配置定义了项目的设计系统，包括颜色、字体、间距等
  theme: {
    // 导入项目自定义的主题变量
    ...themeVars,

    // === 字体大小配置 ===
    // 定义项目中使用的字体大小规范
    fontSize: {
      xs: '0.75rem', // 12px - 极小文字
      sm: '0.875rem', // 14px - 小文字
      base: '1rem', // 16px - 基础文字大小
      lg: '1.125rem', // 18px - 大文字
      xl: '1.25rem', // 20px - 超大文字
      '2xl': '1.5rem', // 24px - 标题文字
      '3xl': '1.875rem', // 30px - 大标题
      '4xl': '2.25rem', // 36px - 超大标题
      '5xl': '3rem', // 48px - 巨大标题
      '6xl': '3.75rem', // 60px - 超巨大标题
    },

    // === 字体家族配置 ===
    // 定义项目中使用的字体栈
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'], // 无衬线字体
      serif: ['Georgia', 'serif'], // 衬线字体
      mono: ['Fira Code', 'monospace'], // 等宽字体（代码）
      global: ['Smiley Sans', 'Inter', 'system-ui', 'sans-serif'], // 全局字体
      harmony: ['HarmonySans', 'Inter', 'system-ui', 'sans-serif'], // 和谐字体
    },

    // === 响应式断点配置 ===
    // 定义不同屏幕尺寸的断点，用于响应式设计
    breakpoints: {
      xs: '475px', // 超小屏幕（手机横屏）
      sm: '640px', // 小屏幕（平板竖屏）
      md: '768px', // 中等屏幕（平板横屏）
      lg: '1024px', // 大屏幕（笔记本）
      xl: '1280px', // 超大屏幕（桌面）
      '2xl': '1536px', // 超超大屏幕（大桌面）
    },

    // === 动画配置 ===
    // 定义项目中使用的动画效果
    animation: {
      'fade-in': 'fadeIn 0.5s ease-in-out', // 淡入动画
      'slide-up': 'slideUp 0.3s ease-out', // 向上滑动动画
      'bounce-in': 'bounceIn 0.6s ease-out', // 弹跳进入动画
      'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', // 慢速脉冲动画
    },

    // === 自定义动画关键帧 ===
    // 定义动画的具体执行步骤
    keyframes: {
      // 淡入动画关键帧 - 从透明+向下偏移到完全显示
      fadeIn: {
        '0%': { opacity: '0', transform: 'translateY(10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      // 向上滑动动画关键帧 - 从底部滑入
      slideUp: {
        '0%': { transform: 'translateY(100%)' },
        '100%': { transform: 'translateY(0)' },
      },
      // 弹跳进入动画关键帧 - 缩放+透明度变化的弹跳效果
      bounceIn: {
        '0%': { transform: 'scale(0.3)', opacity: '0' },
        '50%': { transform: 'scale(1.05)' },
        '70%': { transform: 'scale(0.9)' },
        '100%': { transform: 'scale(1)', opacity: '1' },
      },
    },
  },

  // === 自定义规则配置 ===
  // 自定义规则允许创建 UnoCSS 默认不支持的 CSS 样式
  rules: [
    // === 自定义阴影规则 ===
    // 卡片阴影 - 柔和的卡片投影效果
    ['card-shadow', { 'box-shadow': '4px 4px 7px 0px rgba(100, 100, 111, 0.12)' }],
    // 发光阴影 - 蓝色光晕效果
    ['shadow-glow', { 'box-shadow': '0 0 20px rgba(59, 130, 246, 0.3)' }],

    // === 自定义渐变规则 ===
    // 径向渐变背景 - 从中心向外扩散的渐变
    [
      'bg-gradient-radial',
      { 'background-image': 'radial-gradient(circle, var(--tw-gradient-stops))' },
    ],

    // === 自定义滤镜规则 ===
    // 超小模糊效果 - 轻微的背景模糊
    ['backdrop-blur-xs', { 'backdrop-filter': 'blur(2px)' }],

    // === 自定义变换规则 ===
    // GPU 加速变换 - 启用硬件加速以提升动画性能
    ['transform-gpu', { transform: 'translateZ(0)' }],
  ],
});
