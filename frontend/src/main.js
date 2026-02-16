import './assets/css/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import animateOnScroll from './directives/animateOnScroll'
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

const app = createApp(App)
app.use(createPinia())
app.directive('aos', animateOnScroll)
app.use(router)
app.mount('#app')
