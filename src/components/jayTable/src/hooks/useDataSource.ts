export const useDataSource = (propsRef: any) => {
  const dataSourceRef = ref([]);

  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef);
    if (!dataSource || dataSource.length === 0) {
      return unref(dataSourceRef);
    }
    return unref(dataSourceRef);
  });

  async function fetch(opt: any) {
    try {
      // 显示加载动画
      const { request } = unref(propsRef);
      const res = await request(opt);
      console.log('🚀 ~ fetch ~ opt:', opt);

      if (res) {
        dataSourceRef.value = res.data;
      }
    } catch (e) {
      console.log(e);
    }
  }

  onMounted(() => {
    setTimeout(() => {
      fetch({});
    }, 16);
  });

  async function reload(opt: any) {
    await fetch(opt);
  }
  return { dataSourceRef, getDataSourceRef, fetch, reload };
};
