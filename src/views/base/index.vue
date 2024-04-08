<template>
  <n-space size="large">
    <n-card title="按钮 Button">
      <n-space>
        <n-button>Default</n-button>
        <n-button type="tertiary">Tertiary</n-button>
        <n-button type="primary">Primary</n-button>
        <n-button type="info">Info</n-button>
        <n-button type="success">Success</n-button>
        <n-button type="warning">Warning</n-button>
        <n-button type="error">Error</n-button>
      </n-space>
    </n-card>

    <n-card title="带 Icon 的按钮">
      <n-space>
        <n-button type="info">
          <i class="i-material-symbols:add mr-4 text-18" />
          新增
        </n-button>
        <n-button type="error">
          <i class="i-material-symbols:delete-outline mr-4 text-18" />
          删除
        </n-button>
        <n-button type="warning">
          <i class="i-material-symbols:edit-outline mr-4 text-18" />
          编辑
        </n-button>
        <n-button type="primary">
          <i class="i-majesticons:eye-line mr-4 text-18" />
          查看
        </n-button>
      </n-space>
    </n-card>
  </n-space>
</template>

<script setup></script>
