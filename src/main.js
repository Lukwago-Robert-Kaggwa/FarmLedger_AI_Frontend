import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

axios.defaults.baseURL = 'https://farmledger-ai-backend.onrender.com'
createApp(App).use(store).use(router).mount('#app')
