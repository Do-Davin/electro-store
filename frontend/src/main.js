import './assets/css/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { addIcons, OhVueIcon } from 'oh-vue-icons'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000'

import {
  FaUserTie,
  FaShoppingCart,
  FaBars,
  FaClipboardList,
  FaBox,
  HiSolidHome,
  BiGrid1X2Fill,
  IoListSharp,
} from 'oh-vue-icons/icons'

addIcons(
  FaUserTie,
  FaShoppingCart,
  FaBars,
  FaClipboardList,
  FaBox,
  HiSolidHome,
  BiGrid1X2Fill,
  IoListSharp
)

const app = createApp(App)
app.component('v-icon', OhVueIcon)
app.use(createPinia())
app.use(router)
app.mount('#app')
