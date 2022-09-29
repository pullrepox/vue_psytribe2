import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';

import 'material-icons/iconfont/material-icons.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import axios from 'axios';
import Axios from 'axios';
import router from './router';
import store from './store';
import VueRx from 'vue-rx';

import Vuelidate from 'vuelidate';
import initDirectives from './directives';
import TextareaAutosize from 'vue-textarea-autosize';
import VueSessionStorage from 'vue-sessionstorage';
import VueSplide from '@splidejs/vue-splide';

import {Interceptors} from "./utils/Interceptors";
import {initFacebookSdk} from "./utils/initFacebookSdk";
import VueCompositionAPI from '@vue/composition-api';
import VueEasyLightbox from 'vue-easy-lightbox';

import VuePwaInstallPlugin from "vue-pwa-install";
Vue.use(VuePwaInstallPlugin);

// clipper
import VuejsClipper from 'vuejs-clipper/dist/vuejs-clipper.umd.min';
import 'vuejs-clipper/dist/vuejs-clipper.css';
Vue.use(VuejsClipper);

// plugins
import './plugins';
import vuetify from './plugins/vuetify';

// google-adsense
import Adsense from 'vue-google-adsense/dist/Adsense.min.js';

axios.defaults.baseURL = process.env.VUE_APP_API_URL;

Vue.prototype.$http = Axios;
Vue.config.productionTip = false;
Vue.use(VueRx);

// google-adsense
Vue.use(require('vue-script2'));
Vue.use(Adsense);

Vue.use(TextareaAutosize);
Vue.use(Vuelidate);
Vue.use(VueSessionStorage);
Vue.use(VueSplide);
Vue.use(VueCompositionAPI);
Vue.use(VueEasyLightbox);
initDirectives();

// enable interceptors for http requests
Interceptors();

// pipes
Vue.filter('numbers', (value) => {
    let number = value + 1
    if (number < 10) {
        return "0" + number;
    }
    return number;
});

Vue.filter('minutes', (value) => {
    if (!value || typeof value !== "number") return "00:00"
    let min = parseInt(value / 60),
        sec = parseInt(value % 60)
    min = min < 10 ? "0" + min : min
    sec = sec < 10 ? "0" + sec : sec
    value = min + ":" + sec
    return value
});

// set theme
const currentTheme = localStorage.getItem('theme');
if (!currentTheme) {
    document.body.classList.add('theme-dark');
    localStorage.setItem('theme', 'theme-dark');
} else {
    if (currentTheme === 'theme-dark') {
        document.body.classList.add('theme-dark');
    }
    if (currentTheme === 'theme-light') {
        document.body.classList.add('theme-light');
    }
}


// wait for facebook sdk to start app
initFacebookSdk().then(startApp);

function startApp() {
    new Vue({
        router,
        store,
        vuetify,
        render: (h) => h(App),
    }).$mount('#app');
}


// document.addEventListener('click', () => {
//     getExternalLinks();
// });



