<template>
  <BasicModal
    v-bind="attrs"
    @register="register"
    @ok="handleOk"
    :title="getTitle"
    :cardHeight="600"
    :cardWidth="1000"
  >
    <BasicForm ref="formRef" @register="registerForm"></BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
import { DoctorScheduleApi } from '@/api';
import { BasicForm, BasicModal, useForm, useModalInner } from '@/components';
import { $t } from '@/locales/i18n';
import { useCommonStore } from '@/store';
import { useScheduleSchema } from '../schema';

defineOptions({ name: 'ScheduleModal' });

const commonStore = useCommonStore();

const emit = defineEmits(['register', 'success']);

const attrs = useAttrs();

const isUpdate = ref<boolean>(false); // 是否是更新
const entityId = ref<number>(0); // 实体ID
const entityData = ref<Recordable>({}); // 实体ID

const formRef = ref();

const getTitle = computed(() => {
  return unref(isUpdate) ? '编辑排班' : '新增排班';
});

const { editFormSchemas } = useScheduleSchema();

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
  entityData.value = data?.record;

  if (!unref(isUpdate)) {
    await updateSchema([
      {
        field: 'id',
        ifShow: false,
      },
      {
        field: 'departmentId',
        defaultValue: commonStore.getDepartmentOptions[0].value,
      },
    ]);
  }
  if (unref(isUpdate)) {
    const formData = {
      departmentId: entityData.value.doctor.departmentId,
      doctorId: entityData.value.doctorId,
    };
    await setFieldsValue(formData);
  }
});

const handleOk = async () => {
  try {
    setModalProps({ confirmLoading: true });
    const values = await submit();
    if (values) {
      await DoctorScheduleApi.update(values);
      closeModal();
      window.$message.success(
        (unref(isUpdate) ? $t('common.edit') : $t('common.add')) + $t('common.success'),
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
