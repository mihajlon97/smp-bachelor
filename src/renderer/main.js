import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import GlobalMixin from './mixins/global.mixin'

import 'v8-compile-cache';

import VueSwal from 'vue-swal';
Vue.use(VueSwal)

import Croppa from 'vue-croppa2';
Vue.use(Croppa);
import 'vue-croppa2/dist/vue-croppa.css';

import './assets/css/main.css';

Vue.mixin(GlobalMixin);
Vue.use(require('vue-moment'));

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: {
  	App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
