/* eslint-disable import/no-extraneous-dependencies, import/first */
import Vue from 'vue';
import Flyout from './views/Flyout.vue';

Vue.config.productionTip = false;

new Vue({
  render: h => h(Flyout),
}).$mount('#app');
