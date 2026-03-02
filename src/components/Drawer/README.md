# Drawer 抽屉组件

基于 Naive UI NDrawer 的增强抽屉组件，支持灵活配置、加载状态、底部按钮自定义等功能。

## 目录

- [基本用法](#基本用法)
- [Slots 插槽](#slots-插槽)
- [Props 属性](#props-属性)
- [useDrawer Hook](#usedrawer-hook)

---

## 基本用法

```vue
<template>
  <BasicDrawer @register="register" @ok="handleOk">
    <div>抽屉内容</div>
  </BasicDrawer>
</template>

<script setup lang="ts">
import { BasicDrawer, useDrawer } from '@/components';

const [register, { openDrawer, closeDrawer }] = useDrawer();

const handleOk = () => {
  closeDrawer();
};
</script>
```

---

## Slots 插槽

| 插槽名    | 说明                       |
| --------- | -------------------------- |
| `default` | 抽屉主体内容               |
| `header`  | 自定义头部                 |
| `footer`  | 自定义底部（替换默认按钮） |

### 示例

```vue
<BasicDrawer @register="register">
  <template #header>
    <div>自定义头部</div>
  </template>
  
  <div>抽屉内容</div>
  
  <template #footer>
    <n-button @click="closeDrawer">取消</n-button>
    <n-button type="primary" @click="handleOk">确定</n-button>
  </template>
</BasicDrawer>
```

---

## Props 属性

### 基础属性

| 属性        | 类型                 | 默认值  | 说明                |
| ----------- | -------------------- | ------- | ------------------- |
| `show`      | `boolean`            | `false` | 控制抽屉显示/隐藏   |
| `width`     | `string \| number`   | `500`   | 抽屉宽度            |
| `headTitle` | `string`             | `''`    | 抽屉标题            |
| `loading`   | `boolean`            | `false` | 加载状态，显示 spin |
| `closeFunc` | `() => Promise<any>` | `null`  | 自定义关闭函数      |

### Footer 底部按钮

| 属性               | 类型      | 默认值    | 说明             |
| ------------------ | --------- | --------- | ---------------- |
| `showFooter`       | `boolean` | `true`    | 是否显示底部     |
| `showOkButton`     | `boolean` | `true`    | 显示确定按钮     |
| `showCancelButton` | `boolean` | `true`    | 显示取消按钮     |
| `confirmLoading`   | `boolean` | `false`   | 确定按钮 loading |
| `okType`           | `string`  | `primary` | 确定按钮类型     |
| `okText`           | `string`  | -         | 确定按钮文字     |
| `cancelText`       | `string`  | -         | 取消按钮文字     |

---

## useDrawer Hook

### 返回值

```typescript
const [register, methods] = useDrawer();
```

### register

注册函数，用于将抽屉实例注册到父组件。

### methods 方法

| 方法             | 说明     | 示例                                |
| ---------------- | -------- | ----------------------------------- |
| `openDrawer`     | 打开抽屉 | `openDrawer(data)`                  |
| `closeDrawer`    | 关闭抽屉 | `closeDrawer()`                     |
| `setDrawerProps` | 设置属性 | `setDrawerProps({ loading: true })` |

### 完整示例

```vue
<template>
  <n-button @click="handleOpen">打开抽屉</n-button>

  <BasicDrawer @register="register" @ok="handleOk">
    <div>内容</div>
  </BasicDrawer>
</template>

<script setup lang="ts">
import { BasicDrawer, useDrawer } from '@/components';

const [register, { openDrawer, closeDrawer, setDrawerProps }] = useDrawer();

const handleOpen = () => {
  openDrawer({ id: 1 });
};

const handleOk = async () => {
  setDrawerProps({ loading: true });
  // 提交逻辑...
  setDrawerProps({ loading: false });
  closeDrawer();
};
</script>
```

---

## 事件

| 事件名     | 说明         |
| ---------- | ------------ |
| `register` | 注册事件     |
| `ok`       | 点击确定按钮 |
| `close`    | 点击取消按钮 |

---

## 使用 useDrawerInner

用于在抽屉内部获取实例方法：

```vue
<template>
  <BasicDrawer @register="register">
    <n-button @click="handleClose">关闭</n-button>
  </BasicDrawer>
</template>

<script setup lang="ts">
import { BasicDrawer, useDrawerInner } from '@/components';

const [register, { closeDrawer, setDrawerProps }] = useDrawerInner();

const handleClose = () => {
  closeDrawer();
};
</script>
```
