import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import ToastService from 'primevue/toastservice';
import './assets/style.css';
import 'primeicons/primeicons.css'
import App from './App.vue';
import Main from './page/index.vue'
import Login from './page/login.vue';
import ConfirmationService from 'primevue/confirmationservice';

const app = createApp(App);
app.use(ToastService)
app.use(ConfirmationService)
const router = createRouter({
    routes: [{
        path: '/',
        component: Main
    },
    {
        path: '/login',
        component: Login
    }],
    history: createWebHistory()
})
app.use(router);
const preset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
        }
    },
    components: {
        menu: {
            colorScheme: {
                light: {
                    root: {
                        borderColor: 'white'
                    }
                }
            }
        },
        tag: {
            colorScheme: {
                light: {
                    root: {
                        fontSize: '0.8rem'
                    }
                }
            }
        },
    }
});
app.use(PrimeVue, {
    theme: {
        preset: preset,
        options: {
            prefix: 'p',
            darkModeSelector: '.darkmode',
        }
    }
});
app.mount('#app');