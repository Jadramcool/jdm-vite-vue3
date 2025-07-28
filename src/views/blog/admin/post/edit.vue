<template>
  <div>
    <div class="editor-layout h-100%" :class="[getThemeClass(), 'theme-transition']">
      <!-- 主编辑区域 -->
      <div class="editor-main">
        <!-- 编辑器加载动画 -->
        <Transition name="loading-fade">
          <div v-if="isEditorLoading && isEdit" class="editor-loading-overlay">
            <div class="loading-container">
              <div class="loading-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
              </div>
              <div class="loading-text">
                <h3>正在加载编辑器...</h3>
                <p>请稍候，正在初始化Markdown编辑器</p>
              </div>
            </div>
          </div>
        </Transition>
        <div ref="markdownRef" class="vditor-container" />
      </div>

      <!-- 独立侧边栏 -->
      <div class="editor-sidebar">
        <!-- Tab 切换 -->
        <div class="sidebar-tabs">
          <button
            class="tab-button"
            :class="{ active: activeTab === 'outline' }"
            @click="activeTab = 'outline'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"
              />
            </svg>
            大纲
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'settings' }"
            @click="activeTab = 'settings'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
              />
            </svg>
            设置
          </button>
        </div>

        <!-- Tab 内容 -->
        <div class="sidebar-content">
          <!-- 大纲面板 -->
          <Transition name="tab-slide" mode="out-in">
            <div :key="activeTab" class="tab-content">
              <!-- 大纲面板 -->
              <div v-if="activeTab === 'outline'" class="outline-panel">
                <!-- 大纲头部信息 -->
                <div class="outline-header">
                  <div class="outline-stats">
                    <div class="stat-item">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="stat-icon"
                      >
                        <path
                          d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"
                        />
                      </svg>
                      <span class="stat-label">{{ outlineStats.totalCount }} 个标题</span>
                    </div>
                    <div class="stat-item">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="stat-icon"
                      >
                        <path
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                      <span class="stat-label">{{ outlineStats.maxDepth }} 级深度</span>
                    </div>
                  </div>
                </div>

                <!-- 统一的内容区域 -->
                <Transition name="loading-fade" mode="out-in">
                  <!-- 大纲加载状态 -->
                  <div
                    v-if="isOutlineLoading && isEdit"
                    key="loading"
                    class="outline-loading-overlay"
                  >
                    <div class="loading-container small">
                      <div class="loading-spinner small">
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                      </div>
                      <div class="loading-text">
                        <h4>正在生成大纲...</h4>
                        <p>正在解析文档结构</p>
                      </div>
                    </div>
                  </div>
                  <!-- 大纲空状态 -->
                  <div
                    v-else-if="!isOutlineLoading && outlineItems.length === 0"
                    key="empty"
                    class="outline-content"
                  >
                    <div class="outline-empty">
                      <div class="empty-illustration">
                        <svg
                          width="64"
                          height="64"
                          viewBox="0 0 24 24"
                          fill="none"
                          class="empty-icon"
                        >
                          <path
                            d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="1"
                            opacity="0.2"
                          />
                        </svg>
                        <div class="empty-sparkles">
                          <div class="sparkle sparkle-1"></div>
                          <div class="sparkle sparkle-2"></div>
                          <div class="sparkle sparkle-3"></div>
                        </div>
                      </div>
                      <div class="empty-content">
                        <p class="empty-text">暂无大纲内容</p>
                        <p class="empty-hint">在编辑器中添加标题后，大纲将自动生成</p>
                        <div class="empty-tips">
                          <div class="tip-item">
                            <span class="tip-key"># </span>
                            <span class="tip-desc">一级标题</span>
                          </div>
                          <div class="tip-item">
                            <span class="tip-key">## </span>
                            <span class="tip-desc">二级标题</span>
                          </div>
                          <div class="tip-item">
                            <span class="tip-key">### </span>
                            <span class="tip-desc">三级标题</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 大纲列表状态 -->
                  <div v-else-if="!isOutlineLoading" key="list" class="outline-content">
                    <div class="outline-list">
                      <TransitionGroup name="outline-item" tag="div">
                        <div
                          v-for="(item, index) in outlineItems"
                          :key="item.id"
                          class="outline-item"
                          :class="[
                            `level-${item.level}`,
                            { 'is-active': activeOutlineId === item.id },
                          ]"
                          :style="{
                            paddingLeft: `${(item.level - 1) * 16 + 16}px`,
                            transitionDelay: `${index * 30}ms`,
                          }"
                          @click="scrollToHeading(item.id)"
                        >
                          <div class="outline-item-content">
                            <div class="outline-marker" :class="`marker-level-${item.level}`">
                              <div class="marker-dot"></div>
                              <div class="marker-pulse"></div>
                            </div>
                            <div class="outline-text-wrapper">
                              <span class="outline-text">{{ item.text }}</span>
                              <div class="outline-level-indicator">H{{ item.level }}</div>
                            </div>
                          </div>
                          <div
                            class="outline-connector"
                            v-if="index < outlineItems.length - 1"
                          ></div>
                        </div>
                      </TransitionGroup>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- 设置面板 -->
              <div v-else-if="activeTab === 'settings'" class="settings-panel">
                <div class="setting-group">
                  <h4 class="setting-title">文章设置</h4>
                  <div class="setting-item">
                    <label class="setting-label">文章标题</label>
                    <n-input
                      v-model:value="formData.title"
                      placeholder="请输入文章标题"
                      size="small"
                    />
                  </div>
                  <div class="setting-item">
                    <label class="setting-label">文章分类</label>
                    <n-select
                      v-model:value="formData.categoryId"
                      :options="categoryOptions"
                      placeholder="请选择分类"
                      size="small"
                    />
                  </div>
                  <div class="setting-item">
                    <label class="setting-label">文章摘要</label>
                    <n-input
                      v-model:value="formData.summary"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入文章摘要"
                      size="small"
                    >
                      <template #password-visible-icon></template>
                    </n-input>
                  </div>
                  <div class="setting-item">
                    <label class="setting-label">文章标签</label>
                    <div class="tag-selector">
                      <!-- 已选择的标签 -->
                      <div v-if="formData.tags.length > 0" class="selected-tags">
                        <div
                          v-for="(tag, index) in formData.tags"
                          :key="`selected-${tag.id}-${index}`"
                          class="selected-tag"
                        >
                          <span class="tag-text">{{ tag.name }}</span>
                          <button
                            class="tag-remove"
                            @click="removeTag(index)"
                            :title="`移除标签: ${tag.name}`"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <!-- 可选择的标签云 -->
                      <div v-if="availableTags.length > 0" class="available-tags">
                        <div class="tags-header">
                          <span class="tags-title">可选标签</span>
                          <span class="tags-count">({{ availableTags.length }})</span>
                        </div>
                        <div class="tags-cloud">
                          <button
                            v-for="tag in availableTags"
                            :key="`available-${tag.id}`"
                            class="tag-option"
                            :class="{ selected: formData.tags.some((t) => t.id === tag.id) }"
                            :style="{ '--tag-color': tag.color || '#666' }"
                            @click="toggleTag(tag)"
                            :title="`${tag.description || tag.name} (使用次数: ${tag.useCount})`"
                          >
                            <span class="tag-name">{{ tag.name }}</span>
                            <span class="tag-use-count">{{ tag.useCount }}</span>
                          </button>
                        </div>
                      </div>

                      <!-- 自定义标签输入 -->
                      <div class="custom-tag-input">
                        <div class="input-wrapper">
                          <n-input
                            v-model:value="newTagInput"
                            placeholder="输入自定义标签，按回车添加"
                            size="small"
                            @keyup.enter="addCustomTag"
                            @blur="addCustomTag"
                            clearable
                          >
                            <template #prefix>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                              </svg>
                            </template>
                          </n-input>
                          <button
                            class="add-tag-btn"
                            @click="addCustomTag"
                            :disabled="!newTagInput.trim()"
                            title="添加自定义标签"
                          >
                            添加
                          </button>
                        </div>
                        <div class="input-hint">支持中文、英文、数字，建议2-10个字符</div>
                      </div>
                    </div>
                  </div>
                  <div class="setting-item">
                    <label class="setting-label">封面图片</label>
                    <div class="cover-image-upload">
                      <!-- 封面图片预览 -->
                      <div v-if="formData.coverImage" class="cover-preview">
                        <img
                          :src="formData.coverImage"
                          alt="封面图片"
                          class="cover-image"
                          @click="showCoverPreview"
                          title="点击预览大图"
                        />
                        <div class="cover-actions">
                          <button
                            class="cover-action-btn"
                            @click="showCoverPreview"
                            title="预览大图"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path
                                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                              />
                            </svg>
                          </button>
                          <button
                            class="cover-action-btn"
                            @click="handleCoverImageUpload"
                            title="更换封面"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path
                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                              />
                            </svg>
                          </button>
                          <button
                            class="cover-action-btn delete"
                            @click="removeCoverImage"
                            title="删除封面"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <!-- 上传按钮 -->
                      <div v-else class="cover-upload-area" @click="handleCoverImageUpload">
                        <div class="upload-placeholder">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class="upload-icon"
                          >
                            <path
                              d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
                            />
                          </svg>
                          <p class="upload-text">点击上传封面图片</p>
                          <p class="upload-hint">支持 JPG、PNG、WebP 格式，建议尺寸 16:9</p>
                        </div>
                      </div>
                      <!-- 隐藏的文件输入 -->
                      <input
                        ref="coverImageInput"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        style="display: none"
                        @change="handleCoverImageChange"
                      />
                      <!-- 上传进度 -->
                      <div v-if="coverImageUploading" class="upload-progress">
                        <div class="progress-bar">
                          <div
                            class="progress-fill"
                            :style="{ width: coverUploadProgress + '%' }"
                          ></div>
                        </div>
                        <p class="progress-text">上传中... {{ coverUploadProgress }}%</p>
                      </div>
                    </div>
                  </div>
                  <div class="setting-item">
                    <label class="setting-label">发布状态</label>
                    <n-radio-group v-model:value="formData.status" size="small">
                      <n-radio value="PUBLISHED">发布</n-radio>
                      <n-radio value="DRAFT">草稿</n-radio>
                    </n-radio-group>
                  </div>
                </div>

                <div class="setting-group">
                  <h4 class="setting-title">主题设置</h4>
                  <div class="theme-selector">
                    <div
                      v-for="theme in themes"
                      :key="theme.key"
                      class="theme-option"
                      :class="[theme.key, { active: currentTheme === theme.key }]"
                      :title="theme.name"
                      @click="switchTheme(theme.key)"
                    ></div>
                  </div>
                </div>

                <div class="setting-group">
                  <h4 class="setting-title">编辑器设置</h4>
                  <div class="setting-item switch-item">
                    <label class="setting-label">显示字数</label>
                    <n-switch v-model:value="editorSettings.showLineNumbers" size="small" />
                  </div>
                  <div class="setting-item switch-item">
                    <label class="setting-label">自动保存</label>
                    <n-switch v-model:value="editorSettings.autoSave" size="small" />
                  </div>
                </div>

                <!-- 固定在底部的操作按钮 -->
                <div class="fixed-actions">
                  <button class="action-btn primary" @click="handleSave">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
                      />
                    </svg>
                    保存文章
                  </button>
                  <button class="action-btn secondary" @click="handlePreview">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                      />
                    </svg>
                    预览文章
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- 封面图片预览模态框 -->
    <div v-if="showPreviewModal" class="preview-modal" @click="hidePreviewModal">
      <div class="preview-modal-content" @click.stop>
        <div class="preview-modal-header">
          <h3 class="preview-modal-title">封面图片预览</h3>
          <button class="preview-modal-close" @click="hidePreviewModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </button>
        </div>
        <div class="preview-modal-body">
          <img :src="formData.coverImage" alt="封面图片预览" class="preview-image" />
        </div>
        <div class="preview-modal-footer">
          <button class="preview-action-btn secondary" @click="handleCoverImageUploadFromPreview">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              />
            </svg>
            更换封面
          </button>
          <button class="preview-action-btn danger" @click="removeCoverImage">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
            删除封面
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BlogApi, UploadApi } from '@/api';
import { useTheme } from '@/composables/useTheme';
import { getToken } from '@/utils/token';
import { NInput, NRadio, NRadioGroup, NSwitch, useMessage } from 'naive-ui';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';

defineOptions({ name: 'BlogAdminPostEdit' });

const route = useRoute();
const message = useMessage();

const isEdit = computed(() => {
  return route.query.id !== undefined;
});
const postId = isEdit.value ? Number(route.query.id) : 0;
const post = ref<Blog.Post>();

// 加载状态管理
const isEditorLoading = ref(false); // 编辑器加载状态
const isOutlineLoading = ref(false); // 大纲加载状态

const vditor = ref();
const markdownRef = ref<HTMLDivElement | null>(null);

// 侧边栏状态管理
const activeTab = ref<'outline' | 'settings'>('outline');
const outlineItems = ref<Array<{ id: string; text: string; level: number; lineIndex: number }>>([]);
const activeOutlineId = ref<string>(''); // 当前激活的大纲项ID

// 大纲统计信息
const outlineStats = computed(() => {
  const items = outlineItems.value;
  const totalCount = items.length;
  const maxDepth = items.length > 0 ? Math.max(...items.map((item) => item.level)) : 0;
  return { totalCount, maxDepth };
});

// 编辑器设置
const editorSettings = ref({
  showLineNumbers: true,
  autoSave: false,
});

// 主题设置 - 使用组合式函数
const { currentTheme, themes, switchTheme, loadThemeFromStorage, getThemeClass } = useTheme();

// 表单数据
const formData = ref({
  title: '',
  summary: '',
  tags: [] as Blog.Tag[], // 修改为标签对象数组
  categoryId: null as number | null,
  status: 'DRAFT' as Blog.PostStatus, // PUBLISH: 发布, DRAFT: 草稿
  coverImage: '', // 封面图片URL
});

// 分类选项
const categoryOptions: Ref<{ label: string; value: number }[]> = ref([]);

// 标签相关状态
const availableTags = ref<Blog.Tag[]>([]);
const newTagInput = ref('');

// 封面图片上传相关状态
const coverImageInput = ref<HTMLInputElement>();
const coverImageUploading = ref(false);
const coverUploadProgress = ref(0);

// 封面图片预览模态框状态
const showPreviewModal = ref(false);

onMounted(async () => {
  loadThemeFromStorage();
  await init();
  setTimeout(() => {
    initVditor();
  }, 1000);

  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeyDown);
});

/**
 * 处理键盘事件
 * @param event 键盘事件
 */
const handleKeyDown = (event: KeyboardEvent) => {
  // ESC键关闭预览模态框
  if (event.key === 'Escape' && showPreviewModal.value) {
    hidePreviewModal();
  }
};

onUnmounted(() => {
  const editorInstance = vditor.value;
  if (!editorInstance) return;
  try {
    editorInstance?.destroy?.();
  } catch (error) {
    // 编辑器销毁失败，忽略错误
  }

  // 移除键盘事件监听器
  document.removeEventListener('keydown', handleKeyDown);
});

// 监听编辑器设置变化并实时应用
watch(
  editorSettings,
  (newSettings) => {
    if (!vditor.value) return;

    // 编辑器设置已更改

    // 更新字符计数显示
    const counterElement = vditor.value.vditor?.element?.querySelector('.vditor-counter');
    if (counterElement) {
      counterElement.style.display = newSettings.showLineNumbers ? 'block' : 'none';
    }

    // 更新缓存设置（自动保存）
    if (vditor.value.vditor?.options) {
      vditor.value.vditor.options.cache.enable = newSettings.autoSave;
    }
  },
  { deep: true },
);

// 监听表单标题变化，同步到Markdown
let titleSyncTimer: NodeJS.Timeout;
watch(
  () => formData.value.title,
  (newTitle, oldTitle) => {
    // 防抖处理，避免频繁更新
    clearTimeout(titleSyncTimer);
    titleSyncTimer = setTimeout(() => {
      // 只有当标题真正改变且编辑器已初始化时才同步
      if (newTitle !== oldTitle && vditor.value && newTitle.trim()) {
        const currentH1 = extractH1FromMarkdown();
        // 只有当Markdown中的一级标题与新标题不同时才更新
        if (currentH1 !== newTitle) {
          updateMarkdownH1(newTitle);
        }
      }
    }, 500);
  },
);

/**
 * 初始化页面数据
 */
const init = async () => {
  try {
    // 如果是编辑模式，显示编辑器加载动画
    if (isEdit.value) {
      isEditorLoading.value = true;
      isOutlineLoading.value = true;
    }

    await getPostCategories();
    await getAllTags();

    if (isEdit.value) {
      const res = await BlogApi.getPostById(postId);
      post.value = res;
      // 填充表单数据
      if (res) {
        formData.value = {
          title: res.title || '',
          summary: res.summary || '',
          tags: res.tags || [], // 直接使用标签对象数组
          categoryId: res.categoryId || null,
          status: res.status || 'DRAFT',
          coverImage: res.coverImage || '', // 封面图片URL
        };

        // 编辑模式下，如果Markdown内容中有一级标题但表单标题为空，则同步
        setTimeout(() => {
          if (vditor.value && !formData.value.title) {
            syncMarkdownTitleToForm();
          }
        }, 1500); // 等待编辑器完全初始化
      }
    }
  } catch (error) {
    // 初始化失败
    message.error('加载博客数据失败，请重试');
  } finally {
    // 数据加载完成，但编辑器和大纲可能还在初始化
    // 编辑器加载状态将在initVditor中管理
    // 大纲加载状态将在updateOutlineData中管理
  }
};

// 加载分类
const getPostCategories = async () => {
  const res = await BlogApi.getCategoryTree();
  categoryOptions.value = res.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};

/**
 * 获取所有可用标签
 */
const getAllTags = async () => {
  try {
    const res = await BlogApi.getAllTags();
    availableTags.value = res || [];
  } catch (error) {
    // 获取标签失败
    message.error('获取标签失败');
  }
};

/**
 * 切换标签选择状态
 * @param tag 标签对象，包含name和id
 */
const toggleTag = (tag: Blog.Tag | string) => {
  // 兼容处理：如果传入的是字符串，则查找对应的标签对象
  let targetTag: Blog.Tag;
  if (typeof tag === 'string') {
    const foundTag = availableTags.value.find((t) => t.name === tag);
    if (!foundTag) return;
    targetTag = foundTag;
  } else {
    targetTag = tag;
  }

  const index = formData.value.tags.findIndex((t) => t.id === targetTag.id);
  if (index > -1) {
    // 如果已选择，则移除
    formData.value.tags.splice(index, 1);
  } else {
    // 如果未选择，则添加
    formData.value.tags.push(targetTag);
  }
};

/**
 * 移除指定位置的标签
 * @param index 标签在数组中的索引
 */
const removeTag = (index: number) => {
  if (index >= 0 && index < formData.value.tags.length) {
    formData.value.tags.splice(index, 1);
  }
};

/**
 * 添加自定义标签
 */
const addCustomTag = () => {
  const tagName = newTagInput.value.trim();

  // 验证标签名称
  if (!tagName) {
    return;
  }

  if (tagName.length < 2 || tagName.length > 10) {
    message.error('标签长度应在2-10个字符之间');
    return;
  }

  // 检查是否已存在
  if (formData.value.tags.some((tag) => tag.name === tagName)) {
    message.warning('该标签已存在');
    newTagInput.value = '';
    return;
  }

  // 创建临时标签对象（等待后端返回真实ID）
  const tempTag = {
    id: Date.now(), // 临时ID，后续会被后端返回的真实ID替换
    name: tagName,
    slug: tagName.toLowerCase().replace(/\s+/g, '-'),
    useCount: 0,
    isDeleted: false,
    createdTime: new Date(),
    updatedTime: new Date(),
    isAdd: true,
  };

  // 添加标签
  formData.value.tags.push(tempTag);
  newTagInput.value = '';
};

/**
 * 触发封面图片上传
 */
const handleCoverImageUpload = () => {
  if (coverImageInput.value) {
    coverImageInput.value.click();
  }
};

/**
 * 处理封面图片文件选择
 * @param event 文件选择事件
 */
const handleCoverImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  try {
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      message.error('不支持的图片格式，请选择 JPG、PNG 或 WebP 格式的图片');
      return;
    }

    // 验证文件大小（3MB限制）
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error('图片文件过大，请选择小于3MB的图片');
      return;
    }

    // 开始上传
    coverImageUploading.value = true;
    coverUploadProgress.value = 0;

    const result = await UploadApi.uploadFile(
      {
        file,
        fileType: 'image',
        target: 'oss',
        folder: 'blog/covers',
        maxSize,
        allowedMimeTypes: allowedTypes,
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
      },
      (progress) => {
        coverUploadProgress.value = progress;
      },
    );
    // 获取上传结果URL
    let imageUrl = '';
    if (result.oss?.fileUrl) {
      imageUrl = result.oss.fileUrl;
    } else if (result.local?.fileUrl) {
      imageUrl = result.local.fileUrl;
    }

    if (imageUrl) {
      formData.value.coverImage = imageUrl;
      message.success('封面图片上传成功');
    } else {
      throw new Error('上传成功但未获取到文件URL');
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '封面图片上传失败';
    message.error(errorMessage);
  } finally {
    coverImageUploading.value = false;
    coverUploadProgress.value = 0;
    // 清空文件输入，允许重新选择同一文件
    if (target) {
      target.value = '';
    }
  }
};

/**
 * 删除封面图片
 */
const removeCoverImage = () => {
  formData.value.coverImage = '';
  showPreviewModal.value = false; // 关闭预览模态框
  message.success('已删除封面图片');
};

/**
 * 显示封面图片预览模态框
 */
const showCoverPreview = () => {
  if (formData.value.coverImage) {
    showPreviewModal.value = true;
  }
};

/**
 * 隐藏封面图片预览模态框
 */
const hidePreviewModal = () => {
  showPreviewModal.value = false;
};

/**
 * 从预览模态框中触发封面图片上传
 */
const handleCoverImageUploadFromPreview = () => {
  hidePreviewModal();
  handleCoverImageUpload();
};

/**
 * 初始化Vditor编辑器
 */
const initVditor = () => {
  vditor.value = new Vditor(markdownRef.value as HTMLDivElement, {
    height: '100%',
    width: '100%',
    mode: 'ir',
    cdn: 'https://ld246.com/js/lib/vditor',
    value: post.value?.content || '',
    toolbar: [
      'emoji',
      'headings',
      'bold',
      'italic',
      'strike',
      'link',
      'list',
      'ordered-list',
      'check',
      'quote',
      'line',
      'code',
      'inline-code',
      'insert-before',
      'insert-after',
      'upload',
      'table',
      'undo',
      'redo',
      'fullscreen',
      'edit-mode',
      'both',
      'preview',
      'devtools',
      'info',
      'help',
    ],
    upload: {
      accept: 'image/*',
      multiple: false,
      fieldName: 'file',
      url: `${import.meta.env.VITE_APP_BASE_URL}/upload`,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      filename: (name: string) => {
        // 生成唯一文件名，避免重名冲突
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const ext = name.substring(name.lastIndexOf('.'));
        return `blog_${timestamp}_${randomStr}${ext}`;
      },
      // 添加额外的上传参数
      extraData: {
        fileType: 'image',
        target: 'local',
        folder: 'blog/images',
        maxSize: (5 * 1024 * 1024).toString(), // 5MB
        allowedMimeTypes: JSON.stringify([
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
        ]),
        allowedExtensions: JSON.stringify(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']),
      },
      /**
       * 图片上传格式化函数
       * @param files 上传的文件列表
       * @param responseText 服务器返回的响应文本
       * @returns 格式化后的响应文本，符合Vditor内置数据结构
       */
      format: (files: File[], responseText: string): string => {
        try {
          // 解析服务器返回的JSON数据
          const response = JSON.parse(responseText);
          // 检查返回格式是否符合预期（适配后端 UnifiedUploadResult 格式）
          if (response.code === 200 && response.data) {
            // 获取文件URL，优先使用OSS，其次使用本地
            let fileUrl = '';
            let fileName = files[0]?.name || 'image';

            if (response.data?.oss?.fileUrl) {
              fileUrl = response.data?.oss.fileUrl;
              fileName = response.data?.oss.originalName || fileName;
            } else if (response.data?.local?.fileUrl) {
              fileUrl = response.data?.local.fileUrl;
              fileName = response.data?.local.originalName || fileName;
            }
            if (fileUrl) {
              message.success('图片上传成功');
              // 返回Vditor期望的JSON格式
              return JSON.stringify({
                msg: '上传成功',
                code: 0,
                data: {
                  errFiles: [],
                  succMap: {
                    [fileName]: fileUrl,
                  },
                },
              });
            }
            message.error('上传成功但未获取到文件URL');
            return JSON.stringify({
              msg: '上传成功但未获取到文件URL',
              code: 1,
              data: {
                errFiles: [fileName],
                succMap: {},
              },
            });
          }
          const errorMsg = response.message || '图片上传失败';
          message.error(errorMsg);
          return JSON.stringify({
            msg: errorMsg,
            code: 1,
            data: {
              errFiles: files.map((f) => f.name),
              succMap: {},
            },
          });
        } catch (error) {
          console.error('解析上传响应失败:', error);
          const errorMsg = '图片上传响应格式错误';
          message.error(errorMsg);
          return JSON.stringify({
            msg: errorMsg,
            code: 1,
            data: {
              errFiles: files.map((f) => f.name),
              succMap: {},
            },
          });
        }
      },
      error: (msg: string) => {
        console.error('图片上传失败:', msg);
        message.error('图片上传失败，请重试');
      },
    },
    outline: {
      enable: false,
      position: 'right',
    },
    cache: {
      enable: editorSettings.value.autoSave,
      id: `vditor_cache_${postId}`,
    },
    counter: {
      enable: editorSettings.value.showLineNumbers,
      type: 'markdown',
    },
    preview: {
      mode: 'editor',
      hljs: {
        style: 'github',
        lineNumber: true,
      },
    },
    typewriterMode: true, // 开启打字机模式
    tab: '\t',
    after: () => {
      // console.log('Vditor 初始化完成');
      // console.log('编辑器设置已应用:', editorSettings.value);

      // 编辑器初始化完成，隐藏编辑器加载动画
      isEditorLoading.value = false;

      // 初始化大纲数据
      updateOutlineData();
      // 监听内容变化以更新大纲
      setupContentWatcher();

      // 初始化时同步标题（如果表单标题为空但Markdown中有一级标题）
      setTimeout(() => {
        if (!formData.value.title) {
          syncMarkdownTitleToForm();
        }
      }, 100);
    },
  });
};

/**
 * 更新大纲数据
 */
const updateOutlineData = () => {
  if (!vditor.value) return;

  try {
    // 获取编辑器内容
    const content = vditor.value.getValue();
    const headings: Array<{ id: string; text: string; level: number; lineIndex: number }> = [];

    // 解析标题
    const lines = content.split('\n');
    lines.forEach((line: string, lineIndex: number) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        // 移除markdown链接语法和其他格式化字符
        const cleanText = text
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接 [text](url)
          .replace(/\*\*([^*]+)\*\*/g, '$1') // 移除粗体 **text**
          .replace(/\*([^*]+)\*/g, '$1') // 移除斜体 *text*
          .replace(/`([^`]+)`/g, '$1') // 移除代码 `code`
          .replace(/~~([^~]+)~~/g, '$1') // 移除删除线 ~~text~~
          .trim();

        // 使用行号和级别组合作为稳定ID，同时保存文本用于匹配
        const id = `heading-${lineIndex}-level-${level}`;

        headings.push({ id, text: cleanText, level, lineIndex });
      }
    });

    outlineItems.value = headings;
    // 大纲数据更新完成，隐藏大纲加载动画
    isOutlineLoading.value = false;
    // console.log('大纲数据已更新:', headings);
  } catch (error) {
    // 更新大纲数据失败，即使出错也要隐藏加载动画
    isOutlineLoading.value = false;
  }
};

/**
 * 设置内容变化监听器
 */
const setupContentWatcher = () => {
  if (!vditor.value) return;

  // 监听编辑器内容变化
  let updateTimer: NodeJS.Timeout;
  let syncTimer: NodeJS.Timeout;
  let scrollTimer: NodeJS.Timeout;

  const handleContentChange = () => {
    // 防抖处理，避免频繁更新
    clearTimeout(updateTimer);
    updateTimer = setTimeout(() => {
      updateOutlineData();
    }, 500);

    // 同步标题到表单
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
      syncMarkdownTitleToForm();
    }, 800);
  };

  const handleScroll = () => {
    // 防抖处理滚动事件
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      updateActiveOutlineFromScroll();
    }, 100);
  };

  // 监听输入事件
  const editorElement = vditor.value.vditor?.element;
  if (editorElement) {
    editorElement.addEventListener('input', handleContentChange);
    editorElement.addEventListener('keyup', handleContentChange);
    editorElement.addEventListener('scroll', handleScroll);
  }
};

/**
 * 清理标题文本，移除Markdown格式化字符
 * @param text 原始标题文本
 * @returns 清理后的文本
 */
const cleanHeadingText = (text: string): string => {
  return text
    .replace(/^#+\s*/, '') // 移除#号
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接
    .replace(/\*\*([^*]+)\*\*/g, '$1') // 移除粗体
    .replace(/\*([^*]+)\*/g, '$1') // 移除斜体
    .replace(/`([^`]+)`/g, '$1') // 移除代码
    .replace(/~~([^~]+)~~/g, '$1') // 移除删除线
    .trim();
};

/**
 * 从Markdown内容中提取一级标题
 * @returns 一级标题文本，如果没有则返回空字符串
 */
const extractH1FromMarkdown = (): string => {
  if (!vditor.value) return '';

  try {
    const content = vditor.value.getValue();
    const lines = content.split('\n');

    for (const line of lines) {
      const match = line.match(/^#\s+(.+)$/);
      if (match) {
        return cleanHeadingText(match[1]);
      }
    }
  } catch (error) {
    // 提取一级标题失败
  }

  return '';
};

/**
 * 同步Markdown中的一级标题到表单标题字段
 */
const syncMarkdownTitleToForm = () => {
  const h1Title = extractH1FromMarkdown();

  // 只有当Markdown中有一级标题且与当前表单标题不同时才同步
  if (h1Title && h1Title !== formData.value.title) {
    formData.value.title = h1Title;
  }
};

/**
 * 更新Markdown中的一级标题
 * @param newTitle 新的标题文本
 */
const updateMarkdownH1 = (newTitle: string) => {
  if (!vditor.value || !newTitle.trim()) return;

  try {
    const content = vditor.value.getValue();
    const lines = content.split('\n');
    let hasH1 = false;

    // 查找并替换现有的一级标题
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^#\s+/)) {
        lines[i] = `# ${newTitle}`;
        hasH1 = true;
        break;
      }
    }

    // 如果没有一级标题，在开头添加
    if (!hasH1) {
      lines.unshift(`# ${newTitle}`, '');
    }

    const newContent = lines.join('\n');
    vditor.value.setValue(newContent);
  } catch (error) {
    // 更新Markdown标题失败
  }
};

/**
 * 根据滚动位置更新激活的大纲项
 */
const updateActiveOutlineFromScroll = () => {
  if (!vditor.value || outlineItems.value.length === 0) return;

  const vditorInstance = vditor.value.vditor;
  if (!vditorInstance) return;

  const { currentMode } = vditorInstance;
  let container: HTMLElement | null = null;

  // 根据模式获取容器
  switch (currentMode) {
    case 'wysiwyg':
      container = vditorInstance.wysiwyg?.element || null;
      break;
    case 'ir':
      container = vditorInstance.ir?.element || null;
      break;
    case 'sv':
      container = vditorInstance.preview?.element || null;
      break;
    default:
      break;
  }

  if (!container) return;

  // 获取容器的滚动信息
  const containerRect = container.getBoundingClientRect();
  const viewportCenter = containerRect.top + containerRect.height / 2;

  // 查找所有标题元素及其位置
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let closestHeading: { id: string; distance: number } | null = null;

  for (const heading of headings) {
    const headingText = cleanHeadingText(heading.textContent || '');
    const headingRect = heading.getBoundingClientRect();
    const headingCenter = headingRect.top + headingRect.height / 2;
    const distance = Math.abs(headingCenter - viewportCenter);

    // 只考虑在视口中或视口上方的标题
    if (headingRect.top <= viewportCenter) {
      if (!closestHeading || distance < closestHeading.distance) {
        closestHeading = { id: headingText, distance };
      }
    }
  }

  // 更新激活状态 - 通过文本内容找到对应的大纲项ID
  if (closestHeading) {
    const matchingOutlineItem = outlineItems.value.find((item) => item.text === closestHeading.id);
    if (matchingOutlineItem && matchingOutlineItem.id !== activeOutlineId.value) {
      activeOutlineId.value = matchingOutlineItem.id;
    }
  }
};

/**
 * 添加元素高亮效果
 * @param element 目标元素
 */
const addHighlightEffect = (element: HTMLElement): void => {
  const originalBackground = element.style.backgroundColor;
  const originalTransition = element.style.transition;

  element.style.backgroundColor = '#fff3cd';
  element.style.transition = 'background-color 0.3s ease';

  setTimeout(() => {
    element.style.backgroundColor = originalBackground;
    element.style.transition = originalTransition;
  }, 2000);
};

/**
 * 跳转到指定标题 - 全新实现
 * @param headingId 大纲项ID
 */
const scrollToHeading = (headingId: string) => {
  if (!vditor.value) {
    message.error('编辑器未初始化');
    return;
  }

  const vditorInstance = vditor.value.vditor;
  if (!vditorInstance) {
    message.error('编辑器实例未找到');
    return;
  }

  const { currentMode } = vditorInstance;

  // 首先通过ID找到对应的大纲项
  const targetOutlineItem = outlineItems.value.find((item) => item.id === headingId);
  if (!targetOutlineItem) {
    message.warning('未找到对应的标题');
    return;
  }

  const headingText = targetOutlineItem.text;

  // 策略1: 直接查找DOM中的标题元素（适用于所有模式）
  const findHeadingElement = (): HTMLElement | null => {
    let container: HTMLElement | null = null;

    // 根据模式获取容器
    switch (currentMode) {
      case 'wysiwyg':
        container = vditorInstance.wysiwyg?.element || null;
        break;
      case 'ir':
        container = vditorInstance.ir?.element || null;
        break;
      case 'sv':
        // SV模式下查找预览区域
        container = vditorInstance.preview?.element || null;
        break;
      default:
        break;
    }

    if (!container) return null;

    // 查找所有标题元素
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');

    for (const heading of headings) {
      const currentHeadingText = cleanHeadingText(heading.textContent || '');
      if (currentHeadingText === headingText) {
        return heading as HTMLElement;
      }
    }

    return null;
  };

  // 策略2: 对于SV模式，使用textarea定位
  const scrollInTextarea = (): boolean => {
    if (currentMode !== 'sv') return false;

    const svElement = vditorInstance.sv?.element;
    if (!svElement) return false;

    const textarea = svElement.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return false;

    const content = vditor.value.getValue();
    const lines = content.split('\n');

    // 查找目标行
    let targetLineIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('#')) {
        const cleanLine = cleanHeadingText(line);
        if (cleanLine === headingText) {
          targetLineIndex = i;
          break;
        }
      }
    }

    if (targetLineIndex === -1) return false;

    // 计算字符位置并跳转
    let charPosition = 0;
    for (let i = 0; i < targetLineIndex; i++) {
      charPosition += lines[i].length + 1; // +1 for newline
    }

    textarea.focus();
    textarea.setSelectionRange(charPosition, charPosition + lines[targetLineIndex].length);

    // 滚动到目标位置
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10) || 20;
    const scrollTop = targetLineIndex * lineHeight;
    textarea.scrollTop = Math.max(0, scrollTop - textarea.clientHeight / 2);

    return true;
  };

  // 执行跳转
  try {
    // 首先尝试查找DOM元素
    const targetElement = findHeadingElement();

    if (targetElement) {
      // 找到标题元素，直接滚动
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });

      addHighlightEffect(targetElement);
      // 设置激活状态
      activeOutlineId.value = headingId;
      // message.success(`已跳转到: ${headingText}`);
      return;
    }

    // 如果是SV模式且没找到DOM元素，尝试textarea定位
    if (scrollInTextarea()) {
      // 设置激活状态
      activeOutlineId.value = headingId;
      message.success(`已跳转到: ${headingText}`);
      return;
    }

    // 所有方法都失败
    message.warning(`未找到标题: ${headingText}`);
  } catch (error) {
    // 跳转失败
    message.error('跳转过程中发生错误，请重试');
  }
};

/**
 * 预览文章
 */
const handlePreview = () => {
  if (!vditor.value) {
    message.error('编辑器未初始化');
    return;
  }

  const content = vditor.value.getValue();
  if (!content.trim()) {
    message.error('文章内容为空');
    return;
  }

  // 这里可以实现预览功能，比如打开新窗口或模态框
  message.info('预览功能待实现');
};

// 保存文章
const handleSave = async () => {
  if (!vditor.value) {
    message.error('编辑器未初始化');
    return;
  }

  const content = vditor.value.getValue();
  if (!content.trim()) {
    message.error('文章内容不能为空');
    return;
  }

  if (!formData.value.title.trim()) {
    message.error('文章标题不能为空');
    return;
  }

  if (!formData.value.categoryId) {
    message.error('请选择分类！');
    return;
  }

  try {
    // 准备提交数据，将标签对象数组转换为标签ID数组
    const postData = {
      ...formData.value,
      content,
      tagIds: formData.value.tags.filter((tag: any) => !tag?.isAdd).map((tag) => tag.id), // 提取标签ID
      ...(isEdit.value ? { id: postId } : {}),
      addTags: formData.value.tags.filter((tag: any) => tag?.isAdd).map((tag) => tag.name),
    };

    // 移除tags字段，使用tagIds代替
    delete (postData as any).tags;
    if (isEdit.value) {
      // 更新文章
      await BlogApi.updatePost(postData as Blog.UpdatePostRequest);
      message.success('文章更新成功');
    } else {
      // 创建文章
      await BlogApi.createPost(postData as Blog.CreatePostRequest);
      message.success('文章创建成功');
    }
  } catch (error) {
    message.error('保存失败，请重试');
    // 保存失败
  }
};
</script>

<style lang="scss" scoped>
// 导入通用主题文件
@import '@/assets/styles/common-themes.scss';

.editor-layout {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background-image: var(--editor-bg-gradient);
  padding: 16px;
  gap: 16px;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 12px;
  min-width: 0;
  min-height: 0;
  .editor-main {
    flex: 1;
    height: 100%;
    background: white;
    border-radius: 12px;
    box-shadow: var(--editor-card-shadow);
    overflow: visible;
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    .vditor-container {
      height: 100%;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-width: 0;
      min-height: 0;

      :deep(.vditor) {
        border: none;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      :deep(.vditor-toolbar) {
        background: var(--toolbar-bg-gradient);
        border-bottom: 1px solid var(--toolbar-border);
        padding: 8px 24px;
        padding-left: 16px !important;
        flex-shrink: 0;
        border-radius: 12px 12px 0 0;
        box-shadow:
          0 4px 20px rgba(0, 0, 0, 0.08),
          0 2px 8px rgba(0, 0, 0, 0.04),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        position: relative;
        backdrop-filter: blur(8px);

        // 添加顶部装饰线
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(102, 126, 234, 0.6) 20%,
            rgba(118, 75, 162, 0.6) 80%,
            transparent 100%
          );
          border-radius: 12px 12px 0 0;
        }

        // 添加底部光晕效果
        &::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 1px;
          background: var(--toolbar-divider-bg);
          filter: blur(1px);
        }
      }

      :deep(.vditor-content) {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
      }

      :deep(.vditor-counter) {
        text-align: center;
      }

      :deep(.vditor-toolbar .vditor-tooltipped) {
        margin: 0 4px;
        border-radius: 10px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        border: 1px solid transparent;
        // width: 32px;
        padding: 2px 3px;
        box-sizing: content-box;
        // overflow: hidden;

        &::before {
          // content: '';
          // position: absolute;
          // top: 0;
          // left: -100%;
          // width: 100%;
          // height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.6s ease;
          // z-index: 1;
        }

        // 添加背景光晕
        &::after {
          // content: '';
          // position: absolute;
          // top: 50%;
          // left: 50%;
          // width: 0;
          // height: 0;
          // background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%);
          // border-radius: 50%;
          // transform: translate(-50%, -50%);
          // transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          // opacity: 0;
          // z-index: 0;
        }

        &:hover {
          background: var(--toolbar-btn-hover-bg);
          color: var(--toolbar-btn-hover-color);
          transform: translateY(-2px) scale(1.02); // 减少悬浮高度和缩放
          box-shadow: var(--toolbar-btn-hover-shadow);
          border-color: var(--toolbar-btn-hover-border);

          // &::before {
          //   left: 100%;
          // }

          // &::after {
          //   width: 80px; // 减少光晕大小
          //   height: 80px;
          //   opacity: 0.6; // 降低透明度
          // }
        }

        &:active {
          transform: translateY(-1px) scale(1.01);
          transition-duration: 0.1s;
        }
      }

      // :deep(.vditor-toolbar .vditor-tooltipped svg) {
      //   transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      //   transform-origin: center;
      //   position: relative;
      //   z-index: 2;
      // }

      // :deep(.vditor-toolbar .vditor-tooltipped:hover svg) {
      //   filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))
      //     drop-shadow(0 1px 2px rgba(255, 255, 255, 0.2));
      //   transform: scale(1.05) rotate(2deg);
      // }

      // :deep(.vditor-toolbar .vditor-tooltipped:active svg) {
      //   transform: scale(0.95) rotate(-2deg);
      //   filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3)) brightness(1.2);
      // }

      // 优化代码块内的代码文本
      :deep(.vditor-ir pre code),
      :deep(.vditor-wysiwyg pre code) {
        background: transparent !important;
        padding: 0 !important;
        border: none !important;
        font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
        line-height: 1.6;
        color: #374151;
      }
      :deep(.vditor-counter) {
        height: 36px;
        line-height: 36px;
        padding: 0 10px;
      }
      // 工具栏分组样式
      :deep(.vditor-toolbar .vditor-toolbar__item--current) {
        background: var(--toolbar-current-bg) !important;
        color: var(--toolbar-current-color) !important;
        box-shadow: var(--toolbar-current-shadow) !important;
        border: 1px solid var(--toolbar-current-border) !important;
        transform: translateY(-1px) scale(1.02);
        animation: toolbarCurrentPulse 3s ease-in-out infinite;

        &::before {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent
          ) !important;
        }

        svg {
          filter: var(--toolbar-icon-glow-normal) !important;
          animation: toolbarCurrentIconGlow 2s ease-in-out infinite !important;
        }
      }

      // 工具栏分隔符美化
      :deep(.vditor-toolbar .vditor-toolbar__divider) {
        background: var(--toolbar-divider-bg);
        width: 2px;
        margin: 0 12px;
        opacity: var(--toolbar-divider-opacity);
        border-radius: 1px;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 100%;
          background: var(--toolbar-divider-glow);
          border-radius: 2px;
          filter: blur(1px);
        }
      }
    }
  }

  .editor-sidebar {
    width: 360px;
    min-width: 360px;
    max-width: 360px;
    height: 100%;
    background: var(--sidebar-bg);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    box-shadow: var(--sidebar-shadow);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-shrink: 0;
  }
  .sidebar-tabs {
    display: flex;
    background: #f8fafc;
    border-radius: 12px 12px 0 0;
    padding: 6px;
    gap: 4px;
    .tab-button {
      flex: 1;
      padding: 12px 16px;
      background: transparent;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #64748b;
      font-weight: 500;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      transform-origin: center;
      overflow: hidden;

      // 添加涟漪效果背景
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(148, 163, 184, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
        z-index: -1;
      }

      &.active {
        background: white;
        color: #667eea;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
        font-weight: 600;
        animation: toolbarTabActiveSlide 0.8s cubic-bezier(0.4, 0, 0.2, 1);

        &::before {
          width: 120px;
          height: 120px;
          opacity: 0.8;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
        }

        &::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 3px;
          background: var(--toolbar-decoration);
          border-radius: 2px;
          animation: slideInScale 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        svg {
          transform: scale(1.1) rotate(5deg);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          animation: iconPulse 2s ease-in-out infinite;
        }

        // 文字闪烁效果
        span {
          text-shadow: 0 0 8px rgba(102, 126, 234, 0.3);
          position: relative;

          &::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 50%;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #667eea, transparent);
            border-radius: 1px;
            transform: translateX(-50%);
            opacity: 1;
            animation: sidebarShimmer 2s ease-in-out infinite;
          }
        }
      }

      &:hover:not(.active) {
        background: #e2e8f0;
        color: #475569;
        transform: translateY(-2px) translateX(2px) scale(1.02);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        &::before {
          width: 100px;
          height: 100px;
          opacity: 1;
        }

        svg {
          transform: scale(1.1) rotate(3deg) translateX(1px);
          animation: toolbarIconWiggle 0.8s ease-in-out infinite;
        }

        // 悬停时的文字效果
        span {
          position: relative;

          &::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            width: 0;
            height: 1px;
            background: #475569;
            border-radius: 1px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateX(-50%);
          }
        }

        span::after {
          width: 80%;
        }
      }

      &:active {
        transform: scale(0.98) translateX(-1px);
        transition-duration: 0.1s;
        animation: toolbarTabClickSlide 0.2s ease-out;

        &::before {
          width: 80px;
          height: 80px;
          opacity: 1;
          transition-duration: 0.1s;
        }
      }

      svg {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      &:hover svg {
        transform: scale(1.1);
      }

      // 文字基础样式
      span {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
      }
    }
  }
  .sidebar-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: white;
    position: relative;

    // Tab切换动画
    .tab-slide-enter-active,
    .tab-slide-leave-active {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .tab-slide-enter-from {
      opacity: 0;
      transform: translateX(20px) scale(0.95);
    }

    .tab-slide-leave-to {
      opacity: 0;
      transform: translateX(-20px) scale(0.95);
    }

    .tab-slide-enter-to,
    .tab-slide-leave-from {
      opacity: 1;
      transform: translateX(0) scale(1);
    }

    .outline-panel {
      display: flex;
      flex-direction: column;
      height: 100%;

      .outline-header {
        padding: 16px 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);

        .outline-stats {
          display: flex;
          gap: 16px;

          .stat-item {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 20px;
            border: 1px solid rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;

            &:hover {
              background: rgba(255, 255, 255, 0.95);
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .stat-icon {
              color: #6366f1;
              opacity: 0.8;
            }

            .stat-label {
              font-size: 12px;
              font-weight: 500;
              color: #64748b;
            }
          }
        }
      }

      .outline-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .outline-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 40px 20px;
        text-align: center;

        .empty-illustration {
          position: relative;
          margin-bottom: 24px;

          .empty-icon {
            color: #cbd5e1;
            opacity: 0.6;
            transition: all 0.3s ease;
          }

          .empty-sparkles {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;

            .sparkle {
              position: absolute;
              width: 4px;
              height: 4px;
              background: linear-gradient(45deg, #fbbf24, #f59e0b);
              border-radius: 50%;
              animation: sparkle 2s infinite;

              &.sparkle-1 {
                top: 10%;
                left: 20%;
                animation-delay: 0s;
              }

              &.sparkle-2 {
                top: 30%;
                right: 15%;
                animation-delay: 0.7s;
              }

              &.sparkle-3 {
                bottom: 20%;
                left: 30%;
                animation-delay: 1.4s;
              }
            }
          }
        }

        .empty-content {
          .empty-text {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #64748b;
          }

          .empty-hint {
            font-size: 14px;
            color: #94a3b8;
            margin-bottom: 24px;
            line-height: 1.5;
          }

          .empty-tips {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .tip-item {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 8px 16px;
              background: rgba(99, 102, 241, 0.05);
              border: 1px solid rgba(99, 102, 241, 0.1);
              border-radius: 8px;
              transition: all 0.3s ease;

              &:hover {
                background: rgba(99, 102, 241, 0.1);
                transform: translateY(-1px);
              }

              .tip-key {
                font-family: 'JetBrains Mono', 'Fira Code', monospace;
                font-weight: 600;
                color: #6366f1;
                background: rgba(99, 102, 241, 0.1);
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 12px;
              }

              .tip-desc {
                font-size: 12px;
                color: #64748b;
                font-weight: 500;
              }
            }
          }
        }
      }

      .outline-list {
        flex: 1;
        overflow-y: auto;
        padding: 12px 0;

        .outline-item {
          position: relative;
          cursor: pointer;
          margin-bottom: 2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

          &:hover {
            .outline-item-content {
              background: linear-gradient(
                135deg,
                rgba(99, 102, 241, 0.08) 0%,
                rgba(139, 92, 246, 0.05) 100%
              );
              transform: translateX(4px);
              box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);

              .outline-marker {
                .marker-pulse {
                  opacity: 1;
                  transform: scale(1.5);
                }
              }

              .outline-level-indicator {
                opacity: 1;
                transform: translateX(0);
              }
            }
          }

          &.is-active {
            .outline-item-content {
              background: linear-gradient(
                135deg,
                rgba(99, 102, 241, 0.15) 0%,
                rgba(139, 92, 246, 0.1) 100%
              );
              border-left: 3px solid #6366f1;

              .outline-marker {
                .marker-dot {
                  transform: scale(1.2);
                }

                .marker-pulse {
                  opacity: 1;
                  animation: pulse 2s infinite;
                }
              }

              .outline-text {
                color: #6366f1;
                font-weight: 600;
              }
            }
          }

          .outline-item-content {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            border-radius: 8px;
            margin: 0 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;

            .outline-marker {
              position: relative;
              width: 12px;
              height: 12px;
              flex-shrink: 0;

              .marker-dot {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                transition: all 0.3s ease;
                position: relative;
                z-index: 2;
              }

              .marker-pulse {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 1;
              }

              &.marker-level-1 {
                .marker-dot {
                  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
                }
                .marker-pulse {
                  background: rgba(59, 130, 246, 0.3);
                }
              }

              &.marker-level-2 {
                .marker-dot {
                  background: linear-gradient(135deg, #10b981, #059669);
                  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
                }
                .marker-pulse {
                  background: rgba(16, 185, 129, 0.3);
                }
              }

              &.marker-level-3 {
                .marker-dot {
                  background: linear-gradient(135deg, #f59e0b, #d97706);
                  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
                }
                .marker-pulse {
                  background: rgba(245, 158, 11, 0.3);
                }
              }

              &.marker-level-4 {
                .marker-dot {
                  background: linear-gradient(135deg, #ef4444, #dc2626);
                  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
                }
                .marker-pulse {
                  background: rgba(239, 68, 68, 0.3);
                }
              }

              &.marker-level-5 {
                .marker-dot {
                  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
                }
                .marker-pulse {
                  background: rgba(139, 92, 246, 0.3);
                }
              }

              &.marker-level-6 {
                .marker-dot {
                  background: linear-gradient(135deg, #ec4899, #db2777);
                  box-shadow: 0 2px 4px rgba(236, 72, 153, 0.3);
                }
                .marker-pulse {
                  background: rgba(236, 72, 153, 0.3);
                }
              }
            }

            .outline-text-wrapper {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: space-between;

              .outline-text {
                font-size: 14px;
                color: #374151;
                font-weight: 500;
                line-height: 1.4;
                transition: all 0.3s ease;
                word-wrap: break-word;
                word-break: break-word;
                white-space: normal;
              }

              .outline-level-indicator {
                font-size: 10px;
                font-weight: 600;
                color: #94a3b8;
                background: rgba(148, 163, 184, 0.1);
                padding: 2px 6px;
                border-radius: 10px;
                opacity: 0;
                transform: translateX(8px);
                transition: all 0.3s ease;
                font-family: 'JetBrains Mono', 'Fira Code', monospace;
              }
            }
          }

          .outline-connector {
            position: absolute;
            left: 22px;
            top: 100%;
            width: 1px;
            height: 8px;
            background: linear-gradient(to bottom, rgba(203, 213, 225, 0.5), transparent);
            z-index: 0;
          }

          &.level-1 {
            .outline-text {
              font-weight: 600;
              font-size: 15px;
              color: #1f2937;
            }
          }

          &.level-2 {
            .outline-text {
              font-weight: 500;
              font-size: 14px;
            }
          }

          &.level-3,
          &.level-4,
          &.level-5,
          &.level-6 {
            .outline-text {
              font-weight: 400;
              font-size: 13px;
              color: #6b7280;
            }
          }
        }
      }
    }

    // 大纲项目渐进式出现动画
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    // 闪烁动画
    @keyframes sparkle {
      0%,
      100% {
        opacity: 0;
        transform: scale(0);
      }
      50% {
        opacity: 1;
        transform: scale(1);
      }
    }

    // 脉冲动画
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 0.7;
      }
      50% {
        transform: scale(1.3);
        opacity: 0.3;
      }
      100% {
        transform: scale(1);
        opacity: 0.7;
      }
    }

    // 大纲标记从右滑入动画
    @keyframes markerSlideIn {
      0% {
        opacity: 0;
        transform: translateX(40px) scale(0.5);
        box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
      }
      30% {
        opacity: 0.6;
        transform: translateX(10px) scale(0.8);
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
      }
      70% {
        opacity: 0.9;
        transform: translateX(-2px) scale(1.1);
        box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.1);
      }
      100% {
        opacity: 1;
        transform: translateX(0) scale(1);
        box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
      }
    }

    // 文本流水式进入动画
    @keyframes textFlowIn {
      0% {
        opacity: 0;
        transform: translateX(60px) scale(0.95);
        filter: blur(2px);
        letter-spacing: 2px;
      }
      40% {
        opacity: 0.7;
        transform: translateX(8px) scale(1.02);
        filter: blur(0.5px);
        letter-spacing: 0.5px;
      }
      80% {
        opacity: 0.95;
        transform: translateX(-1px) scale(1.01);
        filter: blur(0px);
        letter-spacing: 0.1px;
      }
      100% {
        opacity: 1;
        transform: translateX(0) scale(1);
        filter: blur(0px);
        letter-spacing: 0px;
      }
    }

    // 级别指示器淡入动画
    @keyframes indicatorFadeIn {
      0% {
        opacity: 0;
        transform: translateX(20px) scale(0.8);
        background: rgba(99, 102, 241, 0);
      }
      50% {
        opacity: 0.5;
        transform: translateX(5px) scale(0.95);
        background: rgba(99, 102, 241, 0.05);
      }
      100% {
        opacity: 1;
        transform: translateX(0) scale(1);
        background: rgba(99, 102, 241, 0.1);
      }
    }

    .settings-panel {
      flex: 1;
      overflow-y: auto;
      padding-bottom: 100px; /* 为固定按钮留出空间 */
      position: relative;

      // 设置面板项目动画
      .setting-group {
        margin-bottom: 32px;
        opacity: 0;
        animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;

        &:nth-child(1) {
          animation-delay: 0.1s;
        }
        &:nth-child(2) {
          animation-delay: 0.2s;
        }
        &:nth-child(3) {
          animation-delay: 0.3s;
        }

        .setting-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #374151;
          position: relative;
          padding-bottom: 8px;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 30px;
            height: 2px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 1px;
          }
        }

        // 主题选择器样式已移至通用主题文件
      }

      .setting-item {
        margin-bottom: 20px;
        position: relative;

        &:last-child {
          margin-bottom: 0;
        }

        .setting-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 10px;
          position: relative;
          transition: color 0.2s ease;

          &::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 1px;
            transition: width 0.3s ease;
          }
        }

        // 聚焦时标签动画效果
        &:focus-within {
          .setting-label {
            color: #667eea;

            &::after {
              width: 30px;
            }
          }
        }

        // 为开关类型的设置项保留原有样式
        &.switch-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 10px;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 0;
          border-radius: 8px;
          transition: all 0.2s ease;

          &:hover {
            background: rgba(102, 126, 234, 0.02);
          }

          &:last-child {
            border-bottom: none;
          }

          .setting-label {
            display: inline;
            margin-bottom: 0;
            font-size: 14px;

            &::after {
              display: none;
            }
          }
        }
      }
    }
  }
}

// 自定义滚动条样式
:deep(.vditor-content) {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;

  // 滚动条样式
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--scrollbar-track-bg);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb-bg);
    border-radius: 4px;

    &:hover {
      background: var(--scrollbar-thumb-hover-bg);
    }

    &:active {
      background: var(--scrollbar-thumb-active-bg);
    }
  }

  // Markdown标签样式优化
  // 标题样式
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 700;
    line-height: 1.3;
    margin: 1.5em 0 0.8em 0;
    color: #1f2937;
    position: relative;
    transition: all 0.3s ease;

    &:hover {
      color: #667eea;
      transform: translateX(4px);
    }
  }

  h1 {
    font-size: 2.2em;
    border-bottom: 3px solid #e5e7eb;
    padding-bottom: 0.5em;

    &::before {
      content: '';
      position: absolute;
      left: -20px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 60%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 3px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover::before {
      opacity: 1;
    }
  }

  h2 {
    font-size: 1.8em;
    border-bottom: 2px solid #f3f4f6;
    padding-bottom: 0.3em;

    &::before {
      content: '';
      position: absolute;
      left: -16px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 50%;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 2px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover::before {
      opacity: 1;
    }
  }

  h3 {
    font-size: 1.5em;

    &::before {
      content: '▶';
      position: absolute;
      left: -20px;
      color: #f59e0b;
      font-size: 0.7em;
      opacity: 0;
      transition: all 0.3s ease;
    }

    &:hover::before {
      opacity: 1;
      transform: translateX(2px);
    }
  }

  h4 {
    font-size: 1.3em;
    color: #374151;

    &::before {
      content: '●';
      position: absolute;
      left: -16px;
      color: #8b5cf6;
      font-size: 0.6em;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover::before {
      opacity: 1;
    }
  }

  h5,
  h6 {
    font-size: 1.1em;
    color: #4b5563;
    font-weight: 600;
  }

  // 段落样式
  p {
    line-height: 1.7;
    margin: 1em 0;
    color: #374151;
    text-align: justify;
    transition: color 0.3s ease;

    &:first-of-type {
      font-size: 1.05em;
      color: #1f2937;
    }

    &:hover {
      color: #1f2937;
    }
  }

  // 链接样式
  a {
    color: #667eea;
    text-decoration: none;
    position: relative;
    font-weight: 500;
    transition: all 0.3s ease;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }

    &:hover {
      color: #764ba2;
      transform: translateY(-1px);

      &::after {
        width: 100%;
      }
    }
  }

  // 强调文本样式
  strong {
    font-weight: 700;
    color: #1f2937;
    background: linear-gradient(120deg, rgba(255, 235, 59, 0.3) 0%, rgba(255, 193, 7, 0.2) 100%);
    padding: 2px 4px;
    border-radius: 3px;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(120deg, rgba(255, 235, 59, 0.4) 0%, rgba(255, 193, 7, 0.3) 100%);
      transform: scale(1.02);
    }
  }

  em {
    font-style: italic;
    color: #7c3aed;
    position: relative;

    &::before {
      content: '"';
      color: #a78bfa;
      font-size: 1.2em;
    }

    &::after {
      content: '"';
      color: #a78bfa;
      font-size: 1.2em;
    }
  }

  // 代码样式 - 仅应用于非代码块内的行内代码
  code:not(pre code) {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    color: #7c3aed;
    padding: 3px 6px;
    border-radius: 4px;
    font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
    font-size: 0.9em;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
      transform: scale(1.02);
      box-shadow: 0 2px 4px rgba(124, 58, 237, 0.1);
    }
  }

  // Markdown 内容样式已移至独立文件 markdown-themes.scss
  // 这里保留编辑器特有的样式
}

// 动画效果
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInScale {
  0% {
    width: 0;
    opacity: 0;
    transform: translateX(-50%) scaleX(0);
  }
  50% {
    opacity: 1;
  }
  100% {
    width: 50px;
    opacity: 1;
    transform: translateX(-50%) scaleX(1);
  }
}

@keyframes iconPulse {
  0%,
  100% {
    transform: scale(1.1) rotate(5deg);
  }
  50% {
    transform: scale(1.2) rotate(8deg);
  }
}

@keyframes sidebarShimmer {
  0% {
    background-position: -100% 0;
  }
  50% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

@keyframes sidebarIconPulse {
  0%,
  100% {
    transform: scale(1.15) rotate(8deg);
  }
  50% {
    transform: scale(1.25) rotate(12deg);
  }
}

@keyframes toolbarTabHoverSlide {
  0% {
    transform: translateY(-2px) translateX(0) scale(1.02);
  }
  25% {
    transform: translateY(-2px) translateX(3px) scale(1.02);
  }
  75% {
    transform: translateY(-2px) translateX(1px) scale(1.02);
  }
  100% {
    transform: translateY(-2px) translateX(2px) scale(1.02);
  }
}

@keyframes toolbarTabActiveSlide {
  0% {
    transform: translateY(-1px) translateX(-10px) scale(0.9);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-1px) translateX(5px) scale(1.05);
  }
  100% {
    transform: translateY(-1px) translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes toolbarTabClickSlide {
  0% {
    transform: scale(0.98) translateX(0);
  }
  50% {
    transform: scale(0.95) translateX(-2px);
  }
  100% {
    transform: scale(0.98) translateX(-1px);
  }
}

@keyframes toolbarIconWiggle {
  0%,
  100% {
    transform: scale(1.1) rotate(3deg) translateX(1px);
  }
  25% {
    transform: scale(1.1) rotate(5deg) translateX(2px);
  }
  75% {
    transform: scale(1.1) rotate(1deg) translateX(0px);
  }
}

@keyframes toolbarIconSlideActive {
  0% {
    transform: scale(1.1) rotate(5deg) translateX(-5px);
  }
  50% {
    transform: scale(1.15) rotate(8deg) translateX(3px);
  }
  100% {
    transform: scale(1.1) rotate(5deg) translateX(0);
  }
}

@keyframes sidebarTabHoverSlide {
  0% {
    transform: translateY(-1px) translateX(0) scale(1.02);
  }
  25% {
    transform: translateY(-1px) translateX(4px) scale(1.02);
  }
  75% {
    transform: translateY(-1px) translateX(2px) scale(1.02);
  }
  100% {
    transform: translateY(-1px) translateX(3px) scale(1.02);
  }
}

@keyframes sidebarTabActiveSlide {
  0% {
    transform: translateY(-1px) translateX(-12px) scale(0.9);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-1px) translateX(6px) scale(1.05);
  }
  100% {
    transform: translateY(-1px) translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes sidebarTabClickSlide {
  0% {
    transform: scale(0.98) translateX(0);
  }
  50% {
    transform: scale(0.95) translateX(-3px);
  }
  100% {
    transform: scale(0.98) translateX(-2px);
  }
}

@keyframes sidebarIconWiggle {
  0%,
  100% {
    transform: scale(1.1) rotate(3deg) translateX(2px);
  }
  25% {
    transform: scale(1.1) rotate(5deg) translateX(3px);
  }
  75% {
    transform: scale(1.1) rotate(1deg) translateX(1px);
  }
}

@keyframes sidebarIconSlideActive {
  0% {
    transform: scale(1.1) rotate(5deg) translateX(-6px);
  }
  50% {
    transform: scale(1.15) rotate(8deg) translateX(4px);
  }
  100% {
    transform: scale(1.1) rotate(5deg) translateX(0);
  }
}

// 工具栏图标浮动动画
@keyframes toolbarIconFloat {
  0%,
  100% {
    transform: scale(1.1) rotate(5deg) translateY(0);
  }
  50% {
    transform: scale(1.15) rotate(8deg) translateY(-2px);
  }
}

// 工具栏当前项脉动动画
@keyframes toolbarCurrentPulse {
  0%,
  100% {
    box-shadow: var(--toolbar-pulse-shadow-normal);
  }
  50% {
    box-shadow: var(--toolbar-pulse-shadow-active);
  }
}

// 工具栏当前项图标发光动画
@keyframes toolbarCurrentIconGlow {
  0%,
  100% {
    filter: var(--toolbar-icon-glow-normal);
  }
  50% {
    filter: var(--toolbar-icon-glow-active);
  }
}

@keyframes shimmer {
  0% {
    background-position: -100px 0;
  }
  100% {
    background-position: 100px 0;
  }
}

.editor-layout {
  animation: slideIn 0.5s ease-out;
}

/* 标签选择器样式 */
.tag-selector {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
  background: var(--bg-color-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.tag-selector:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 已选择的标签 */
.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: var(--primary-color);
  color: white;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  animation: tagSlideIn 0.3s ease-out;
  transition: all 0.2s ease;
}

.selected-tag:hover {
  background: var(--primary-color-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.selected-tag .tag-text {
  line-height: 1;
}

.selected-tag .tag-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.selected-tag .tag-remove:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* 可选标签区域 */
.available-tags {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tags-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-color-secondary);
  font-weight: 500;
}

.tags-title {
  color: var(--text-color);
}

.tags-count {
  color: var(--text-color-tertiary);
  font-size: 11px;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-height: 120px;
  overflow-y: auto;
  padding: 4px 0;
}

.tag-option {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.tag-option::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: var(--tag-color, #666);
  transition: width 0.2s ease;
}

.tag-option:hover {
  border-color: var(--tag-color, #666);
  background: var(--bg-color-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tag-option:hover::before {
  width: 100%;
  opacity: 0.1;
}

.tag-option.selected {
  background: var(--tag-color, #666);
  color: white;
  border-color: var(--tag-color, #666);
}

.tag-option.selected::before {
  width: 100%;
  opacity: 0.2;
}

.tag-option .tag-name {
  font-weight: 500;
  line-height: 1;
}

.tag-option .tag-use-count {
  font-size: 10px;
  opacity: 0.7;
  background: rgba(0, 0, 0, 0.1);
  padding: 1px 4px;
  border-radius: 6px;
  min-width: 16px;
  text-align: center;
}

.tag-option.selected .tag-use-count {
  background: rgba(255, 255, 255, 0.2);
}

/* 自定义标签输入 */
.custom-tag-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.input-wrapper .n-input {
  flex: 1;
}

.add-tag-btn {
  padding: 6px 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.add-tag-btn:hover:not(:disabled) {
  background: var(--primary-color-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.add-tag-btn:disabled {
  background: var(--bg-color-disabled);
  color: var(--text-color-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

.input-hint {
  font-size: 11px;
  color: var(--text-color-tertiary);
  line-height: 1.4;
  padding-left: 4px;
}

/* 标签动画 */
@keyframes tagSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-10px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes tagPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.tag-option:active {
  animation: tagPulse 0.2s ease;
}

/* 滚动条样式 */
.tags-cloud::-webkit-scrollbar {
  width: 4px;
}

.tags-cloud::-webkit-scrollbar-track {
  background: var(--scrollbar-track-bg);
  border-radius: 2px;
}

.tags-cloud::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb-bg);
  border-radius: 2px;
}

.tags-cloud::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover-bg);
}

.tags-cloud::-webkit-scrollbar-thumb:active {
  background: var(--scrollbar-thumb-active-bg);
}

/* 固定操作按钮样式 */
.fixed-actions {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  max-width: calc(100vw - 40px);
  padding: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 50px;
  display: flex;
  gap: 4px;
  z-index: 1000;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 20px;
  border: none;
  border-radius: 46px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  min-width: 100px;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.action-btn.primary:hover {
  transform: translateY(-1px) scale(1.05);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.action-btn.secondary {
  background: rgba(248, 250, 252, 0.8);
  color: #374151;
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.action-btn.secondary:hover {
  background: rgba(226, 232, 240, 0.9);
  border-color: rgba(148, 163, 184, 0.8);
  transform: translateY(-1px) scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-btn:active {
  transform: translateY(0) scale(0.98);
  transition-duration: 0.1s;
}

.action-btn svg {
  transition: transform 0.2s ease;
}

.action-btn:hover svg {
  transform: scale(1.1) rotate(2deg);
}

/* 加载动画样式 - 融入主题设计 */
.editor-loading-overlay,
.outline-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--sidebar-bg, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.outline-loading-overlay {
  background: var(--sidebar-bg, rgba(255, 255, 255, 0.9));
  backdrop-filter: blur(8px);
  border: 1px solid var(--toolbar-border, rgba(226, 232, 240, 0.8));
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px;
  background: var(--sidebar-bg, rgba(255, 255, 255, 0.9));
  border-radius: 20px;
  box-shadow: var(--editor-card-shadow, 0 8px 32px rgba(0, 0, 0, 0.1));
  border: 1px solid var(--toolbar-border, rgba(226, 232, 240, 0.8));
  backdrop-filter: blur(16px);
  position: relative;
  overflow: hidden;
}

.loading-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--toolbar-decoration, linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%));
  border-radius: 20px 20px 0 0;
}

.loading-container.small {
  gap: 16px;
  padding: 24px;
  border-radius: 16px;
}

.loading-container.small::before {
  height: 2px;
  border-radius: 16px 16px 0 0;
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.loading-spinner.small {
  width: 40px;
  height: 40px;
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: spin 2s linear infinite;
  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.1));
}

.spinner-ring:nth-child(1) {
  border-top-color: var(--outline-marker-1, #667eea);
  border-right-color: var(--outline-marker-1, #667eea);
  animation-delay: 0s;
  opacity: 1;
}

.spinner-ring:nth-child(2) {
  border-top-color: var(--outline-marker-2, #10b981);
  border-right-color: var(--outline-marker-2, #10b981);
  animation-delay: -0.4s;
  transform: scale(0.8);
  opacity: 0.8;
}

.spinner-ring:nth-child(3) {
  border-top-color: var(--outline-marker-3, #f59e0b);
  border-right-color: var(--outline-marker-3, #f59e0b);
  animation-delay: -0.8s;
  transform: scale(0.6);
  opacity: 0.6;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  text-align: center;
  color: var(--text-color, #374151);
  position: relative;
}

.loading-text h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-color, #1f2937);
  background: var(--toolbar-decoration, linear-gradient(90deg, #667eea, #764ba2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}

.loading-text h4 {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color, #1f2937);
  background: var(--toolbar-decoration, linear-gradient(90deg, #667eea, #764ba2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.3px;
}

.loading-text p {
  margin: 0;
  font-size: 14px;
  color: var(--text-color-secondary, #6b7280);
  opacity: 0.8;
  font-weight: 500;
  line-height: 1.5;
}

/* 加载动画过渡效果 */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.loading-fade-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
  filter: blur(4px);
}

.loading-fade-leave-to {
  opacity: 0;
  transform: scale(1.1) translateY(-10px);
  filter: blur(2px);
}

/* 加载容器呼吸动画 */
@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
    box-shadow: var(--editor-card-shadow, 0 8px 32px rgba(0, 0, 0, 0.1));
  }
  50% {
    transform: scale(1.02);
    box-shadow: var(--editor-card-shadow, 0 12px 40px rgba(0, 0, 0, 0.15));
  }
}

.loading-container {
  animation: breathe 3s ease-in-out infinite;
}

/* 文本闪烁动画 */
@keyframes textGlow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.loading-text p {
  animation: textGlow 2s ease-in-out infinite;
}

/* 装饰条流光动画 */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.loading-container::before {
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
}

/* 深色主题适配 */
.theme-dark .editor-loading-overlay,
.theme-dark .outline-loading-overlay {
  background: var(--sidebar-bg, rgba(17, 24, 39, 0.95));
}

.theme-dark .outline-loading-overlay {
  background: var(--sidebar-bg, rgba(17, 24, 39, 0.9));
  border-color: var(--toolbar-border, rgba(75, 85, 99, 0.8));
}

.theme-dark .loading-container {
  background: var(--sidebar-bg, rgba(31, 41, 55, 0.9));
  border-color: var(--toolbar-border, rgba(75, 85, 99, 0.8));
}

.theme-dark .loading-text h3,
.theme-dark .loading-text h4 {
  background: var(--toolbar-decoration, linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #f59e0b));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.theme-dark .loading-text p {
  color: #d1d5db;
}

.theme-dark .spinner-ring {
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.1));
}

/* 封面图片上传组件样式 */
.cover-image-upload {
  margin-top: 8px;
}

.cover-preview {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: var(--sidebar-bg, #f9fafb);
  border: 2px solid var(--toolbar-border, #e5e7eb);
  transition: all 0.3s ease;
}

.cover-preview:hover {
  border-color: var(--primary-color, #667eea);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.cover-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.cover-preview:hover .cover-image {
  transform: scale(1.02);
}

.cover-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cover-preview:hover .cover-actions {
  opacity: 1;
}

.cover-action-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-color, #374151);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cover-action-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cover-action-btn.delete {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.cover-action-btn.delete:hover {
  background: rgba(239, 68, 68, 1);
}

.cover-upload-area {
  border: 2px dashed var(--toolbar-border, #d1d5db);
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--sidebar-bg, #f9fafb);
  position: relative;
  overflow: hidden;
}

.cover-upload-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.5s ease;
}

.cover-upload-area:hover {
  border-color: var(--primary-color, #667eea);
  background: var(--primary-bg, rgba(102, 126, 234, 0.05));
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.cover-upload-area:hover::before {
  left: 100%;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  color: var(--text-color-secondary, #9ca3af);
  transition: all 0.3s ease;
}

.cover-upload-area:hover .upload-icon {
  color: var(--primary-color, #667eea);
  transform: scale(1.1);
}

.upload-text {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color, #374151);
  transition: color 0.3s ease;
}

.cover-upload-area:hover .upload-text {
  color: var(--primary-color, #667eea);
}

.upload-hint {
  margin: 0;
  font-size: 12px;
  color: var(--text-color-secondary, #9ca3af);
  line-height: 1.4;
}

.upload-progress {
  margin-top: 12px;
  padding: 16px;
  background: var(--sidebar-bg, #f9fafb);
  border: 1px solid var(--toolbar-border, #e5e7eb);
  border-radius: 8px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--toolbar-border, #e5e7eb);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--primary-color, #667eea),
    var(--secondary-color, #764ba2)
  );
  border-radius: 3px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: progressShimmer 1.5s ease-in-out infinite;
}

@keyframes progressShimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-text {
  margin: 0;
  font-size: 12px;
  color: var(--text-color-secondary, #6b7280);
  text-align: center;
  font-weight: 500;
}

/* 深色主题适配 */
.theme-dark .cover-preview {
  background: var(--sidebar-bg, #1f2937);
  border-color: var(--toolbar-border, #374151);
}

.theme-dark .cover-upload-area {
  background: var(--sidebar-bg, #1f2937);
  border-color: var(--toolbar-border, #374151);
}

.theme-dark .cover-upload-area:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: var(--primary-color, #667eea);
}

.theme-dark .upload-progress {
  background: var(--sidebar-bg, #1f2937);
  border-color: var(--toolbar-border, #374151);
}

.theme-dark .progress-bar {
  background: var(--toolbar-border, #374151);
}

.theme-dark .upload-text {
  color: var(--text-color, #f3f4f6);
}

.theme-dark .upload-hint {
  color: var(--text-color-secondary, #9ca3af);
}

.theme-dark .progress-text {
  color: var(--text-color-secondary, #9ca3af);
}

/* 封面图片预览模态框样式 */
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.preview-modal-content {
  background: var(--sidebar-bg, #ffffff);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease;
  border: 1px solid var(--toolbar-border, #e5e7eb);
}

@keyframes modalSlideIn {
  from {
    transform: scale(0.9) translateY(-20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.preview-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--toolbar-border, #e5e7eb);
  background: var(--sidebar-bg, #ffffff);
}

.preview-modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color, #374151);
}

.preview-modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-color-secondary, #9ca3af);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.preview-modal-close:hover {
  background: var(--hover-bg, #f3f4f6);
  color: var(--text-color, #374151);
  transform: scale(1.05);
}

.preview-modal-body {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--preview-bg, #f8fafc);
  min-height: 300px;
  max-height: 70vh;
  overflow: hidden;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
  border-radius: 0;
}

.preview-modal-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--toolbar-border, #e5e7eb);
  background: var(--sidebar-bg, #ffffff);
}

.preview-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--toolbar-border, #e5e7eb);
  border-radius: 6px;
  background: var(--sidebar-bg, #ffffff);
  color: var(--text-color, #374151);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preview-action-btn:hover {
  background: var(--hover-bg, #f3f4f6);
  border-color: var(--primary-color, #667eea);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.preview-action-btn.secondary {
  background: var(--primary-color, #667eea);
  color: white;
  border-color: var(--primary-color, #667eea);
}

.preview-action-btn.secondary:hover {
  background: var(--primary-hover, #5a67d8);
  border-color: var(--primary-hover, #5a67d8);
}

.preview-action-btn.danger {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.preview-action-btn.danger:hover {
  background: #dc2626;
  border-color: #dc2626;
}

/* 深色主题适配 */
.theme-dark .preview-modal-content {
  background: var(--sidebar-bg, #1f2937);
  border-color: var(--toolbar-border, #374151);
}

.theme-dark .preview-modal-header {
  background: var(--sidebar-bg, #1f2937);
  border-color: var(--toolbar-border, #374151);
}

.theme-dark .preview-modal-title {
  color: var(--text-color, #f3f4f6);
}

.theme-dark .preview-modal-close {
  color: var(--text-color-secondary, #9ca3af);
}

.theme-dark .preview-modal-close:hover {
  background: var(--hover-bg, #374151);
  color: var(--text-color, #f3f4f6);
}

.theme-dark .preview-modal-body {
  background: var(--preview-bg, #111827);
}

.theme-dark .preview-modal-footer {
  background: var(--sidebar-bg, #1f2937);
  border-color: var(--toolbar-border, #374151);
}

.theme-dark .preview-action-btn {
  background: var(--sidebar-bg, #1f2937);
  color: var(--text-color, #f3f4f6);
  border-color: var(--toolbar-border, #374151);
}

.theme-dark .preview-action-btn:hover {
  background: var(--hover-bg, #374151);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .preview-modal-content {
    max-width: 95vw;
    max-height: 95vh;
    margin: 20px;
  }

  .preview-modal-header {
    padding: 12px 16px;
  }

  .preview-modal-title {
    font-size: 14px;
  }

  .preview-modal-close {
    width: 28px;
    height: 28px;
  }

  .preview-modal-body {
    min-height: 200px;
    max-height: 60vh;
  }

  .preview-modal-footer {
    padding: 12px 16px;
    gap: 8px;
  }

  .preview-action-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
}

/* 修复 Vditor 工具栏上传按钮样式，使其与其他按钮保持一致 */
:deep(.vditor-toolbar .vditor-tooltipped[data-type='upload']) {
  /* 确保上传按钮容器样式一致 */
  position: relative;
  // overflow: hidden;

  /* 隐藏默认的文件输入样式，但保持功能 */
  input[type='file'] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 3;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
  }

  /* 确保 SVG 图标在文件输入之下但可见，并正确居中 */
  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    pointer-events: none;
    width: 16px;
    height: 16px;
  }
}

/* 确保上传按钮的悬浮效果与其他按钮一致 */
:deep(.vditor-toolbar .vditor-tooltipped[data-type='upload']:hover) {
  background: var(--toolbar-btn-hover-bg) !important;
  color: var(--toolbar-btn-hover-color) !important;
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: var(--toolbar-btn-hover-shadow) !important;
  border-color: var(--toolbar-btn-hover-border) !important;
}

/* 确保悬浮时图标位置保持居中 */
:deep(.vditor-toolbar .vditor-tooltipped[data-type='upload']:hover svg) {
  transform: translate(-50%, -50%) !important;
}

/* 确保上传按钮的激活状态与其他按钮一致 */
:deep(.vditor-toolbar .vditor-tooltipped[data-type='upload']:active) {
  transform: translateY(-1px) scale(1.01) !important;
  transition-duration: 0.1s !important;
}

/* 大纲项目从右往左流水式动画效果 */
.outline-item-enter-active {
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.outline-item-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.outline-item-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
  filter: blur(3px);
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.08), transparent);
}

.outline-item-leave-to {
  opacity: 0;
  transform: translateX(-80px) scale(0.95);
  filter: blur(2px);
}

.outline-item-move {
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 大纲项目进入时的分层动画效果 */
.outline-item-enter-active .outline-marker {
  animation: markerSlideIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
}

.outline-item-enter-active .outline-text {
  animation: textFlowIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
}

.outline-item-enter-active .outline-level-indicator {
  animation: indicatorFadeIn 0.6s ease-out 0.4s both;
}
</style>
