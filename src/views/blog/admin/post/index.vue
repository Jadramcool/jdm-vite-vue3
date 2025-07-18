<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>

    <n-divider dashed />

    <BasicTable
      ref="tableRef"
      :title="$t('modules.blog.post.table.title')"
      :columns="columns"
      :filters="queryParams"
      :request="loadNoticeList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      :scroll-x="'max-content'"
      @add="handleAdd"
    />
  </div>
</template>

<script lang="tsx" setup>
import { BlogApi } from '@/api';
import { BasicForm, BasicTable, useForm } from '@/components';
import { $t } from '@/locales';
import { useRouter } from 'vue-router';
import { useBlogSchema } from './schema';

defineOptions({ name: 'BlogPostList' });

const router = useRouter();

const tableRef = ref<any>(null);
const formRef = ref<any>(null);

// 请求参数
const queryParams = ref<Query.GetParams>({});

// 加载状态管理
const loadingStates = ref<Record<number, boolean>>({});

const schemaMethods = {
  handleEdit: (row: Blog.Post) => {
    router.push({
      path: `/blog/admin/post/edit`,
      query: {
        id: row.id,
      },
    });
  },
  handlePublish: async (row: Blog.Post) => {
    try {
      loadingStates.value[row.id] = true;
      await BlogApi.togglePostPublish(row.id);
      const targetStatus = row.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      row.status = targetStatus as Blog.PostStatus;
      const resquestMessage = row.status === 'PUBLISHED' ? '发布成功' : '取消发布成功';
      window.$message.success(resquestMessage);
    } catch (error: any) {
      window.$message.error(error.message);
    } finally {
      loadingStates.value[row.id] = false;
    }
  },

  handleToggleTop: async (row: Blog.Post) => {
    try {
      loadingStates.value[row.id] = true;
      await BlogApi.togglePostTop(row.id);
      const resquestMessage = row.isTop ? '取消置顶成功' : '置顶成功';
      row.isTop = !row.isTop;
      tableRef.value.reload();
      window.$message.success(resquestMessage);
    } catch (error: any) {
      window.$message.error(error.message);
    } finally {
      loadingStates.value[row.id] = false;
    }
  },

  handleSearchCategory: async (row: Blog.Post) => {
    await setFieldsValue({ categoryId: row.id });
    await tableRef.value.reload();
  },

  handleSearchTag: async (row: Blog.Post) => {
    await setFieldsValue({ tagIds: [row.id] });
    await tableRef.value.reload();
  },
};

const handleAdd = () => {
  router.push({
    path: `/blog/admin/post/edit`,
  });
};

const { columns, formSchemas } = useBlogSchema(schemaMethods, loadingStates);

const [register, { getFieldsValue, setFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
  tableRef,
});

const loadNoticeList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };
  return BlogApi.getPostList(data);
};

const handleSubmit = (data: any) => {
  data && tableRef.value.reload();
};
</script>
