import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { addIcons, OhVueIcon } from 'oh-vue-icons'

import {
  FaUserTie,
  FaShoppingCart,
  FaBars,
  FaClipboardList,
  FaBox,
  HiSolidHome,
} from 'oh-vue-icons/icons'

addIcons(
  FaUserTie,
  FaShoppingCart,
  FaBars,
  FaClipboardList,
  FaBox,
  HiSolidHome
)

const app = createApp(App)
app.component('v-icon', OhVueIcon)
app.use(createPinia())
app.use(router)
app.mount('#app')
