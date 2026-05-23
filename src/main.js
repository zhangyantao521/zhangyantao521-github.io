import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Vant 组件
import {
  Button,
  Cell,
  CellGroup,
  Field,
  Form,
  NavBar,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Stepper,
  Slider,
  Picker,
  Popup,
  Toast,
  Dialog,
  Loading,
  Empty,
  Progress,
  Card,
  Tag,
  Icon,
  List,
  PullRefresh
} from 'vant'

// Vant 样式
import 'vant/lib/index.css'

const app = createApp(App)

// 注册 Vant 组件
const vantComponents = [
  Button, Cell, CellGroup, Field, Form, NavBar,
  Radio, RadioGroup, Checkbox, CheckboxGroup,
  Stepper, Slider, Picker, Popup, Toast, Dialog,
  Loading, Empty, Progress, Card, Tag, Icon, List, PullRefresh
]

vantComponents.forEach(component => {
  app.use(component)
})

app.use(createPinia())
app.use(router)

app.mount('#app')
