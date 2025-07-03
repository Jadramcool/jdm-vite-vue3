<template>
  <div>
    <Wave></Wave>
    <div class="content">
      <div class="left-side">
        <div class="my-info w-200px h-200px flex">
          <div class="avatar"></div>
          <div class="name text-30px font-bold">Jay</div>
          <div class="info">
            <div class="desc">前端开发，关注技术，分享知识</div>
          </div>
        </div>
      </div>
      <div class="right-side"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Wave } from './components';
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: row;
  height: 100%;
  padding: 20px 10%;
  .left-side {
    flex: 1;
    height: 100%;
    .my-info {
      background: linear-gradient(135deg, #ff6b6b, #ffb86c);
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  .right-side {
    flex: 1;
    height: 100%;
  }
}
</style>
