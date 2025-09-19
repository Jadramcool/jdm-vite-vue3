<template>
  <BasicModal
    v-bind="attrs"
    @register="register"
    @ok="handleOk"
    :title="getTitle"
    class="create-modal"
  >
    <BasicForm @register="registerForm">
      <template #navigationIcon="{ model, field }">
        <NInput v-model:value="model[field]" placeholder="请输入图标URL或点击按钮获取" clearable>
          <template #prefix>
            <n-image
              height="20"
              width="20"
              v-if="isUrl(model[field])"
              :src="model[field]"
              :preview-src-list="[model[field]]"
            />
          </template>
          <template #suffix>
            <JayIcon @click="handleGetIcon" :icon="'mdi:freebsd'" style="cursor: pointer"></JayIcon>
          </template>
        </NInput>
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
import { NavigationApi } from '@/api';
import { BasicForm, BasicModal, useForm, useModalInner } from '@/components';
import { JayIcon } from '@/components/common';
import { isUrl } from '@/utils';
import { useCreateModalSchema } from '../schema';

/**
 * 创建分组/导航弹窗组件
 * 用于新增和编辑导航分组和导航项
 */
defineOptions({ name: 'CreateModal' });

const emit = defineEmits(['register', 'success']);

const attrs = useAttrs();

const isUpdate = ref<boolean>(false); // 是否是更新
const modalType = ref<'group' | 'navigation'>('navigation'); // 弹窗类型
const entityId = ref<number>(0); // 实体ID
const currentGroup = ref<Navigation.NavigationGroup | null>(null); // 当前分组

/**
 * 获取弹窗标题
 */
const getTitle = computed(() => {
  const typeText = modalType.value === 'group' ? '分组' : '导航';
  return `${unref(isUpdate) ? '编辑' : '创建'}${typeText}`;
});

/**
 * 注册表单实例
 * 使用computed确保schema变化时能重新获取配置
 */
const [registerForm, { setFieldsValue, resetFields, submit, getFieldsValue, validate }] = useForm({
  labelWidth: 120,
  gridProps: { cols: 1 },
  schemas: computed(() => {
    const { getFormSchemas } = useCreateModalSchema();
    return getFormSchemas(modalType.value);
  }),
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
  currentGroup.value = data?.group?.id ? data.group : null;
  // 设置表单默认值
  if (modalType.value === 'navigation' && currentGroup.value) {
    await setFieldsValue({
      groupIds: [currentGroup.value.id],
      path: 'https://www.baidu.com',
    });
  }

  // 编辑时设置表单值
  if (isUpdate.value && data?.record) {
    const formData = { ...data.record };

    // 如果是导航编辑，需要将单个groupId转换为groupIds数组以适配多选组件
    if (modalType.value === 'navigation' && formData.groupId) {
      // 当前后端只存储单个分组ID，转换为数组格式
      formData.groupIds = [formData.groupId];
      console.log('编辑模式 - 原始分组ID:', formData.groupId);
      console.log('编辑模式 - 转换后的分组IDs:', formData.groupIds);
    }

    await setFieldsValue(formData);
  }

  setModalProps({ loading: false });
});

/**
 * 获取网站图标和信息
 */
const handleGetIcon = async () => {
  try {
    const formValues = getFieldsValue();
    const websiteUrl = formValues.path;

    if (!websiteUrl) {
      window.$message?.warning('请先输入网站URL');
      return;
    }

    // 调用 API 获取网站信息
    const response = await NavigationApi.websiteInfo({ url: websiteUrl });
    if (response?.title && response?.icon) {
      await setFieldsValue({
        name: response.title,
        icon: response.icon,
      });
    }
  } catch (error) {
    console.error('获取网站信息失败:', error);
    window.$message?.error(
      `获取网站信息失败，请检查URL格式:${error instanceof Error ? error.message : '未知错误'}`,
    );
  }
};

/**
 * 处理确认按钮点击
 */
const handleOk = async () => {
  try {
    setModalProps({ confirmLoading: true });

    // 验证表单
    const valid = await validate();
    if (!valid) {
      window.$message?.warning('请填写完整信息');
      return;
    }

    const values = await submit();
    console.log('表单数据:', values);

    // 如果是导航操作，处理groupIds数组
    if (modalType.value === 'navigation' && values.groupIds && Array.isArray(values.groupIds)) {
      if (values.groupIds.length === 0) {
        window.$message?.error('请至少选择一个分组');
        return;
      }
    }

    if (modalType.value === 'group') {
      // 处理分组创建/编辑
      if (isUpdate.value) {
        values.id = entityId.value;
        await NavigationApi.updateNavigationGroup(values);
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
