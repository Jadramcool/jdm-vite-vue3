import { useConfigStore } from '@/store';
import { computed } from 'vue';

export function useGlobalConfig() {
  const configStore = useConfigStore();

  const getConfig = (key: string, defaultValue?: any) => {
    return configStore.getConfigValue(key, defaultValue);
  };

  const allConfig = computed(() => configStore.getAllConfig);

  const loading = computed(() => configStore.loading);

  const initialized = computed(() => configStore.initialized);

  const updateConfig = (key: string, value: any) => {
    configStore.updateConfigItem(key, value);
  };

  const reloadConfig = async () => {
    return configStore.reloadConfig();
  };

  const initConfig = async () => {
    return configStore.initConfig();
  };

  const clearConfig = () => {
    configStore.clearConfig();
  };

  return {
    allConfig,
    loading,
    initialized,
    getConfig,
    updateConfig,
    reloadConfig,
    initConfig,
    clearConfig,
  };
}

export function getGlobalConfig(key: string, defaultValue?: any) {
  const configStore = useConfigStore();
  return configStore.getConfigValue(key, defaultValue);
}
