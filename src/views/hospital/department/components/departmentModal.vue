<template>
  <BasicModal v-bind="attrs" @register="register" @ok="handleOk" :title="getTitle">
    <BasicForm @register="registerForm"></BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
import { DepartmentApi } from '@/api';
import { BasicForm, BasicModal, useForm, useModalInner } from '@/components';
import { useDepartmentSchema } from '../schema';

defineOptions({ name: 'noticeModal' });

const emit = defineEmits(['register', 'success']);

const attrs = useAttrs();

const isUpdate = ref<boolean>(false); // 是否是更新
const entityId = ref<number>(0); // 实体ID

const getTitle = computed(() => {
  return unref(isUpdate) ? '编辑部门' : '新增部门';
});
const { editFormSchemas } = useDepartmentSchema();

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
        await DepartmentApi.createDepartment(values);
      } else {
        await DepartmentApi.updateDepartment(values);
      }
      closeModal();
      window.$message.success(unref(isUpdate) ? '编辑科室成功' : '新增科室成功');
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
