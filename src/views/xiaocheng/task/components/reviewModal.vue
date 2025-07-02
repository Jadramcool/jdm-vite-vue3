<template>
  <BasicModal
    v-bind="attrs"
    @register="register"
    @ok="handleOk"
    :title="getTitle"
    cardWidth="600px"
    cardHeight="200px"
  >
    <n-space align="start" vertical size="large" class="text-lg">
      <div>评审类型：{{ displayData.type }}</div>
      <div class="flex items-center">
        <span> 项目：</span>
        <n-checkbox-group v-model:value="checkProjects">
          <n-space item-style="display: flex;">
            <n-checkbox
              v-for="item in checkList"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </n-space>
        </n-checkbox-group>
      </div>
      <div>分支：{{ displayData.branchName }}</div>
      <div>内容：{{ displayData.name }}</div>
    </n-space>
  </BasicModal>
</template>

<script setup lang="ts">
import { BasicModal, useModalInner } from '@/components';

defineOptions({ name: 'noticeModal' });

const attrs = useAttrs();

const entityId = ref<number>(0); // 实体ID
const entity = ref<any>({}); // 实体
const defaultCheckedList = [
  {
    label: '商户后台',
    value: 1,
  },
  {
    label: '集团后台',
    value: 2,
  },
  {
    label: 'lark-bar-webapp',
    value: 3,
  },
  {
    label: '收银台',
    value: 4,
  },
];

const checkList = ref<any>([]); // 选中的项目
const checkProjects = ref<any>([]); // 选中的项目

const displayData = ref<any>({}); // 显示数据

// 获取选中的项目字符串
const selectedProjectsString = computed(() => {
  return checkProjects.value.join('、');
});

const getTitle = computed(() => {
  return '评审';
});

const [register, { closeModal }] = useModalInner(async (data) => {
  entityId.value = data?.record?.id;
  entity.value = data?.record;

  // 每次打开时重置选中状态
  checkList.value = defaultCheckedList.map((item) => ({
    ...item,
  }));

  let type = '';
  if (entity.value.type === 'BUG') {
    type = 'bug';
  } else if (entity.value.type === 'REQ') {
    type = 'ft';
  } else if (entity.value.type === 'OPT') {
    type = 'perf';
  }
  const projectPrefix = entity.value.project.prefix.toLowerCase();
  const branchName = `${type}_${projectPrefix}${entity.value.id}`;

  displayData.value = {
    type,
    branchName,
    name: entity.value.name,
  };
});

const handleOk = async () => {
  const reviewContent = `【评审】
项目：${selectedProjectsString.value}
分支：${displayData.value.branchName}
内容：${entity.value.name}${displayData.value.type === 'bug' ? '@谢郑柱' : '@刘家瑞'}`;

  navigator.clipboard.writeText(reviewContent);
  window.$message.success(`已复制评审内容`);
  closeModal();
};
</script>
