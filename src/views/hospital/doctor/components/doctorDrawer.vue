<template>
  <BasicDrawer v-bind="attrs" @register="register" @ok="handleOk" :headTitle="getTitle">
    <BasicForm @register="registerForm"></BasicForm>
  </BasicDrawer>
</template>

<script setup lang="ts">
import { DoctorApi } from '@/api';
import { BasicDrawer, BasicForm, useDrawerInner, useForm } from '@/components';
import { $t } from '@/locales/i18n';
import { flattenObject } from '@/utils';
import dayjs from 'dayjs';
import { useDoctorSchema } from '../schema';

const attrs = useAttrs();

const emit = defineEmits(['success', 'register']);

const isUpdate = ref<boolean>(false); // 是否是更新
const entityId = ref<Nullable<number>>(null); // 实体id
const getTitle = computed(() => {
  return (
    (unref(isUpdate) ? $t('common.edit') : $t('common.add')) + $t('common.system.user.schema.user')
  );
});

const { editFormSchemas } = useDoctorSchema();

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
      await validateFields(['username']);
      const values = getFieldsValue();

      values['user.roles'] = values['user.role'];
      delete values['user.role'];
      if (values) {
        if (!unref(isUpdate)) {
          await DoctorApi.create(values);
        } else {
          values.id = entityId.value;
          await DoctorApi.update(values);
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
        field: 'user.username',
        defaultValue: `user${dayjs().format('DD~HH:mm:ss')}`,
        componentProps: {
          disabled: false,
        },
      },
    ]);
  }

  // isUpdate填充数据
  if (unref(isUpdate)) {
    data.record.user.role = data.record.user.roles.map((role: System.Role) => role.id);
    const newObj = flattenObject(data.record);
    console.log(
      '🚀 ~ const[register,{closeDrawer,setDrawerProps}]=useDrawerInner ~ newObj:',
      newObj,
    );

    await setFieldsValue({
      ...newObj,
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
