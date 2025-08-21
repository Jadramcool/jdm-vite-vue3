<template>
  <div class="basic-setting-container">
    <!-- 头像设置区域 -->
    <div class="avatar-section">
      <div class="section-header">
        <JayIcon icon="solar:camera-bold" class="header-icon" />
        <span class="header-title">头像设置</span>
      </div>
      <div class="avatar-upload-section">
        <div class="avatar-preview">
          <n-avatar :size="120" :src="userInfo?.avatar" class="user-avatar-large" />
        </div>
        <div class="upload-controls">
          <n-upload
            :custom-request="handleCustomUpload"
            @before-upload="beforeUpload"
            :show-file-list="false"
            accept="image/*"
            class="upload-button-wrapper"
          >
            <n-button
              type="primary"
              size="large"
              class="upload-button"
              :loading="uploading"
              :disabled="uploading"
            >
              <template #icon>
                <JayIcon icon="solar:upload-bold" />
              </template>
              {{
                uploading
                  ? `${$t('common.uploading')}... ${uploadProgress}%`
                  : $t('modules.appCenter.basicSetting.uploadAvatar')
              }}
            </n-button>
          </n-upload>
          <div class="upload-tips">
            <JayIcon icon="solar:info-circle-bold" class="tip-icon" />
            <span>支持 JPG、PNG 格式，文件大小不超过 2MB</span>
          </div>
        </div>
      </div>
      <n-progress
        v-if="uploadProgress > 0 && uploadProgress < 100"
        :percentage="uploadProgress"
        class="upload-progress"
        type="line"
        :show-indicator="true"
        processing
      />
    </div>

    <!-- 基本信息区域 -->
    <div class="info-section">
      <div class="section-header">
        <JayIcon icon="solar:user-id-bold" class="header-icon" />
        <span class="header-title">基本信息</span>
      </div>
      <div class="form-container">
        <BasicForm
          @register="registerUserInfoForm"
          ref="formRef"
          class="user-info-form"
        ></BasicForm>
        <div class="form-actions">
          <n-button
            type="primary"
            size="large"
            attr-type="submit"
            @click="handleSubmitUserInfo"
            class="save-button"
          >
            <template #icon>
              <JayIcon icon="solar:check-circle-bold" />
            </template>
            {{ $t('common.submit') }}
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UploadApi, UserApi } from '@/api';
import { BasicForm, useForm } from '@/components';
import { $t } from '@/locales';
import { useConstantsStore, useUserStore } from '@/store';
import type { UploadFileInfo } from 'naive-ui';
import { useUserInfoSchema } from '../schema';

defineOptions({ name: 'BasicSetting' });

const userStore = useUserStore();
const constantsStore = useConstantsStore();

// 上传状态
const uploading = ref(false);
const uploadProgress = ref(0);

const userInfo = computed(() => ({
  ...userStore.getUser,
}));

// 省市区对照表
const cityAddress = computed(() => {
  return constantsStore.getCityAddress;
});

// 存储省市区路径
const cityDetail = ref<string>('');

onMounted(async () => {
  // 初始化表单数据
  if (unref(userInfo)) {
    await setFieldsValue(unref(userInfo));

    const componentInstance = await getComponentInstance('city');

    // 获取到当前的省市区地址，naive ui不支持单选直接获取，只能去取label自己格式化了
    cityDetail.value = componentInstance.selectedOption?.label.replace(/[\s\/]/g, '') || '';
  }
});

const schemaMethods = {
  addressUpdate(_val: string, _option: any, pathValues: any[]) {
    const path = pathValues?.map((item) => item?.name).join('');
    cityDetail.value = path;
  },
};

const { editFormSchemas } = useUserInfoSchema(schemaMethods, { addressOptions: cityAddress });

const [registerUserInfoForm, { setFieldsValue, validate, getFieldsValue, getComponentInstance }] =
  useForm({
    labelWidth: 120,
    gridProps: { cols: '2' },
    schemas: editFormSchemas,
    showActionButtonGroup: false,
  });

const beforeUpload = async (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  if (
    !['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(data.file.file?.type as string)
  ) {
    window.$message.error($t('modules.appCenter.basicSetting.uploadTypeError'));
    return false;
  }

  // 检查文件大小（2MB限制）
  const maxSize = 2 * 1024 * 1024;
  if (data.file.file && data.file.file.size > maxSize) {
    window.$message.error('头像文件过大，请选择小于2MB的图片');
    return false;
  }

  return true;
};

const handleCustomUpload = async ({ file, onProgress, onFinish, onError }: any) => {
  if (!file.file) {
    onError('文件不存在');
    return;
  }

  try {
    uploading.value = true;
    uploadProgress.value = 0;

    const result = await UploadApi.uploadFile(
      {
        file: file.file,
        fileType: 'avatar',
        target: 'oss',
      },
      (progress) => {
        uploadProgress.value = progress;
        onProgress({ percent: progress });
      },
      true, // 使用预设配置
    );

    // 获取上传结果URL
    let avatarUrl = '';
    if (result.oss?.fileUrl) {
      avatarUrl = result.oss.fileUrl;
    } else if (result.local?.fileUrl) {
      avatarUrl = result.local.fileUrl;
    }

    if (avatarUrl) {
      userStore.setUser({ avatar: avatarUrl });
      window.$message.success($t('modules.appCenter.basicSetting.uploadSuccess'));
      onFinish();
    } else {
      throw new Error('上传成功但未获取到文件URL');
    }
  } catch (error: any) {
    const errorMessage = error?.message || '头像上传失败';
    window.$message.error(errorMessage);
    onError(errorMessage);
  } finally {
    uploading.value = false;
    uploadProgress.value = 0;
  }
};

const handleSubmitUserInfo = async () => {
  try {
    await validate();
    const values = getFieldsValue();

    if (values) {
      values.birthday = new Date(values.birthday);
      values.addressDetail = (cityDetail.value || '') + (values.address || '');
      const newUserInfo = await UserApi.update(values);
      userStore.setUser(newUserInfo);
      window.$message.success($t('common.submitSuccess'));
    }
  } catch (e: any) {
    if (Array.isArray(e)) {
      const errMsg = e.map((item) => item[0].message).join(',');
      window.$message.error(errMsg);
    } else {
      window.$message.error(e);
    }
  }
};
</script>

<style scoped lang="scss">
.basic-setting-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 8px;
  margin: 0 auto;
}

// 区域通用样式
.avatar-section,
.info-section {
  background: #ffffff;
  padding: 32px 0;
  border-bottom: 1px solid rgba(229, 231, 235, 0.3);

  &:last-child {
    border-bottom: none;
  }
}

// 区域头部样式
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(99, 102, 241, 0.1);
}

.header-icon {
  width: 20px;
  height: 20px;
  color: #6366f1;
  flex-shrink: 0;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  letter-spacing: -0.025em;
}

// 头像上传区域样式
.avatar-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 8px 0;
}

.avatar-preview {
  position: relative;
  display: inline-block;
}

.user-avatar-large {
  border: 2px solid rgba(229, 231, 235, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: #6366f1;
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.15);
  }
}

.upload-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.upload-button-wrapper {
  display: flex;
  justify-content: center;
}

.upload-button {
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 500;
  font-size: 14px;
  box-shadow: none;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
  }
}

.upload-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 13px;
  background: #f9fafb;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.tip-icon {
  width: 14px;
  height: 14px;
  color: #6366f1;
  flex-shrink: 0;
}

.upload-progress {
  margin-top: 16px;
  width: 100%;
  max-width: 300px;

  :deep(.n-progress-text) {
    color: #6366f1;
    font-weight: 500;
    font-size: 13px;
  }
}

// 表单容器样式
.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-info-form {
  :deep(.n-form-item) {
    margin-bottom: 20px;

    .n-form-item-label {
      font-weight: 500;
      color: #374151;
      padding-bottom: 8px;
      font-size: 14px;
    }

    .n-input,
    .n-select,
    .n-date-picker,
    .n-cascader {
      border-radius: 8px;
      transition: all 0.2s ease;
      border-color: #d1d5db;

      &:hover {
        border-color: #9ca3af;
      }

      &:focus-within {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }
    }
  }

  :deep(.n-form-item-feedback-wrapper) {
    margin-top: 4px;
  }
}

.form-actions {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.save-button {
  border-radius: 8px;
  padding: 12px 32px;
  font-weight: 500;
  font-size: 14px;
  box-shadow: none;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .basic-setting-container {
    gap: 16px;
    padding: 4px;
    max-width: 100%;
  }

  .avatar-section,
  .info-section {
    padding: 24px 0;
  }

  .section-header {
    margin-bottom: 20px;
    padding-bottom: 12px;
  }

  .avatar-upload-section {
    gap: 16px;
    padding: 4px 0;
  }

  .user-avatar-large {
    width: 100px !important;
    height: 100px !important;
  }

  .upload-controls {
    gap: 12px;
  }

  .upload-button {
    padding: 10px 20px;
    font-size: 14px;
  }

  .upload-tips {
    padding: 6px 12px;
    font-size: 12px;
  }

  .form-container {
    gap: 16px;
  }

  .user-info-form {
    :deep(.n-form-item) {
      margin-bottom: 16px;

      .n-form-item-label {
        font-size: 13px;
      }
    }
  }

  .form-actions {
    padding-top: 16px;
  }

  .save-button {
    padding: 10px 24px;
    font-size: 14px;
  }

  .header-title {
    font-size: 15px;
  }
}
</style>
