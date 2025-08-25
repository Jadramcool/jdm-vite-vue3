<template>
  <div class="post-detail-container">
    <n-back-top :right="0" bottom="100" />

    <!-- 文章头部区域 -->
    <div class="post-header" :style="backgroundStyle">
      <div class="header-overlay"></div>
      <div class="header-content">
        <div class="post-meta">
          <div class="breadcrumb">
            <span class="breadcrumb-item">博客</span>
            <span class="breadcrumb-separator">></span>
            <span class="breadcrumb-item">{{ post?.category?.name || '文章详情' }}</span>
          </div>
        </div>

        <h1 class="post-title">{{ post?.title }}</h1>

        <div class="post-summary" v-if="post?.summary">
          {{ post.summary }}
        </div>

        <div class="post-info">
          <div class="info-item">
            <JayIcon icon="twemoji:person-raising-hand" class="info-icon" />
            <span>{{ post?.author.username }}</span>
          </div>
          <div class="info-item">
            <JayIcon icon="fluent-emoji-flat:spiral-calendar" class="info-icon" />
            <span>{{ dayjs(post?.publishedAt).format('YYYY年MM月DD日') }}</span>
          </div>
          <div class="info-item">
            <JayIcon icon="twemoji:fire" class="info-icon" />
            <span>{{ post?.likeCount || 0 }} 热度</span>
          </div>
          <div class="info-item">
            <JayIcon icon="fxemoji:openbook" class="info-icon" />
            <span>{{ post?.commentCount || 0 }} 评论</span>
          </div>
        </div>

        <!-- 标签 -->
        <div class="post-tags" v-if="post?.tags && post.tags.length > 0">
          <span class="tag" v-for="tag in post.tags" :key="tag.id">
            {{ tag.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- 阅读进度条 -->
    <div class="reading-progress">
      <div class="progress-bar" :style="{ width: readingProgress + '%' }"></div>
    </div>

    <!-- 文章内容区域 -->
    <div class="post-content-wrapper">
      <div class="container">
        <div class="content-layout">
          <!-- 移动端目录切换按钮 -->
          <button class="mobile-toc-toggle" @click="toggleMobileToc" v-if="tocItems.length > 0">
            <JayIcon icon="material-symbols:format-list-bulleted" />
            <span>目录</span>
          </button>

          <!-- 移动端目录遮罩 -->
          <div
            class="mobile-toc-overlay"
            :class="{ active: isMobileTocOpen }"
            @click="closeMobileToc"
          ></div>

          <!-- 左侧目录导航 -->
          <aside
            class="table-of-contents"
            :class="{ 'mobile-open': isMobileTocOpen }"
            v-if="tocItems.length > 0"
          >
            <div class="toc-header">
              <JayIcon icon="material-symbols:format-list-bulleted" />
              <span>目录</span>
              <button class="toc-close" @click="closeMobileToc">
                <JayIcon icon="material-symbols:close" />
              </button>
            </div>
            <nav class="toc-nav">
              <ul class="toc-list">
                <li
                  v-for="item in tocItems"
                  :key="item.id"
                  class="toc-item"
                  :class="{ active: activeHeading === item.id, [`level-${item.level}`]: true }"
                  @click="scrollToHeading(item.id)"
                >
                  <a :href="`#${item.id}`" class="toc-link">{{ item.text }}</a>
                </li>
              </ul>
            </nav>
          </aside>

          <!-- 主要内容区域 -->
          <main class="main-content">
            <!-- 文章元信息卡片 -->
            <div class="article-meta-card">
              <div class="meta-row">
                <div class="meta-item">
                  <JayIcon icon="material-symbols:schedule" class="meta-icon" />
                  <div class="meta-text">
                    <div>预计阅读时间</div>
                    <div>{{ estimatedReadTime }} 分钟</div>
                  </div>
                </div>
                <div class="meta-item">
                  <JayIcon icon="material-symbols:visibility" class="meta-icon" />
                  <div class="meta-text">
                    <div>字数统计</div>
                    <div>{{ wordCount }} 字</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 文章正文 -->
            <article class="post-content">
              <div ref="markdownRef" class="markdown-content" />
            </article>

            <!-- 文章标签云 -->
            <div class="article-tags-section" v-if="post?.tags && post.tags.length > 0">
              <h3 class="tags-title">
                <JayIcon icon="material-symbols:tag" />
                相关标签
              </h3>
              <div class="tags-cloud">
                <span class="tag-item" v-for="tag in post.tags" :key="tag.id">
                  {{ tag.name }}
                </span>
              </div>
            </div>

            <!-- 文章底部信息 -->
            <div class="post-footer">
              <div class="post-actions">
                <button class="action-btn like-btn" @click="handleLike">
                  <JayIcon icon="twemoji:red-heart" class="action-icon" />
                  <div class="action-text">
                    <span class="action-label">点赞</span>
                    <span class="action-count">{{ post?.likeCount || 0 }}</span>
                  </div>
                </button>
                <button class="action-btn share-btn">
                  <JayIcon icon="material-symbols:share" class="action-icon" />
                  <div class="action-text">
                    <span class="action-label">分享</span>
                    <span class="action-count">分享文章</span>
                  </div>
                </button>
                <button class="action-btn bookmark-btn" @click="handleBookmark">
                  <JayIcon icon="material-symbols:bookmark" class="action-icon" />
                  <div class="action-text">
                    <span class="action-label">收藏</span>
                    <span class="action-count">收藏文章</span>
                  </div>
                </button>
              </div>

              <!-- 版权声明 -->
              <div class="copyright-notice">
                <div class="copyright-content">
                  <JayIcon icon="material-symbols:copyright" class="copyright-icon" />
                  <div class="copyright-text">
                    <p>
                      本文由 <strong>{{ post?.author.username }}</strong> 创作
                    </p>
                    <p>如需转载，请注明出处并保留原文链接</p>
                  </div>
                </div>
              </div>

              <div class="post-navigation" v-if="false">
                <!-- 上一篇/下一篇导航 -->
                <div class="nav-item prev">
                  <span class="nav-label">上一篇</span>
                  <span class="nav-title">文章标题</span>
                </div>
                <div class="nav-item next">
                  <span class="nav-label">下一篇</span>
                  <span class="nav-title">文章标题</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BlogApi } from '@/api';
import homeBgUrl from '@/assets/images/blog/home_bg.png';

import dayjs from 'dayjs';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

defineOptions({ name: 'PostDetail' });

const backgroundStyle = computed(() => {
  const style: Record<string, string> = {
    height: `400px`,
  };
  style.backgroundImage = `url(${homeBgUrl})`;

  // 优先使用背景图片
  if (post.value?.coverImage) {
    style.backgroundImage = `url('${post.value.coverImage}')`;
  } else {
    style.backgroundImage = `url(${homeBgUrl})`;
  }

  style.backgroundSize = 'cover';
  style.backgroundPosition = 'center';
  style.backgroundRepeat = 'no-repeat';

  return style;
});

const route = useRoute();
const router = useRouter();
const postId = Number(route.params.id);

const post = ref<Blog.Post>();

const markdownRef = ref<HTMLDivElement | null>(null);

// 目录相关
interface TocItem {
  id: string;
  text: string;
  level: number;
}

const tocItems = ref<TocItem[]>([]);
const activeHeading = ref<string>('');

// 阅读进度
const readingProgress = ref(0);

// 文章统计
const wordCount = ref(0);
const estimatedReadTime = ref(0);

// 移动端目录状态
const isMobileTocOpen = ref(false);

// 滚动事件处理函数
const handleScroll = () => {
  updateReadingProgress();
  updateActiveHeading();
};

onMounted(async () => {
  await init();
  initVditor();
  setupScrollListener();
});

/**
 * 设置滚动监听器
 */
const setupScrollListener = () => {
  window.addEventListener('scroll', handleScroll);
};

/**
 * 清理滚动监听器
 */
const cleanupScrollListener = () => {
  window.removeEventListener('scroll', handleScroll);
};

/**
 * 更新阅读进度
 */
const updateReadingProgress = () => {
  const scrollTop = window.pageYOffset || (document.documentElement as HTMLElement).scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  readingProgress.value = Math.min(Math.max(progress, 0), 100);
};

/**
 * 更新当前激活的标题
 */
const updateActiveHeading = () => {
  const headings = document.querySelectorAll(
    '.markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6',
  );
  let activeId = '';

  headings.forEach((heading) => {
    const rect = (heading as HTMLElement).getBoundingClientRect();
    if (rect.top <= 100) {
      activeId = heading.id;
    }
  });

  activeHeading.value = activeId;
};

/**
 * 生成目录
 */
const generateToc = () => {
  if (!markdownRef.value) return;

  const headings = markdownRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const toc: TocItem[] = [];

  headings.forEach((heading, index) => {
    const level = parseInt((heading as HTMLElement).tagName.charAt(1), 10);
    const text = heading.textContent || '';
    const id = `heading-${index}`;

    // 为标题添加ID
    (heading as HTMLElement).id = id;

    toc.push({
      id,
      text,
      level,
    });
  });
  tocItems.value = toc;
};

/**
 * 滚动到指定标题
 */
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    (element as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
    // 在移动端点击目录项后自动关闭目录
    if (window.innerWidth <= 992) {
      closeMobileToc();
    }
  }
};

/**
 * 计算字数和阅读时间
 */
const calculateWordStats = () => {
  if (!post.value?.content) return;

  // 移除Markdown语法，计算纯文本字数
  const plainText = post.value.content
    .replace(/[#*`_~\[\]()]/g, '') // 移除Markdown符号
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`.*?`/g, '') // 移除行内代码
    .replace(/\s+/g, ' ') // 合并空白字符
    .trim();

  const words = plainText.length;
  wordCount.value = words;

  // 按照中文阅读速度 300-500 字/分钟计算
  estimatedReadTime.value = Math.ceil(words / 400);
};

/**
 * 处理点赞
 */
const handleLike = () => {
  // TODO: 实现点赞功能
  console.log('点赞功能待实现');
};

/**
 * 处理收藏
 */
const handleBookmark = () => {
  // TODO: 实现收藏功能
  console.log('收藏功能待实现');
};

/**
 * 切换移动端目录显示
 */
const toggleMobileToc = () => {
  isMobileTocOpen.value = !isMobileTocOpen.value;
};

/**
 * 关闭移动端目录
 */
const closeMobileToc = () => {
  isMobileTocOpen.value = false;
};

onUnmounted(() => {
  // 清理滚动监听器
  cleanupScrollListener();
});

const init = async () => {
  const res = await BlogApi.getPostById(postId);
  post.value = res;
};

/**
 * 初始化Vditor预览
 */
const initVditor = () => {
  if (!markdownRef.value || !post.value?.content) {
    return;
  }

  // 清除之前的内容和类名
  markdownRef.value.innerHTML = '';
  markdownRef.value.className = 'markdown-content';

  Vditor.preview(markdownRef.value as HTMLDivElement, post.value.content, {
    mode: 'light',
    hljs: {
      style: 'github',
      lineNumber: true,
    },
    theme: {
      current: 'classic',
    },
    math: {
      inlineDigit: true,
    },
    anchor: 1, // 启用锚点生成
  });

  // 添加平滑滚动效果
  markdownRef.value.style.scrollBehavior = 'smooth';

  // 处理标题链接点击事件，支持带锚点的路由跳转
  nextTick(() => {
    const headingLinks = markdownRef.value?.querySelectorAll('h1 a, h2 a, h3 a, h4 a, h5 a, h6 a');
    headingLinks?.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const { href } = link as HTMLAnchorElement;
        const targetId = href?.substring(href.lastIndexOf('#') + 1);
        if (targetId) {
          // 更新路由，添加锚点hash
          router.replace({
            path: route.path,
            hash: `#${targetId}`,
          });

          // 平滑滚动到目标元素
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            (targetElement as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // 页面加载时如果URL中有hash，自动滚动到对应位置
    if (route.hash) {
      const targetId = route.hash.substring(1);
      setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          (targetElement as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500); // 延迟执行，确保DOM渲染完成
    }

    generateToc();
    calculateWordStats();
  });
};
</script>

<style lang="scss" scoped>
/**
 * 文章详情页面容器
 */
.post-detail-container {
  min-height: 100vh;
  background: var(--bg-color, #f8fafc);
  transition: all 0.3s ease;

  /**
   * 文章头部区域
   */
  .post-header {
    position: relative;
    height: 40vh;
    min-height: 320px;
    max-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;

    .header-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.4) 0%,
        rgba(0, 0, 0, 0.6) 50%,
        rgba(0, 0, 0, 0.3) 100%
      );
      backdrop-filter: blur(1px);
    }

    .header-content {
      position: relative;
      max-width: 800px;
      width: 90%;
      text-align: center;
      color: white;
      padding: 1.5rem;
    }
  }

  /**
 * 面包屑导航
 */
  .post-meta {
    margin-bottom: 1.5rem;
  }

  .breadcrumb {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    opacity: 0.9;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    backdrop-filter: blur(10px);

    &-item {
      color: white;
    }

    &-separator {
      color: rgba(255, 255, 255, 0.6);
    }
  }

  /**
 * 文章标题
 */
  .post-title {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 1rem 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  /**
 * 文章摘要
 */
  .post-summary {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    opacity: 0.95;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  /**
 * 文章信息
 */
  .post-info {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 15px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  }

  .info-icon {
    font-size: 1rem;
  }

  /**
 * 文章标签
 */
  .post-tags {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .tag {
    display: inline-block;
    padding: 0.375rem 0.875rem;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-1px);
    }
  }

  /**
   * 文章内容区域
   */
  .post-content-wrapper {
    background: var(--content-bg, white);
    position: relative;
    margin-top: -2rem;
    border-radius: 1.5rem 1.5rem 0 0;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);

    .container {
      max-width: 1600px;
      margin: 0 auto;
      padding: 2.5rem 2rem 2rem;

      /* 内容布局 */
      .content-layout {
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        position: relative;
        align-items: start;

        /* 移动端目录切换按钮 */
        .mobile-toc-toggle {
          display: none;
          position: fixed;
          bottom: 2rem;
          left: 2rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 1rem 1.5rem;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
          }
        }

        /* 移动端目录遮罩 */
        .mobile-toc-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;

          &.active {
            opacity: 1;
            visibility: visible;
          }
        }

        /* 目录导航 */
        .table-of-contents {
          position: sticky;
          top: 1.5rem;
          height: fit-content;
          max-height: calc(100vh - 3rem);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 1.2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow-y: auto;
          transition: all 0.3s ease;
          .toc-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
            font-size: 1rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e2e8f0;

            .toc-close {
              display: none;
              background: none;
              border: none;
              color: #6b7280;
              cursor: pointer;
              padding: 0.25rem;
              border-radius: 4px;
              transition: all 0.2s ease;

              &:hover {
                background: rgba(107, 114, 128, 0.1);
                color: #374151;
              }
            }
          }
          .toc-nav {
            overflow-y: auto;
            .toc-list {
              list-style: none;
              padding: 0;
              margin: 0;
              .toc-item {
                margin-bottom: 0.25rem;
                cursor: pointer;

                &.active .toc-link {
                  color: #667eea;
                  background: rgba(102, 126, 234, 0.15);
                  font-weight: 500;
                  padding-left: 0.5rem;
                }

                &.level-1 .toc-link {
                  padding-left: 0;
                }
                &.level-2 .toc-link {
                  padding-left: 1rem;
                }
                &.level-3 .toc-link {
                  padding-left: 2rem;
                }
                &.level-4 .toc-link {
                  padding-left: 3rem;
                }
                &.level-5 .toc-link {
                  padding-left: 4rem;
                }
                &.level-6 .toc-link {
                  padding-left: 5rem;
                }
              }
            }
          }
        }

        .main-content {
          min-width: 0;
          padding: 0;
          /* 文章元信息卡片 */
          .article-meta-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
            position: relative;
            overflow: hidden;

            &::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
              pointer-events: none;
            }

            .meta-row {
              display: flex;
              justify-content: space-around;
              text-align: center;
              gap: 2rem;
              position: relative;

              .meta-item {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(5px);
                transition: all 0.3s ease;

                &:hover {
                  background: rgba(255, 255, 255, 0.2);
                  transform: translateY(-3px);
                }

                .meta-icon {
                  font-size: 1.5rem;
                  opacity: 0.9;
                }

                .meta-text {
                  font-size: 0.85rem;
                  font-weight: 500;
                  line-height: 1.3;
                }
              }
            }
          }
        }

        /**
      * 文章内容
      */
        .post-content {
          background: var(--content-bg, white);
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 3rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          .markdown-content {
            line-height: 1.8;
            font-size: 1rem;
            color: var(--text-color, #374151);
          }
        }

        /* 标签云区域 */
        .article-tags-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;

          &:hover {
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
          }

          .tags-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.1rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid #e2e8f0;
          }
          .tags-cloud {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;

            .tag-item {
              background: linear-gradient(135deg, #667eea, #764ba2);
              color: white;
              padding: 0.75rem 1.5rem;
              border-radius: 25px;
              font-size: 0.9rem;
              font-weight: 600;
              text-decoration: none;
              transition: all 0.3s ease;
              box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
              position: relative;
              overflow: hidden;

              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                  90deg,
                  transparent,
                  rgba(255, 255, 255, 0.2),
                  transparent
                );
                transition: left 0.5s ease;
              }

              &:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);
                color: white;

                &::before {
                  left: 100%;
                }
              }
            }
          }
        }

        /**
      * 文章底部
      */
        .post-footer {
          border-top: 1px solid var(--border-color, #e5e7eb);
          padding-top: 1.5rem;

          /**
        * 文章操作按钮
        */
          .post-actions {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-bottom: 3rem;
            padding: 2rem 0;

            .action-btn {
              display: flex;
              align-items: center;
              gap: 1rem;
              padding: 1rem 2rem;
              border: none;
              border-radius: 16px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.3s ease;
              background: rgba(255, 255, 255, 0.95);
              color: #4a5568;
              box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
              border: 1px solid rgba(255, 255, 255, 0.3);
              backdrop-filter: blur(10px);
              min-width: 140px;

              &:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 35px rgba(0, 0, 0, 0.12);
              }

              .action-icon {
                font-size: 1.5rem;
                opacity: 0.8;
              }

              .action-text {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 0.25rem;
                .action-label {
                  font-size: 0.9rem;
                  font-weight: 600;
                  color: #2d3748;
                }

                .action-count {
                  font-size: 0.8rem;
                  color: #718096;
                  font-weight: 400;
                }
              }
            }

            .like-btn {
              background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(238, 90, 82, 0.1));
              border-color: rgba(255, 107, 107, 0.2);

              .action-icon {
                color: #ff6b6b;
              }

              .action-label {
                color: #ff6b6b;
              }

              &:hover {
                background: linear-gradient(
                  135deg,
                  rgba(255, 107, 107, 0.15),
                  rgba(238, 90, 82, 0.15)
                );
                border-color: rgba(255, 107, 107, 0.3);
              }
            }

            .share-btn {
              background: linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(68, 160, 141, 0.1));
              border-color: rgba(78, 205, 196, 0.2);

              .action-icon {
                color: #4ecdc4;
              }

              .action-label {
                color: #4ecdc4;
              }

              &:hover {
                background: linear-gradient(
                  135deg,
                  rgba(78, 205, 196, 0.15),
                  rgba(68, 160, 141, 0.15)
                );
                border-color: rgba(78, 205, 196, 0.3);
              }
            }

            .bookmark-btn {
              background: linear-gradient(
                135deg,
                rgba(102, 126, 234, 0.1),
                rgba(79, 109, 245, 0.1)
              );
              border-color: rgba(102, 126, 234, 0.2);

              .action-icon {
                color: #667eea;
              }

              .action-label {
                color: #667eea;
              }

              &:hover {
                background: linear-gradient(
                  135deg,
                  rgba(102, 126, 234, 0.15),
                  rgba(79, 109, 245, 0.15)
                );
                border-color: rgba(102, 126, 234, 0.3);
              }
            }
          }
        }

        /* 版权声明 */
        .copyright-notice {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 2.5rem;
          border-radius: 16px;
          margin: 3rem 0;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-left: 6px solid #667eea;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;

          &:hover {
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
          }
          .copyright-content {
            display: flex;
            align-items: flex-start;
            gap: 1.5rem;

            .copyright-icon {
              font-size: 2rem;
              color: #667eea;
              margin-top: 0.25rem;
              opacity: 0.8;
            }

            .copyright-text {
              flex: 1;
              font-size: 0.875rem;
              color: #4a5568;
              line-height: 1.6;

              p {
                margin: 0.25rem 0;
              }

              strong {
                color: #667eea;
                font-weight: 600;
              }
            }
          }
        }

        /**
      * 文章导航
      */
        .post-navigation {
          gap: 1rem;
          .nav-item {
            padding: 1rem;
            background: var(--card-bg, #f8fafc);
            border-radius: 0.75rem;
            border: 1px solid var(--border-color, #e5e7eb);
            cursor: pointer;
            transition: all 0.3s ease;

            .nav-label {
              display: block;
              font-size: 0.75rem;
              color: var(--text-secondary, #6b7280);
              margin-bottom: 0.25rem;
            }

            .nav-title {
              display: block;
              font-weight: 500;
              color: var(--text-color, #374151);
            }
          }
          .nav-item:hover {
            background: var(--hover-bg, #f1f5f9);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
  }

  /**
 * Vditor 样式重置
 */
  .vditor-reset {
    font-family:
      'Inter',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      'Helvetica Neue',
      Arial,
      sans-serif;
  }

  /* 阅读进度条 */
  .reading-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: rgba(0, 0, 0, 0.1);

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
    }
  }

  .toc-link {
    display: block;
    padding: 0.5rem 0;
    color: #4a5568;
    text-decoration: none;
    font-size: 0.875rem;
    line-height: 1.4;
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover {
      color: #667eea;
      background: rgba(102, 126, 234, 0.1);
      padding-left: 0.5rem;
    }
  }

  /* 文章正文区域 */
  .post-content {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 3rem;
    margin-bottom: 3rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }
  }

  /* 响应式设计 */
  @media (max-width: 992px) {
    .post-header {
      height: 35vh;
      min-height: 280px;
      max-height: 320px;

      .header-content {
        padding: 1rem;
      }
    }

    .post-content-wrapper {
      margin-top: -1.5rem;

      .container {
        padding: 2rem 1rem 1.5rem;

        .content-layout {
          padding: 0 0.5rem;
          display: block;

          .mobile-toc-toggle {
            display: flex;
          }

          .mobile-toc-overlay {
            display: block;
          }

          .table-of-contents {
            position: fixed;
            top: 0;
            left: -100%;
            width: 280px;
            height: 100vh;
            max-height: 100vh;
            background: white;
            z-index: 1000;
            transition: left 0.3s ease;
            border-radius: 0;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
            padding: 1rem;

            &.mobile-open {
              left: 0;
            }

            .toc-close {
              display: block;
            }
          }

          .main-content {
            width: 100%;
            max-width: none;
          }
        }
      }
    }

    .post-title {
      font-size: 2rem;
      margin: 0.75rem 0;
    }

    .post-summary {
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .post-info {
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .info-item {
      font-size: 0.75rem;
      padding: 0.4rem 0.8rem;
    }

    .article-meta-card {
      padding: 0.75rem;
      margin-bottom: 1rem;

      .meta-row {
        gap: 1rem;

        .meta-item {
          min-width: 100px;
          padding: 0.5rem 0.6rem;

          .meta-icon {
            font-size: 0.9rem;
          }

          .meta-text {
            div:first-child {
              font-size: 0.65rem;
            }

            div:last-child {
              font-size: 0.75rem;
            }
          }
        }
      }
    }

    .article-tags-section {
      margin: 1.5rem 0;
      padding: 1rem;

      .tags-title {
        font-size: 1rem;
        margin-bottom: 0.75rem;
      }
    }

    .post-footer {
      margin-top: 1.5rem;
      padding-top: 1rem;
    }
  }

  @media (max-width: 768px) {
    .post-header {
      height: 30vh;
      min-height: 250px;
      max-height: 280px;
    }

    .post-title {
      font-size: 1.75rem;
      margin: 0.5rem 0;
    }

    .post-summary {
      font-size: 0.85rem;
      margin-bottom: 0.75rem;
    }

    .post-info {
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .info-item {
      font-size: 0.7rem;
      padding: 0.3rem 0.6rem;
    }

    .article-meta-card {
      padding: 0.6rem;
      margin-bottom: 0.75rem;

      .meta-row {
        gap: 0.75rem;
        flex-direction: column;

        .meta-item {
          min-width: auto;
          width: 100%;
          max-width: 180px;
          padding: 0.4rem 0.5rem;
        }
      }
    }

    .post-content-wrapper {
      margin-top: -1rem;

      .container {
        padding: 1.5rem 0.75rem 1rem;
      }
    }

    .article-tags-section {
      margin: 1rem 0;
      padding: 0.75rem;
    }

    .post-footer {
      margin-top: 1rem;
      padding-top: 0.75rem;
    }
  }
}
</style>
