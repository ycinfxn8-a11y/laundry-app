import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import OneSignalVuePlugin from '@onesignal/onesignal-vue3'
import './assets/main.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(OneSignalVuePlugin, {
    appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
    allowLocalhostAsSecureOrigin: true  // agar bisa test di localhost
  })
  .mount('#app')