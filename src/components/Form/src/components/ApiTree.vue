<template>
  <n-spin :show="loading">
    <n-flex v-if="getProps.showSearchForm" align="center" justify="space-between" class="mb-4">
      <div>
        <n-input v-model:value="pattern" placeholder="搜索" size="small" />
      </div>
      <div>
        <n-switch v-model:value="showIrrelevantNodes" size="small">
          <template #checked> 展示无关 </template>
          <template #unchecked> 隐藏无关 </template>
        </n-switch>
      </div>
    </n-flex>
    <NTree
      v-bind="getBindValue"
      block-line
      v-model:checked-keys="modelValue"
      :data="data"
      :pattern="pattern"
      :on-update:checked-keys="handleCheckedKeys"
      :default-expand-all="true"
    />
  </n-spin>
</template>

<script lang="ts" setup>
import type { TreeOption } from 'naive-ui';
import { NTree } from 'naive-ui';

const modelValue: any = defineModel('value');
const attrs = useAttrs();
const props = defineProps({
  ...NTree.props,
  // 是否级联
  cascade: {
    type: Boolean,
    default: false,
  },
  // 是否显示选择框
  checkable: {
    type: Boolean,
    default: true,
  },
  // 是否允许点击节点进行勾选，仅在 checkable 为 true 时生效
  checkOnClick: {
    type: Boolean,
    default: true,
  },
  // 节点整行撑开
  blockLine: {
    type: Boolean,
    default: true,
  },
  // 默认选中的多选项
  defaultCheckedKeys: {
    type: Array as PropType<string[] | number[]>,
    default: () => [],
  },
  // 显示节点线
  showLine: {
    type: Boolean,
    default: true,
  },
  api: {
    type: Function as PropType<(arg?: any) => Promise<any[] | Recordable>>,
    default: () => ({}),
  },
  afterRequest: {
    type: Function as PropType<(res: any) => any>,
    default: () => ({}),
  },
  autoLoad: {
    type: Boolean,
    default: true,
  },
  // 是否显示搜索框
  showSearchForm: {
    type: Boolean,
    default: false,
  },
  // 是否采用自定义级联
  isCustomCascader: {
    type: Boolean,
    default: true,
  },
});

const loading = ref<boolean>(false);
// 树形数据
const data = ref<TreeOption[]>([]);
// 扁平结构
const flattenData = ref<TreeOption[]>([]);
// 搜索关键字
const pattern = ref<string>('');
// 是否展示搜索无关的节点
const showIrrelevantNodes = ref<boolean>(false);

const getProps = computed(() => {
  return {
    ...unref(attrs),
    ...unref(props),
  };
});

const getBindValue = computed(() => {
  return { ...unref(getProps) };
});

const apiMethod = computed(() => {
  return unref(getProps).api || false;
});

// 平铺菜单,就挺蠢的，我获取到的本来就是扁平的，然后出力成树形结构，我还要平铺的，真的好蠢，谁让这个是个组件，不确定返回结果
const getFlattenData = (datas: Recordable[]): Recordable[] => {
  let result: Recordable[] = [];

  for (const data of datas) {
    result.push(data); // 将当前菜单添加到结果数组
    if (data.children && data.children.length > 0) {
      result = result.concat(getFlattenData(data.children)); // 递归添加子菜单
    }
  }

  return result;
};

// 获取选中节点的子节点值
const getCheckChildrenValues = (checkData: any): any => {
  const values: any = [checkData];
  let childrenValues: any = [];
  if (checkData.children && checkData.children.length > 0) {
    checkData.children.forEach((item: any) => {
      childrenValues = [...childrenValues, ...getCheckChildrenValues(item)];
    });
  }
  if (childrenValues.length > 0) {
    return [...values, ...childrenValues];
  }

  return values;
};

//  获取选中个节点的父节点
const getCheckParentValues = (checkData: any): any => {
  let parentValues: any = [];
  if (checkData.pid) {
    const parentId = checkData.pid;
    const parent = flattenData.value.find((item: any) => item.id === parentId);

    if (parent && parent.pid) {
      parentValues = [...parentValues, ...getCheckParentValues(parent)];
    } else {
      parentValues = [...parentValues, parent];
    }
  }
  if (parentValues.length > 0) {
    return [...parentValues, checkData];
  }

  return [];
};

// 监听选中节点
const handleCheckedKeys = (
  keys: string[] | number[],
  option: Array<TreeOption | null>,
  meta: { node: TreeOption | null; action: 'check' | 'uncheck' },
) => {
  if (!unref(getProps).isCustomCascader) {
    modelValue.value = keys;
    return;
  }
  const checkData = meta.node;
  const childrenValues = getCheckChildrenValues(checkData);
  const parentValues = getCheckParentValues(checkData);

  let selectKeys: number[] | string[] = [];
  if (meta.action === 'check') {
    // 选中节点
    const newValues = [...option, ...childrenValues, ...parentValues];

    selectKeys = [...new Set(newValues.map((item: any) => item.id))];
  } else {
    // 取消选中节点
    const a = new Set(option);
    const b = new Set(childrenValues);
    const newValues = [...new Set([...a].filter((x) => !b.has(x)))];
    selectKeys = [...new Set(newValues.map((item: any) => item.id))];
  }

  modelValue.value = selectKeys;
};

onMounted(() => {
  if (unref(getProps).autoLoad) {
    fetch();
  }
});

const fetch = async () => {
  try {
    if (unref(apiMethod)) {
      loading.value = true;
      const res: any = await unref(apiMethod)();

      const resData: any[] = Array.isArray(res) ? res : res.data;
      let optionData: any[] = resData;

      // 后处理
      if (unref(getProps).afterRequest) {
        optionData = unref(getProps).afterRequest(resData);
      }

      // options.value = transferOptions(optionData);
      data.value = optionData;
    } else {
      data.value = unref(getProps).data;
    }

    // 扁平化数据
    flattenData.value = getFlattenData(data.value);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
