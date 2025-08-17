import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import ui from '@nuxt/ui/vue-plugin';
import './assets/style.css';
import App from './App.vue';
import Main from './page/index.vue'

const app = createApp(App);
const router = createRouter({
    routes: [{
        path: '/',
        component: Main
    }],
    history: createWebHistory()
})
app.use(router);
app.use(ui);
app.mount('#app');