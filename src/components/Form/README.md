# Form 表单组件

基于 Naive UI 的增强表单组件，支持动态表单生成、布局控制、展开收起等功能。

## 目录

- [基本用法](#基本用法)
- [展开/收起功能](#展开收起功能)
- [Grid 布局配置](#grid-布局配置)
- [useForm Hook](#useform-hook)
- [组件 Props](#组件-props)
- [自定义组件](#自定义组件)

---

## 基本用法

```vue
<template>
  <BasicForm @register="register" @submit="handleSubmit" />
</template>

<script setup lang="ts">
import { BasicForm } from '@/components';

const [register] = useForm({
  schemas: [
    { field: 'name', label: '姓名', component: 'NInput' },
    { field: 'age', label: '年龄', component: 'NInputNumber' },
  ],
  submitOnReset: true,
});

const handleSubmit = (values) => {
  console.log('表单值:', values);
};
</script>
```

---

## 展开/收起功能

Form 组件内置了表单字段的展开/收起功能，当表单字段超过 3 个时自动显示展开/收起按钮。

### 控制逻辑

```typescript
// BasicForm.vue 内部逻辑
const gridCollapsed = ref<boolean>(false); // 表单是否折叠
const overflow = ref<boolean>(false);

// 展开/收起切换函数
const unfoldToggle = () => {
  gridCollapsed.value = !gridCollapsed.value;
  overflow.value = gridCollapsed.value;
};

// NGrid 组件通过 collapsed 属性控制显示行数
const getGrid = computed((): GridProps => {
  return {
    collapsed: isInline.value ? gridCollapsed.value : false,
    collapsedRows: 1, // 默认显示1行
    responsive: 'screen',
  };
});
```

### 触发条件

- `showAdvancedButton: true` (默认开启)
- 表单项数量 > 3 个
- 布局模式为 `inline`

### 按钮位置

展开/收起按钮显示在表单右侧，位于重置按钮旁边：

```vue
<NButton
  type="primary"
  text
  icon-placement="right"
  v-if="isInline && getProps.showAdvancedButton && getSchema.length > 3"
  @click="unfoldToggle"
>
  {{ overflow ? '展开' : '收起' }}
</NButton>
```

### 手动控制

可以通过 `collapsed` 属性手动控制展开/收起状态：

```vue
<BasicForm :collapsed="false" :show-advanced-button="true" />
```

### 相关 Props

| 属性                 | 类型      | 默认值  | 说明                  |
| -------------------- | --------- | ------- | --------------------- |
| `showAdvancedButton` | `boolean` | `true`  | 是否显示展开/收起按钮 |
| `collapsed`          | `boolean` | `false` | 是否折叠（手动控制）  |
| `collapsedRows`      | `number`  | `1`     | 折叠时显示的行数      |

---

## Grid 布局配置

使用 `gridProps` 属性配置表单网格布局，支持响应式列数。

### 基本配置

```typescript
const [register] = useForm({
  gridProps: {
    cols: 2, // 默认2列
    'x-gap': 10, // 水平间距
  },
});
```

### 响应式列数

支持根据屏幕宽度自动调整列数：

```typescript
// 格式: '<屏幕宽度>:列数'
// s: 640px, m: 768px, l: 1024px, xl: 1280px, 2xl: 1536px
gridProps: {
  cols: '1 s:1 m:2 l:3 xl:4 2xl:4',
}

// 解释:
// - 默认/小屏幕: 1列
// - s (640px+): 1列
// - m (768px+): 2列
// - l (1024px+): 3列
// - xl (1280px+): 4列
// - 2xl (1536px+): 4列
```

### giProps 配置

配置每个表单项的 GridItem 属性：

```typescript
const [register] = useForm({
  giProps: {
    offset: 0, // 偏移量
  },
  gridProps: {
    cols: 2,
  },
});
```

---

## useForm Hook

### 基本用法

```typescript
import { useForm } from '@/components';

const [register, { getFieldsValue, setFieldsValue, resetFields, validate, submit }] = useForm({
  schemas: formSchemas,
  gridProps: { cols: 2 },
  submitOnReset: true,
});

// register: 用于注册表单到父组件
// getFieldsValue: 获取表单值
// setFieldsValue: 设置表单值
// resetFields: 重置表单
// validate: 验证表单
// submit: 提交表单
```

### 完整 API

| 方法                   | 说明                           | 参数                     |
| ---------------------- | ------------------------------ | ------------------------ |
| `register`             | 注册表单（必须传入 BasicForm） | -                        |
| `getFieldsValue`       | 获取表单值                     | `(nameList?: string[])`  |
| `setFieldsValue`       | 设置表单值                     | `(values: Recordable)`   |
| `resetFields`          | 重置表单                       | -                        |
| `validate`             | 验证表单                       | `(nameList?: string[])`  |
| `validateFields`       | 验证指定字段                   | `(nameList: string[])`   |
| `clearValidate`        | 清除验证                       | `(nameList?: string[])`  |
| `submit`               | 提交表单                       | -                        |
| `setProps`             | 设置表单属性                   | `(props: Recordable)`    |
| `updateSchema`         | 更新表单结构                   | `(schema: FormSchema[])` |
| `getComponentInstance` | 获取组件实例                   | `(field: string)`        |

### 与 Table 联动

```vue
<script setup>
const tableRef = ref();
const [register, { getFieldsValue }] = useForm({
  schemas: formSchemas,
  tableRef, // 关联表格，提交时自动刷新
});

// 提交时获取查询参数
const handleSubmit = (values) => {
  console.log(values); // 包含表单值
  tableRef.value?.reload(); // 刷新表格
};
</script>
```

---

## 组件 Props

### 完整配置

```typescript
const props = {
  // 表单布局
  layout: 'inline' | 'vertical' | 'horizontal', // 默认 'inline'
  labelWidth: 100, // 标签宽度
  labelAlign: 'left' | 'right',
  size: 'small' | 'medium' | 'large',

  // 表单配置
  schemas: [], // 表单项配置
  model: {}, // 表单数据

  // 按钮配置
  showSubmitButton: true,
  showResetButton: true,
  submitButtonText: '提交',
  resetButtonText: '重置',

  // 展开/收起
  showAdvancedButton: true,
  collapsed: false,
  collapsedRows: 1,

  // Grid 布局
  gridProps: {
    cols: 2,
    'x-gap': 10,
  },
  giProps: {},

  // 行为配置
  submitOnReset: false,
  resetPageOnReset: true,
};
```

---

## 自定义组件

### 注册自定义组件

Form 组件内置了以下自定义组件：

| 组件名          | 说明               |
| --------------- | ------------------ |
| `ApiSelect`     | 远程下拉选择器     |
| `ApiTree`       | 远程树形控件       |
| `ApiTreeSelect` | 远程下拉树形选择器 |
| `DatePicker`    | 日期选择器（增强） |
| `IconPicker`    | 图标选择器         |

### 使用示例

```typescript
const schemas = [
  {
    field: 'role',
    label: '角色',
    component: 'ApiSelect',
    componentProps: {
      api: RoleApi.getList,
      labelField: 'name',
      valueField: 'id',
      placeholder: '请选择角色',
    },
  },
  {
    field: 'department',
    label: '部门',
    component: 'ApiTree',
    componentProps: {
      api: DeptApi.getTree,
      labelField: 'name',
      valueField: 'id',
    },
  },
  {
    field: 'birthday',
    label: '生日',
    component: 'DatePicker',
    componentProps: {
      type: 'date',
      format: 'yyyy-MM-dd',
    },
  },
];
```

---

## 完整示例

```vue
<template>
  <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" ref="formRef" />
</template>

<script setup lang="ts">
import { BasicForm, useForm } from '@/components';

const formRef = ref();
const [register, { getFieldsValue, setFieldsValue, resetFields, validate }] = useForm({
  // 表单布局
  layout: 'inline',
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },

  // 表单项
  schemas: [
    { field: 'name', label: '姓名', component: 'NInput', required: true },
    { field: 'age', label: '年龄', component: 'NInputNumber' },
    { field: 'email', label: '邮箱', component: 'NInput' },
    { field: 'phone', label: '手机', component: 'NInput' },
    { field: 'address', label: '地址', component: 'NInput' },
  ],

  // 按钮配置
  showSubmitButton: true,
  showResetButton: true,
  submitOnReset: true,

  // 展开/收起（超过3个自动显示）
  showAdvancedButton: true,
  collapsed: false,
  collapsedRows: 1,
});

const handleSubmit = (values) => {
  console.log('提交:', values);
};

const handleReset = () => {
  console.log('重置');
};
</script>
```
