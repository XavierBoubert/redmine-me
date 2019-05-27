<template>
  <div class="activity">
    <div class="table">
      <div class="thead">
        <div class="th">Task</div>
        <div class="th">Real time</div>
        <div class="th">Activity</div>
        <div class="th">Time to log</div>
      </div>

      <div v-for="issue in issues" :key="issue.id" class="tbody">
        <div class="td"><span>{{ issue.id }} {{ issue.text }}</span></div>
        <div class="td">{{ issue.time }}</div>
        <div class="td">noop</div>
        <div class="td">noop</div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import { mapState, mapGetters } from 'vuex';
import store from '@/services/store';

export default {
  name: 'activity',
  store,
  computed: {
    ...mapState('Redmine', ['issuesData']),
    ...mapGetters('Redmine', ['issues']),
  },
};
</script>

<style lang="scss" scoped>
.activity {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 11px;
  background: radial-gradient(ellipse at center, #3f3f3f 0%,#323232 100%);
  border: 2px solid #414141;
  border-radius: 3px;
  color: #fff;
  box-shadow: 0 2px 3px 2px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  .table {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 30px;

    .thead {
      color: #aaa;
    }

    .thead, .tbody {
      width: 100%;

      .th, .td {
        box-sizing: border-box;
        float: left;
        height: 18px;
        width: 25%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 4px;

        &:first-child {
          width: 45%;
        }

        &:nth-child(2) {
          width: 20%;
        }

        &:nth-child(3) {
          width: 20%;
        }

        &:nth-child(4) {
          width: 15%;
        }
      }
    }
  }
}
</style>
