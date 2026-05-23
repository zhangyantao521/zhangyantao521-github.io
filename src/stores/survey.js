import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 农机行业问卷数据
const surveyData = {
  title: '农机行业使用情况调查问卷',
  description: '感谢您参与本次调查，您的反馈将帮助我们更好地了解农机行业现状',
  questions: [
    {
      id: 1,
      type: 'radio',
      title: '您所在的地区是？',
      required: true,
      options: [
        { label: '华北地区', value: 'huabei' },
        { label: '东北地区', value: 'dongbei' },
        { label: '华东地区', value: 'huadong' },
        { label: '华中地区', value: 'huazhong' },
        { label: '华南地区', value: 'huanan' },
        { label: '西南地区', value: 'xinan' },
        { label: '西北地区', value: 'xibei' }
      ]
    },
    {
      id: 2,
      type: 'radio',
      title: '您的种植规模是？',
      required: true,
      options: [
        { label: '50亩以下', value: 'small' },
        { label: '50-100亩', value: 'medium' },
        { label: '100-500亩', value: 'large' },
        { label: '500亩以上', value: 'xlarge' }
      ]
    },
    {
      id: 3,
      type: 'checkbox',
      title: '您目前拥有哪些类型的农机设备？（可多选）',
      required: true,
      options: [
        { label: '拖拉机', value: 'tractor' },
        { label: '收割机', value: 'harvester' },
        { label: '播种机', value: 'seeder' },
        { label: '植保无人机', value: 'drone' },
        { label: '灌溉设备', value: 'irrigation' },
        { label: '烘干设备', value: 'dryer' },
        { label: '其他', value: 'other' }
      ]
    },
    {
      id: 4,
      type: 'radio',
      title: '您购买农机设备的主要渠道是？',
      required: true,
      options: [
        { label: '农机专卖店', value: 'store' },
        { label: '厂家直销', value: 'factory' },
        { label: '电商平台', value: 'online' },
        { label: '二手市场', value: 'secondhand' },
        { label: '农机合作社', value: 'cooperative' }
      ]
    },
    {
      id: 5,
      type: 'slider',
      title: '您对目前农机设备的满意度评分（1-10分）',
      required: true,
      min: 1,
      max: 10,
      step: 1
    },
    {
      id: 6,
      type: 'checkbox',
      title: '您认为农机设备存在哪些问题？（可多选）',
      required: false,
      options: [
        { label: '价格偏高', value: 'price' },
        { label: '维修不便', value: 'maintenance' },
        { label: '操作复杂', value: 'operation' },
        { label: '油耗较高', value: 'fuel' },
        { label: '配件难买', value: 'parts' },
        { label: '售后服务差', value: 'service' }
      ]
    },
    {
      id: 7,
      type: 'radio',
      title: '您是否使用过智能农机设备？',
      required: true,
      options: [
        { label: '是', value: 'yes' },
        { label: '否', value: 'no' }
      ],
      followUp: {
        condition: 'yes',
        question: {
          id: 7.1,
          type: 'checkbox',
          title: '您使用过哪些智能功能？（可多选）',
          required: false,
          options: [
            { label: '自动驾驶', value: 'autopilot' },
            { label: '精准施肥', value: 'precision' },
            { label: '远程监控', value: 'remote' },
            { label: '数据分析', value: 'data' }
          ]
        }
      }
    },
    {
      id: 8,
      type: 'stepper',
      title: '您计划在未来一年内购买多少台农机设备？',
      required: true,
      min: 0,
      max: 10,
      default: 0
    },
    {
      id: 9,
      type: 'radio',
      title: '您更倾向于购买哪种品牌的农机？',
      required: true,
      options: [
        { label: '国产品牌（如：一拖、雷沃）', value: 'domestic' },
        { label: '进口品牌（如：约翰迪尔、凯斯）', value: 'imported' },
        { label: '合资品牌', value: 'joint' },
        { label: '不看重品牌，看性价比', value: 'cost_effective' }
      ]
    },
    {
      id: 10,
      type: 'radio',
      title: '您对农机补贴政策了解程度如何？',
      required: true,
      options: [
        { label: '非常了解', value: 'very_familiar' },
        { label: '比较了解', value: 'familiar' },
        { label: '一般了解', value: 'general' },
        { label: '不太了解', value: 'not_familiar' },
        { label: '完全不了解', value: 'no_idea' }
      ]
    }
  ]
}

export const useSurveyStore = defineStore('survey', () => {
  // State
  const survey = ref(surveyData)
  const answers = ref({})
  const currentQuestionIndex = ref(0)
  const isCompleted = ref(false)
  const loading = ref(false)
  
  // Getters
  const totalQuestions = computed(() => survey.value.questions.length)
  const currentQuestion = computed(() => survey.value.questions[currentQuestionIndex.value])
  const progress = computed(() => Math.round((currentQuestionIndex.value / totalQuestions.value) * 100))
  const canSubmit = computed(() => {
    // 检查所有必填题是否已回答
    return survey.value.questions.every(q => {
      if (!q.required) return true
      const answer = answers.value[q.id]
      return answer !== undefined && answer !== '' && 
             (Array.isArray(answer) ? answer.length > 0 : true)
    })
  })
  
  // Actions
  const setAnswer = (questionId, value) => {
    answers.value[questionId] = value
    
    // 如果取消选择导致后续题不需要显示，清除后续答案
    const question = survey.value.questions.find(q => q.id === questionId)
    if (question?.followUp && value !== question.followUp.condition) {
      delete answers.value[question.followUp.question.id]
    }
  }
  
  const nextQuestion = () => {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      currentQuestionIndex.value++
    }
  }
  
  const prevQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--
    }
  }
  
  const goToQuestion = (index) => {
    currentQuestionIndex.value = index
  }
  
  const submitSurvey = async () => {
    loading.value = true
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 保存到本地存储
    const surveyRecord = {
      id: 'survey_' + Date.now(),
      answers: { ...answers.value },
      submitTime: new Date().toISOString(),
      userId: 'user_' + Date.now()
    }
    
    const history = JSON.parse(localStorage.getItem('surveyHistory') || '[]')
    history.push(surveyRecord)
    localStorage.setItem('surveyHistory', JSON.stringify(history))
    
    isCompleted.value = true
    loading.value = false
    
    return { success: true, data: surveyRecord }
  }
  
  const resetSurvey = () => {
    answers.value = {}
    currentQuestionIndex.value = 0
    isCompleted.value = false
  }
  
  // 获取统计数据
  const getStatistics = () => {
    const history = JSON.parse(localStorage.getItem('surveyHistory') || '[]')
    
    // 模拟更多数据
    const mockData = generateMockData(50)
    const allData = [...mockData, ...history.map(h => h.answers)]
    
    return calculateStatistics(allData)
  }
  
  return {
    survey,
    answers,
    currentQuestionIndex,
    isCompleted,
    loading,
    totalQuestions,
    currentQuestion,
    progress,
    canSubmit,
    setAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    submitSurvey,
    resetSurvey,
    getStatistics
  }
})

// 生成模拟数据
function generateMockData(count) {
  const mockData = []
  const regions = ['huabei', 'dongbei', 'huadong', 'huazhong', 'huanan', 'xinan', 'xibei']
  const scales = ['small', 'medium', 'large', 'xlarge']
  const equipments = [['tractor'], ['harvester'], ['tractor', 'harvester'], ['drone'], ['tractor', 'seeder', 'harvester']]
  const channels = ['store', 'factory', 'online', 'secondhand', 'cooperative']
  const brands = ['domestic', 'imported', 'joint', 'cost_effective']
  const subsidies = ['very_familiar', 'familiar', 'general', 'not_familiar', 'no_idea']
  
  for (let i = 0; i < count; i++) {
    mockData.push({
      1: regions[Math.floor(Math.random() * regions.length)],
      2: scales[Math.floor(Math.random() * scales.length)],
      3: equipments[Math.floor(Math.random() * equipments.length)],
      4: channels[Math.floor(Math.random() * channels.length)],
      5: Math.floor(Math.random() * 10) + 1,
      6: ['price', 'maintenance', 'operation', 'fuel', 'parts', 'service'].filter(() => Math.random() > 0.5),
      7: Math.random() > 0.5 ? 'yes' : 'no',
      '7.1': ['autopilot', 'precision', 'remote', 'data'].filter(() => Math.random() > 0.5),
      8: Math.floor(Math.random() * 5),
      9: brands[Math.floor(Math.random() * brands.length)],
      10: subsidies[Math.floor(Math.random() * subsidies.length)]
    })
  }
  
  return mockData
}

// 计算统计数据
function calculateStatistics(data) {
  const stats = {
    totalCount: data.length,
    regionDistribution: {},
    scaleDistribution: {},
    equipmentDistribution: {},
    channelDistribution: {},
    satisfactionAvg: 0,
    brandPreference: {},
    subsidyAwareness: {},
    smartEquipmentUsage: { yes: 0, no: 0 }
  }
  
  let satisfactionSum = 0
  
  data.forEach(answers => {
    // 地区分布
    stats.regionDistribution[answers[1]] = (stats.regionDistribution[answers[1]] || 0) + 1
    
    // 规模分布
    stats.scaleDistribution[answers[2]] = (stats.scaleDistribution[answers[2]] || 0) + 1
    
    // 设备分布
    if (Array.isArray(answers[3])) {
      answers[3].forEach(eq => {
        stats.equipmentDistribution[eq] = (stats.equipmentDistribution[eq] || 0) + 1
      })
    }
    
    // 购买渠道
    stats.channelDistribution[answers[4]] = (stats.channelDistribution[answers[4]] || 0) + 1
    
    // 满意度
    satisfactionSum += answers[5] || 0
    
    // 品牌偏好
    stats.brandPreference[answers[9]] = (stats.brandPreference[answers[9]] || 0) + 1
    
    // 补贴了解程度
    stats.subsidyAwareness[answers[10]] = (stats.subsidyAwareness[answers[10]] || 0) + 1
    
    // 智能设备使用情况
    if (answers[7] === 'yes') {
      stats.smartEquipmentUsage.yes++
    } else {
      stats.smartEquipmentUsage.no++
    }
  })
  
  stats.satisfactionAvg = data.length > 0 ? (satisfactionSum / data.length).toFixed(1) : 0
  
  return stats
}
