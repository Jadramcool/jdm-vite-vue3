<template>
  <BasicModal v-bind="attrs" @register="register" @ok="handleOk" :title="getTitle">
    <BasicForm @register="registerForm"></BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
import { ConfigApi } from '@/api';
import { BasicForm, BasicModal, useForm, useModalInner } from '@/components';
import { $t } from '@/locales/i18n';
import { booleanConverter } from '@/utils';
import { useConfigSchema } from '../schema';

/**
 * 系统配置弹窗组件
 * 用于新增和编辑系统配置项
 */
defineOptions({ name: 'configModal' });

const emit = defineEmits(['register', 'success']);

const attrs = useAttrs();

const isUpdate = ref<boolean>(false); // 是否是更新
const entityId = ref<number>(0); // 实体ID

/**
 * 获取弹窗标题
 */
const getTitle = computed(() => {
  return `${unref(isUpdate) ? $t('common.edit') : $t('common.add')}系统配置`;
});
const { editFormSchemas } = useConfigSchema();

/**
 * 注册表单实例
 */
const [registerForm, { setFieldsValue, resetFields, submit, updateSchema }] = useForm({
  labelWidth: 120,
  gridProps: { cols: 1 },
  schemas: editFormSchemas,
  showActionButtonGroup: false,
});

/**
 * 注册弹窗实例
 * 处理弹窗打开时的数据初始化
 */
const [register, { closeModal, setModalProps }] = useModalInner(async (data) => {
  await resetFields();
  isUpdate.value = !!data?.isUpdate;
  entityId.value = data?.record?.id;

  // 编辑时设置表单值
  if (isUpdate.value) {
    if (data.record.type === 'JSON' || data.record.type === 'ARRAY') {
      await updateSchema({
        field: 'value',
        component: 'NInput',
      });
    } else if (data.record.type === 'BOOLEAN') {
      await updateSchema({
        field: 'value',
        component: 'NRadioGroup',
        componentProps: {
          options: [
            { label: '是', value: 'true' },
            { label: '否', value: 'false' },
          ],
        },
      });
    }
    // 将后端传来的布尔值转换为前端表单需要的数字格式
    const convertedRecord = {
      ...data.record,
      value: JSON.stringify(data.record.value),
      isSystem:
        typeof data.record.isSystem === 'boolean'
          ? booleanConverter.toNumber(data.record.isSystem)
          : data.record.isSystem,
      isPublic:
        typeof data.record.isPublic === 'boolean'
          ? booleanConverter.toNumber(data.record.isPublic)
          : data.record.isPublic,
    };
    setFieldsValue(convertedRecord);
  }
});

/**
 * 处理确认操作
 * 根据当前模式（新增/编辑）调用相应的API接口
 */
const handleOk = async () => {
  try {
    setModalProps({ confirmLoading: true });
    const values = await submit();
    if (values) {
      if (unref(isUpdate)) {
        // 更新系统配置
        await ConfigApi.updateConfig({
          id: entityId.value,
          ...values,
        });
      } else {
        // 新增系统配置
        await ConfigApi.createConfig(values);
      }
      closeModal();
      window.$message.success(
        `${unref(isUpdate) ? $t('common.edit') : $t('common.add')}系统配置${$t('common.success')}`,
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
