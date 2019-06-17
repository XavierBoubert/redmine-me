/* eslint-disable import/no-extraneous-dependencies, import/first */
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '@/layouts/views/Page.vue';
import Flyout from '@/flyout/views/Flyout.vue';
import '@fortawesome/fontawesome-free/css/all.css';

Vue.config.productionTip = false;
Vue.config.devtools = false;

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'hash',
  routes: [
    { path: '/flyout', component: Flyout },
  ],
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app');
