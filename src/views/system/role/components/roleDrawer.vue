<template>
  <BasicDrawer v-bind="attrs" @register="register" @ok="handleOk" :headTitle="getTitle">
    <BasicForm @register="registerForm"></BasicForm>
  </BasicDrawer>
</template>

<script setup lang="ts">
import { RoleApi } from '@/api';
import { BasicDrawer, BasicForm, useDrawerInner, useForm } from '@/components';
import { $t } from '@/locales/i18n';
import { useRoleSchema } from '../schema';

const attrs = useAttrs();

const emit = defineEmits(['success', 'register']);

const isUpdate = ref<boolean>(false); // 是否是更新
const entityId = ref<Nullable<number>>(null); // 实体id
const getTitle = computed(() => {
  return (
    (unref(isUpdate) ? $t('common.edit') : $t('common.add')) + $t('common.system.user.schema.user')
  );
});

const { editFormSchemas } = useRoleSchema();

const [registerForm, { setFieldsValue, resetFields, updateSchema, submit }] = useForm({
  labelWidth: 120,
  gridProps: { cols: 1 },
  schemas: editFormSchemas,
  showActionButtonGroup: false,
});

const [register, { closeDrawer, setDrawerProps }] = useDrawerInner(async (data) => {
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
  } else if (data.record.code === 'DEFAULT') {
    await updateSchema([
      {
        field: 'code',
        componentProps: {
          disabled: true,
        },
      },
    ]);
  }

  // isUpdate填充数据
  if (unref(isUpdate)) {
    await setFieldsValue({
      ...data.record,
    });
  }
});

const handleOk = async () => {
  try {
    setDrawerProps({ confirmLoading: true });
    const values = await submit();

    if (values) {
      if (!unref(isUpdate)) {
        await RoleApi.addRole(values);
      } else {
        await RoleApi.updateRole(values);
      }
      closeDrawer();
      emit('success');
    }
  } catch (e) {
    console.error(e);
  } finally {
    setDrawerProps({ confirmLoading: false });
  }
};
</script>

<style scoped lang="scss"></style>
