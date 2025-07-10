<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>

    <n-divider dashed />

    <BasicTable
      ref="tableRef"
      :title="$t('modules.blog.category.table.title')"
      :columns="columns"
      :filters="queryParams"
      :request="loadCategoryList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      scroll-x="1200"
      @add="handleAdd"
    >
      <template #toolbar>
        <n-button
          type="primary"
          @click="updateAllCategoryPostCount"
          size="small"
          :loading="updateAllLoading"
        >
          {{ $t('modules.blog.category.schema.updatePostCount') }}
        </n-button>
      </template>
    </BasicTable>
    <CategoryModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="tsx" setup>
import { BlogApi } from '@/api';
import { BasicForm, BasicTable, useForm, useModal } from '@/components';
import { $t } from '@/locales';
import { CategoryModal } from './components';
import { useCategorySchema } from './schema';

defineOptions({ name: 'BlogCategoryList' });
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
  handleEdit: (record: Blog.Category) => {
    console.log('编辑分类:', record);
    openModal({ record, isUpdate: true });
  },
  handleDelete: async (row: Blog.Category) => {
    try {
      loadingStates.value[row.id] = true;
      await BlogApi.deleteCategory(row.id);
      window.$message.success($t('common.deleteSuccess'));
      tableRef.value.reload();
    } catch (error: any) {
      window.$message.error(error.message);
    } finally {
      loadingStates.value[row.id] = false;
    }
  },
};
const [registerModal, { openModal }] = useModal();

const handleAdd = () => {
  openModal({
    isUpdate: false,
  });
};

const handleSuccess = () => {
  tableRef.value.reload();
};

const updateAllCategoryPostCount = async () => {
  try {
    updateAllLoading.value = true;
    await BlogApi.updateAllCategoryPostCount();
    window.$message.success($t('modules.blog.category.message.updatePostCountSuccess'));
    tableRef.value.reload();
  } catch (error: any) {
    window.$message.error(error.message);
  } finally {
    updateAllLoading.value = false;
  }
};

const { columns, formSchemas } = useCategorySchema(schemaMethods);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
  tableRef,
});

const loadCategoryList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };
  return BlogApi.getCategoryList(data);
};

const handleSubmit = (data: any) => {
  data && tableRef.value.reload();
};
</script>
