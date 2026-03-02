<template>
  <BasicModal
    v-bind="attrs"
    @register="register"
    @ok="handleOk"
    :title="getTitle"
    :loading="loading"
  >
    <BasicForm @register="registerForm"></BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
import { DepartmentApi } from '@/api';
import { BasicForm, BasicModal, useForm, useModalInner } from '@/components';
import { useDepartmentSchema } from '../schema';

defineOptions({ name: 'departmentModal' });

const emit = defineEmits(['register', 'success']);

const attrs = useAttrs();

const entityId = ref<number>(0); // 实体ID
const isUpdate = ref<boolean>(false); // 是否是更新
const loading = ref<boolean>(false); // 加载状态

const getTitle = computed(() => {
  return `${unref(isUpdate) ? '编辑' : '新增'}部门`;
});
const { editFormSchemas } = useDepartmentSchema();

const [registerForm, { setFieldsValue, resetFields, submit }] = useForm({
  labelWidth: 120,
  gridProps: { cols: '1 s:1 m:2' },
  schemas: editFormSchemas,
  showActionButtonGroup: false,
});

const [register, { closeModal, setModalProps }] = useModalInner(async (data) => {
  loading.value = true;
  await resetFields();
  isUpdate.value = !!data?.isUpdate;
  entityId.value = data?.record?.id;
  if (isUpdate.value) {
    await setFieldsValue(data.record);
  }
  loading.value = false;
});

const handleOk = async () => {
  try {
    loading.value = true;
    setModalProps({ confirmLoading: true });
    const values = await submit();
    const allValues = { ...values };
    if (allValues) {
      if (!unref(isUpdate)) {
        await DepartmentApi.createDepartment(allValues);
      } else {
        await DepartmentApi.updateDepartment({ id: entityId.value, ...allValues });
      }
      emit('success');
      closeModal();
    }
  } catch (error: any) {
    console.error(error);
    window.$message?.error(error);
  } finally {
    loading.value = false;
    setModalProps({ confirmLoading: false });
  }
};
</script>
