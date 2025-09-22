<template>
  <div
    class="login-container wh-full flex"
    :class="appStore.colorMode === 'dark' ? 'login-dark' : 'login-light'"
  >
    <!-- 左侧装饰区域 -->
    <div class="login-decoration flex-1 relative overflow-hidden <lg:hidden">
      <div class="decoration-content h-full flex flex-col justify-center items-center p-60px">
        <!-- 品牌标识 -->
        <div class="brand-section mb-60px text-center">
          <div class="logo-wrapper mb-20px">
            <TheLogo class="w-80px h-80px" />
          </div>
          <h1 class="brand-title text-5xl font-bold mb-10px">
            <span class="text-gradient">{{ systemName }}</span>
          </h1>
          <p class="brand-subtitle text-xl opacity-80">智能管理平台</p>
        </div>

        <!-- 特性展示 -->
        <div class="features-grid grid grid-cols-1 gap-30px max-w-400px">
          <div class="feature-card group">
            <div class="feature-icon-wrapper">
              <i class="i-carbon-dashboard feature-icon text-blue-500"></i>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">智能仪表盘</h3>
              <p class="feature-description">实时数据监控与可视化分析</p>
            </div>
          </div>

          <div class="feature-card group">
            <div class="feature-icon-wrapper">
              <i class="i-carbon-user-multiple feature-icon text-green-500"></i>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">权限管理</h3>
              <p class="feature-description">细粒度权限控制与角色分配</p>
            </div>
          </div>

          <div class="feature-card group">
            <div class="feature-icon-wrapper">
              <i class="i-carbon-cloud-security feature-icon text-purple-500"></i>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">安全防护</h3>
              <p class="feature-description">企业级安全保障与数据加密</p>
            </div>
          </div>
        </div>

        <!-- 版权信息 -->
        <div class="copyright-section mt-auto pt-40px">
          <p class="copyright-text">{{ copyright }}</p>
        </div>
      </div>

      <!-- 装饰性几何图形 -->
      <div class="geometric-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>

    <!-- 右侧登录表单区域 -->
    <div class="login-form-section flex items-center justify-center min-h-screen">
      <div class="form-wrapper">
        <div class="form-header text-center mb-40px lg:hidden">
          <TheLogo class="w-60px h-60px mx-auto mb-20px" />
          <h2 class="form-title text-3xl font-bold mb-10px">
            <span class="text-gradient">{{ systemName }}</span>
          </h2>
        </div>

        <Transition :name="appStore.transitionAnimation" mode="out-in">
          <component :is="formComponets[formType]" v-model="formType" class="w-full" />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore, useConfigStore } from '@/store';
import { Login, Register } from './components';

const appStore = useAppStore();
const configStore = useConfigStore();

const copyright = configStore.getConfigValue('copyright');
const systemName = configStore.getConfigValue('site_name');

type IformType = 'login' | 'register' | 'resetPwd';
const formType: Ref<IformType> = ref('login');
const formComponets: any = {
  login: Login,
  register: Register,
};
</script>

<style lang="scss" scoped>
// 基础容器
.login-container {
  min-height: 100vh;
  position: relative;
}

// 通用渐变文字样式
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

// 左侧装饰区域
.login-decoration {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;

  .decoration-content {
    position: relative;
    z-index: 2;
  }

  .logo-wrapper {
    animation: float 6s ease-in-out infinite;
  }

  .brand-title .text-gradient {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .brand-subtitle {
    color: rgba(255, 255, 255, 0.9);
  }

  .feature-card {
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    &:hover {
      transform: translateY(-5px) scale(1.02);
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

      .feature-icon-wrapper {
        transform: rotate(5deg) scale(1.1);
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }

  .feature-icon-wrapper {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    transition: all 0.3s ease;

    .feature-icon {
      font-size: 24px;
      color: white;
    }
  }

  .feature-content {
    flex: 1;
  }

  .feature-title {
    font-size: 16px;
    font-weight: 600;
    color: white;
    margin-bottom: 4px;
  }

  .feature-description {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.4;
  }

  .copyright-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
  }

  // 装饰性几何图形
  .geometric-shapes {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 1;

    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 8s ease-in-out infinite;

      &.shape-1 {
        width: 200px;
        height: 200px;
        top: 10%;
        right: -100px;
      }

      &.shape-2 {
        width: 150px;
        height: 150px;
        bottom: 20%;
        left: -75px;
        animation-delay: 2s;
      }

      &.shape-3 {
        width: 100px;
        height: 100px;
        top: 60%;
        right: 10%;
        animation-delay: 4s;
      }
    }
  }
}

// 右侧表单区域
.login-form-section {
  width: 600px;
  padding: 40px;
  background: white;
  transition: background-color 0.3s ease;

  @media (max-width: 1024px) {
    width: 100%;
    min-height: 100vh;
  }

  .form-wrapper {
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
  }
}

// 深色模式样式
.login-dark {
  .login-decoration {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1f1f1f 100%);

    .brand-title .text-gradient {
      background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-subtitle {
      color: rgba(255, 255, 255, 0.8);
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

        .feature-icon-wrapper {
          background: rgba(255, 255, 255, 0.15);
        }
      }
    }

    .feature-icon-wrapper {
      background: rgba(255, 255, 255, 0.1);
    }

    .feature-title {
      color: #ffffff;
    }

    .feature-description {
      color: rgba(255, 255, 255, 0.7);
    }

    .copyright-text {
      color: rgba(255, 255, 255, 0.6);
    }

    .geometric-shapes {
      .shape {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }

  .login-form-section {
    background: #1a1a1a;
    color: #ffffff;
  }

  .form-header {
    .form-title {
      .text-gradient {
        background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
  }
}

// 动画定义
@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
