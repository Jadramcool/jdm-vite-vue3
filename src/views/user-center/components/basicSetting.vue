<template>
  <div class="basic-setting-container">
    <!-- 头像设置卡片 -->
    <n-card class="avatar-card">
      <template #header>
        <div class="card-header">
          <JayIcon icon="solar:camera-bold" class="header-icon" />
          <span class="header-title">头像设置</span>
        </div>
      </template>
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
    </n-card>
    <!-- 基本信息卡片 -->
    <n-card class="info-card">
      <template #header>
        <div class="card-header">
          <JayIcon icon="solar:user-id-bold" class="header-icon" />
          <span class="header-title">基本信息</span>
        </div>
      </template>
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
    </n-card>
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
  gap: 16px;
  padding: 4px;
}

// 卡片通用样式
.avatar-card,
.info-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  :deep(.n-card-header) {
    padding: 16px 20px 12px;
    border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  }

  :deep(.n-card__content) {
    padding: 20px;
  }
}

// 卡片头部样式
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 24px;
  height: 24px;
  color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

// 头像上传区域样式
.avatar-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar-preview {
  position: relative;
  display: inline-block;
}

.user-avatar-large {
  border: 3px solid #ffffff;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
}

.camera-icon {
  width: 32px;
  height: 32px;
  color: white;
}

.upload-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-button-wrapper {
  display: flex;
  justify-content: center;
}

.upload-button {
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
  }
}

.upload-tips {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #718096;
  font-size: 13px;
  background: rgba(113, 128, 150, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(113, 128, 150, 0.2);
}

.tip-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.upload-progress {
  margin-top: 12px;

  :deep(.n-progress-text) {
    color: #667eea;
    font-weight: 600;
  }
}

// 表单容器样式
.form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-info-form {
  :deep(.n-form-item) {
    margin-bottom: 16px;

    .n-form-item-label {
      font-weight: 600;
      color: #4a5568;
      padding-bottom: 6px;
    }

    .n-input,
    .n-select,
    .n-date-picker,
    .n-cascader {
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      &:focus-within {
        box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
      }
    }
  }

  :deep(.n-form-item-feedback-wrapper) {
    margin-top: 2px;
  }
}

.form-actions {
  display: flex;
  justify-content: center;
  padding-top: 12px;
  border-top: 1px solid rgba(229, 231, 235, 0.8);
}

.save-button {
  border-radius: 8px;
  padding: 10px 28px;
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .basic-setting-container {
    gap: 12px;
    padding: 2px;
  }

  .avatar-card,
  .info-card {
    :deep(.n-card-header) {
      padding: 12px 16px 8px;
    }

    :deep(.n-card__content) {
      padding: 16px;
    }
  }

  .avatar-upload-section {
    gap: 12px;
  }

  .user-avatar-large {
    width: 100px !important;
    height: 100px !important;
  }

  .upload-controls {
    gap: 8px;
  }

  .upload-button {
    padding: 8px 16px;
    font-size: 14px;
  }

  .form-container {
    gap: 12px;
  }

  .user-info-form {
    :deep(.n-form-item) {
      margin-bottom: 12px;
    }
  }

  .form-actions {
    padding-top: 8px;
  }

  .save-button {
    padding: 8px 20px;
    font-size: 14px;
  }
}
</style>
