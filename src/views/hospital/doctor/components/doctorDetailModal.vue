<template>
  <BasicModal v-bind="attrs" @register="register" :title="getTitle" :showCancelButton="false">
    <n-descriptions label-placement="left" bordered :column="6">
      <n-descriptions-item :span="3">
        <template #label> 早餐 </template>
        苹果
      </n-descriptions-item>
    </n-descriptions>
  </BasicModal>
</template>

<script setup lang="ts">
import { BasicModal, useModalInner } from '@/components';

defineOptions({ name: 'noticeModal' });

const attrs = useAttrs();

const entityId = ref<number>(0); // 实体ID

const getTitle = computed(() => {
  return '医生详情';
});
// const { editFormSchemas } = useDepartmentSchema();

const [register] = useModalInner(async (data) => {
  console.log('🚀 ~ const[register,{closeModal,setModalProps}]=useModalInner ~ data:', data.record);

  entityId.value = data?.record?.id;
});
</script>
