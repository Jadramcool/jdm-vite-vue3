<template>
  <BasicModal
    v-bind="attrs"
    @register="register"
    @ok="handleOk"
    :title="getTitle"
    class="create-modal"
  >
    <BasicForm @register="registerForm"></BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
import { NavigationApi } from '@/api';
import { BasicForm, BasicModal, useForm, useModalInner } from '@/components';
import { useCreateModalSchema } from '../schema';

/**
 * 创建分组/导航弹窗组件
 * 用于新增和编辑导航分组和导航项
 */
defineOptions({ name: 'CreateModal' });

const emit = defineEmits(['register', 'success']);

const attrs = useAttrs();

const isUpdate = ref<boolean>(false); // 是否是更新
const modalType = ref<'group' | 'navigation'>('group'); // 弹窗类型
const entityId = ref<number>(0); // 实体ID
const currentGroup = ref<Navigation.NavigationGroup | null>(null); // 当前分组

/**
 * 获取弹窗标题
 */
const getTitle = computed(() => {
  const typeText = modalType.value === 'group' ? '分组' : '导航';
  return `${unref(isUpdate) ? '编辑' : '创建'}${typeText}`;
});

const { getFormSchemas } = useCreateModalSchema();

/**
 * 注册表单实例
 */
const [registerForm, { setFieldsValue, resetFields, submit }] = useForm({
  labelWidth: 120,
  gridProps: { cols: 1 },
  schemas: computed(() => getFormSchemas(modalType.value)),
  showActionButtonGroup: false,
});

/**
 * 注册弹窗实例
 * 处理弹窗打开时的数据初始化
 */
const [register, { closeModal, setModalProps }] = useModalInner(async (data) => {
  await resetFields();

  isUpdate.value = !!data?.isUpdate;
  modalType.value = data?.type || 'group';
  entityId.value = data?.record?.id;
  currentGroup.value = data?.group || null;

  // 设置表单默认值
  if (modalType.value === 'navigation' && currentGroup.value) {
    await setFieldsValue({
      groupId: currentGroup.value.id,
    });
  }

  // 编辑时设置表单值
  if (isUpdate.value && data?.record) {
    await setFieldsValue({
      ...data.record,
    });
  }

  setModalProps({ loading: false });
});

/**
 * 处理确认按钮点击
 */
const handleOk = async () => {
  try {
    setModalProps({ confirmLoading: true });

    const values = await submit();
    console.log('表单数据:', values);

    if (modalType.value === 'group') {
      // 处理分组创建/编辑
      if (isUpdate.value) {
        await NavigationApi.updateNavigationGroup(entityId.value, values);
        window.$message?.success('分组更新成功');
      } else {
        await NavigationApi.createNavigationGroup(values);
        window.$message?.success('分组创建成功');
      }
    }
    // 处理导航创建/编辑
    else if (isUpdate.value) {
      values.id = entityId.value;
      await NavigationApi.updateNavigation(values);
      window.$message?.success('导航更新成功');
    } else {
      await NavigationApi.createNavigation(values);
      window.$message?.success('导航创建成功');
    }

    closeModal();
    emit('success');
  } catch (error) {
    console.error('操作失败:', error);
    window.$message?.error('操作失败，请重试');
  } finally {
    setModalProps({ confirmLoading: false });
  }
};
</script>

<style scoped lang="scss"></style>
