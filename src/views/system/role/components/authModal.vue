<template>
  <BasicModal v-bind="attrs" @register="register" @ok="handleOk" :headTitle="getTitle">
    <BasicForm @register="registerForm"></BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
import { RoleApi } from '@/api';
import { BasicForm, BasicModal, useForm, useModalInner } from '@/components';
import { $t } from '@/locales/i18n';
import { useRoleSchema } from '../schema';

defineOptions({ name: 'menuModal' });

const emit = defineEmits(['register', 'success']);

const attrs = useAttrs();

const entityId = ref<number>(0); // 实体ID

const getTitle = computed(() => {
  return $t('modules.system.role.schema.menu');
});

const { authFormSchemas } = useRoleSchema();

const [registerForm, { setFieldsValue, resetFields, submit }] = useForm({
  labelWidth: 120,
  gridProps: { cols: 1 },
  schemas: authFormSchemas,
  showActionButtonGroup: false,
});

const [register, { closeModal, setModalProps }] = useModalInner(async (data) => {
  await resetFields();
  entityId.value = data?.record?.id;
  const { menus } = data.record;
  const menuIds: number[] = menus.map((item: System.Menu) => item.id);
  await setFieldsValue({ menu: menuIds });
});

const handleOk = async () => {
  try {
    setModalProps({ confirmLoading: true });
    const values = await submit();
    if (values) {
      const { menu: menuIds } = values;
      await RoleApi.updateRoleMenu({ roleId: entityId.value, menuIds });
      emit('success');
      window.$message.success('分配菜单权限成功！');
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
