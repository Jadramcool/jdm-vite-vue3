<template>
  <BasicModal v-bind="attrs" @register="register" @ok="handleOk" :title="getTitle">
    <BasicForm @register="registerForm"></BasicForm>
    <BasicForm @register="registerExtraForm"></BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
import { MenuApi } from '@/api';
import { BasicForm, BasicModal, useForm, useModalInner } from '@/components';
import { $t } from '@/locales/i18n';
import { useMenuSchema } from '../schema';

defineOptions({ name: 'menuModal' });

const emit = defineEmits(['register', 'success']);

const attrs = useAttrs();

const entityId = ref<number>(0); // 实体ID
const isUpdate = ref<boolean>(false); // 是否是更新

const getTitle = computed(() => {
  return (
    (unref(isUpdate) ? $t('common.edit') : $t('common.add')) + $t('common.system.menu.schema.menu')
  );
});
const { editFormSchemas, extraDataFromSchemas } = useMenuSchema();

const [registerForm, { setFieldsValue, resetFields, submit }] = useForm({
  labelWidth: 120,
  gridProps: { cols: '1 s:1 m:2' },
  schemas: editFormSchemas,
  showActionButtonGroup: false,
});

const [
  registerExtraForm,
  { setFieldsValue: setFieldsValue2, resetFields: resetFields2, submit: submit2 },
] = useForm({
  labelWidth: 120,
  gridProps: { cols: '1 s:1 m:2' },
  schemas: extraDataFromSchemas,
  showActionButtonGroup: false,
});

const [register, { closeModal, setModalProps }] = useModalInner(async (data) => {
  await resetFields();
  await resetFields2();
  isUpdate.value = !!data?.isUpdate;
  entityId.value = data?.record?.id;

  const extraData = data?.record?.extraData ? JSON.parse(data?.record?.extraData) : {};
  if (isUpdate.value) {
    setFieldsValue(data.record);
    setFieldsValue2(extraData);
  }
});

const handleOk = async () => {
  try {
    setModalProps({ confirmLoading: true });
    const values = await submit();
    const extraValues = await submit2();
    const allValues = { ...values, extraData: JSON.stringify(extraValues) };
    if (allValues) {
      if (!unref(isUpdate)) {
        await MenuApi.createMenu(allValues);
      } else {
        await MenuApi.updateMenu({ id: entityId.value, ...allValues });
      }
      emit('success');
      closeModal();
    }
  } catch (error: any) {
    console.error(error);
    window.$message?.error(error);
  } finally {
    setModalProps({ confirmLoading: false });
  }
};
</script>
