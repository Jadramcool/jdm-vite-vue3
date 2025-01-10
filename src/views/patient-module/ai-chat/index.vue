<template>
  <n-card class="h-full">
    <template #header>
      <n-h1 prefix="bar" type="info">AI问诊</n-h1>
    </template>

    <template #default>
      <n-scrollbar style="max-height: 100%">
        <n-space vertical>
          <div v-for="message in messages" :key="message.id" class="message" :class="message.role">
            <div>{{ message.content }}</div>
          </div>
          <div v-if="loading" class="message loading">Loading...</div>
        </n-space>
      </n-scrollbar>
    </template>

    <template #footer>
      <n-flex :wrap="false">
        <n-input
          v-model:value="userInput"
          placeholder="请输入您的病状"
          @keyup.enter="sendMessage"
        />
        <n-button type="primary" @click="sendMessage">发送</n-button>
      </n-flex>
    </template>
  </n-card>
</template>

<script lang="tsx" setup>
import { AiChatApi } from '@/api';

const messages = ref([
  {
    id: 1,
    content:
      '你好，我是您的专属医疗小管家，请问有什么可以帮助你的吗？您可以询问我症状，我可以给您推荐该挂什么科室',
    role: 'assistant',
  },
]);
const loading = ref(false);
const userInput = ref('');

const sendMessage = async () => {
  if (!userInput.value.trim()) return;
  loading.value = true;

  const userMessage = {
    id: messages.value.length + 1,
    content: userInput.value,
    role: 'user',
  };
  messages.value.push(userMessage);
  try {
    const res = await AiChatApi.zhipuAI(messages.value);

    const assistantMessage = {
      id: messages.value.length + 1,
      content: res.choices[0].message.content,
      role: 'assistant',
    };
    messages.value.push(assistantMessage);
  } catch (error) {
    console.log(error);
  }
  userInput.value = '';
  loading.value = false;
};
</script>

<style>
.chat-container {
  font-family: Arial, sans-serif;
}

.message {
  max-width: 80%;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
}

.user {
  align-self: flex-end;
  background-color: #dcf8c6;
}

.assistant {
  align-self: flex-start;
  background-color: #e6e6e6;
}
</style>
