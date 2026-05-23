<template>
  <div class="survey-page">
    <van-nav-bar
      title="农机问卷调查"
      left-text="退出"
      left-arrow
      @click-left="onLogout"
    />
    
    <!-- 问卷完成页面 -->
    <div v-if="surveyStore.isCompleted" class="completed-page">
      <van-empty
      
        description="问卷提交成功"
      >
        <van-image
          src="/success.png"
          alt="成功图标"
          class="success-icon"
        />
        <template #description>
          <div class="success-content">
            <h3>感谢您的参与！</h3>
            <p>您的反馈对我们非常重要</p>
          </div>
        </template>
      </van-empty>
      
      <div class="action-buttons">
        <van-button type="primary" block round @click="viewStatistics">
          查看统计结果
        </van-button>
        <van-button plain type="primary" block round @click="restartSurvey" style="margin-top: 12px;">
          重新填写
        </van-button>
      </div>
    </div>
    
    <!-- 问卷填写页面 -->
    <div v-else class="survey-content">
      <!-- 进度条 -->
      <div class="progress-section">
        <div class="progress-info">
          <span class="progress-text">进度 {{ surveyStore.progress }}%</span>
          <span class="question-count">{{ surveyStore.currentQuestionIndex + 1 }} / {{ surveyStore.totalQuestions }}</span>
        </div>
        <van-progress
          :percentage="surveyStore.progress"
          :stroke-width="8"
          color="linear-gradient(to right, #07c160, #10b981)"
        />
      </div>
      
      <!-- 问卷信息 -->
      <div class="survey-info">
        <h2 class="survey-title">{{ surveyStore.survey.title }}</h2>
        <p class="survey-desc">{{ surveyStore.survey.description }}</p>
      </div>
      
      <!-- 题目导航 -->
      <div class="question-nav">
        <div
          v-for="(q, index) in surveyStore.survey.questions"
          :key="q.id"
          class="nav-dot"
          :class="{
            'active': index === surveyStore.currentQuestionIndex,
            'completed': answers[q.id] !== undefined && answers[q.id] !== '' &&
                        (!Array.isArray(answers[q.id]) || answers[q.id].length > 0)
          }"
          @click="goToQuestion(index)"
        >
          {{ index + 1 }}
        </div>
      </div>
      
      <!-- 当前题目 -->
      <div class="question-card">
        <div class="question-header">
          <span class="question-type">{{ getQuestionTypeText(currentQuestion.type) }}</span>
          <span v-if="currentQuestion.required" class="required-tag">必填</span>
        </div>
        
        <h3 class="question-title">
          <span class="question-number">{{ surveyStore.currentQuestionIndex + 1 }}.</span>
          {{ currentQuestion.title }}
        </h3>
        
        <!-- 单选题 -->
        <template v-if="currentQuestion.type === 'radio'">
          <van-radio-group v-model="answers[currentQuestion.id]">
            <van-cell-group inset>
              <van-cell
                v-for="option in currentQuestion.options"
                :key="option.value"
                :title="option.label"
                clickable
                @click="answers[currentQuestion.id] = option.value"
              >
                <template #right-icon>
                  <van-radio :name="option.value" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </template>
        
        <!-- 多选题 -->
        <template v-else-if="currentQuestion.type === 'checkbox'">
          <van-checkbox-group v-model="surveyStore.answers[currentQuestion.id]">
            <van-cell-group inset>
              <van-cell
                v-for="option in currentQuestion.options"
                :key="option.value"
                :title="option.label"
                clickable
              >
                <template #right-icon>
                  <van-checkbox :name="option.value" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </template>
        
        <!-- 滑块题 -->
        <template v-else-if="currentQuestion.type === 'slider'">
          <div class="slider-container">
            <div class="slider-value">
              <span class="value">{{ answers[currentQuestion.id] || currentQuestion.min }}</span>
              <span class="unit">分</span>
            </div>
            <van-slider
              v-model="answers[currentQuestion.id]"
              :min="currentQuestion.min"
              :max="currentQuestion.max"
              :step="currentQuestion.step"
              bar-height="8px"
              active-color="#07c160"
            />
            <div class="slider-range">
              <span>{{ currentQuestion.min }}分</span>
              <span>{{ currentQuestion.max }}分</span>
            </div>
          </div>
        </template>
        
        <!-- 步进器题 -->
        <template v-else-if="currentQuestion.type === 'stepper'">
          <div class="stepper-container">
            <van-stepper
              v-model="answers[currentQuestion.id]"
              :min="currentQuestion.min"
              :max="currentQuestion.max"
              :default-value="currentQuestion.default"
              theme="round"
              button-size="32"
            />
            <span class="stepper-unit">台</span>
          </div>
        </template>
        
        <!-- 跟进题 -->
        <div v-if="showFollowUp" class="follow-up-question">
          <van-divider />
          <h4 class="follow-up-title">{{ currentQuestion.followUp.question.title }}</h4>
          <van-checkbox-group v-model="surveyStore.answers[currentQuestion.followUp.question.id]">
            <van-cell-group inset>
              <van-cell
                v-for="option in currentQuestion.followUp.question.options"
                :key="option.value"
                :title="option.label"
                clickable
              >
                <template #right-icon>
                  <van-checkbox :name="option.value" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </div>
      </div>
      
      <!-- 导航按钮 -->
      <div class="nav-buttons">
        <van-button
          v-if="surveyStore.currentQuestionIndex > 0"
          plain
          type="default"
          @click="prevQuestion"
        >
          上一题
        </van-button>
        <van-button
          v-if="surveyStore.currentQuestionIndex < surveyStore.totalQuestions - 1"
          type="primary"
          @click="nextQuestion"
        >
          下一题
        </van-button>
        <van-button
          v-else
          type="success"
          :loading="surveyStore.loading"
          @click="submitSurvey"
        >
          提交问卷
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast, showLoadingToast, closeToast } from 'vant'
import { useSurveyStore } from '@/stores/survey'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const surveyStore = useSurveyStore()
const userStore = useUserStore()

const currentQuestion = computed(() => surveyStore.currentQuestion)
const answers = computed(() => surveyStore.answers)

// 是否显示跟进题
const showFollowUp = computed(() => {
  const q = currentQuestion.value
  return q.followUp && answers.value[q.id] === q.followUp.condition
})

// 获取题型文本
const getQuestionTypeText = (type) => {
  const typeMap = {
    radio: '单选',
    checkbox: '多选',
    slider: '评分',
    stepper: '数量'
  }
  return typeMap[type] || type
}

// 多选状态由 van-checkbox-group 自动处理

// 导航方法
const nextQuestion = () => {
  // 验证当前题目
  const q = currentQuestion.value
  if (q.required) {
    const answer = answers.value[q.id]
    if (answer === undefined || answer === '' || 
        (Array.isArray(answer) && answer.length === 0)) {
      showToast('请回答当前题目')
      return
    }
  }
  surveyStore.nextQuestion()
}

const prevQuestion = () => {
  surveyStore.prevQuestion()
}

const goToQuestion = (index) => {
  surveyStore.goToQuestion(index)
}

// 提交问卷
const submitSurvey = async () => {
  if (!surveyStore.canSubmit) {
    showToast('请完成所有必填题目')
    return
  }
  
  try {
    showLoadingToast({
      message: '提交中...',
      forbidClick: true,
      duration: 0
    })
    
    await surveyStore.submitSurvey()
    closeToast()
    showToast('提交成功')
  } catch (error) {
    closeToast()
    showToast('提交失败，请重试')
  }
}

// 查看统计
const viewStatistics = () => {
  router.push('/statistics')
}

// 重新填写
const restartSurvey = () => {
  surveyStore.resetSurvey()
}

// 退出登录
const onLogout = () => {
  showConfirmDialog({
    title: '确认退出',
    message: '退出后需要重新登录',
  })
    .then(() => {
      userStore.logout()
      router.push('/login')
    })
    .catch(() => {})
}
</script>

<style scoped lang="scss">
.survey-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 100px;
}

.completed-page {
  padding: 40px 20px;
  
  .success-content {
    text-align: center;
    
    h3 {
      color: #07c160;
      font-size: 20px;
      margin-bottom: 8px;
    }
    
    p {
      color: #666;
      font-size: 14px;
    }
  }
  
  .action-buttons {
    margin-top: 40px;
    padding: 0 20px;
  }
}

.progress-section {
  background: white;
  padding: 16px 20px;
  margin-bottom: 12px;
  
  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    
    .progress-text {
      color: #07c160;
      font-weight: bold;
    }
    
    .question-count {
      color: #999;
      font-size: 14px;
    }
  }
}

.survey-info {
  background: white;
  padding: 20px;
  margin-bottom: 12px;
  
  .survey-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
  }
  
  .survey-desc {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
  }
}

.question-nav {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: white;
  margin-bottom: 12px;
  flex-wrap: wrap;
  
  .nav-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    background: #f0f0f0;
    color: #666;
    cursor: pointer;
    transition: all 0.3s;
    
    &.active {
      background: #07c160;
      color: white;
    }
    
    &.completed {
      background: #e6f7ed;
      color: #07c160;
      border: 1px solid #07c160;
    }
  }
}

.question-card {
  background: white;
  margin: 0 12px 12px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  .question-header {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    
    .question-type {
      font-size: 12px;
      color: #07c160;
      background: #e6f7ed;
      padding: 2px 8px;
      border-radius: 4px;
    }
    
    .required-tag {
      font-size: 12px;
      color: #ee0a24;
      background: #ffe6e8;
      padding: 2px 8px;
      border-radius: 4px;
    }
  }
  
  .question-title {
    font-size: 16px;
    color: #333;
    line-height: 1.6;
    margin-bottom: 20px;
    
    .question-number {
      color: #07c160;
      font-weight: bold;
      margin-right: 4px;
    }
  }
}

.slider-container {
  padding: 20px 0;
  
  .slider-value {
    text-align: center;
    margin-bottom: 20px;
    
    .value {
      font-size: 36px;
      font-weight: bold;
      color: #07c160;
    }
    
    .unit {
      font-size: 16px;
      color: #666;
      margin-left: 4px;
    }
  }
  
  .slider-range {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    color: #999;
    font-size: 12px;
  }
}

.stepper-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
  
  .stepper-unit {
    color: #666;
    font-size: 14px;
  }
}

.follow-up-question {
  margin-top: 20px;
  
  .follow-up-title {
    font-size: 15px;
    color: #333;
    margin-bottom: 16px;
  }
}

.nav-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 12px;
  padding: 12px 20px;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  
  .van-button {
    flex: 1;
  }
}

:deep(.van-cell-group--inset) {
  margin: 0;
}

:deep(.van-radio__icon--checked .van-icon) {
  background-color: #07c160;
  border-color: #07c160;
}

:deep(.van-checkbox__icon--checked .van-icon) {
  background-color: #07c160;
  border-color: #07c160;
}

:deep(.van-slider__button) {
  background-color: #07c160;
}
</style>