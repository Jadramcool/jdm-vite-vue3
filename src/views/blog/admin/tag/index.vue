<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>

    <n-divider dashed />

    <BasicTable
      ref="tableRef"
      :title="$t('modules.blog.tag.table.title')"
      :columns="columns"
      :filters="queryParams"
      :request="loadTagList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      scroll-x="1200"
    >
      <template #toolbar>
        <!-- 更新所有标签文章数量 -->
        <n-button
          type="primary"
          @click="updateAllTagPostCount"
          size="small"
          :loading="updateAllLoading"
        >
          {{ $t('modules.blog.tag.schema.updateUseCount') }}
        </n-button>
      </template>
    </BasicTable>
  </div>
</template>

<script lang="tsx" setup>
import { BlogApi } from '@/api';
import { BasicForm, BasicTable, useForm } from '@/components';
import { $t } from '@/locales';
import { useTagSchema } from './schema';

defineOptions({ name: 'BlogTagList' });
onMounted(() => {
  // 获取表格数据
});

const tableRef = ref<any>(null);
const formRef = ref<any>(null);

// 请求参数
const queryParams = ref<Query.GetParams>({});

// 加载状态管理
const loadingStates = ref<Record<number, boolean>>({});
const updateAllLoading = ref(false);

const schemaMethods = {
  handleEdit: (row: Blog.Tag) => {
    console.log('编辑标签:', row);
    // TODO: 实现编辑功能
  },
  handleDelete: async (row: Blog.Tag) => {
    try {
      loadingStates.value[row.id] = true;
      await BlogApi.deleteTag(row.id);
      window.$message.success($t('common.deleteSuccess'));
      tableRef.value.reload();
    } catch (error: any) {
      window.$message.error(error.message);
    } finally {
      loadingStates.value[row.id] = false;
    }
  },
};

const updateAllTagPostCount = async () => {
  try {
    updateAllLoading.value = true;
    await BlogApi.updateAllTagPostCount();
    window.$message.success($t('modules.blog.tag.message.updateUseCountSuccess'));
    tableRef.value.reload();
  } catch (error: any) {
    window.$message.error(error.message);
  } finally {
    updateAllLoading.value = false;
  }
};

const { columns, formSchemas } = useTagSchema(schemaMethods);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
  tableRef,
});

const loadTagList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };
  return BlogApi.getTagList(data);
};

const handleSubmit = (data: any) => {
  data && tableRef.value.reload();
};
</script>
