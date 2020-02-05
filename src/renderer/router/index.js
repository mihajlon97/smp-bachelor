import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
	  {
		  path: '/',
		  name: 'Play',
		  component: () => import('../Pages/Play.vue')
	  },
	  {
		  path: '/edit',
		  name: 'Edit',
		  component: () => import('../pages/EditNew.vue')
	  },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
