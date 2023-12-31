// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

// router setup
import routes from './routes/routes'

// Plugins
import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import Notifications from './components/NotificationPlugin'

// MaterialDashboard plugin
import MaterialDashboard from './material-dashboard'

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: 'nav-item active',
})

Vue.prototype.$apiURL = process.env.API_URL || 'http://localhost:3000'

Vue.use(VueRouter)
Vue.use(MaterialDashboard)
Vue.use(GlobalComponents)
Vue.use(GlobalDirectives)
Vue.use(Notifications)

new Vue({
  el: '#app',
  render: (h) => h(App),
  router,
})
