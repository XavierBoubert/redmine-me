<template>
  <div class="activity">
    <div class="table">
      <div class="thead">
        <div class="th">Task</div>
        <div class="th"></div>
        <div class="th">Real time</div>
        <div class="th">Activity</div>
        <div class="th">Time to log</div>
      </div>

      <div class="tbody">
        <div v-for="issue in issues" :key="issue.id" class="tr">
          <div class="td">{{ issue.id }}</div>
          <div class="td">{{ issue.text }}</div>
          <div class="td">{{ formatTime(issue.time) }}</div>
          <div class="td">noop</div>
          <div class="td">noop</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <button class="button button-validate">Apply in Redmine</button>
      <button class="button button-cancel" @click="clear">Clear</button>
      <button class="button button-cancel" @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import store from '@/services/store';

export default {
  name: 'activity',
  store,
  computed: {
    issues() {
      const { issues } = this.$store.state.Redmine.issuesData;
      const activeIssue = { ...this.$store.state.Redmine.activeIssue };

      if (!activeIssue.id) {
        return issues;
      }

      const issue = issues[activeIssue.id] || {};
      const time = issues[activeIssue.id] ? issues[activeIssue.id].time : 0;

      activeIssue.time = time + ((new Date()).getTime() - activeIssue.start);

      issues[activeIssue.id] = { ...issue, ...activeIssue };

      return issues;
    },
  },
  methods: {
    clear() {
      this.$store.dispatch('Redmine/clear');
    },
    formatDoubleNumber(value) {
      return value && value < 10 ? `0${value}` : value;
    },
    formatTime(milli) {
      const time = Math.round(milli / 1000);
      const hours = this.formatDoubleNumber(Math.floor(time / 3600));
      const minutes = this.formatDoubleNumber(Math.floor((time - (hours * 3600)) / 60));
      const seconds = this.formatDoubleNumber(time - (hours * 3600) - (minutes * 60));

      return [
        hours ? `${hours}h` : '',
        minutes ? `${minutes}min` : '',
        seconds ? `${seconds}s` : '',
      ]
        .filter(string => !!string)
        .join(' ');
    },
    formatNowTime(start) {
      return this.formatTime((new Date()).getTime() - start);
    },
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
  font-size: 12px;
  line-height: 1.2;

  .table {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 40px;

    .thead {
      z-index: 1;
      position: absolute;
      top: 2px;
      left: 2px;
      right: 20px;
      height: 26px;
      color: #aaa;
      background: #333;
    }

    .tbody {
      position: absolute;
      top: 2px;
      left: 2px;
      right: 2px;
      bottom: 0;
      overflow-y: scroll;

      .tr:first-child {
        padding-top: 26px;
      }
    }

    .thead, .tbody {
      .th, .td {
        box-sizing: border-box;
        float: left;
        height: 22px;
        width: 25%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 6px;

        &:first-child {
          width: 9%;
        }

        &:nth-child(2) {
          width: 36%;
        }

        &:nth-child(3) {
          width: 20%;
        }

        &:nth-child(4) {
          width: 20%;
        }

        &:nth-child(5) {
          width: 15%;
        }
      }
    }
  }

  .footer {
    position: absolute;
    bottom: 2px;
    left: 2px;
    right: 2px;
    text-align: right;
  }

  .button {
    cursor: pointer;
    background: none;
    border: none;
    color: #fff;
    border-radius: 3px;
    margin: 0 0 0 10px;
    color: #424242;
    box-sizing: border-box;
    height: 28px;
    line-height: 1em;
    padding: 2px 8px;
  }

  .button-validate {
    background: #5ddc6c;
  }

  .button-cancel {
    background: #1d1a1a;
    color: #aaa;
  }
}
</style>
