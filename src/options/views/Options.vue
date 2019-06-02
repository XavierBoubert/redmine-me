<template>
  <div class="options">
    <h1>Options</h1>

    <h2>Redmine <i class="fas" :class="[`fa-heart${network ? '' : '-broken'}`]"></i></h2>

    <label>Website url</label>
    <input ref="redmineUrl" type="text" @input="redmineChange" :value="redmineUrl">

    <label>Username</label>
    <input ref="redmineUsername" type="text" @input="redmineChange" :value="redmineUsername">

    <label>Password</label>
    <input ref="redminePassword" type="password" @input="redmineChange" :value="redminePassword">

    <h2>Activity</h2>

    <label>Default activity</label>
    <select v-model="defaultActivity" @change="defaultActivityChange">
      <option
        v-for="activity in activities"
        :key="activity.id"
        :selected="activity.id === defaultActivity"
        :value="activity.id"
      >
        {{ activity.name }}
      </option>
    </select>

    <label>Max hours per day</label>
    <input type="text" @input="maxHoursChange" :value="maxHours">

    <h2>Customization</h2>

    <label>Your email (to display your gravatar)</label>
    <input type="text" @input="emailChange" :value="email">

    <h2>Debug</h2>
    <button @click="openDevtools">Open the dev tools</button>
    <button @click="checkUpdate">Check for updates</button>
  </div>
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import store from '@/services/store';
import { mapState } from 'vuex';
import { ipcRenderer } from 'electron';

export default {
  name: 'options',
  store,
  mounted() {
    this.$store.dispatch('Redmine/pullActivities');
  },
  computed: {
    ...mapState('Options', [
      'redmineUrl', 'redmineUsername', 'redminePassword', 'defaultActivity', 'maxHours', 'email',
    ]),
    ...mapState('Redmine', ['network', 'activities']),
  },
  methods: {
    redmineChange() {
      this.$store.dispatch('Options/changeRedmine', {
        url: this.$refs.redmineUrl.value,
        username: this.$refs.redmineUsername.value,
        password: this.$refs.redminePassword.value,
      });
    },
    defaultActivityChange(event) {
      this.$store.dispatch('Options/changeDefaultActivity', event.target.value);
    },
    maxHoursChange(event) {
      this.$store.dispatch('Options/changeMaxHours', event.target.value);
    },
    emailChange(event) {
      this.$store.dispatch('Options/changeEmail', event.target.value);
    },
    openDevtools() {
      ipcRenderer.send('devtools:open');
    },
    checkUpdate() {
      this.$store.dispatch('Options/checkUpdate');
    },
  },
};
</script>

<style lang="scss" scoped>
.options {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
  font-size: 11px;
  background: radial-gradient(ellipse at center, #3f3f3f 0%,#323232 100%);
  border: 2px solid #414141;
  border-radius: 3px;
  color: #fff;
  box-shadow: 0 2px 3px 2px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  font-size: 12px;
  line-height: 1.2;

  .fa-heart {
    color: #5ddc6c;
  }

  .fa-heart-broken {
    color: #faa176;
  }

  h1 {
    font-size: 23px;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0 10px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-size: 13px;
  }

  input, select {
    width: 100%;
    margin-bottom: 10px;
    padding: 3px;
    border: none;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
  }

  button {
    display: inline-block;
    cursor: pointer;
    outline: none;
    height: 28px;
    margin-right: 10px;
    padding: 2px 8px;
    border: none;
    border-radius: 3px;
    box-sizing: border-box;
    line-height: 1em;
    background: #2c80bb;
    color: #fff;
  }
}
</style>
