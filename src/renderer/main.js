import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import GlobalMixin from './mixins/global.mixin'

import 'v8-compile-cache';

import VueSwal from 'vue-swal';
Vue.use(VueSwal)

import Croppa from 'vue-croppa';
Vue.use(Croppa);
import 'vue-croppa/dist/vue-croppa.css';

import './assets/css/main.css';

Vue.mixin(GlobalMixin);
Vue.use(require('vue-moment'));

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
