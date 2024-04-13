<template>
  <AppPage full>
    <iframe :src="route.meta.originPath" frameborder="0" class="wh-full"></iframe>
  </AppPage>
</template>

<script lang="ts" setup>
const route: any = useRoute();
console.log(route.meta.originPath);
</script>
