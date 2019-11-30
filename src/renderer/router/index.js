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
		  path: '/create',
		  name: 'Create',
		  component: () => import('../Pages/Create.vue')
	  },
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
