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
    const drawer = unref(modalRef);
    if (!drawer) {
      console.error('useDrawer instance is undefined!');
    }
    return drawer as any;
  };

  const methods: any = {
    // 设置模态框属性
    setDrawerProps: (props: Partial<any>): void => {
      getModal()?.setDrawerProps(props);
    },
    // 打开模态框
    openDrawer: <T = any>(data?: T, show: boolean = true, openOnSet: boolean = true): void => {
      getModal()?.setDrawerProps({ show });
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
    closeDrawer: () => {
      getModal()?.setDrawerProps({ show: false });
    },
  };

  return [register, methods];
};

export const useModalInner = (callbackFn?: Fn) => {
  const modalInstanceRef = ref<Nullable<any>>(null);
  const currentInstance = getCurrentInstance();
  const uidRef = ref<number>(0);

  if (!getCurrentInstance()) {
    throw new Error('useDrawerInner() can only be used inside setup() or functional components!');
  }

  const getModalInner = () => {
    const instance = unref(modalInstanceRef);
    if (!instance) {
      console.error('useDrawerInner instance is undefined!');
      return;
    }
    return instance;
  };

  function register(drawerInnerInstance: any, uuid: number) {
    isProdMode() &&
      tryOnUnmounted(() => {
        modalInstanceRef.value = null;
      });

    uidRef.value = uuid;
    modalInstanceRef.value = drawerInnerInstance;
    currentInstance?.emit('register', drawerInnerInstance, uuid);
  }

  watchEffect(() => {
    const data = dataTransferRef[unref(uidRef)];
    if (!data) return;
    if (!callbackFn || !isFunction(callbackFn)) return;
    nextTick(() => {
      callbackFn(data);
    });
  });

  const methods: any = {
    // 设置模态框属性
    setDrawerProps: (props: Partial<any>): void => {
      getModalInner()?.setDrawerProps(props);
    },
    // 打开模态框
    openDrawer() {
      getModalInner()?.setDrawerProps({ show: true });
    },
    // 关闭模态框
    closeDrawer: () => {
      getModalInner()?.setDrawerProps({ show: false });
    },
  };

  return [register, methods];
};
