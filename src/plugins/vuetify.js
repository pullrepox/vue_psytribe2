// import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: '#323659'
            },
            light: {
                primary: '#ffffff'
            }
        }
    },
    icons: {
        // iconfont: 'mdiSvg || mdi || md', // 'mdi' // || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    },
});
