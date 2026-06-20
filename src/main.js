import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Tooltip from './components/Tooltip.vue'
import SvgIcon from './components/svgIcon.vue';
import { i18n } from './i18n/index.js';

const app = createApp(App)

app.component('Tooltip', Tooltip) 
app.component('SvgIcon', SvgIcon);

app.use(i18n);
app.mount('#app')

