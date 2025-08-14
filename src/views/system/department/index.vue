<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>
    <n-divider dashed />
    <BasicTable
      ref="tableRef"
      title="部门列表"
      :columns="columns"
      :filters="queryParams"
      :request="loadDepartmentList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      :pagination="false"
      :headerNoWrap="true"
      v-model:expanded-row-keys="expandedRowKeys"
      scroll-x="1400"
      @add="handleAdd"
    >
      <template #toolbar>
        <n-space>
          <n-button type="primary" size="small" ghost @click="handleExpandAll"> 展开全部 </n-button>
          <n-button type="primary" size="small" ghost @click="handleCollapseAll">
            折叠全部
          </n-button>
        </n-space>
      </template>
    </BasicTable>

    <DepartmentModal @register="registerModal" @success="handleSuccess"> </DepartmentModal>
  </div>
</template>

<script lang="tsx" setup>
import { DepartmentApi } from '@/api/system';
import { BasicForm, BasicTable, useForm, useModal } from '@/components';
import { arrayToTree } from '@/utils';
import { ref } from 'vue';
import { DepartmentModal } from './components';
import { useDepartmentSchema } from './schema';

defineOptions({ name: 'MenuManager' });

const tableRef = ref<any>(null);
const formRef = ref<any>(null);

const expandedRowKeys = ref<any>([]);
// 存储所有可展开的行键
const allExpandableKeys = ref<any>([]);

// 请求参数
const queryParams = ref<Query.GetParams>({});

// 表格/表单方法
const schemaMethods = {
  handleEdit(record: NaiveUI.RowData) {
    openModal({
      isUpdate: true,
      record,
    });
  },
  handleDelete(record: NaiveUI.RowData) {
    DepartmentApi.deleteDepartment(record.id).then(() => {
      tableRef.value.reload();
    });
  },
};

const { columns, formSchemas } = useDepartmentSchema(schemaMethods);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
  tableRef,
});

const [registerModal, { openModal }] = useModal();

/**
 * 表格数据请求
 * @param {Query.GetParams} data - 请求参数
 * @returns {Promise<any[]>} 部门树形数据
 */
const loadDepartmentList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };

  const res = await DepartmentApi.getDepartmentList(data);
  const departmentList = arrayToTree(res.list, null, 'parentId');

  // 获取所有有子节点的行键
  const expandableKeys = res.list
    .filter((item: any) => item.childrenCount)
    .map((item: any) => item.id);

  // 保存所有可展开的行键
  allExpandableKeys.value = expandableKeys;
  // 默认展开所有节点
  expandedRowKeys.value = [...expandableKeys];
  return departmentList;
};

/**
 * 展开全部节点
 */
const handleExpandAll = () => {
  expandedRowKeys.value = [...allExpandableKeys.value];
};

/**
 * 折叠全部节点
 */
const handleCollapseAll = () => {
  expandedRowKeys.value = [];
};

const handleAdd = () => {
  openModal({
    isUpdate: false,
  });
};

const handleSuccess = () => {
  tableRef.value.reload();
};

// 表单提交
const handleSubmit = (data: any) => {
  data && tableRef.value.reload();
};
</script>
