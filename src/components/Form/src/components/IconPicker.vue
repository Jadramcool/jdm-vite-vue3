<template>
  <div class="icon-picker">
    <n-input-group>
      <n-input :value="props.value" disabled clearable>
        <template #prefix>
          <jay-icon :icon="props.value" />
        </template>
      </n-input>
      <n-button @click="showModal = true" type="primary">
        <jay-icon icon="material-symbols:add" />
        选择图标
      </n-button>
    </n-input-group>

    <!-- 图标选择弹窗 -->
    <n-modal v-model:show="showModal" preset="card" title="选择图标" style="width: 800px">
      <div class="icon-picker-modal">
        <!-- 搜索框 -->
        <n-input
          v-model:value="modalSearchKeyword"
          placeholder="搜索图标..."
          clearable
          class="mb-4"
          @input="handleModalSearch"
        >
          <template #prefix>
            <jay-icon icon="material-symbols:search" />
          </template>
          <template #password-visible-icon></template>
        </n-input>

        <!-- 图标集合选择 -->
        <n-select
          v-model:value="activeCategory"
          :options="iconSetOptions"
          placeholder="选择图标集合"
          class="mb-4"
          @update:value="handleIconSetChange"
          :loading="loading"
        />

        <!-- 分类筛选器 -->
        <n-select
          v-if="categoryOptions.length > 1"
          v-model:value="selectedCategory"
          :options="categoryOptions"
          placeholder="选择分类"
          class="mb-4"
          @update:value="handleCategoryChange"
        />

        <!-- 图标网格 -->
        <n-spin :show="loading">
          <div class="icon-grid" v-if="paginatedIcons.length > 0">
            <div
              v-for="icon in paginatedIcons"
              :key="icon.fullName"
              class="icon-item"
              :class="{ active: props.value === icon.fullName }"
              @click="selectIcon(icon.fullName)"
            >
              <jay-icon :icon="icon.fullName" :size="24" />
              <n-text class="icon-name">{{ icon.name }}</n-text>
            </div>
          </div>
          <n-empty v-else-if="!loading && filteredIcons.length === 0" description="暂无图标" />
        </n-spin>

        <!-- 自定义图标输入 -->
        <n-divider>或者</n-divider>
        <n-input
          v-model:value="customIcon"
          placeholder="输入完整的图标名称，如：material-symbols:home"
          @keyup.enter="selectIcon(customIcon)"
        >
          <template #suffix>
            <n-button size="small" @click="selectIcon(customIcon)" :disabled="!customIcon">
              确认
            </n-button>
          </template>
        </n-input>
        <div v-if="customIcon" class="custom-preview mt-2">
          <jay-icon :icon="customIcon" :size="24" />
          <n-text>{{ customIcon }}</n-text>
        </div>

        <!-- 分页 -->
        <n-pagination
          v-if="totalPages > 1"
          v-model:page="currentPage"
          :page-count="totalPages"
          :page-size="pageSize"
          show-size-picker
          :page-sizes="[20, 40, 60, 80]"
          @update:page-size="handlePageSizeChange"
          class="mt-4"
        />

        <!-- 图标统计信息 -->
        <div class="icon-stats mt-2" v-if="!loading">
          <n-text depth="3" style="font-size: 12px">
            共找到 {{ filteredIcons.length }} 个图标
            <span v-if="selectedCategory !== 'all'"
              >（分类:
              {{ categoryOptions.find((c) => c.value === selectedCategory)?.label }}）</span
            >
            <span v-if="modalSearchKeyword">（搜索: "{{ modalSearchKeyword }}"）</span>
          </n-text>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { JayIcon } from '@/components';
import {
  NButton,
  NDivider,
  NEmpty,
  NInput,
  NInputGroup,
  NModal,
  NPagination,
  NSelect,
  NSpin,
  NText,
} from 'naive-ui';
import { computed, defineOptions, ref, watch } from 'vue';

// 定义组件选项
defineOptions({
  name: 'IconPicker',
});

interface Props {
  value?: string;
  placeholder?: string;
}

interface Emits {
  (e: 'update:value', value: string): void;
}

interface IconSet {
  prefix: string;
  name: string;
  total: number;
  author?: string;
  url?: string;
  license?: string;
}

interface IconifyIcon {
  name: string;
  prefix: string;
  fullName: string;
  category?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 响应式数据
const showModal = ref(false);
const modalSearchKeyword = ref('');
const activeCategory = ref('popular');
const selectedCategory = ref('all'); // 新增：选中的分类
const customIcon = ref('');
const currentPage = ref(1);
const pageSize = ref(60);
const loading = ref(false);
const iconSets = ref<IconSet[]>([]);
const currentIcons = ref<IconifyIcon[]>([]);

// API 基础URL
const ICONIFY_API_BASE = 'https://api.iconify.design';

// 热门图标集合
const POPULAR_ICON_SETS = [
  'material-symbols',
  'mdi',
  'heroicons',
  'tabler',
  'carbon',
  'lucide',
  'ph',
  'solar',
  'mingcute',
  'fluent',
];

const categories = ref<any>([]);

// API 调用函数
async function fetchIconSets(): Promise<IconSet[]> {
  try {
    const response = await fetch(`${ICONIFY_API_BASE}/collections`);
    const data = await response.json();

    // 转换数据格式并优先显示热门图标集
    const allSets: IconSet[] = Object.entries(data).map(([prefix, info]: [string, any]) => ({
      prefix,
      name: info.name || prefix,
      total: info.total || 0,
      author: info.author?.name,
      url: info.author?.url,
      license: info.license?.title,
    }));

    // 将热门图标集排在前面
    const popularSets = allSets.filter((set) => POPULAR_ICON_SETS.includes(set.prefix));
    const otherSets = allSets.filter((set) => !POPULAR_ICON_SETS.includes(set.prefix));

    return [...popularSets, ...otherSets];
  } catch (error) {
    console.error('获取图标集合失败:', error);
    return [];
  }
}

async function fetchIcons(prefix: string, query?: string): Promise<IconifyIcon[]> {
  try {
    let url = `${ICONIFY_API_BASE}/collection?prefix=${prefix}`;
    if (query) {
      url += `&query=${encodeURIComponent(query)}`;
    }

    // console.log('正在获取图标:', url);
    const response = await fetch(url);
    const data = await response.json();
    // console.log('API返回数据:', data);

    // 处理categories数据
    if (data.categories) {
      //   console.log('API返回categories:', data.categories);
      categories.value = Object.entries(data.categories).map(([key, value]) => ({
        name: key,
        value,
      }));
    }

    const allIcons: IconifyIcon[] = [];

    // 处理categories中的图标
    if (data.categories) {
      Object.entries(data.categories).forEach(([categoryName, iconNames]: [string, any]) => {
        if (Array.isArray(iconNames)) {
          iconNames.forEach((name: string) => {
            allIcons.push({
              name,
              prefix,
              fullName: `${prefix}:${name}`,
              category: categoryName,
            });
          });
        }
      });
    }

    // 处理uncategorized中的图标
    if (data.uncategorized && Array.isArray(data.uncategorized)) {
      data.uncategorized.forEach((name: string) => {
        allIcons.push({
          name,
          prefix,
          fullName: `${prefix}:${name}`,
          category: 'uncategorized',
        });
      });
    }

    // 如果没有categories和uncategorized，尝试处理icons对象（兼容旧格式）
    if (!data.categories && !data.uncategorized && data.icons) {
      Object.keys(data.icons).forEach((name) => {
        allIcons.push({
          name,
          prefix,
          fullName: `${prefix}:${name}`,
          category: undefined,
        });
      });
    }

    // console.log('处理后的图标数据总数:', allIcons.length);
    // console.log('前5个图标:', allIcons.slice(0, 5));
    return allIcons;
  } catch (error) {
    console.error('获取图标失败:', error);
    return [];
  }
}

// 计算属性
const iconSetOptions = computed(() => {
  return iconSets.value.map((set) => ({
    label: `${set.name} (${set.total})`,
    value: set.prefix,
  }));
});

// 分类选项
const categoryOptions = computed(() => {
  const options = [{ label: '全部', value: 'all' }];

  if (categories.value.length > 0) {
    categories.value.forEach((category: { name: any }) => {
      options.push({
        label: category.name,
        value: category.name,
      });
    });

    // 如果有uncategorized图标，添加未分类选项
    const hasUncategorized = currentIcons.value.some((icon) => icon.category === 'uncategorized');
    if (hasUncategorized) {
      options.push({ label: '未分类', value: 'uncategorized' });
    }
  }

  return options;
});

const filteredIcons = computed(() => {
  let icons = currentIcons.value;

  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    icons = icons.filter((icon) => icon.category === selectedCategory.value);
    // console.log('分类筛选后图标数量:', icons.length, '分类:', selectedCategory.value);
  }

  // 按搜索关键词筛选
  if (modalSearchKeyword.value) {
    icons = icons.filter(
      (icon) =>
        icon.name.toLowerCase().includes(modalSearchKeyword.value.toLowerCase()) ||
        icon.fullName.toLowerCase().includes(modalSearchKeyword.value.toLowerCase()),
    );
    // console.log('搜索过滤后图标数量:', icons.length, '关键词:', modalSearchKeyword.value);
  }

  //   console.log('最终筛选后图标数量:', icons.length);
  return icons;
});

const paginatedIcons = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  const paginated = filteredIcons.value.slice(start, end);
  //   console.log('分页图标:', {
  //     总数: filteredIcons.value.length,
  //     当前页: currentPage.value,
  //     每页数量: pageSize.value,
  //     开始索引: start,
  //     结束索引: end,
  //     当前页图标数: paginated.length,
  //   });
  return paginated;
});

const totalPages = computed(() => {
  return Math.ceil(filteredIcons.value.length / pageSize.value);
});

// 方法
async function initIconSets() {
  loading.value = true;
  try {
    iconSets.value = await fetchIconSets();
    if (iconSets.value.length > 0) {
      activeCategory.value = iconSets.value[0].prefix;
      await loadIcons(activeCategory.value);
    }
  } catch (error) {
    console.error('初始化图标集合失败:', error);
    window.$message?.error('加载图标集合失败');
  } finally {
    loading.value = false;
  }
}

async function loadIcons(prefix: string) {
  loading.value = true;
  try {
    // console.log('开始加载图标集:', prefix, '搜索关键词:', modalSearchKeyword.value);
    currentIcons.value = await fetchIcons(prefix, modalSearchKeyword.value);
    // console.log('加载完成，图标数量:', currentIcons.value.length);
    currentPage.value = 1;
    selectedCategory.value = 'all'; // 重置分类选择
  } catch (error) {
    console.error('加载图标失败:', error);
    window.$message?.error('加载图标失败');
  } finally {
    loading.value = false;
  }
}

async function handleIconSetChange(prefix: string) {
  if (prefix) {
    await loadIcons(prefix);
  }
}

function selectIcon(icon: string) {
  if (!icon) return;
  emit('update:value', icon);
  showModal.value = false;
  customIcon.value = '';
}

async function handleModalSearch() {
  currentPage.value = 1;
  if (activeCategory.value) {
    await loadIcons(activeCategory.value);
  }
}

function handlePageSizeChange(size: number) {
  pageSize.value = size;
  currentPage.value = 1;
}

function handleCategoryChange() {
  currentPage.value = 1;
}

// 监听弹窗打开，初始化数据
watch(showModal, async (newVal) => {
  if (newVal && iconSets.value.length === 0) {
    await initIconSets();
  }
});

// 防抖搜索
const debouncedSearch = debounce(handleModalSearch, 300);

watch(modalSearchKeyword, () => {
  debouncedSearch();
});

// 简单的防抖函数
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
</script>

<style lang="scss" scoped>
.icon-picker {
  .selected-icon-preview {
    padding: 8px;
    border: 1px solid var(--n-border-color);
    border-radius: 4px;
    background-color: var(--n-color);
  }
}

.icon-picker-modal {
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
    max-height: 400px;
    overflow-y: auto;

    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 8px;
      border: 1px solid var(--n-border-color);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: var(--n-primary-color);
        background-color: var(--n-primary-color-hover);
      }

      &.active {
        border-color: var(--n-primary-color);
        background-color: var(--n-primary-color-suppl);
      }

      .icon-name {
        margin-top: 4px;
        font-size: 12px;
        text-align: center;
        word-break: break-all;
      }
    }
  }

  .custom-preview {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border: 1px solid var(--n-border-color);
    border-radius: 4px;
    background-color: var(--n-color);
  }
}
</style>
