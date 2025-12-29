import './assets/css/main.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
// import './assets/css/flags.css'
import './assets/css/style.css'

// PrimeVue + Theme
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice'
// import Aura from '@primeuix/themes/aura'
import Noir from './presets/Noir.js';

import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000'

import { addIcons, OhVueIcon } from 'oh-vue-icons'
import {
  FaUserTie,
  FaShoppingCart,
  FaBars,
  FaClipboardList,
  FaBox,
  HiSolidHome
} from 'oh-vue-icons/icons'

addIcons(FaUserTie, FaShoppingCart, FaBars, FaClipboardList, FaBox, HiSolidHome)

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Noir,
    options: {
      prefix: 'p',
      darkModeSelector: '.p-dark',
      cssLayer: false,
    }
  }
})

app.use(ConfirmationService)
app.use(DialogService)
app.use(ToastService)

app.component('v-icon', OhVueIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
