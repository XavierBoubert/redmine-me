/* eslint-disable import/no-extraneous-dependencies, import/first */
import Vue from 'vue';
import Flyout from './views/Flyout.vue';
import '@fortawesome/fontawesome-free/css/all.css';

Vue.config.productionTip = false;

new Vue({
  render: h => h(Flyout),
}).$mount('#app');
