<template>
  <BasicModal v-bind="attrs" @register="register" @ok="handleOk" :headTitle="getTitle">
    <BasicForm @register="registerForm"></BasicForm>
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

const { editFormSchemas } = useMenuSchema();

const [registerForm, { setFieldsValue, resetFields, submit }] = useForm({
  labelWidth: 120,
  gridProps: { cols: '1 s:1 m:2' },
  schemas: editFormSchemas,
  showActionButtonGroup: false,
});

const [register, { closeModal, setModalProps }] = useModalInner(async (data) => {
  await resetFields();
  isUpdate.value = !!data?.isUpdate;
  entityId.value = data?.record?.id;

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
        await MenuApi.createMenu(values);
      } else {
        await MenuApi.updateMenu({ id: entityId.value, ...values });
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
