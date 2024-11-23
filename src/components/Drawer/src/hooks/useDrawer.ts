import { isFunction, isProdMode } from '@/utils';
import { isEqual } from 'lodash';
import { onUnmounted, ref, unref } from 'vue';

const dataTransferRef = reactive<any>({});

const showData = reactive<{ [key: number]: boolean }>({});

export const useDrawer = () => {
  const drawRef = ref<Nullable<any>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);
  const uid = ref<string>('');

  function register(instance: any, uuid: string) {
    if (isProdMode()) {
      // 开发环境下，组件卸载后释放内存
      onUnmounted(() => {
        drawRef.value = null;
        loadedRef.value = null;
      });
    }

    // 实际上 register 拿到的并不是 组件实例， 只是挂载了一些组件内部方法的 对象 formAction
    if (unref(loadedRef) && isProdMode() && instance === unref(drawRef)) return;

    uid.value = uuid;
    drawRef.value = instance;
    loadedRef.value = true;

    instance.emitShow = (show: boolean, uid: number) => {
      showData[uid] = show;
    };
  }

  const getDrawer: any = () => {
    const drawer = unref(drawRef);
    if (!drawer) {
      console.error('useDrawer instance is undefined!');
    }
    return drawer as any;
  };

  const methods: any = {
    // 设置抽屉属性
    setDrawerProps: (props: Partial<any>): void => {
      getDrawer()?.setDrawerProps(props);
    },
    // 打开抽屉
    openDrawer: <T = any>(data?: T, show: boolean = true, openOnSet: boolean = true): void => {
      getDrawer()?.setDrawerProps({ show });
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
    // 关闭抽屉
    closeDrawer: () => {
      getDrawer()?.setDrawerProps({ show: false });
    },
  };

  return [register, methods];
};

export const useDrawerInner = (callbackFn?: Fn) => {
  const drawerInstanceRef = ref<Nullable<any>>(null);
  const currentInstance = getCurrentInstance();
  const uidRef = ref<number>(0);

  if (!getCurrentInstance()) {
    throw new Error('useDrawerInner() can only be used inside setup() or functional components!');
  }

  const getDrawerInner = () => {
    const instance = unref(drawerInstanceRef);
    if (!instance) {
      console.error('useDrawerInner instance is undefined!');
      return;
    }
    return instance;
  };

  function register(drawerInnerInstance: any, uuid: number) {
    isProdMode() &&
      tryOnUnmounted(() => {
        drawerInstanceRef.value = null;
      });

    uidRef.value = uuid;
    drawerInstanceRef.value = drawerInnerInstance;
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
    // 设置抽屉属性
    setDrawerProps: (props: Partial<any>): void => {
      getDrawerInner()?.setDrawerProps(props);
    },
    // 打开抽屉
    openDrawer() {
      getDrawerInner()?.setDrawerProps({ show: true });
    },
    // 关闭抽屉
    closeDrawer: () => {
      getDrawerInner()?.setDrawerProps({ show: false });
    },
  };

  return [register, methods];
};
