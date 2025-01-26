<template>
  <div>
    <n-space size="large">
      <n-card title="按钮 Button">
        <n-space>
          <n-button>Default</n-button>
          <n-button type="tertiary"> Tertiary </n-button>
          <n-button type="primary"> Primary </n-button>
          <n-button type="info"> Info </n-button>
          <n-button type="success"> Success </n-button>
          <n-button type="warning"> Warning </n-button>
          <n-button type="error"> Error </n-button>
        </n-space>
      </n-card>

      <n-card title="带 Icon 的按钮">
        <n-space>
          <n-button type="info">
            <i class="i-material-symbols:add mr-4 text-18px" />
            新增
          </n-button>
          <n-button type="error">
            <i class="i-material-symbols:delete-outline mr-4 text-18px" />
            删除
          </n-button>
          <n-button type="warning">
            <i class="i-material-symbols:edit-outline mr-4 text-18px" />
            编辑
          </n-button>
          <n-button type="primary">
            <i class="i-majesticons:eye-line mr-4 text-18px" />
            查看
          </n-button>
        </n-space>
      </n-card>
    </n-space>

    <n-space size="large" mt-30px>
      <n-card title="通知 Notification">
        <n-space>
          <n-button type="info" @click="notify('info')"> 信息 </n-button>
          <n-button type="success" @click="notify('success')"> 成功 </n-button>
          <n-button type="warning" @click="notify('warning')"> 警告 </n-button>
          <n-button type="error" @click="notify('error')"> 错误 </n-button>
        </n-space>
      </n-card>
      <n-card title="提示 Notification">
        <n-space>
          <n-button type="info" @click="message('info')"> 信息 </n-button>
          <n-button type="success" @click="message('success')"> 成功 </n-button>
          <n-button type="warning" @click="message('warning')"> 警告 </n-button>
          <n-button type="error" @click="message('error')"> 错误 </n-button>
        </n-space>
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
const notify = (type: 'info' | 'success' | 'warning' | 'error') => {
  window.$notification[type]({
    title: `通知消息`,
    content: `通知消息详情`,
    duration: 3000,
    keepAliveOnHover: true,
  });
};

const message = (type: 'info' | 'success' | 'warning' | 'error') => {
  window.$message[type]('信息消息详情');
};
</script>
