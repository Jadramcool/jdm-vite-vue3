# 组件使用指南

基于 `schema` 配置的数据表格和表单组件使用说明。

## 目录

- [Table 表格组件](#table-表格组件)
- [Form 表单组件](#form-表单组件)
- [Modal 弹窗组件](#modal-弹窗组件)
- [Drawer 抽屉组件](#drawer-抽屉组件)
- [Schema 配置详解](#schema-配置详解)

---

## Table 表格组件

### 基本用法

```vue
<template>
  <Table :columns="columns" :request="loadData" />
</template>

<script setup lang="ts">
import { Table } from '@/components';

const columns = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' },
];

const loadData = async (params) => {
  const { data } = await api.getList(params);
  return data;
};
</script>
```

### 完整示例

```vue
<template>
  <Table
    :columns="columns"
    :request="loadData"
    :pagination="{ pageSize: 10, pageSizes: [10, 20, 30] }"
    :row-key="'id'"
    show-add-btn
    show-batch-delete-btn
    show-columns-setting
  />
</template>

<script setup lang="ts">
import { Table } from '@/components';

const columns = [
  { type: 'selection', options: ['all', 'none'] },
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name', ellipsis: { tooltip: true } },
  {
    title: '操作',
    key: 'action',
    width: 200,
    render: (row) =>
      h(NSpace, {}, () => [
        h(NButton, { size: 'small', onClick: () => handleEdit(row) }, () => '编辑'),
        h(NPopconfirm, { onPositiveClick: () => handleDelete(row.id) }, () =>
          h(NButton, { size: 'small', type: 'error' }, () => '删除'),
        ),
      ]),
  },
];

const loadData = async (params) => {
  const { data, total } = await api.getList(params);
  return { data, total };
};
</script>
```

### Table Props

| 属性                  | 类型                | 默认值      | 说明                       |
| --------------------- | ------------------- | ----------- | -------------------------- |
| columns               | `Array`             | `[]`        | 表格列配置                 |
| request               | `Function`          | `null`      | 数据请求函数               |
| pagination            | `Object / Boolean`  | `{}`        | 分页配置，`false` 关闭分页 |
| row-key               | `String / Function` | `undefined` | 行唯一标识                 |
| show-add-btn          | `Boolean`           | `true`      | 显示新增按钮               |
| show-batch-delete-btn | `Boolean`           | `false`     | 显示批量删除按钮           |
| show-columns-setting  | `Boolean`           | `true`      | 显示列设置                 |
| auto-load             | `Boolean`           | `true`      | 自动加载数据               |
| local-pagination      | `Boolean`           | `false`     | 本地分页                   |

---

## Form 表单组件

### 基本用法

```vue
<template>
  <Form :schemas="schemas" @submit="handleSubmit" />
</template>

<script setup lang="ts">
import { Form } from '@/components';

const schemas = [
  { key: 'name', label: '姓名', component: 'NInput' },
  { key: 'age', label: '年龄', component: 'NInputNumber' },
];

const handleSubmit = (values) => {
  console.log('表单值:', values);
};
</script>
```

### 带查询和重置

```vue
<template>
  <Form :schemas="schemas" layout="inline" @submit="handleSearch" @reset="handleReset" />
</template>
```

### Form Props

| 属性                     | 类型                                   | 默认值     | 说明         |
| ------------------------ | -------------------------------------- | ---------- | ------------ |
| schemas                  | `Array`                                | `[]`       | 表单配置     |
| layout                   | `'inline' / 'vertical' / 'horizontal'` | `'inline'` | 布局方式     |
| label-width              | `Number / String`                      | `'auto'`   | 标签宽度     |
| size                     | `String`                               | `'medium'` | 表单尺寸     |
| show-action-button-group | `Boolean`                              | `true`     | 显示操作按钮 |
| show-reset-button        | `Boolean`                              | `true`     | 显示重置按钮 |
| show-submit-button       | `Boolean`                              | `true`     | 显示提交按钮 |

---

## Modal 弹窗组件

### 基本用法

```vue
<template>
  <Modal v-model:show="show" title="弹窗标题">
    <div>弹窗内容</div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Modal } from '@/components';

const show = ref(false);
</script>
```

### 带底部按钮

```vue
<template>
  <Modal
    v-model:show="show"
    title="编辑用户"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <Form :schemas="schemas" />
  </Modal>
</template>
```

### Modal Props

| 属性               | 类型              | 默认值      | 说明            |
| ------------------ | ----------------- | ----------- | --------------- |
| show               | `Boolean`         | `false`     | 显示状态        |
| title              | `String`          | `undefined` | 标题            |
| card-width         | `String / Number` | `'800px'`   | 宽度            |
| card-height        | `String / Number` | `'420px'`   | 高度            |
| draggable          | `Boolean`         | `true`      | 是否可拖拽      |
| show-ok-button     | `Boolean`         | `true`      | 显示确认按钮    |
| show-cancel-button | `Boolean`         | `true`      | 显示取消按钮    |
| confirm-loading    | `Boolean`         | `undefined` | 确认按钮loading |

---

## Drawer 抽屉组件

### 基本用法

```vue
<template>
  <Drawer v-model:show="show" title="抽屉标题">
    <div>抽屉内容</div>
  </Drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Drawer } from '@/components';

const show = ref(false);
</script>
```

---

## Schema 配置详解

### 完整 Schema 结构

```typescript
const schemas = [
  {
    key: 'fieldName', // 字段名（必填）
    label: '字段标签', // 显示标签
    defaultValue: undefined, // 默认值

    // 搜索表单配置
    form: {
      component: 'NInput', // 组件类型
      query: 'like', // 查询方式: 'like', '=', 'in', '>=' 等
      componentProps: {}, // 组件属性
      rules: [], // 验证规则
      ifshow: () => boolean, // 条件显示
    },

    // 编辑表单配置
    editForm: {
      component: 'NInput',
      componentProps: {},
      rules: [],
    },

    // 表格列配置
    table: {
      width: 100,
      ellipsis: true,
      fixed: 'left',
      sorter: true,
      render: (row) => h('span', {}, row.fieldName), // 自定义渲染
    },
  },
];
```

### 组件类型映射

| Schema 配置      | 对应组件                     |
| ---------------- | ---------------------------- |
| `NInput`         | `n-input`                    |
| `NInputNumber`   | `n-input-number`             |
| `NSelect`        | `n-select`                   |
| `NDatePicker`    | `n-date-picker`              |
| `NCheckboxGroup` | `n-checkbox-group`           |
| `NRadioGroup`    | `n-radio-group`              |
| `ApiSelect`      | `ApiSelect` (远程选择器)     |
| `ApiTree`        | `ApiTree` (远程树)           |
| `ApiTreeSelect`  | `ApiTreeSelect` (远程下拉树) |
| `IconPicker`     | `IconPicker` (图标选择器)    |

### ApiSelect 使用

```typescript
{
  key: 'role',
  label: '角色',
  form: {
    component: 'ApiSelect',
    componentProps: {
      api: RoleApi.getAllRoleList,  // 请求函数
      multiple: false,              // 是否多选
      placeholder: '请选择角色',
      labelField: 'name',            // 显示字段
      valueField: 'id',              // 值字段
    },
  },
}
```

### 表格自定义渲染

```typescript
{
  key: 'status',
  label: '状态',
  table: {
    render: (row) => {
      const status = row.status === 1 ? 'success' : 'error';
      return h(NTag, { type: status, bordered: false }, () => row.status === 1 ? '启用' : '禁用');
    },
  },
}
```

### 表单验证规则

```typescript
{
  key: 'phone',
  label: '手机号',
  editForm: {
    rules: [
      {
        type: 'string',
        required: true,
        message: '请输入手机号',
        trigger: ['blur', 'input'],
      },
      {
        validator: (_rule, value) => {
          if (value && !/^1\d{10}$/.test(value)) {
            return new Error('手机号格式错误');
          }
          return true;
        },
        trigger: 'blur',
      },
    ],
  },
}
```

### 条件显示

```typescript
{
  key: 'department',
  label: '部门',
  form: {
    ifshow: (values) => values.type === 'department',
  },
}
```

### 组合使用示例

完整的管理页面 schema 示例：

```typescript
import { api } from '@/api';
import { $t } from '@/locales/i18n';
import { columnsUtil, formSchemaUtil } from '@/utils';

export const useUserSchema = () => {
  const schemas = [
    {
      key: 'id',
      label: $t('common.id'),
      defaultValue: undefined,
      form: {
        component: 'NInputNumber',
        componentProps: { min: 1 },
      },
    },
    {
      key: 'username',
      label: $t('common.username'),
      defaultValue: undefined,
      form: {
        component: 'NInput',
        query: 'in',
        componentProps: { placeholder: '请输入用户名' },
      },
      editForm: {
        componentProps: { disabled: true },
      },
    },
    {
      key: 'name',
      label: $t('user.name'),
      defaultValue: undefined,
      table: {
        render: (row) => row.name || '-',
      },
    },
    {
      key: 'role',
      label: $t('user.role'),
      form: {
        component: 'ApiSelect',
        componentProps: {
          api: RoleApi.getAllRoleList,
          multiple: true,
          labelField: 'name',
          valueField: 'id',
        },
      },
      table: {
        render: (row) => {
          return row.roles?.map((r) => r.name).join(', ') || '-';
        },
      },
    },
    {
      key: 'status',
      label: $t('common.status'),
      defaultValue: [0, 1],
      form: {
        component: 'NCheckboxGroup',
        query: 'in',
        componentProps: { options: statusOptions },
      },
      editForm: {
        component: 'NRadioGroup',
        componentProps: { options: statusOptions },
      },
      table: {
        render: (row) => {
          const status = statusOptions.find((s) => s.value === row.status);
          return h(NTag, { type: row.status === 1 ? 'success' : 'warning' }, () => status?.label);
        },
      },
    },
    {
      key: 'createdTime',
      label: $t('common.createdTime'),
      form: {
        component: 'NDatePicker',
        componentProps: { type: 'daterange' },
      },
      table: {
        render: (row) => dayjs(row.createdTime).format('YYYY-MM-DD HH:mm:ss'),
      },
    },
  ];

  return { schemas };
};
```

### 字段数组模式（推荐）

除了手动定义 schema，还可以使用字段数组模式，通过配置字段名列表自动生成表格列和表单：

```typescript
import { $t } from '@/locales/i18n';
import { columnsUtil, formSchemaUtil, editFormSchemaUtil } from '@/utils';

export const useNoticeSchema = () => {
  const schema = [
    {
      key: 'id',
      label: $t('notice.id'),
      defaultValue: undefined,
      form: {
        component: 'NInputNumber',
        componentProps: { min: 1, step: 1, precision: 0 },
      },
      editForm: {
        componentProps: { disabled: true },
        rules: [
          { required: true, message: $t('common.pleaseInputId'), trigger: ['blur', 'input'] },
        ],
      },
      table: { width: 80 },
    },
    {
      key: 'type',
      label: $t('notice.type'),
      defaultValue: undefined,
      form: {
        component: 'NRadioGroup',
        componentProps: {
          options: [
            { label: '通知', value: 1 },
            { label: '公告', value: 2 },
          ],
        },
      },
      editForm: {
        component: 'NRadioGroup',
        componentProps: {
          options: [
            { label: '通知', value: 1 },
            { label: '公告', value: 2 },
          ],
        },
      },
      table: { width: 100 },
    },
    {
      key: 'title',
      label: $t('notice.title'),
      defaultValue: undefined,
      form: {
        component: 'NInput',
        componentProps: { placeholder: '请输入标题' },
      },
      editForm: {
        componentProps: { disabled: false },
        rules: [
          { required: true, message: $t('common.pleaseInputTitle'), trigger: ['blur', 'input'] },
        ],
      },
      table: { width: 200, ellipsis: { tooltip: true } },
    },
    {
      key: 'content',
      label: $t('notice.content'),
      defaultValue: undefined,
      form: {
        component: 'NInput',
        componentProps: { type: 'textarea', placeholder: '请输入内容' },
      },
      editForm: {
        component: 'NInput',
        componentProps: { type: 'textarea' },
        rules: [
          { required: true, message: $t('common.pleaseInputContent'), trigger: ['blur', 'input'] },
        ],
      },
      table: { width: 300, ellipsis: { tooltip: true } },
    },
    {
      key: 'author',
      label: $t('notice.author'),
      defaultValue: undefined,
      table: { width: 100 },
    },
    {
      key: 'status',
      label: $t('common.status'),
      defaultValue: 0,
      form: {
        component: 'NCheckboxGroup',
        componentProps: {
          options: [
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
          ],
        },
      },
      editForm: {
        component: 'NRadioGroup',
        componentProps: {
          options: [
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
          ],
        },
      },
      table: {
        width: 80,
        render: (row) =>
          h(NTag, { type: row.status === 1 ? 'success' : 'error', bordered: false }, () =>
            row.status === 1 ? '启用' : '禁用',
          ),
      },
    },
    {
      key: 'createdTime',
      label: $t('common.createdTime'),
      table: {
        width: 180,
        render: (row) =>
          row.createdTime ? dayjs(row.createdTime).format('YYYY-MM-DD HH:mm') : '-',
      },
    },
    {
      key: 'updatedTime',
      label: $t('common.updatedTime'),
      table: {
        width: 180,
        render: (row) =>
          row.updatedTime ? dayjs(row.updatedTime).format('YYYY-MM-DD HH:mm') : '-',
      },
    },
  ];

  // 表格和表单字段
  const tableFields = [
    'id',
    'type',
    'title',
    'content',
    'author',
    'status',
    'createdTime',
    'updatedTime',
    'operate',
  ];
  const formFields = ['id', 'type', 'title', 'status', 'content'];
  const editFormFields = ['id', 'title', 'type', 'content'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema, editFormFields));

  return { columns, formSchemas, editFormSchemas };
};
```

**导出说明：**

```typescript
// 方式一：分别导出 columns、formSchemas、editFormSchemas
export const useNoticeSchema = () => {
  // ... 配置代码
  return { columns, formSchemas, editFormSchemas };
};

// 在组件中使用
const { columns, formSchemas, editFormSchemas } = useNoticeSchema();
```

---

## 实用工具函数

### formSchemaUtil

```typescript
import { formSchemaUtil } from '@/utils';

// 创建表单项
const schema = formSchemaUtil.create({
  key: 'name',
  label: '姓名',
  component: 'NInput',
});

// 创建带验证的表单项
const schemaWithRules = formSchemaUtil.create({
  key: 'email',
  label: '邮箱',
  component: 'NInput',
  rules: [{ required: true, type: 'email' }],
});
```

### columnsUtil

```typescript
import { columnsUtil } from '@/utils';

// 创建表格列
const columns = columnsUtil.create([
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' },
]);

// 添加操作列
columnsUtil.addAction(columns, {
  render: (row) => h(NButton, { onClick: () => handleEdit(row) }, () => '编辑'),
});
```

---

## 最佳实践

1. **统一管理 Schema**: 将页面相关的 schema 抽取到单独的文件，如 `schema.tsx`

2. **使用计算属性**: 推荐使用 `computed` 包装 schema，便于响应式更新

3. **类型定义**: 为复杂业务定义类型，提高代码可维护性

4. **组件复用**: 常用配置抽取为工具函数或组合式函数
