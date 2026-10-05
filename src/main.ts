// Self-hosted fonts (replaces the Google Fonts <link>: faster, private, CSP-friendly).
import '@fontsource-variable/inter'
import '@fontsource-variable/hanken-grotesk'
import '@fontsource-variable/jetbrains-mono'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
