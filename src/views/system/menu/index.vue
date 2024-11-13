<template>
  <div>
    <NCard :title="$t('common.search')" size="small">
      <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>
    </NCard>

    <BasicTable
      ref="tableRef"
      :title="$t('modules.system.menu.table.title')"
      :columns="columns"
      :filters="queryParams"
      :request="loadMenuList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      :pagination="false"
      @update:checked-row-keys="handleCheck"
    />

    <!-- <MenuDrawer @register="registerDrawer"> </MenuDrawer> -->
  </div>
</template>

<script lang="tsx" setup>
import { MenuApi } from '@/api/system';
import { BasicForm, BasicTable, useForm } from '@/components';
// import { MenuDrawer } from './components';
import { arrayToTree } from '@/utils';
import { useMenuSchema } from './schema';

defineOptions({ name: 'UserManager' });

// 表格/表单配置  采用computed（适配i18n）
const tableRef = ref<any>(null);
const formRef = ref<any>(null);

// 请求参数
const queryParams = ref<Query.GetParams>({});

// 表格/表单方法
const schemaMethods = {
  // handleEdit(record: NaiveUI.RowData) {
  //   openDrawer(record);
  // },
};

// 表格/表单配置  采用computed（适配i18n）
const { columns, formSchemas } = useMenuSchema(schemaMethods);

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
});

// 表格数据请求
const loadMenuList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };

  const res = await MenuApi.menuList(data);
  const menuList = arrayToTree(res);
  return menuList;
};

// 表单提交
const handleSubmit = (data: any) => {
  data && tableRef.value.reload();
};

const handleCheck = (keys: Array<string | number>, rows: object[]) => {
  console.log(keys, rows);
};
</script>
