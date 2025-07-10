<template>
  <BasicModal v-bind="attrs" @register="register" @ok="handleOk" :title="getTitle">
    <BasicForm @register="registerForm"></BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
import { BlogApi } from '@/api';
import { BasicForm, BasicModal, useForm, useModalInner } from '@/components';
import { $t } from '@/locales/i18n';
import { useCategorySchema } from '../schema';

defineOptions({ name: 'categoryModal' });

const emit = defineEmits(['register', 'success']);

const attrs = useAttrs();

const isUpdate = ref<boolean>(false); // 是否是更新
const entityId = ref<number>(0); // 实体ID

const getTitle = computed(() => {
  return (
    (unref(isUpdate) ? $t('common.edit') : $t('common.add')) + $t('modules.blog.category.category')
  );
});
const { editFormSchemas } = useCategorySchema();

const [registerForm, { setFieldsValue, resetFields, submit }] = useForm({
  labelWidth: 120,
  gridProps: { cols: 1 },
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
        await BlogApi.createCategory(values);
      } else {
        await BlogApi.updateCategory(entityId.value, values);
      }
      closeModal();
      window.$message.success(
        (unref(isUpdate) ? $t('common.edit') : $t('common.add')) +
          $t('modules.blog.category.category') +
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
