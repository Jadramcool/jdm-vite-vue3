<template>
  <BasicModal v-bind="attrs" @register="register" @ok="handleOk" :title="getTitle">
    <BasicForm @register="registerForm"></BasicForm>
    <RoleUserSelect></RoleUserSelect>
  </BasicModal>
</template>

<script setup lang="ts">
import { NoticeApi } from '@/api';
import { BasicForm, BasicModal, useForm, useModalInner } from '@/components';
import { $t } from '@/locales/i18n';
import { useNoticeSchema } from '../schema';

defineOptions({ name: 'sendNoticeModal' });

const emit = defineEmits(['register', 'success']);

const attrs = useAttrs();

const isUpdate = ref<boolean>(false); // 是否是更新
const entityId = ref<number>(0); // 实体ID

const getTitle = computed(
  () => $t('modules.notice.notice.schema.send') + $t('modules.notice.notice.notice'),
);
const { editFormSchemas } = useNoticeSchema();

const [registerForm, { setFieldsValue, resetFields, submit, updateSchema }] = useForm({
  labelWidth: 120,
  gridProps: { cols: 1 },
  schemas: editFormSchemas,
  showActionButtonGroup: false,
});

const [register, { closeModal, setModalProps }] = useModalInner(async (data) => {
  await resetFields();
  isUpdate.value = !!data?.isUpdate;
  entityId.value = data?.record?.id;

  if (!unref(isUpdate)) {
    await updateSchema([
      {
        field: 'id',
        ifShow: false,
      },
    ]);
  }
  if (isUpdate.value) {
    setFieldsValue(data.record);
  }
});

const handleOk = async () => {
  try {
    setModalProps({ confirmLoading: true });
    const values = await submit();
    if (values) {
      if (!unref(isUpdate)) {
        await NoticeApi.createNotice(values);
      } else {
        await NoticeApi.updateNotice(values);
      }
      closeModal();
      window.$message.success(
        (unref(isUpdate) ? $t('common.edit') : $t('common.add')) +
          $t('modules.notice.notice.notice') +
          $t('common.success'),
      );
      emit('success');
    }
  } catch (error: any) {
    console.error(error);
    window.$message?.error(error);
  } finally {
    setModalProps({ confirmLoading: false });
  }
};
</script>
