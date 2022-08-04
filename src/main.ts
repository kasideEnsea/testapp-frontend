import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import * as toastr from "toastr";
import FlagIcon from 'vue-flag-icon';

toastr.options.positionClass = "toast-with-offset"
Vue.use(FlagIcon);
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app');
