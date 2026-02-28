# Modal 模态框组件

基于 Naive UI NModal 的增强模态框组件，支持灵活配置、加载状态、底部按钮自定义等功能。

## 目录

- [基本用法](#基本用法)
- [Slots 插槽](#slots-插槽)
- [Props 属性](#props-属性)
- [useModal Hook](#usemodal-hook)

---

## 基本用法

```vue
<template>
  <BasicModal @register="register" @ok="handleOk">
    <div>弹窗内容</div>
  </BasicModal>
</template>

<script setup lang="ts">
import { BasicModal, useModal } from '@/components';

const [register, { openModal, closeModal }] = useModal();

const handleOk = () => {
  closeModal();
};
</script>
```

---

## Slots 插槽

| 插槽名 | 说明 |
|--------|------|
| `default` | 弹窗主体内容 |
| `header` | 自定义头部 |
| `footer` | 自定义底部（替换默认按钮） |
| `action` | 操作区域（按钮右侧） |

### 示例

```vue
<BasicModal @register="register">
  <template #header>
    <div>自定义头部</div>
  </template>
  
  <div>弹窗内容</div>
  
  <template #footer>
    <n-button @click="closeModal">取消</n-button>
    <n-button type="primary" @click="handleOk">确定</n-button>
  </template>
  
  <template #action>
    <n-button>额外操作</n-button>
  </template>
</BasicModal>
```

---

## Props 属性

### 基础属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `show` | `boolean` | `false` | 控制弹窗显示/隐藏 |
| `title` | `string` | `弹窗` | 弹窗标题 |
| `loading` | `boolean` | `false` | 加载状态，显示 spin |
| `cardWidth` | `string \| number` | `800px` | 弹窗宽度 |
| `cardHeight` | `string \| number` | `420px` | 内容区域高度 |
| `draggable` | `boolean` | `true` | 是否可拖拽 |
| `closeFunc` | `() => Promise<any>` | `null` | 自定义关闭函数 |

### Footer 底部按钮

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `showFooter` | `boolean` | `true` | 是否显示底部 |
| `showOkButton` | `boolean` | `true` | 显示确定按钮 |
| `showCancelButton` | `boolean` | `true` | 显示取消按钮 |
| `confirmLoading` | `boolean` | `false` | 确定按钮 loading |
| `okType` | `string` | `primary` | 确定按钮类型 |
| `okText` | `string` | - | 确定按钮文字 |
| `cancelText` | `string` | - | 取消按钮文字 |

---

## useModal Hook

### 返回值

```typescript
const [register, methods] = useModal();
```

### register

注册函数，用于将弹窗实例注册到父组件。

### methods 方法

| 方法 | 说明 | 示例 |
|------|------|------|
| `openModal` | 打开弹窗 | `openModal(data)` |
| `closeModal` | 关闭弹窗 | `closeModal()` |
| `setModalProps` | 设置属性 | `setModalProps({ loading: true })` |

### 完整示例

```vue
<template>
  <n-button @click="handleOpen">打开弹窗</n-button>
  
  <BasicModal @register="register" @ok="handleOk">
    <div>内容</div>
  </BasicModal>
</template>

<script setup lang="ts">
import { BasicModal, useModal } from '@/components';

const [register, { openModal, closeModal, setModalProps }] = useModal();

const handleOpen = () => {
  openModal({ id: 1 });
};

const handleOk = async () => {
  setModalProps({ loading: true });
  // 提交逻辑...
  setModalProps({ loading: false });
  closeModal();
};
</script>
```

---

## 事件

| 事件名 | 说明 |
|--------|------|
| `register` | 注册事件 |
| `ok` | 点击确定按钮 |
| `close` | 点击取消/关闭按钮 |

---

## 使用 useModalInner

用于在弹窗内部获取实例方法：

```vue
<template>
  <BasicModal @register="register">
    <n-button @click="handleClose">关闭</n-button>
  </BasicModal>
</template>

<script setup lang="ts">
import { BasicModal, useModalInner } from '@/components';

const [register, { closeModal, setModalProps }] = useModalInner();

const handleClose = () => {
  closeModal();
};
</script>
```

---

## 加载状态示例

```vue
<template>
  <BasicModal :loading="loading" @register="register" @ok="handleOk">
    <div>内容</div>
  </BasicModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BasicModal, useModal } from '@/components';

const loading = ref(false);
const [register, { openModal, closeModal }] = useModal();

const handleOk = async () => {
  loading.value = true;
  try {
    // 提交逻辑
    closeModal();
  } finally {
    loading.value = false;
  }
};
</script>
```

---

## 结合表单使用

```vue
<template>
  <BasicModal @register="register" @ok="handleOk">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
import { BasicForm, BasicModal, useForm, useModal } from '@/components';

const [registerForm, { submit }] = useForm({
  schemas: [...],
});

const [register, { closeModal, setModalProps }] = useModal();

const handleOk = async () => {
  setModalProps({ confirmLoading: true });
  try {
    const values = await submit();
    // 提交 values
    closeModal();
  } finally {
    setModalProps({ confirmLoading: false });
  }
};
</script>
```
