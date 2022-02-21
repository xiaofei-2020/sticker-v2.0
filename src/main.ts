import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import "element-plus/theme-chalk/src/loading.scss"

const app = createApp(App);
app.use(createPinia());
app.mount('#app')
