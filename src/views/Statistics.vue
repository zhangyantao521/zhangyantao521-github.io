<template>
  <div class="statistics-page">
    <van-nav-bar
      title="统计结果"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />
    
    <div class="stats-content">
      <!-- 概览卡片 -->
      <div class="overview-section">
        <div class="overview-card">
          <div class="overview-item">
            <div class="overview-value">{{ stats.totalCount }}</div>
            <div class="overview-label">总样本数</div>
          </div>
          <div class="overview-item">
            <div class="overview-value">{{ stats.satisfactionAvg }}</div>
            <div class="overview-label">平均满意度</div>
          </div>
          <div class="overview-item">
            <div class="overview-value">{{ smartUsageRate }}%</div>
            <div class="overview-label">智能设备使用率</div>
          </div>
        </div>
      </div>
      
      <!-- 地区分布 -->
      <div class="chart-section">
        <div class="section-header">
          <h3 class="section-title">
            <van-icon name="location-o" />
            地区分布
          </h3>
        </div>
        <div class="chart-container">
          <div
            v-for="(item, index) in regionData"
            :key="item.name"
            class="bar-item"
          >
            <div class="bar-label">{{ item.label }}</div>
            <div class="bar-wrapper">
              <div
                class="bar-fill"
                :style="{ width: item.percentage + '%', backgroundColor: colors[index % colors.length] }"
              ></div>
            </div>
            <div class="bar-value">{{ item.value }}人 ({{ item.percentage }}%)</div>
          </div>
        </div>
      </div>
      
      <!-- 种植规模分布 -->
      <div class="chart-section">
        <div class="section-header">
          <h3 class="section-title">
            <van-icon name="expand-o" />
            种植规模分布
          </h3>
        </div>
        <div class="scale-distribution">
          <div
            v-for="(item, index) in scaleData"
            :key="item.name"
            class="scale-item"
          >
            <div class="scale-circle" :style="{ backgroundColor: colors[index % colors.length] }">
              <span class="scale-percent">{{ item.percentage }}%</span>
            </div>
            <div class="scale-label">{{ item.label }}</div>
            <div class="scale-count">{{ item.value }}人</div>
          </div>
        </div>
      </div>
      
      <!-- 农机设备拥有情况 -->
      <div class="chart-section">
        <div class="section-header">
          <h3 class="section-title">
            <van-icon name="cluster-o" />
            农机设备拥有情况
          </h3>
        </div>
        <div class="equipment-grid">
          <div
            v-for="(item, index) in equipmentData"
            :key="item.name"
            class="equipment-card"
            :style="{ borderColor: colors[index % colors.length] }"
          >
            <div class="equipment-icon" :style="{ backgroundColor: colors[index % colors.length] + '20' }">
              <van-icon :name="item.icon" :color="colors[index % colors.length]" size="24" />
            </div>
            <div class="equipment-info">
              <div class="equipment-name">{{ item.label }}</div>
              <div class="equipment-count">
                <span class="count">{{ item.value }}</span>
                <span class="unit">人拥有</span>
              </div>
            </div>
            <div class="equipment-percent" :style="{ color: colors[index % colors.length] }">
              {{ item.percentage }}%
            </div>
          </div>
        </div>
      </div>
      
      <!-- 购买渠道分析 -->
      <div class="chart-section">
        <div class="section-header">
          <h3 class="section-title">
            <van-icon name="shop-o" />
            购买渠道偏好
          </h3>
        </div>
        <div class="channel-list">
          <div
            v-for="(item, index) in channelData"
            :key="item.name"
            class="channel-item"
          >
            <div class="channel-rank" :class="{ 'top3': index < 3 }">{{ index + 1 }}</div>
            <div class="channel-info">
              <div class="channel-name">{{ item.label }}</div>
              <div class="channel-bar">
                <div
                  class="channel-bar-fill"
                  :style="{ width: item.percentage + '%' }"
                ></div>
              </div>
            </div>
            <div class="channel-value">{{ item.value }}人</div>
          </div>
        </div>
      </div>
      
      <!-- 品牌偏好 -->
      <div class="chart-section">
        <div class="section-header">
          <h3 class="section-title">
            <van-icon name="like-o" />
            品牌偏好
          </h3>
        </div>
        <div class="brand-chart">
          <div
            v-for="(item, index) in brandData"
            :key="item.name"
            class="brand-item"
          >
            <div class="brand-label">{{ item.label }}</div>
            <div class="brand-progress">
              <van-progress
                :percentage="item.percentage"
                :stroke-width="16"
                :color="brandColors[index]"
              />
            </div>
            <div class="brand-value">{{ item.percentage }}%</div>
          </div>
        </div>
      </div>
      
      <!-- 补贴政策了解程度 -->
      <div class="chart-section">
        <div class="section-header">
          <h3 class="section-title">
            <van-icon name="bill-o" />
            补贴政策了解程度
          </h3>
        </div>
        <div class="subsidy-awareness">
          <div
            v-for="(item, index) in subsidyData"
            :key="item.name"
            class="awareness-item"
            :style="{ opacity: 0.3 + (index * 0.15) }"
          >
            <div class="awareness-dot" :style="{ backgroundColor: colors[index % colors.length] }"></div>
            <div class="awareness-content">
              <div class="awareness-label">{{ item.label }}</div>
              <div class="awareness-bar">
                <div
                  class="awareness-fill"
                  :style="{ width: item.percentage + '%', backgroundColor: colors[index % colors.length] }"
                ></div>
              </div>
            </div>
            <div class="awareness-value">{{ item.value }}人</div>
          </div>
        </div>
      </div>
      
      <!-- 满意度分布 -->
      <div class="chart-section">
        <div class="section-header">
          <h3 class="section-title">
            <van-icon name="star-o" />
            满意度评分分布
          </h3>
        </div>
        <div class="satisfaction-chart">
          <div class="satisfaction-avg">
            <div class="avg-circle">
              <span class="avg-value">{{ stats.satisfactionAvg }}</span>
              <span class="avg-label">平均分</span>
            </div>
          </div>
          <div class="satisfaction-bars">
            <div
              v-for="item in satisfactionDistribution"
              :key="item.score"
              class="satisfaction-item"
            >
              <div class="satisfaction-score">{{ item.score }}分</div>
              <div class="satisfaction-bar-wrapper">
                <div
                  class="satisfaction-bar-fill"
                  :style="{ 
                    width: item.percentage + '%',
                    backgroundColor: item.score >= 7 ? '#07c160' : item.score >= 4 ? '#ff976a' : '#ee0a24'
                  }"
                ></div>
              </div>
              <div class="satisfaction-count">{{ item.count }}人</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="action-section">
        <van-button type="primary" block round @click="goBack">
          返回问卷
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSurveyStore } from '@/stores/survey'

const router = useRouter()
const surveyStore = useSurveyStore()

// 获取统计数据
const stats = computed(() => surveyStore.getStatistics())

// 颜色配置
const colors = ['#07c160', '#1989fa', '#ff976a', '#ee0a24', '#7232dd', '#333333']
const brandColors = ['#07c160', '#1989fa', '#ff976a', '#ee0a24']

// 地区标签映射
const regionLabels = {
  huabei: '华北地区',
  dongbei: '东北地区',
  huadong: '华东地区',
  huazhong: '华中地区',
  huanan: '华南地区',
  xinan: '西南地区',
  xibei: '西北地区'
}

// 规模标签映射
const scaleLabels = {
  small: '50亩以下',
  medium: '50-100亩',
  large: '100-500亩',
  xlarge: '500亩以上'
}

// 设备标签映射
const equipmentLabels = {
  tractor: '拖拉机',
  harvester: '收割机',
  seeder: '播种机',
  drone: '植保无人机',
  irrigation: '灌溉设备',
  dryer: '烘干设备',
  other: '其他'
}

// 设备图标映射
const equipmentIcons = {
  tractor: 'logistics',
  harvester: 'cluster-o',
  seeder: 'flower-o',
  drone: 'aim',
  irrigation: 'drop',
  dryer: 'fire-o',
  other: 'more-o'
}

// 渠道标签映射
const channelLabels = {
  store: '农机专卖店',
  factory: '厂家直销',
  online: '电商平台',
  secondhand: '二手市场',
  cooperative: '农机合作社'
}

// 品牌标签映射
const brandLabels = {
  domestic: '国产品牌',
  imported: '进口品牌',
  joint: '合资品牌',
  cost_effective: '性价比优先'
}

// 补贴了解程度标签映射
const subsidyLabels = {
  very_familiar: '非常了解',
  familiar: '比较了解',
  general: '一般了解',
  not_familiar: '不太了解',
  no_idea: '完全不了解'
}

// 智能设备使用率
const smartUsageRate = computed(() => {
  const { yes, no } = stats.value.smartEquipmentUsage
  const total = yes + no
  return total > 0 ? Math.round((yes / total) * 100) : 0
})

// 地区数据
const regionData = computed(() => {
  const data = stats.value.regionDistribution
  const total = stats.value.totalCount
  return Object.entries(data)
    .map(([key, value]) => ({
      name: key,
      label: regionLabels[key] || key,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0
    }))
    .sort((a, b) => b.value - a.value)
})

// 规模数据
const scaleData = computed(() => {
  const data = stats.value.scaleDistribution
  const total = stats.value.totalCount
  return Object.entries(data)
    .map(([key, value]) => ({
      name: key,
      label: scaleLabels[key] || key,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0
    }))
    .sort((a, b) => b.value - a.value)
})

// 设备数据
const equipmentData = computed(() => {
  const data = stats.value.equipmentDistribution
  const total = stats.value.totalCount
  return Object.entries(data)
    .map(([key, value]) => ({
      name: key,
      label: equipmentLabels[key] || key,
      icon: equipmentIcons[key] || 'circle',
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0
    }))
    .sort((a, b) => b.value - a.value)
})

// 渠道数据
const channelData = computed(() => {
  const data = stats.value.channelDistribution
  const total = stats.value.totalCount
  return Object.entries(data)
    .map(([key, value]) => ({
      name: key,
      label: channelLabels[key] || key,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0
    }))
    .sort((a, b) => b.value - a.value)
})

// 品牌数据
const brandData = computed(() => {
  const data = stats.value.brandPreference
  const total = stats.value.totalCount
  return Object.entries(data)
    .map(([key, value]) => ({
      name: key,
      label: brandLabels[key] || key,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0
    }))
    .sort((a, b) => b.value - a.value)
})

// 补贴数据
const subsidyData = computed(() => {
  const data = stats.value.subsidyAwareness
  const total = stats.value.totalCount
  return Object.entries(data)
    .map(([key, value]) => ({
      name: key,
      label: subsidyLabels[key] || key,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0
    }))
    .sort((a, b) => b.value - a.value)
})

// 满意度分布（模拟数据）
const satisfactionDistribution = computed(() => {
  // 根据平均分生成一个合理的分布
  const avg = parseFloat(stats.value.satisfactionAvg) || 7
  const total = stats.value.totalCount || 50
  
  const distribution = []
  for (let i = 1; i <= 10; i++) {
    let count
    if (i <= 3) {
      count = Math.max(1, Math.round(total * 0.05 * (4 - i) / 3))
    } else if (i <= 6) {
      count = Math.max(2, Math.round(total * 0.15))
    } else if (i <= 8) {
      count = Math.round(total * 0.25)
    } else {
      count = Math.round(total * 0.3)
    }
    
    // 根据平均分调整
    if (avg < 5 && i > 7) count = Math.max(1, Math.round(count * 0.3))
    if (avg > 8 && i < 5) count = Math.max(1, Math.round(count * 0.3))
    
    distribution.push({
      score: i,
      count,
      percentage: Math.round((count / total) * 100)
    })
  }
  
  return distribution.reverse()
})

const goBack = () => {
  router.push('/survey')
}
</script>

<style scoped lang="scss">
.statistics-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.stats-content {
  padding: 12px;
  padding-bottom: 40px;
}

.overview-section {
  margin-bottom: 12px;
  
  .overview-card {
    background: linear-gradient(135deg, #07c160 0%, #10b981 100%);
    border-radius: 12px;
    padding: 24px;
    display: flex;
    justify-content: space-around;
    color: white;
    
    .overview-item {
      text-align: center;
      
      .overview-value {
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 4px;
      }
      
      .overview-label {
        font-size: 14px;
        opacity: 0.9;
      }
    }
  }
}

.chart-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  .section-header {
    margin-bottom: 20px;
    
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      display: flex;
      align-items: center;
      gap: 8px;
      
      .van-icon {
        color: #07c160;
      }
    }
  }
}

// 地区分布条形图
.bar-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  
  .bar-label {
    width: 80px;
    font-size: 14px;
    color: #666;
    flex-shrink: 0;
  }
  
  .bar-wrapper {
    flex: 1;
    height: 20px;
    background: #f0f0f0;
    border-radius: 10px;
    overflow: hidden;
    margin: 0 12px;
  }
  
  .bar-fill {
    height: 100%;
    border-radius: 10px;
    transition: width 0.5s ease;
  }
  
  .bar-value {
    width: 100px;
    font-size: 12px;
    color: #999;
    text-align: right;
    flex-shrink: 0;
  }
}

// 规模分布圆形图
.scale-distribution {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 16px;
  
  .scale-item {
    text-align: center;
    
    .scale-circle {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 8px;
      
      .scale-percent {
        color: white;
        font-weight: bold;
        font-size: 16px;
      }
    }
    
    .scale-label {
      font-size: 14px;
      color: #333;
      margin-bottom: 4px;
    }
    
    .scale-count {
      font-size: 12px;
      color: #999;
    }
  }
}

// 设备网格
.equipment-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  .equipment-card {
    display: flex;
    align-items: center;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e5e5e5;
    
    .equipment-icon {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
    }
    
    .equipment-info {
      flex: 1;
      
      .equipment-name {
        font-size: 14px;
        color: #333;
        margin-bottom: 4px;
      }
      
      .equipment-count {
        font-size: 12px;
        color: #999;
        
        .count {
          color: #07c160;
          font-weight: bold;
          font-size: 16px;
          margin-right: 4px;
        }
      }
    }
    
    .equipment-percent {
      font-size: 18px;
      font-weight: bold;
    }
  }
}

// 渠道列表
.channel-list {
  .channel-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .channel-rank {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #f0f0f0;
      color: #999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      margin-right: 12px;
      
      &.top3 {
        background: #07c160;
        color: white;
      }
    }
    
    .channel-info {
      flex: 1;
      
      .channel-name {
        font-size: 14px;
        color: #333;
        margin-bottom: 6px;
      }
      
      .channel-bar {
        height: 6px;
        background: #f0f0f0;
        border-radius: 3px;
        overflow: hidden;
        
        .channel-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #07c160, #10b981);
          border-radius: 3px;
          transition: width 0.5s ease;
        }
      }
    }
    
    .channel-value {
      width: 50px;
      text-align: right;
      font-size: 14px;
      color: #666;
    }
  }
}

// 品牌图表
.brand-chart {
  .brand-item {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    
    .brand-label {
      width: 100px;
      font-size: 14px;
      color: #666;
      flex-shrink: 0;
    }
    
    .brand-progress {
      flex: 1;
      margin: 0 12px;
    }
    
    .brand-value {
      width: 50px;
      font-size: 14px;
      color: #333;
      font-weight: bold;
      text-align: right;
    }
  }
}

// 补贴了解程度
.subsidy-awareness {
  .awareness-item {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    
    .awareness-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 12px;
      flex-shrink: 0;
    }
    
    .awareness-content {
      flex: 1;
      
      .awareness-label {
        font-size: 14px;
        color: #333;
        margin-bottom: 6px;
      }
      
      .awareness-bar {
        height: 8px;
        background: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
        
        .awareness-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }
      }
    }
    
    .awareness-value {
      width: 50px;
      text-align: right;
      font-size: 14px;
      color: #666;
    }
  }
}

// 满意度图表
.satisfaction-chart {
  display: flex;
  gap: 20px;
  
  .satisfaction-avg {
    .avg-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #07c160 0%, #10b981 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      
      .avg-value {
        font-size: 32px;
        font-weight: bold;
      }
      
      .avg-label {
        font-size: 12px;
        opacity: 0.9;
      }
    }
  }
  
  .satisfaction-bars {
    flex: 1;
    
    .satisfaction-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      
      .satisfaction-score {
        width: 36px;
        font-size: 12px;
        color: #666;
      }
      
      .satisfaction-bar-wrapper {
        flex: 1;
        height: 16px;
        background: #f0f0f0;
        border-radius: 8px;
        overflow: hidden;
        margin: 0 8px;
        
        .satisfaction-bar-fill {
          height: 100%;
          border-radius: 8px;
          transition: width 0.5s ease;
        }
      }
      
      .satisfaction-count {
        width: 40px;
        font-size: 12px;
        color: #999;
        text-align: right;
      }
    }
  }
}

.action-section {
  margin-top: 20px;
  padding: 0 8px;
}
</style>
