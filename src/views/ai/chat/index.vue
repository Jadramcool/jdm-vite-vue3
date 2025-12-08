<template>
  <div class="ai-chat-container">
    <!-- 左侧调试参数面板 -->
    <div class="left-panel" :class="{ collapsed: leftPanelCollapsed }">
      <div class="panel-header">
        <h3>调试参数</h3>
        <n-button quaternary circle size="small" @click="toggleLeftPanel" class="collapse-btn">
          <template #icon>
            <JayIcon
              :icon="
                leftPanelCollapsed
                  ? 'material-symbols:chevron-right'
                  : 'material-symbols:chevron-left'
              "
              :size="16"
            />
          </template>
        </n-button>
      </div>

      <div class="panel-content" v-show="!leftPanelCollapsed">
        <!-- 温度参数 -->
        <div class="param-group">
          <label class="param-label">
            温度参数
            <span class="param-value">{{ apiConfig.temperature }}</span>
          </label>
          <n-slider
            v-model:value="apiConfig.temperature"
            :min="0"
            :max="2"
            :step="0.1"
            :marks="{ 0: '保守', 1: '平衡', 2: '创新' }"
            size="small"
          />
          <div class="param-description">
            控制回答的创造性和随机性。值越高回答越有创意，值越低回答越稳定准确。
          </div>
        </div>

        <!-- 最大回复长度 -->
        <div class="param-group">
          <label class="param-label">最大回复长度</label>
          <n-input-number
            v-model:value="apiConfig.maxTokens"
            :min="100"
            :max="8000"
            :step="100"
            placeholder="2048"
            size="small"
            style="width: 100%"
          />
          <div class="param-description">限制AI回复的最大字符数，避免回复过长。</div>
        </div>

        <!-- Top-p参数 -->
        <div class="param-group">
          <label class="param-label">
            Top-p
            <span class="param-value">{{ apiConfig.topP || 0.9 }}</span>
          </label>
          <n-slider v-model:value="apiConfig.topP" :min="0.1" :max="1" :step="0.05" size="small" />
          <div class="param-description">
            控制词汇选择的多样性。值越小回答越集中，值越大回答越多样。
          </div>
        </div>

        <!-- 频率惩罚 -->
        <div class="param-group">
          <label class="param-label">
            频率惩罚
            <span class="param-value">{{ apiConfig.frequencyPenalty || 0 }}</span>
          </label>
          <n-slider
            v-model:value="apiConfig.frequencyPenalty"
            :min="-2"
            :max="2"
            :step="0.1"
            size="small"
          />
          <div class="param-description">减少重复内容的出现。正值减少重复，负值增加重复。</div>
        </div>

        <!-- 存在惩罚 -->
        <div class="param-group">
          <label class="param-label">
            存在惩罚
            <span class="param-value">{{ apiConfig.presencePenalty || 0 }}</span>
          </label>
          <n-slider
            v-model:value="apiConfig.presencePenalty"
            :min="-2"
            :max="2"
            :step="0.1"
            size="small"
          />
          <div class="param-description">鼓励谈论新话题。正值增加新话题，负值倾向于重复话题。</div>
        </div>

        <!-- 重置按钮 -->
        <div class="param-actions">
          <n-button size="small" @click="resetToDefaults" style="width: 100%">
            重置为默认值
          </n-button>
        </div>
      </div>
    </div>

    <!-- 主聊天区域 -->
    <div class="main-chat-area">
      <!-- 头部 -->
      <div class="chat-header">
        <div class="header-left">
          <h2>AI 智能助手</h2>
          <span class="model-info">{{ getModelDisplayName(currentModel) }}</span>
          <span class="provider-info">{{
            availableProviders.find((p) => p.id === currentProvider)?.name
          }}</span>
        </div>
        <div class="header-right">
          <n-button quaternary circle @click="clearChat" :disabled="isLoading">
            <template #icon>
              <JayIcon icon="material-symbols:delete-forever-outline-rounded" :size="24" />
            </template>
          </n-button>
          <n-button quaternary circle @click="showSettings = true">
            <template #icon>
              <JayIcon icon="material-symbols:settings-outline-rounded" :size="24" />
            </template>
          </n-button>
        </div>
      </div>

      <!-- 聊天区域 -->
      <div class="chat-content" ref="chatContentRef">
        <div class="messages-container">
          <div v-if="messages.length === 0" class="empty-state">
            <div class="empty-icon">🤖</div>
            <h3>开始与AI对话</h3>
            <p>选择一个AI模型，然后输入您的问题</p>
          </div>

          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message-item"
            :class="message.role"
          >
            <div class="message-avatar">
              <span v-if="message.role === 'user'">👤</span>
              <span v-else>🤖</span>
            </div>
            <div class="message-content">
              <div class="message-text" v-html="formatMessage(message.content)"></div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>

              <!-- 消息操作按钮 -->
              <div v-if="message.role === 'assistant' && !isLoading" class="message-actions">
                <n-button size="tiny" quaternary @click="copyMessage(message.content)">
                  <template #icon>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </template>
                  复制
                </n-button>
                <n-button size="tiny" quaternary @click="regenerateMessage(index)">
                  <template #icon>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <polyline points="23 4 23 10 17 10" />
                      <polyline points="1 20 1 14 7 14" />
                      <path
                        d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
                      />
                    </svg>
                  </template>
                  重新生成
                </n-button>
              </div>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="isLoading" class="message-item assistant">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="chat-input">
        <div class="input-container">
          <!-- 快速模型切换 -->
          <div class="quick-model-selector">
            <n-dropdown
              :options="quickModelOptions"
              @select="handleQuickModelChange"
              trigger="click"
              placement="top-start"
            >
              <div class="model-selector-wrapper">
                <n-button quaternary circle size="small" class="model-switch-btn">
                  <template #icon>
                    <JayIcon icon="material-symbols:arrow-drop-down" :size="24" />
                  </template>
                </n-button>
                <span class="model-display-text">{{ getModelDisplayName(currentModel) }}</span>
              </div>
            </n-dropdown>
          </div>

          <!-- 智能体选择器 -->
          <div class="agent-selector">
            <n-dropdown
              :options="agentOptions"
              @select="handleAgentChange"
              trigger="click"
              placement="top-start"
              :show-arrow="false"
            >
              <div class="agent-selector-wrapper">
                <n-button quaternary circle size="small" class="agent-switch-btn">
                  <template #icon>
                    <span class="agent-icon">{{ currentAgent?.avatar || '🤖' }}</span>
                  </template>
                </n-button>
                <span class="current-agent-display">{{ currentAgent?.name || '通用助手' }}</span>
              </div>
            </n-dropdown>
          </div>

          <n-input
            v-model:value="inputMessage"
            type="textarea"
            placeholder="输入您的问题..."
            :autosize="{ minRows: 1, maxRows: 4 }"
            @keydown.enter.prevent="handleEnterKey"
            :disabled="isLoading"
          />
          <div class="input-actions">
            <n-button
              v-if="!isLoading"
              type="primary"
              @click="sendMessage"
              :disabled="!inputMessage.trim() || !apiConfig.apiKey"
            >
              发送
            </n-button>
            <n-button v-else type="error" @click="stopGeneration"> 停止 </n-button>
          </div>
        </div>
      </div>

      <!-- 设置抽屉 -->
      <n-drawer v-model:show="showSettings" width="450" placement="right">
        <n-drawer-content title="AI 设置">
          <n-form :model="apiConfig" label-placement="top">
            <n-form-item label="AI 提供商">
              <n-select
                v-model:value="currentProvider"
                :options="providerOptions"
                placeholder="选择AI提供商"
                @update:value="handleProviderChange"
              />
            </n-form-item>

            <n-form-item label="AI 模型">
              <n-select
                v-model:value="currentModel"
                :options="currentProviderModels"
                placeholder="选择AI模型"
                :disabled="!currentProvider"
                :loading="loadingModels[currentProvider]"
              />
              <div v-if="modelLoadErrors[currentProvider]" class="model-error">
                <n-text type="error" style="font-size: 12px">
                  {{ modelLoadErrors[currentProvider] }}
                </n-text>
                <n-button
                  size="tiny"
                  quaternary
                  type="primary"
                  @click="loadProviderModels(currentProvider)"
                  style="margin-left: 8px"
                >
                  重试
                </n-button>
              </div>
              <div v-if="dynamicModels[currentProvider]?.length > 0" class="model-info">
                <n-text depth="3" style="font-size: 12px">
                  已动态加载 {{ dynamicModels[currentProvider].length }} 个模型
                </n-text>
              </div>
            </n-form-item>

            <n-form-item label="API Key">
              <n-input
                v-model:value="apiConfig.apiKey"
                type="password"
                placeholder="请输入API Key"
                show-password-on="click"
              />
            </n-form-item>

            <n-form-item label="Base URL (可选)">
              <n-input v-model:value="apiConfig.baseURL" placeholder="自定义API地址" />
            </n-form-item>

            <n-form-item label="温度参数">
              <n-slider
                v-model:value="apiConfig.temperature"
                :min="0"
                :max="2"
                :step="0.1"
                :marks="{ 0: '保守', 1: '平衡', 2: '创新' }"
              />
            </n-form-item>

            <n-form-item label="最大回复长度">
              <n-input-number
                v-model:value="apiConfig.maxTokens"
                :min="100"
                :max="4000"
                placeholder="2048"
              />
            </n-form-item>

            <n-form-item>
              <n-space>
                <n-button
                  type="primary"
                  @click="validateAPIConfig"
                  :loading="validating"
                  :disabled="!apiConfig.apiKey"
                >
                  验证API配置
                </n-button>
                <n-button @click="saveSettings">保存设置</n-button>
              </n-space>
            </n-form-item>
          </n-form>
        </n-drawer-content>
      </n-drawer>
    </div>
    <!-- 主聊天区域结束 -->
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui';

import { AiApi } from '@/api';
import {
  AGENT_CATEGORIES,
  getAgentById,
  getAllAgents,
  recordAgentUsage,
  type AgentCategory,
  type AIAgent,
  type AIProvider,
} from '@/api/ai/ai';
import JayIcon from '@/components/common/JayIcon.vue';

type AIMessage = AiApi.AIMessage;

// 消息接口
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  streaming?: boolean;
}

// API配置
interface APIConfig {
  apiKey: string;
  baseURL: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

const message = useMessage();

// 响应式数据
const messages = ref<Message[]>([]);
const inputMessage = ref('');
const isLoading = ref(false);
const showSettings = ref(false);
const validating = ref(false);
const chatContentRef = ref<HTMLElement>();
const currentStreamController = ref<AbortController | null>(null);

// 左侧面板状态
const leftPanelCollapsed = ref(false);

// 当前选中的提供商和模型
const currentProvider = ref('deepseek');
const currentModel = ref('deepseek-chat');

// 智能体相关状态
const currentAgent = ref<AIAgent | null>(null);
const availableAgents = ref<AIAgent[]>([]);
const agentCategories = ref<AgentCategory[]>(AGENT_CATEGORIES);

// 从AI API获取可用的提供商和模型
const getAvailableProviders = () => {
  const providers: Record<string, AIProvider> = AiApi.getAIProviders();
  return Object.entries(providers).map(([key, provider]: [string, AIProvider]) => ({
    id: key,
    name: provider.name,
    models: provider.models.map((model) => ({
      id: model,
      name: model,
      displayName: getModelDisplayName(model),
    })),
  }));
};

// 动态模型列表状态
const dynamicModels = ref<Record<string, AiApi.AIModel[]>>({});
const loadingModels = ref<Record<string, boolean>>({});
const modelLoadErrors = ref<Record<string, string>>({});

// 获取模型的显示名称
const getModelDisplayName = (modelId: string): string => {
  const displayNames: Record<string, string> = {
    'deepseek-chat': 'DeepSeek Chat',
  };
  return displayNames[modelId] || modelId;
};

const availableProviders = getAvailableProviders();

// 提供商选项
const providerOptions = availableProviders.map((provider) => ({
  label: provider.name,
  value: provider.id,
}));

// 获取指定提供商的动态模型列表
const loadProviderModels = async (providerId: string) => {
  if (!apiConfig.apiKey) {
    console.warn('API Key未配置，无法获取动态模型列表');
    return;
  }

  if (loadingModels.value[providerId]) {
    return; // 避免重复加载
  }

  loadingModels.value[providerId] = true;
  modelLoadErrors.value[providerId] = '';

  try {
    const models = await AiApi.getProviderModels(providerId, apiConfig.apiKey, apiConfig.baseURL);
    dynamicModels.value[providerId] = models;
  } catch (error) {
    console.error(`获取${providerId}模型列表失败:`, error);
    modelLoadErrors.value[providerId] = error instanceof Error ? error.message : '获取模型列表失败';
  } finally {
    loadingModels.value[providerId] = false;
  }
};

// 当前提供商的模型选项
const currentProviderModels = computed(() => {
  const provider = availableProviders.find((p) => p.id === currentProvider.value);

  // 优先使用动态获取的模型列表
  const dynamicModelList = dynamicModels.value[currentProvider.value];
  if (dynamicModelList && dynamicModelList.length > 0) {
    return dynamicModelList.map((model) => ({
      label: model.name || model.id,
      value: model.id,
      description: model.description,
    }));
  }

  // 回退到默认模型列表
  return (
    provider?.models.map((model) => ({
      label: getModelDisplayName(model.id),
      value: model.id,
    })) || []
  );
});

// 快速模型切换选项
const quickModelOptions = computed(() => {
  const options: any[] = [];

  // 添加提供商分组
  availableProviders.forEach((provider) => {
    const providerModels =
      provider.id === currentProvider.value
        ? currentProviderModels.value
        : provider.models.map((model) => ({
            label: getModelDisplayName(model.id),
            value: model.id,
          }));

    if (providerModels.length > 0) {
      options.push({
        type: 'group',
        label: provider.name,
        key: provider.id,
        children: providerModels.map((model) => ({
          label: model.label,
          key: `${provider.id}:${model.value}`,
          value: `${provider.id}:${model.value}`,
        })),
      });
    }
  });

  return options;
});

// 智能体选项
const agentOptions = computed(() => {
  const options: any[] = [];

  // 按分类分组智能体
  agentCategories.value.forEach((category) => {
    const categoryAgents = availableAgents.value.filter(
      (agent) => agent.category === category.id && agent.isActive,
    );

    if (categoryAgents.length > 0) {
      options.push({
        type: 'group',
        label: `${category.icon} ${category.name}`,
        key: category.id,
        children: categoryAgents.map((agent) => ({
          label: `${agent.avatar} ${agent.name}`,
          key: agent.id,
          value: agent.id,
          description: agent.description,
        })),
      });
    }
  });

  return options;
});

// API配置
const apiConfig = reactive<APIConfig>({
  apiKey: '',
  baseURL: '',
  temperature: 0.7,
  maxTokens: 2000,
  topP: 0.9,
  frequencyPenalty: 0,
  presencePenalty: 0,
});

// 切换左侧面板
const toggleLeftPanel = () => {
  leftPanelCollapsed.value = !leftPanelCollapsed.value;
};

// 重置调试参数为默认值
const resetToDefaults = () => {
  apiConfig.temperature = 0.7;
  apiConfig.maxTokens = 2000;
  apiConfig.topP = 0.9;
  apiConfig.frequencyPenalty = 0;
  apiConfig.presencePenalty = 0;
  message.success('已重置为默认参数');
};

// 生成消息ID
const generateMessageId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// 格式化消息内容（支持Markdown）
const formatMessage = (content: string) => {
  // 简单的Markdown格式化
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
};

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContentRef.value) {
      chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight;
    }
  });
};

// 处理键盘事件
const handleEnterKey = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;

  const userMessage: Message = {
    id: generateMessageId(),
    role: 'user',
    content: inputMessage.value.trim(),
    timestamp: Date.now(),
  };

  messages.value.push(userMessage);
  inputMessage.value = '';

  scrollToBottom();

  // 开始加载
  isLoading.value = true;

  try {
    // 创建AI回复消息
    const assistantMessage: Message = {
      id: generateMessageId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      streaming: true,
    };

    messages.value.push(assistantMessage);
    scrollToBottom();

    // 调用AI API（流式传输）
    await callAIAPI(assistantMessage);
  } catch (error) {
    console.error('AI API调用失败:', error);
    message.error('AI服务暂时不可用，请稍后重试');

    // 移除失败的消息
    messages.value = messages.value.filter(
      (msg) => msg.id !== messages.value[messages.value.length - 1].id,
    );
  } finally {
    isLoading.value = false;
  }
};

// 调用AI API（流式传输）
const callAIAPI = async (assistantMessage: Message) => {
  try {
    // 检查API配置
    if (!apiConfig.apiKey) {
      throw new Error('请先在设置中配置API Key');
    }

    // 创建AI服务实例
    const aiService = AiApi.createAIService(currentProvider.value, {
      apiKey: apiConfig.apiKey,
      baseURL: apiConfig.baseURL,
      temperature: apiConfig.temperature,
      maxTokens: apiConfig.maxTokens,
      model: currentModel.value,
    });

    // 构建消息历史（排除当前正在流式传输的助手消息）
    const aiMessages: AIMessage[] = [];

    // 如果有选中的智能体，添加系统提示
    if (currentAgent.value && currentAgent.value.systemPrompt) {
      aiMessages.push({
        role: 'system',
        content: currentAgent.value.systemPrompt,
      });
    }

    // 添加历史消息
    const historyMessages = messages.value
      .filter((msg) => msg.role !== 'assistant' || !msg.streaming)
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    aiMessages.push(...historyMessages);

    // 创建AbortController用于停止生成
    currentStreamController.value = new AbortController();

    // 调用流式API
    await aiService
      .sendStreamMessage(
        aiMessages,
        (chunk: string) => {
          // 处理流式数据块 - 直接更新messages数组中的消息
          console.log('收到流式数据块:', chunk);
          const lastMessage = messages.value[messages.value.length - 1];
          if (lastMessage && lastMessage.role === 'assistant' && lastMessage.streaming) {
            lastMessage.content += chunk;
            scrollToBottom();
          }
        },
        currentStreamController.value.signal,
      )
      .then(() => {
        // 流式传输完成
        const lastMessage = messages.value[messages.value.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.streaming = false;
        }
        currentStreamController.value = null;
      })
      .catch((error: Error) => {
        // 处理错误
        console.error('AI API流式调用失败:', error);
        const lastMessage = messages.value[messages.value.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.content = '抱歉，AI服务出现错误，请稍后重试。';
          lastMessage.streaming = false;
        }
        currentStreamController.value = null;
        message.error(`AI服务错误: ${error.message}`);
      });
  } catch (error) {
    console.error('AI API调用失败:', error);
    assistantMessage.content = '抱歉，AI服务暂时不可用，请检查配置后重试。';
    assistantMessage.streaming = false;
    currentStreamController.value = null;
    throw error;
  }
};

// 处理提供商切换
const handleProviderChange = async (providerId: string) => {
  const provider = availableProviders.find((p) => p.id === providerId);
  if (!provider) return;

  // 尝试动态加载模型列表
  await loadProviderModels(providerId);

  // 选择第一个可用的模型
  const dynamicModelList = dynamicModels.value[providerId];
  if (dynamicModelList && dynamicModelList.length > 0) {
    currentModel.value = dynamicModelList[0].id;
  } else if (provider.models.length > 0) {
    // 回退到默认模型列表
    const [firstModel] = provider.models;
    currentModel.value = firstModel.id;
  }
};

// 处理快速模型切换
const handleQuickModelChange = async (key: string) => {
  const [providerId, modelId] = key.split(':');

  if (!providerId || !modelId) return;

  // 如果切换到不同的提供商，需要先切换提供商
  if (providerId !== currentProvider.value) {
    currentProvider.value = providerId;
    // 尝试加载该提供商的动态模型列表
    await loadProviderModels(providerId);
  }

  // 设置选中的模型
  currentModel.value = modelId;

  message.success(`已切换到 ${getModelDisplayName(modelId)}`);
};

// 处理智能体切换
const handleAgentChange = (agentId: string) => {
  const agent = getAgentById(agentId);
  if (!agent) return;

  currentAgent.value = agent;

  // 如果智能体有首选的提供商和模型，自动切换
  if (agent.config?.preferredProvider && agent.config.preferredProvider !== currentProvider.value) {
    const preferredProvider = availableProviders.find(
      (p) => p.id === agent.config?.preferredProvider,
    );
    if (preferredProvider) {
      currentProvider.value = agent.config.preferredProvider;
      // 尝试加载该提供商的动态模型列表
      loadProviderModels(agent.config.preferredProvider);
    }
  }

  if (agent.config?.preferredModel && agent.config.preferredModel !== currentModel.value) {
    currentModel.value = agent.config.preferredModel;
  }

  // 记录智能体使用
  recordAgentUsage(agentId);

  message.success(`已切换到 ${agent.name}`);
};

// 复制消息
const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content);
    message.success('消息已复制到剪贴板');
  } catch (error) {
    console.error('复制失败:', error);
    message.error('复制失败');
  }
};

// 重新生成消息
const regenerateMessage = async (messageIndex: number) => {
  const assistantMessage = messages.value[messageIndex];
  if (!assistantMessage || assistantMessage.role !== 'assistant') return;

  // 找到该AI消息对应的用户消息
  let userMessage: Message | null = null;
  for (let i = messageIndex - 1; i >= 0; i--) {
    if (messages.value[i].role === 'user') {
      userMessage = messages.value[i];
      break;
    }
  }

  if (!userMessage) {
    message.error('无法找到对应的用户消息');
    return;
  }

  // 重置AI消息内容
  assistantMessage.content = '';
  assistantMessage.streaming = true;
  assistantMessage.timestamp = Date.now();

  // 开始重新生成
  isLoading.value = true;

  try {
    await callAIAPI(assistantMessage);
  } catch (error) {
    console.error('重新生成失败:', error);
  } finally {
    isLoading.value = false;
  }
};

// 停止生成
const stopGeneration = () => {
  if (currentStreamController.value) {
    currentStreamController.value.abort();
    currentStreamController.value = null;
  }

  // 停止当前流式传输
  const lastMessage = messages.value[messages.value.length - 1];
  if (lastMessage && lastMessage.role === 'assistant' && lastMessage.streaming) {
    lastMessage.streaming = false;
    if (!lastMessage.content.trim()) {
      lastMessage.content = '生成已停止';
    }
  }

  isLoading.value = false;
  message.info('已停止生成');
};

// 清空对话
const clearChat = () => {
  // 如果正在生成，先停止
  if (isLoading.value) {
    stopGeneration();
  }

  messages.value = [];
  message.success('对话已清空');
};

// 验证API配置
const validateAPIConfig = async () => {
  if (!apiConfig.apiKey) {
    message.error('请输入API Key');
    return false;
  }

  validating.value = true;

  try {
    const aiService = AiApi.createAIService(currentProvider.value, {
      apiKey: apiConfig.apiKey,
      baseURL: apiConfig.baseURL,
      temperature: apiConfig.temperature,
      maxTokens: apiConfig.maxTokens,
      model: currentModel.value,
    });

    const isValid = await aiService.validateConfig();
    if (isValid) {
      message.success('API配置验证成功');
      return true;
    }
    message.error('API配置验证失败，请检查API Key和网络连接');
    return false;
  } catch (error) {
    console.error('API配置验证失败:', error);
    message.error(`API配置验证失败: ${(error as Error).message}`);
    return false;
  } finally {
    validating.value = false;
  }
};

// 保存设置
const saveSettings = async () => {
  // 如果有API Key，先验证配置
  if (apiConfig.apiKey) {
    const isValid = await validateAPIConfig();
    if (!isValid) {
      return; // 验证失败，不保存设置
    }
  }

  // 保存到本地存储
  localStorage.setItem(
    'ai-chat-config',
    JSON.stringify({
      currentProvider: currentProvider.value,
      currentModel: currentModel.value,
      apiConfig,
    }),
  );

  showSettings.value = false;
  message.success('设置已保存');
};

// 加载设置
const loadSettings = () => {
  try {
    const saved = localStorage.getItem('ai-chat-config');
    if (saved) {
      const config = JSON.parse(saved);
      currentProvider.value = config.currentProvider || 'deepseek';
      currentModel.value = config.currentModel || 'deepseek-chat';
      Object.assign(apiConfig, config.apiConfig || {});

      // 确保选中的模型在当前提供商中存在
      const provider = availableProviders.find((p) => p.id === currentProvider.value);
      if (provider && !provider.models.find((m) => m.id === currentModel.value)) {
        currentModel.value = provider.models[0]?.id || 'deepseek-chat';
      }
    }
  } catch (error) {
    console.error('加载设置失败:', error);
  }
};

// 监听API Key变更，自动重新加载当前提供商的模型列表
watch(
  () => apiConfig.apiKey,
  (newApiKey, oldApiKey) => {
    if (newApiKey && newApiKey !== oldApiKey && currentProvider.value) {
      // 清除之前的模型数据和错误信息
      delete dynamicModels.value[currentProvider.value];
      delete modelLoadErrors.value[currentProvider.value];
      // 重新加载模型列表
      loadProviderModels(currentProvider.value);
    }
  },
);

// 监听提供商变更，自动加载模型列表
watch(
  () => currentProvider.value,
  (newProvider) => {
    if (newProvider && apiConfig.apiKey) {
      loadProviderModels(newProvider);
    }
  },
);

// 组件挂载时加载设置
onMounted(() => {
  loadSettings();
  initializeAgents();

  // 检测屏幕尺寸，在小屏幕上默认折叠左侧面板
  const checkScreenSize = () => {
    if (window.innerWidth <= 480) {
      leftPanelCollapsed.value = true;
    }
  };

  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);

  // 组件卸载时移除监听器
  onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize);
  });
});

// 初始化智能体
const initializeAgents = () => {
  // 加载所有可用的智能体
  availableAgents.value = getAllAgents();

  // 设置默认智能体（通用助手）
  if (!currentAgent.value) {
    const defaultAgent = availableAgents.value.find((agent) => agent.id === 'general-assistant');
    if (defaultAgent) {
      currentAgent.value = defaultAgent;
    }
  }
};
</script>

<style lang="scss" scoped>
.ai-chat-container {
  height: 100%;
  display: flex;
  flex-direction: row;
  background: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Inter', sans-serif;
  overflow: hidden;
  position: relative;
}

.left-panel {
  width: 280px;
  background: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &.collapsed {
    width: 0;
    overflow: hidden;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #e8e8e8;
    background: #fafafa;

    h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .collapse-btn {
      padding: 4px;
      border: none;
      background: none;
      cursor: pointer;
      color: #666;
      border-radius: 4px;
      transition: all 0.2s;

      &:hover {
        background: #e8e8e8;
        color: #333;
      }
    }
  }

  .panel-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;

    .param-group {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .param-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 500;
        color: #333;

        .param-value {
          font-size: 12px;
          color: #1890ff;
          font-weight: 600;
        }
      }

      .param-description {
        font-size: 11px;
        color: #666;
        margin-top: 6px;
        line-height: 1.4;
        background: #f8f9fa;
        padding: 6px 8px;
        border-radius: 4px;
        border-left: 3px solid #1890ff;
      }
    }

    .param-actions {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #e8e8e8;
    }
  }
}

.main-chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e9ecef;
  flex-shrink: 0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #343a40;
    }

    .model-info {
      padding: 6px 8px;
      background: #e9ecef;
      color: #495057;
      border-radius: 4px;
      font-weight: 500;
    }

    .provider-info {
      padding: 6px 8px;
      background: #f8f9fa;
      color: #6c757d;
      border-radius: 3px;
      font-size: 11px;
      font-weight: 500;
    }
  }

  .header-right {
    display: flex;
    gap: 8px;
  }
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  background: white;
}

.messages-container {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f8f9fa;
  }

  &::-webkit-scrollbar-thumb {
    background: #dee2e6;
    border-radius: 3px;

    &:hover {
      background: #adb5bd;
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #6c757d;
    text-align: center;

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.6;
    }

    h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #495057;
    }

    p {
      margin: 0;
      font-size: 14px;
      color: #6c757d;
    }
  }

  .message-item {
    display: flex;
    margin-bottom: 20px;

    &.user {
      flex-direction: row-reverse;

      .message-content {
        align-items: flex-end;

        .message-text {
          background: #007bff;
          color: white;
          border-radius: 12px 12px 4px 12px;
        }
      }

      .message-avatar {
        margin-left: 12px;
        margin-right: 0;
      }
    }

    &.assistant {
      .message-content {
        .message-text {
          background: #f8f9fa;
          color: #333;
          border-radius: 12px 12px 12px 4px;
          border: 1px solid #e9ecef;
        }
      }
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .message-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    flex-shrink: 0;
    font-size: 14px;
    font-weight: 500;
    color: white;

    .message-item.user & {
      background: #007bff;
    }

    .message-item.assistant & {
      background: #28a745;
    }
  }

  .message-content {
    display: flex;
    flex-direction: column;
    max-width: 70%;
    min-width: 100px;

    .message-text {
      padding: 12px 16px;
      line-height: 1.6;
      word-wrap: break-word;
      font-size: 14px;

      :deep(strong) {
        color: #495057;
        font-weight: 600;
      }

      :deep(em) {
        color: #6c757d;
        font-style: italic;
      }

      :deep(code) {
        background: #f8f9fa;
        color: #e83e8c;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 0.9em;
      }

      :deep(pre) {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 16px;
        margin: 12px 0;
        overflow-x: auto;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 0.9em;
        line-height: 1.4;

        code {
          background: none;
          color: #24292e;
          padding: 0;
        }
      }

      :deep(blockquote) {
        border-left: 4px solid #007bff;
        background: #f8f9fa;
        margin: 12px 0;
        padding: 12px 16px;
        font-style: italic;
        color: #6c757d;

        p {
          margin: 0;
        }
      }

      :deep(ul),
      :deep(ol) {
        margin: 12px 0;
        padding-left: 20px;

        li {
          margin: 4px 0;
          line-height: 1.6;
        }
      }

      :deep(h1),
      :deep(h2),
      :deep(h3),
      :deep(h4),
      :deep(h5),
      :deep(h6) {
        color: #495057;
        font-weight: 600;
        margin: 16px 0 8px 0;
        line-height: 1.4;
      }

      :deep(a) {
        color: #007bff;
        text-decoration: underline;

        &:hover {
          color: #0056b3;
        }
      }

      :deep(table) {
        width: 100%;
        border-collapse: collapse;
        margin: 12px 0;
        border: 1px solid #e9ecef;

        th,
        td {
          padding: 8px 12px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        th {
          background: #f8f9fa;
          color: #495057;
          font-weight: 600;
        }

        tr:nth-child(even) {
          background: #f8f9fa;
        }
      }
    }

    .message-time {
      margin-top: 4px;
      font-size: 12px;
      color: #999;
      padding: 0 4px;
      align-self: flex-start;
    }

    .message-actions {
      margin-top: 8px;
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.2s;

      :deep(.n-button) {
        font-size: 12px;
        padding: 4px 8px;
        height: auto;
      }
    }
  }

  .message-item:hover .message-actions {
    opacity: 1;
  }

  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 12px 16px;
    background: white;
    border-radius: 12px 12px 12px 4px;
    border: 1px solid #e8e8e8;

    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #1890ff;
      animation: typing 1.4s infinite ease-in-out;

      &:nth-child(1) {
        animation-delay: -0.32s;
      }

      &:nth-child(2) {
        animation-delay: -0.16s;
      }
    }
  }
}

.chat-input {
  padding: 16px 20px;
  background: #ffffff;
  border-top: 1px solid #e9ecef;
  flex-shrink: 0;

  .input-container {
    display: flex;
    gap: 12px;
    align-items: center;

    .quick-model-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      padding: 8px 12px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
      transition: all 0.2s ease;

      &:hover {
        background: #e9ecef;
        border-color: #ced4da;
      }

      .model-selector-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        width: 100%;

        .model-display-text {
          font-size: 12px;
          color: #495057;
          font-weight: 500;
          white-space: nowrap;
        }
      }
    }

    .agent-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      padding: 8px 12px;
      background: #f0f8ff;
      border-radius: 8px;
      border: 1px solid #d1ecf1;
      transition: all 0.2s ease;

      &:hover {
        background: #e1f5fe;
        border-color: #bee5eb;
      }

      .agent-selector-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        width: 100%;
      }
    }

    .agent-switch-btn {
      width: 28px;
      height: 28px;
      color: #0c5460;
      transition: color 0.2s ease;

      &:hover {
        color: #007bff;
      }

      .agent-icon {
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .current-agent-display {
      font-size: 12px;
      color: #0c5460;
      font-weight: 500;
      white-space: nowrap;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  :deep(.n-input) {
    flex: 1;
    border-radius: 8px;

    .n-input__input-el {
      font-size: 14px;
      line-height: 1.4;
      padding: 12px 16px;
      border: 1px solid #ced4da;
      background: #ffffff;

      &:focus {
        border-color: #007bff;
      }

      &::placeholder {
        color: #6c757d;
        font-size: 14px;
      }
    }
  }

  .input-actions {
    flex-shrink: 0;

    :deep(.n-button) {
      height: 40px;
      padding: 0 16px;
      font-size: 14px;
      border-radius: 6px;
      background: #007bff;
      border: none;

      &:hover {
        background: #0056b3;
      }

      &[type='error'] {
        background: #dc3545;

        &:hover {
          background: #c82333;
        }
      }
    }
  }
}

// 动画效果
@keyframes typing {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

// 设置抽屉样式
:deep(.n-drawer) {
  .n-drawer-content {
    background: #ffffff;
  }

  .n-drawer-header {
    background: #ffffff;
    border-bottom: 1px solid #e9ecef;
    padding: 16px 24px;

    .n-drawer-title {
      font-size: 18px;
      font-weight: 600;
      color: #495057;
    }
  }

  .n-drawer-body {
    padding: 24px;
    background: #ffffff;

    .n-form-item {
      margin-bottom: 20px;

      .n-form-item-label {
        padding-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #495057;
      }

      .n-form-item-control {
        .n-select,
        .n-input-number,
        .n-input,
        .n-slider {
          border-radius: 6px;
          border: 1px solid #ced4da;
          transition: border-color 0.2s ease;
          background: #ffffff;

          &:hover {
            border-color: #007bff;
          }

          &:focus,
          &.n-select-focused {
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
          }
        }
      }
    }

    .n-space {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;

      .n-button {
        height: 36px;
        border-radius: 6px;
        font-weight: 500;
        font-size: 14px;

        &.n-button--primary-type {
          background: #007bff;
          border: 1px solid #007bff;

          &:hover {
            background: #0056b3;
            border-color: #0056b3;
          }
        }

        &:not(.n-button--primary-type) {
          background: #ffffff;
          border: 1px solid #ced4da;
          color: #495057;

          &:hover {
            border-color: #007bff;
            color: #007bff;
          }
        }
      }
    }
  }
}

.model-error {
  margin-top: 8px;
  padding: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// 响应式设计
@media (max-width: 768px) {
  .ai-chat-container {
    .left-panel {
      width: 260px;

      .panel-content {
        padding: 12px;

        .param-group {
          margin-bottom: 16px;
        }
      }
    }

    .chat-header {
      padding: 12px 16px;

      .header-left h2 {
        font-size: 18px;
      }
    }

    .chat-content .messages-container {
      padding: 16px 12px;

      .message-item {
        margin-bottom: 16px;

        .message-content {
          max-width: 85%;

          .message-text {
            padding: 10px 12px;
            font-size: 13px;
          }
        }

        .message-avatar {
          width: 30px;
          height: 30px;
          font-size: 13px;
        }
      }
    }

    .chat-input {
      padding: 12px 16px;

      .input-container :deep(.n-input) .n-input__input-el {
        padding: 10px 12px;
        font-size: 13px;
      }
    }
  }
}

@media (max-width: 480px) {
  .ai-chat-container {
    .left-panel {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      z-index: 1000;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);

      &.collapsed {
        transform: translateX(-100%);
      }
    }

    .chat-header {
      padding: 10px 12px;

      .header-left {
        h2 {
          font-size: 16px;
        }

        .provider-info {
          display: none;
        }
      }
    }

    .chat-content .messages-container {
      padding: 12px 8px;

      .message-item {
        .message-content {
          max-width: 90%;

          .message-text {
            padding: 8px 10px;
            font-size: 12px;
          }
        }

        .message-avatar {
          width: 26px;
          height: 26px;
          font-size: 11px;
        }
      }
    }

    .chat-input {
      padding: 10px 12px;

      .input-container {
        flex-direction: column;
        gap: 8px;

        .input-actions :deep(.n-button) {
          width: 100%;
          max-width: 150px;
        }
      }
    }
  }
}
</style>
