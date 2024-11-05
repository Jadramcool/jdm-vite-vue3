import { isProdMode } from '@/utils';
import type { FormProps } from 'naive-ui';
import { nextTick, onUnmounted, ref, unref } from 'vue';
import { FormActionType } from './types';

export const useForm = (props?: any) => {
  const formRef = ref<Nullable<FormActionType>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);

  const register = (instance: FormActionType) => {
    if (isProdMode()) {
      // 开发环境下，组件卸载后释放内存
      onUnmounted(() => {
        formRef.value = null;
        loadedRef.value = null;
      });
    }

    // form 组件实例 instance 已存在
    // 实际上 register 拿到的并不是 组件实例， 只是挂载了一些组件内部方法的 对象 formAction
    if (unref(loadedRef) && isProdMode() && instance === unref(formRef)) return;

    formRef.value = instance;
    loadedRef.value = true;

    // 监听 props， 若props改变了
    // 则使用 form 实例调用内部的 setProps 方法将新的props设置到form组件内部
    watch(
      () => props,
      () => {
        if (props) {
          instance.setProps(props);
        }
      },
      { immediate: true, deep: true },
    );
  };

  async function getForm() {
    const form = unref(formRef);
    if (!form) {
      console.log('error');
    }
    await nextTick();
    return form as any;
  }

  const methods: any = {
    setProps: async (formProps: FormProps) => {
      const form = await getForm();
      form.setProps(formProps);
    },
    getFieldsValue: <T>() => {
      return unref(formRef)?.getFieldsValue() as T;
    },
    resetFields: async () => {
      getForm().then(async (form) => {
        await form.resetFields();
      });
    },
    clearValidate: async (name?: string | string[]) => {
      const form = await getForm();
      await form.clearValidate(name);
    },
  };

  return [register, methods];
};
