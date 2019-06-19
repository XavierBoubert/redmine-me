/* eslint-disable import/no-extraneous-dependencies, import/first */
import Vue from 'vue';
import VueRouter from 'vue-router';
import PerfectPanel from '@/perfect-panel/views/PerfectPanel.vue';
import '@fortawesome/fontawesome-free/css/all.css';

Vue.config.productionTip = false;
Vue.config.devtools = false;

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'hash',
  routes: [
    // { path: '/flyout', component: Flyout },
    { path: '/panel', component: () => import('@/panel/views/Panel.vue') },
    { path: '/panel-parent', component: () => import('@/panel/views/PanelParent.vue') },
  ],
});

new Vue({
  render: h => h(PerfectPanel),
  router,
}).$mount('#app');
