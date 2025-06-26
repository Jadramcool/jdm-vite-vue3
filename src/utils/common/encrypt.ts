/*
 * @Author: jdm 1051780106@qq.com
 * @Date: 2025-06-26 11:40:40
 * @LastEditors: jdm 1051780106@qq.com
 * @LastEditTime: 2025-06-26 13:06:35
 * @FilePath: \jdm-vite-vue3\src\utils\common\encrypt.ts
 * @Description: 字符串加密解密工具 - 提供Base64和简单加密功能
 */

import { ref } from 'vue';

// 类型定义
export interface EncryptResult {
  success: boolean;
  data?: string;
  error?: string;
}

export interface CopyResult {
  success: boolean;
  error?: string;
}

/**
 * Base64 编码（支持中文）
 * @param text 要编码的文本
 * @returns 编码结果
 */
export function encodeBase64(text: string): EncryptResult {
  try {
    if (!text || text.trim() === '') {
      return {
        success: false,
        error: '输入文本不能为空',
      };
    }

    // 使用现代API替代过时的unescape
    const encoded = btoa(encodeURIComponent(text));
    return {
      success: true,
      data: encoded,
    };
  } catch (error) {
    return {
      success: false,
      error: `编码失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}

/**
 * Base64 解码
 * @param encodedText 要解码的Base64文本
 * @returns 解码结果
 */
export function decodeBase64(encodedText: string): EncryptResult {
  try {
    if (!encodedText || encodedText.trim() === '') {
      return {
        success: false,
        error: '输入文本不能为空',
      };
    }

    const decoded = decodeURIComponent(atob(encodedText));
    return {
      success: true,
      data: decoded,
    };
  } catch (error) {
    return {
      success: false,
      error: `解码失败: ${error instanceof Error ? error.message : '无效的Base64格式'}`,
    };
  }
}

/**
 * 简单字符串加密（凯撒密码）
 * @param text 要加密的文本
 * @param shift 位移量，默认为3
 * @returns 加密结果
 */
export function encryptCaesar(text: string, shift: number = 3): EncryptResult {
  try {
    if (!text || text.trim() === '') {
      return {
        success: false,
        error: '输入文本不能为空',
      };
    }

    const encrypted = text
      .split('')
      .map((char) => {
        const code = char.charCodeAt(0);
        return String.fromCharCode(code + shift);
      })
      .join('');

    return {
      success: true,
      data: encrypted,
    };
  } catch (error) {
    return {
      success: false,
      error: `加密失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}

/**
 * 简单字符串解密（凯撒密码）
 * @param encryptedText 要解密的文本
 * @param shift 位移量，默认为3
 * @returns 解密结果
 */
export function decryptCaesar(encryptedText: string, shift: number = 3): EncryptResult {
  try {
    if (!encryptedText || encryptedText.trim() === '') {
      return {
        success: false,
        error: '输入文本不能为空',
      };
    }

    const decrypted = encryptedText
      .split('')
      .map((char) => {
        const code = char.charCodeAt(0);
        return String.fromCharCode(code - shift);
      })
      .join('');

    return {
      success: true,
      data: decrypted,
    };
  } catch (error) {
    return {
      success: false,
      error: `解密失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<CopyResult>
 */
export async function copyToClipboard(text: string): Promise<CopyResult> {
  try {
    if (!text) {
      return {
        success: false,
        error: '复制内容不能为空',
      };
    }

    // 检查浏览器是否支持 Clipboard API
    if (!navigator.clipboard) {
      // 降级方案：使用传统的 document.execCommand
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        return { success: true };
      }
      throw new Error('execCommand 复制失败');
    }

    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `复制失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}

/**
 * 创建加密工具的 Vue 组合式函数
 * @returns 加密工具的响应式状态和方法
 */
export function useEncrypt() {
  const plainText = ref('');
  const encryptedText = ref('');
  const copySuccess = ref(false);
  const loading = ref(false);
  const error = ref('');

  // 清除错误信息
  const clearError = () => {
    error.value = '';
  };

  // Base64 加密
  const encryptText = () => {
    clearError();
    loading.value = true;

    const result = encodeBase64(plainText.value);

    if (result.success) {
      encryptedText.value = result.data || '';
      copySuccess.value = false;
    } else {
      error.value = result.error || '加密失败';
    }

    loading.value = false;
  };

  // Base64 解密
  const decryptText = () => {
    clearError();
    loading.value = true;

    const result = decodeBase64(encryptedText.value);

    if (result.success) {
      plainText.value = result.data || '';
    } else {
      error.value = result.error || '解密失败';
    }

    loading.value = false;
  };

  // 复制到剪贴板
  const handleCopy = async () => {
    clearError();

    const result = await copyToClipboard(encryptedText.value);

    if (result.success) {
      copySuccess.value = true;
      // 3秒后重置复制成功状态
      setTimeout(() => {
        copySuccess.value = false;
      }, 3000);
    } else {
      error.value = result.error || '复制失败';
    }
  };

  // 清空所有内容
  const clearAll = () => {
    plainText.value = '';
    encryptedText.value = '';
    copySuccess.value = false;
    clearError();
  };

  return {
    // 响应式状态
    plainText,
    encryptedText,
    copySuccess,
    loading,
    error,

    // 方法
    encryptText,
    decryptText,
    handleCopy,
    clearAll,
    clearError,
  };
}

// 导出加密工具对象
export const EncryptUtils = {
  encodeBase64,
  decodeBase64,
  encryptCaesar,
  decryptCaesar,
  copyToClipboard,
};

// 默认导出
export default EncryptUtils;
