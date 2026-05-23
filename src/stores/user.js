import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  
  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => userInfo.value?.name || '')
  const userPhone = computed(() => userInfo.value?.phone || '')
  
  // Actions
  const setUserInfo = (info) => {
    userInfo.value = info
    if (info.token) {
      token.value = info.token
      localStorage.setItem('token', info.token)
    }
  }
  
  const logout = () => {
    userInfo.value = null
    token.value = ''
    localStorage.removeItem('token')
  }
  
  // 模拟登录
  const login = async (phone, code) => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟验证
    if (phone && code === '123456') {
      const mockUser = {
        id: 'user_' + Date.now(),
        name: '农机用户' + phone.slice(-4),
        phone: phone,
        token: 'mock_token_' + Date.now()
      }
      setUserInfo(mockUser)
      return { success: true, data: mockUser }
    } else {
      throw new Error('验证码错误')
    }
  }
  
  // 发送验证码
  const sendCode = async (phone) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      throw new Error('请输入正确的手机号')
    }
    
    // 模拟发送成功
    return { success: true, message: '验证码已发送' }
  }
  
  return {
    userInfo,
    token,
    isLoggedIn,
    userName,
    userPhone,
    setUserInfo,
    logout,
    login,
    sendCode
  }
})
