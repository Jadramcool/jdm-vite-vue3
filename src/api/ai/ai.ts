// AI服务接口定义
export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

// 智能体接口定义
export interface AIAgent {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  systemPrompt: string;
  category:
    | 'general'
    | 'coding'
    | 'writing'
    | 'analysis'
    | 'creative'
    | 'business'
    | 'education'
    | 'custom';
  tags: string[];
  isBuiltIn: boolean;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  usageCount?: number;
  rating?: number;
  author?: string;
  version?: string;
  config?: {
    temperature?: number;
    maxTokens?: number;
    preferredModel?: string;
    preferredProvider?: string;
  };
}

// 智能体分类
export interface AgentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

// 智能体使用统计
export interface AgentUsageStats {
  agentId: string;
  totalUsage: number;
  lastUsed: number;
  averageRating: number;
  totalRatings: number;
}

export interface AIConfig {
  apiKey: string;
  baseURL?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface AIModel {
  id: string;
  name: string;
  description?: string;
  contextLength?: number;
  pricing?: {
    input?: number;
    output?: number;
  };
}

export interface AIProvider {
  name: string;
  baseURL: string;
  models: string[]; // 保留作为默认模型列表
  headers: (apiKey: string) => Record<string, string>;
  formatRequest: (messages: AIMessage[], config: AIConfig) => any;
  parseResponse: (response: any) => string;
  parseStreamChunk: (chunk: string) => string | null;
  getModels?: (apiKey: string, baseURL?: string) => Promise<AIModel[]>;
}

// AI服务提供商配置
export const AI_PROVIDERS: Record<string, AIProvider> = {
  deepseek: {
    name: 'DeepSeek',
    baseURL: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat'],
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    }),
    formatRequest: (messages: AIMessage[], config: AIConfig) => ({
      model: config.model || 'deepseek-chat',
      messages: messages.map((msg) => ({ role: msg.role, content: msg.content })),
      temperature: config.temperature || 0.7,
      max_tokens: config.maxTokens || 2048,
      stream: true,
    }),
    parseResponse: (response: any) => response.choices?.[0]?.message?.content || '',
    parseStreamChunk: (chunk: string) => {
      if (chunk.startsWith('data: ')) {
        const data = chunk.slice(6).trim();
        if (data === '[DONE]') return null;
        try {
          const parsed = JSON.parse(data);
          return parsed.choices?.[0]?.delta?.content || '';
        } catch {
          return '';
        }
      }
      return '';
    },
    getModels: async (apiKey: string, baseURL?: string): Promise<AIModel[]> => {
      const url = `${baseURL || 'https://api.deepseek.com/v1'}/models`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`获取DeepSeek模型列表失败: ${response.status}`);
      }

      const data = await response.json();
      return (
        data.data?.map((model: any) => ({
          id: model.id,
          name: model.id,
          description: model.description,
        })) || []
      );
    },
  },
};

// AI服务类
export class AIService {
  private provider: AIProvider;

  private config: AIConfig;

  constructor(providerKey: string, config: AIConfig) {
    const provider = AI_PROVIDERS[providerKey];
    if (!provider) {
      throw new Error(`不支持的AI服务提供商: ${providerKey}`);
    }
    this.provider = provider;
    this.config = config;
  }

  /**
   * 发送流式消息
   */
  async sendStreamMessage(
    messages: AIMessage[],
    onChunk: (chunk: string) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    const url = `${this.config.baseURL || this.provider.baseURL}/chat/completions`;
    const headers = this.provider.headers(this.config.apiKey);
    const body = this.provider.formatRequest(messages, this.config);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      throw new Error(`AI API请求失败: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      // 使用递归方式替代while循环中的await，完全符合ESLint规范
      const processStream = async (): Promise<void> => {
        const { done, value } = await reader.read();
        if (done) return;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const content = this.provider.parseStreamChunk(line);
          if (content !== null && content !== '') {
            onChunk(content);
          }
        }

        // 递归调用处理下一个chunk
        await processStream();
      };

      await processStream();
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * 发送普通消息
   */
  async sendMessage(messages: AIMessage[]): Promise<string> {
    const url = `${this.config.baseURL || this.provider.baseURL}/chat/completions`;
    const headers = this.provider.headers(this.config.apiKey);
    const body = { ...this.provider.formatRequest(messages, this.config), stream: false };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`AI API请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return this.provider.parseResponse(data);
  }

  /**
   * 验证API配置
   */
  async validateConfig(): Promise<boolean> {
    try {
      const testMessages: AIMessage[] = [{ role: 'user', content: 'Hello' }];
      await this.sendMessage(testMessages);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * 创建AI服务实例
 */
export const createAIService = (providerKey: string, config: AIConfig): AIService => {
  return new AIService(providerKey, config);
};

/**
 * 获取所有AI提供商
 */
export const getAIProviders = (): Record<string, AIProvider> => {
  return AI_PROVIDERS;
};

/**
 * 获取指定提供商信息
 */
export const getAIProvider = (providerKey: string): AIProvider | undefined => {
  return AI_PROVIDERS[providerKey];
};

/**
 * 获取指定提供商的模型列表
 */
export const getProviderModels = async (
  providerKey: string,
  apiKey: string,
  baseURL?: string,
): Promise<AIModel[]> => {
  const provider = AI_PROVIDERS[providerKey];
  if (!provider) {
    throw new Error(`不支持的AI服务提供商: ${providerKey}`);
  }

  if (provider.getModels) {
    try {
      return await provider.getModels(apiKey, baseURL);
    } catch (error) {
      console.warn(`获取${provider.name}模型列表失败，使用默认列表:`, error);
      // 如果API调用失败，返回默认模型列表
      return provider.models.map((modelId) => ({
        id: modelId,
        name: modelId,
        description: `${provider.name} ${modelId}`,
      }));
    }
  }

  // 如果没有getModels方法，返回默认模型列表
  return provider.models.map((modelId) => ({
    id: modelId,
    name: modelId,
    description: `${provider.name} ${modelId}`,
  }));
};

// ==================== 智能体管理API ====================

// 预定义的智能体分类
export const AGENT_CATEGORIES: AgentCategory[] = [
  {
    id: 'general',
    name: '通用助手',
    description: '日常对话和通用任务',
    icon: '💬',
    color: '#1890ff',
  },
  {
    id: 'coding',
    name: '编程助手',
    description: '代码编写、调试和优化',
    icon: '💻',
    color: '#52c41a',
  },
  {
    id: 'writing',
    name: '写作助手',
    description: '文章写作、文案创作',
    icon: '✍️',
    color: '#722ed1',
  },
  {
    id: 'analysis',
    name: '分析助手',
    description: '数据分析、逻辑推理',
    icon: '📊',
    color: '#fa8c16',
  },
  {
    id: 'creative',
    name: '创意助手',
    description: '创意设计、头脑风暴',
    icon: '🎨',
    color: '#eb2f96',
  },
  {
    id: 'business',
    name: '商务助手',
    description: '商业分析、市场策略',
    icon: '💼',
    color: '#13c2c2',
  },
  {
    id: 'education',
    name: '教育助手',
    description: '学习辅导、知识解答',
    icon: '📚',
    color: '#f5222d',
  },
  { id: 'custom', name: '自定义', description: '用户自定义智能体', icon: '⚙️', color: '#666666' },
];

// 内置智能体列表
export const BUILT_IN_AGENTS: AIAgent[] = [
  {
    id: 'general-assistant',
    name: '通用助手',
    description: '我是一个通用AI助手，可以帮助您解答问题、提供建议和进行日常对话。',
    avatar: '🤖',
    systemPrompt:
      '你是一个友好、专业的AI助手。请用简洁明了的语言回答用户的问题，提供有用的建议和信息。',
    category: 'general',
    tags: ['通用', '对话', '问答'],
    isBuiltIn: true,
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    usageCount: 0,
    rating: 5.0,
    author: 'System',
    version: '1.0.0',
  },
  {
    id: 'coding-expert',
    name: '编程专家',
    description: '专业的编程助手，擅长多种编程语言，可以帮助您编写、调试和优化代码。',
    avatar: '👨‍💻',
    systemPrompt:
      '你是一个专业的编程专家，精通多种编程语言和开发框架。请提供清晰、可执行的代码解决方案，并解释代码的工作原理。注重代码质量、性能和最佳实践。',
    category: 'coding',
    tags: ['编程', '代码', '调试', '优化'],
    isBuiltIn: true,
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    usageCount: 0,
    rating: 4.9,
    author: 'System',
    version: '1.0.0',
    config: {
      temperature: 0.3,
      preferredModel: 'deepseek-chat',
      preferredProvider: 'deepseek',
    },
  },
  {
    id: 'writing-master',
    name: '写作大师',
    description: '专业的写作助手，可以帮助您创作各种类型的文章、文案和创意内容。',
    avatar: '✍️',
    systemPrompt:
      '你是一个专业的写作大师，擅长各种文体的创作。请根据用户需求提供高质量的文章、文案或创意内容，注重语言的准确性、流畅性和表达力。',
    category: 'writing',
    tags: ['写作', '文案', '创作', '文章'],
    isBuiltIn: true,
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    usageCount: 0,
    rating: 4.8,
    author: 'System',
    version: '1.0.0',
    config: {
      temperature: 0.7,
    },
  },
  {
    id: 'data-analyst',
    name: '数据分析师',
    description: '专业的数据分析助手，可以帮助您分析数据、制作图表和提供洞察。',
    avatar: '📊',
    systemPrompt:
      '你是一个专业的数据分析师，擅长数据处理、统计分析和可视化。请提供准确的数据分析结果，清晰的解释和有价值的洞察。',
    category: 'analysis',
    tags: ['数据分析', '统计', '图表', '洞察'],
    isBuiltIn: true,
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    usageCount: 0,
    rating: 4.7,
    author: 'System',
    version: '1.0.0',
    config: {
      temperature: 0.2,
    },
  },
];

// 智能体存储键名
const AGENTS_STORAGE_KEY = 'ai_agents';
const AGENT_STATS_STORAGE_KEY = 'ai_agent_stats';

/**
 * 获取所有智能体
 */
export const getAllAgents = (): AIAgent[] => {
  try {
    const stored = localStorage.getItem(AGENTS_STORAGE_KEY);
    const customAgents = stored ? JSON.parse(stored) : [];
    return [...BUILT_IN_AGENTS, ...customAgents];
  } catch (error) {
    console.error('获取智能体列表失败:', error);
    return BUILT_IN_AGENTS;
  }
};

/**
 * 根据分类获取智能体
 */
export const getAgentsByCategory = (category: string): AIAgent[] => {
  return getAllAgents().filter((agent) => agent.category === category && agent.isActive);
};

/**
 * 根据ID获取智能体
 */
export const getAgentById = (id: string): AIAgent | undefined => {
  return getAllAgents().find((agent) => agent.id === id);
};

/**
 * 保存自定义智能体
 */
export const saveCustomAgent = (
  agent: Omit<AIAgent, 'id' | 'createdAt' | 'updatedAt' | 'isBuiltIn'>,
): AIAgent => {
  try {
    const newAgent: AIAgent = {
      ...agent,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isBuiltIn: false,
      usageCount: 0,
    };

    const stored = localStorage.getItem(AGENTS_STORAGE_KEY);
    const customAgents = stored ? JSON.parse(stored) : [];
    customAgents.push(newAgent);
    localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(customAgents));

    return newAgent;
  } catch (error) {
    console.error('保存智能体失败:', error);
    throw new Error('保存智能体失败');
  }
};

/**
 * 更新智能体
 */
export const updateAgent = (id: string, updates: Partial<AIAgent>): boolean => {
  try {
    // 不能更新内置智能体
    const agent = getAgentById(id);
    if (!agent || agent.isBuiltIn) {
      return false;
    }

    const stored = localStorage.getItem(AGENTS_STORAGE_KEY);
    const customAgents = stored ? JSON.parse(stored) : [];
    const index = customAgents.findIndex((a: AIAgent) => a.id === id);

    if (index === -1) {
      return false;
    }

    customAgents[index] = {
      ...customAgents[index],
      ...updates,
      updatedAt: Date.now(),
    };

    localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(customAgents));
    return true;
  } catch (error) {
    console.error('更新智能体失败:', error);
    return false;
  }
};

/**
 * 删除智能体
 */
export const deleteAgent = (id: string): boolean => {
  try {
    // 不能删除内置智能体
    const agent = getAgentById(id);
    if (!agent || agent.isBuiltIn) {
      return false;
    }

    const stored = localStorage.getItem(AGENTS_STORAGE_KEY);
    const customAgents = stored ? JSON.parse(stored) : [];
    const filteredAgents = customAgents.filter((a: AIAgent) => a.id !== id);

    localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(filteredAgents));
    return true;
  } catch (error) {
    console.error('删除智能体失败:', error);
    return false;
  }
};

/**
 * 记录智能体使用
 */
export const recordAgentUsage = (agentId: string): void => {
  try {
    // 更新智能体使用次数
    const agent = getAgentById(agentId);
    if (agent && !agent.isBuiltIn) {
      updateAgent(agentId, {
        usageCount: (agent.usageCount || 0) + 1,
        updatedAt: Date.now(),
      });
    }

    // 更新使用统计
    const stored = localStorage.getItem(AGENT_STATS_STORAGE_KEY);
    const stats = stored ? JSON.parse(stored) : {};

    if (!stats[agentId]) {
      stats[agentId] = {
        agentId,
        totalUsage: 0,
        lastUsed: 0,
        averageRating: 0,
        totalRatings: 0,
      };
    }

    stats[agentId].totalUsage += 1;
    stats[agentId].lastUsed = Date.now();

    localStorage.setItem(AGENT_STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('记录智能体使用失败:', error);
  }
};

/**
 * 获取智能体使用统计
 */
export const getAgentStats = (agentId: string): AgentUsageStats | undefined => {
  try {
    const stored = localStorage.getItem(AGENT_STATS_STORAGE_KEY);
    const stats = stored ? JSON.parse(stored) : {};
    return stats[agentId];
  } catch (error) {
    console.error('获取智能体统计失败:', error);
    return undefined;
  }
};

/**
 * 搜索智能体
 */
export const searchAgents = (query: string): AIAgent[] => {
  const allAgents = getAllAgents();
  const lowerQuery = query.toLowerCase();

  return allAgents.filter(
    (agent) =>
      agent.isActive &&
      (agent.name.toLowerCase().includes(lowerQuery) ||
        agent.description.toLowerCase().includes(lowerQuery) ||
        agent.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))),
  );
};
