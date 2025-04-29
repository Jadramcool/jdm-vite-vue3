<template>
  <BasicModal
    v-bind="attrs"
    @register="register"
    @ok="handleOk"
    :title="getTitle"
    :cardHeight="'600px'"
    :cardWidth="'1000px'"
  >
    <n-card hoverable>
      <n-thing>
        <template #header> {{ entity.title }} </template>
        <template #description>
          {{ entity.content }}
        </template>
        <template #header-extra>
          <n-tag :bordered="false" :type="NoticeTypeColorMap[entity.type]">
            {{ NoticeTypeOptions.find((item) => item.value == entity.type)?.label }}
          </n-tag>
        </template>
      </n-thing>
    </n-card>

    <n-divider />

    <RoleUserSelect ref="selectUserRef" :selectedUserIds="receiverIds"></RoleUserSelect>
  </BasicModal>
</template>

<script setup lang="ts">
import { NoticeApi } from '@/api';
import { BasicModal, useModalInner } from '@/components';
import { NoticeTypeColorMap, NoticeTypeOptions } from '@/constants';
import { $t } from '@/locales/i18n';
import { useTemplateRef } from 'vue';

defineOptions({ name: 'sendNoticeModal' });

const emit = defineEmits(['register', 'success']);

const attrs = useAttrs();
const selectUserRef = useTemplateRef<any>('selectUserRef');

const entityId = ref<number>(0); // 实体ID
const entity = ref<any>({});
const receiverIds = ref<any[]>([]);

const getTitle = computed(
  () => $t('modules.notice.notice.schema.send') + $t('modules.notice.notice.notice'),
);

const [register, { closeModal, setModalProps }] = useModalInner(async (data) => {
  entity.value = data?.record;
  const receivers = entity.value?.receivers || [];
  receiverIds.value = receivers.map((item: any) => item.userId);
  entityId.value = data?.record?.id;
});

const handleOk = async () => {
  try {
    setModalProps({ confirmLoading: true });
    await selectUserRef.value.validate();
    const values = await selectUserRef.value.getSelectUsers();
    await NoticeApi.sendNotice({
      id: entityId.value,
      userIds: values,
    });
    emit('success');
    window.$message.success('发送成功！');
    closeModal();
  } catch (error: any) {
    console.error(error);
    window.$message?.error(error[0]?.message);
  } finally {
    setModalProps({ confirmLoading: false });
  }
};
</script>
