<template>
  <BasicDrawer v-bind="attrs" @register="register" @ok="handleOk" :headTitle="getTitle">
    <!-- <template #header> 自定义抽屉头 </template>
    <template #footer> <n-button> 额外的按钮 </n-button> </template> -->
    <BasicForm @register="registerForm"></BasicForm>
  </BasicDrawer>
</template>

<script setup lang="ts">
import { UserManagerApi } from '@/api';
import { BasicDrawer, BasicForm, useDrawerInner, useForm } from '@/components';
import { $t } from '@/locales/i18n';
import dayjs from 'dayjs';
import { useUserSchema } from '../schema';

const attrs = useAttrs();

const emit = defineEmits(['success', 'register']);

const isUpdate = ref<boolean>(false); // 是否是更新
const entityId = ref<Nullable<number>>(null); // 实体id
const getTitle = computed(() => {
  return (
    (unref(isUpdate) ? $t('common.edit') : $t('common.add')) + $t('common.system.user.schema.user')
  );
});

const { editFormSchemas } = useUserSchema();

const [
  registerForm,
  { setFieldsValue, resetFields, updateSchema, validateFields, submit, getFieldsValue },
] = useForm({
  labelWidth: 120,
  gridProps: { cols: 1 },
  schemas: editFormSchemas,
  showActionButtonGroup: false,
  submitFunc: async () => {
    // 自定义验证
    try {
      await validateFields(['username', 'phone']);
      const values = getFieldsValue();

      values.roles = values.role;
      delete values.role;

      if (values) {
        if (!unref(isUpdate)) {
          await UserManagerApi.addUser(values);
        } else {
          await UserManagerApi.updateUser(values);
        }
        closeDrawer();
        emit('success');
      }
    } catch (e: any) {
      window.$message.error(e);
    }
  },
});

const [register, { closeDrawer, setDrawerProps }] = useDrawerInner(async (data) => {
  await resetFields();
  isUpdate.value = !!data?.isUpdate;
  entityId.value = data?.record?.id;

  // 新增的时候，将username字段禁用取消
  if (!unref(isUpdate)) {
    await updateSchema([
      {
        field: 'id',
        componentProps: {
          disabled: false,
        },
        ifShow: false,
      },
      {
        field: 'username',
        defaultValue: `user${dayjs().format('DD~HH:mm:ss')}`,
        componentProps: {
          disabled: false,
        },
      },
    ]);
  }

  // isUpdate填充数据
  if (unref(isUpdate)) {
    data.record.role = data.record.roles.map((role: System.Role) => role.id);
    await setFieldsValue({
      ...data.record,
    });
  }
});

const handleOk = async () => {
  try {
    setDrawerProps({ confirmLoading: true });
    await submit();
  } catch (e) {
    console.error(e);
  } finally {
    setDrawerProps({ confirmLoading: false });
  }
};
</script>

<style scoped lang="scss"></style>
