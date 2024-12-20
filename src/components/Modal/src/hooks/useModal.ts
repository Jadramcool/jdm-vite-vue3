import { isFunction, isProdMode } from '@/utils';
import { isEqual } from 'lodash';
import { onUnmounted, ref, unref } from 'vue';

const dataTransferRef = reactive<any>({});

const openData = reactive<{ [key: number]: boolean }>({});

export const useModal = () => {
  const modalRef = ref<Nullable<any>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);
  const uid = ref<string>('');

  function register(instance: any, uuid: string) {
    if (isProdMode()) {
      // 开发环境下，组件卸载后释放内存
      onUnmounted(() => {
        modalRef.value = null;
        loadedRef.value = null;
      });
    }

    // 实际上 register 拿到的并不是 组件实例， 只是挂载了一些组件内部方法的 对象 formAction
    if (unref(loadedRef) && isProdMode() && instance === unref(modalRef)) return;

    uid.value = uuid;
    modalRef.value = instance;
    loadedRef.value = true;

    instance.emitOpen = (show: boolean, uid: number) => {
      openData[uid] = show;
    };
  }

  const getModal: any = () => {
    const modal = unref(modalRef);
    if (!modal) {
      console.error('useModal instance is undefined!');
    }
    return modal as any;
  };

  const methods: any = {
    // 设置模态框属性
    setModalProps: (props: Partial<any>): void => {
      getModal()?.setModalProps(props);
    },
    // 打开模态框
    openModal: <T = any>(data?: T, show: boolean = true, openOnSet: boolean = true): void => {
      getModal()?.setModalProps({ show });
      if (!data) return;
      if (openOnSet) {
        dataTransferRef[unref(uid)] = null;
        dataTransferRef[unref(uid)] = data;
        return;
      }
      const equal = isEqual(toRaw(dataTransferRef[unref(uid)]), toRaw(data));
      if (!equal) {
        dataTransferRef[unref(uid)] = toRaw(data);
      }
    },
    // 关闭模态框
    closeModal: () => {
      getModal()?.setModalProps({ show: false });
    },
  };

  return [register, methods];
};

/**
 * 内部modal
 * @param callbackFn 执行方法
 * @param immediate 是否在dom加载完就执行，默认false，目前在针对非表单的时候建议使用true，避免内部组件渲染异常
 * @returns
 */
export const useModalInner = (callbackFn?: Fn, immediate: boolean = false) => {
  const modalInstanceRef = ref<Nullable<any>>(null);
  const currentInstance = getCurrentInstance();
  const uidRef = ref<number>(0);

  if (!getCurrentInstance()) {
    throw new Error('useModalInner() can only be used inside setup() or functional components!');
  }

  const getModalInner = () => {
    const instance = unref(modalInstanceRef);
    if (!instance) {
      console.error('useModalInner instance is undefined!');
      return;
    }
    return instance;
  };

  function register(modalInnerInstance: any, uuid: number) {
    isProdMode() &&
      tryOnUnmounted(() => {
        modalInstanceRef.value = null;
      });

    uidRef.value = uuid;

    modalInstanceRef.value = modalInnerInstance;

    currentInstance?.emit('register', modalInnerInstance, uuid);
  }

  watchEffect(() => {
    const data = dataTransferRef[unref(uidRef)];
    if (!data) return;
    if (!callbackFn || !isFunction(callbackFn)) return;

    if (immediate) {
      callbackFn(data);
    } else {
      nextTick(() => {
        callbackFn(data);
      });
    }
  });

  const methods: any = {
    // 设置模态框属性
    setModalProps: (props: Partial<any>): void => {
      getModalInner()?.setModalProps(props);
    },
    // 打开模态框
    openModal() {
      getModalInner()?.setModalProps({ show: true });
    },
    // 关闭模态框
    closeModal: () => {
      getModalInner()?.setModalProps({ show: false });
    },
  };

  return [register, methods];
};
