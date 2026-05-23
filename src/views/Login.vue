<template>
  <div class="login-page">
    <div class="login-header">
      <div class="logo">
        <van-icon name="cluster-o" size="60" color="#07c160" />
      </div>
      <h1 class="title">农机问卷调查</h1>
      <p class="subtitle">欢迎使用农机行业调研系统</p>
    </div>
    
    <div class="login-form">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="phone"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            maxlength="11"
            :rules="[{ required: true, message: '请填写手机号' }, { validator: validatePhone, message: '手机号格式错误' }]"
          >
            <template #left-icon>
              <van-icon name="phone-o" class="field-icon" />
            </template>
          </van-field>
          
          <van-field
            v-model="code"
            name="code"
            label="验证码"
            placeholder="请输入验证码"
            maxlength="6"
            :rules="[{ required: true, message: '请填写验证码' }]"
          >
            <template #left-icon>
              <van-icon name="shield-o" class="field-icon" />
            </template>
            <template #button>
              <van-button
                size="small"
                type="primary"
                :disabled="countdown > 0 || !phone"
                @click="sendCode"
                native-type="button"
              >
                {{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
              </van-button>
            </template>
          </van-field>
        </van-cell-group>
        
        <div class="submit-btn">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            size="large"
          >
            登录
          </van-button>
        </div>
      </van-form>
      
      <div class="tips">
        <p>测试验证码: <strong>123456</strong></p>
        <p>任意11位手机号均可登录</p>
      </div>
    </div>
    
    <div class="login-footer">
      <p>© 2024 农机问卷调查系统</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const phone = ref('')
const code = ref('')
const loading = ref(false)
const countdown = ref(0)

// 手机号验证
const validatePhone = (val) => {
  return /^1[3-9]\d{9}$/.test(val)
}

// 发送验证码
const sendCode = async () => {
  if (!validatePhone(phone.value)) {
    showToast('请输入正确的手机号')
    return
  }
  
  try {
    await userStore.sendCode(phone.value)
    showToast('验证码已发送')
    
    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    showToast(error.message || '发送失败')
  }
}

// 提交登录
const onSubmit = async () => {
  loading.value = true
  
  try {
    await userStore.login(phone.value, code.value)
    showToast('登录成功')
    router.push('/survey')
  } catch (error) {
    showToast(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
  
  .logo {
    width: 100px;
    height: 100px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    color: white;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .subtitle {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
  }
}

.login-form {
  background: white;
  border-radius: 16px;
  padding: 30px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  .field-icon {
    margin-right: 8px;
    color: #666;
  }
  
  .submit-btn {
    margin-top: 30px;
    padding: 0 16px;
  }
  
  .tips {
    margin-top: 20px;
    text-align: center;
    color: #999;
    font-size: 12px;
    
    p {
      margin: 5px 0;
    }
    
    strong {
      color: #07c160;
    }
  }
}

.login-footer {
  margin-top: 40px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

:deep(.van-cell-group--inset) {
  margin: 0;
}

:deep(.van-field__label) {
  width: 70px;
}
</style>
