<template>
  <div class="feature-showcase">
    <n-card :title="$t('modules.base.features.title')" segmented>
      <n-grid :cols="2" :x-gap="12" :y-gap="12">
        <n-grid-item>
          <n-card :title="$t('modules.base.features.table')" hoverable>
            <p>{{ $t('modules.base.features.tableDesc') }}</p>
            <template #footer>
              <n-button type="primary" @click="goToTableDemo">
                {{ $t('common.goTo') }}
              </n-button>
            </template>
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card :title="$t('modules.base.features.form')" hoverable>
            <p>{{ $t('modules.base.features.formDesc') }}</p>
            <template #footer>
              <n-button type="primary" @click="goToFormDemo">
                {{ $t('common.goTo') }}
              </n-button>
            </template>
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card :title="$t('modules.base.features.chart')" hoverable>
            <p>{{ $t('modules.base.features.chartDesc') }}</p>
            <template #footer>
              <n-button type="primary" @click="goToChartDemo">
                {{ $t('common.goTo') }}
              </n-button>
            </template>
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card :title="$t('modules.base.features.notification')" hoverable>
            <p>{{ $t('modules.base.features.notificationDesc') }}</p>
            <template #footer>
              <n-button type="primary" @click="goToNotificationDemo">
                {{ $t('common.goTo') }}
              </n-button>
            </template>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>

    <n-card :title="$t('modules.base.features.components')" segmented style="margin-top: 20px">
      <n-grid :cols="3" :x-gap="12" :y-gap="12">
        <n-grid-item>
          <n-card :title="$t('modules.base.features.button')" hoverable>
            <p>{{ $t('modules.base.features.buttonDesc') }}</p>
            <template #footer>
              <n-button type="primary" @click="goToComponentDemo('button')">
                {{ $t('common.goTo') }}
              </n-button>
            </template>
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card :title="$t('modules.base.features.input')" hoverable>
            <p>{{ $t('modules.base.features.inputDesc') }}</p>
            <template #footer>
              <n-button type="primary" @click="goToComponentDemo('input')">
                {{ $t('common.goTo') }}
              </n-button>
            </template>
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card :title="$t('modules.base.features.modal')" hoverable>
            <p>{{ $t('modules.base.features.modalDesc') }}</p>
            <template #footer>
              <n-button type="primary" @click="goToComponentDemo('modal')">
                {{ $t('common.goTo') }}
              </n-button>
            </template>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { $t } from '@/locales/i18n';
import { useRouter } from 'vue-router';

defineOptions({ name: 'FeatureShowcase' });

const router = useRouter();

const goToTableDemo = () => {
  router.push('/base/component#table');
};

const goToFormDemo = () => {
  router.push('/base/component#form');
};

const goToChartDemo = () => {
  router.push('/base/component#chart');
};

const goToNotificationDemo = () => {
  router.push('/base/component#notification');
};

const goToComponentDemo = (component: string) => {
  router.push(`/base/component#${component}`);
};
</script>

<style scoped lang="scss">
.feature-showcase {
  padding: 20px;
}
</style>
