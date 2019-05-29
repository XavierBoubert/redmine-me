<template>
  <div class="activity" :class="[ status ]">
    <div class="table">
      <div class="thead">
        <div class="th">Task</div>
        <div class="th"></div>
        <div class="th">Real time</div>
        <div class="th">Activity</div>
        <div class="th">Hours to log</div>
      </div>

      <div class="tbody">
        <div v-for="issue in issues" :key="issue.id" class="tr">
          <div class="td" @click="openIssue(issue.id)">{{ issue.id }}</div>
          <div class="td" @click="openIssue(issue.id)">{{ issue.text }}</div>
          <div class="td">{{ formatTime(issue.time) }}</div>
          <div class="td">
            <select
              v-model="issue.activity"
              class="select-activity"
              @change="changeActivity($event, issue.id)"
            >
              <option
                v-for="activity in activities"
                :key="activity.id"
                :selected="activity.id === issue.activity"
                :value="activity.id"
              >
                {{ activity.name }}
              </option>
            </select>
          </div>
          <div class="td">
            <input
              type="text"
              maxlength="1"
              class="time-log"
              :class="{ error: issue.error }"
              :value="issue.timeLog || ''"
              @input="changeTimeLog($event, issue.id)"
            >
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="total">
        Total: <span :class="{
          valid: timeLogTotal > 0 && timeLogTotal <= (maxHours || 8),
          error: timeLogTotal > (maxHours || 8),
        }">{{ timeLogTotal }} hours</span>
      </div>
      <button class="button button-validate button-push" @click="pushActivities">
        {{ status === 'idle' ? 'Apply to Redmine' : '' }}
        {{ status === 'pushing' ? 'Applying...' : '' }}
        {{ status === 'pushed' ? 'Applied!' : '' }}
      </button>
      <button class="button button-cancel" @click="clear">Clear</button>
      <button class="button button-cancel" @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import { ipcRenderer } from 'electron';
import api from '@/redmine/api';
import store from '@/services/store';
import { mapState } from 'vuex';

export default {
  name: 'activity',
  store,
  mounted() {
    this.$store.dispatch('Redmine/pullActivities');

    this.refreshIssuesTimeLogTotal();
  },
  data() {
    return {
      timeLogTotal: 0,
    };
  },
  computed: {
    ...mapState('Redmine', ['activities', 'status']),
    ...mapState('Options', ['defaultActivity', 'maxHours']),
    issues() {
      const issues = { ...this.$store.state.Redmine.issuesData.issues };
      const activeIssue = { ...this.$store.state.Redmine.activeIssue };

      Object.keys(issues).forEach((id) => {
        issues[id].activity = issues[id].activity || this.defaultActivity;
      });

      if (!activeIssue.id) {
        return issues;
      }

      const issue = issues[activeIssue.id] || {};
      const time = issue.time || 0;

      activeIssue.activity = activeIssue.activity || this.defaultActivity;
      activeIssue.time = time + ((new Date()).getTime() - activeIssue.start);

      issues[activeIssue.id] = {
        ...issue,
        ...activeIssue,
        error: issue.error,
      };

      return issues;
    },
  },
  methods: {
    clear() {
      this.$store.dispatch('Redmine/clear');
    },
    isTimeLogValid(timeLog) {
      // eslint-disable-next-line eqeqeq
      return parseInt(timeLog, 10) == timeLog
        && parseInt(timeLog, 10) > -1
        && parseInt(timeLog, 10) < 9;
    },
    refreshIssuesTimeLogTotal() {
      this.timeLogTotal = Object.keys(this.issues).length
        ? Object
          .keys(this.issues)
          .map(id => parseInt((this.issues[id]
            && this.isTimeLogValid(this.issues[id].timeLog)
            && this.issues[id].timeLog)
            || 0, 10))
          .reduce((accumulator, currentValue) => accumulator + currentValue)
        : 0;
    },
    formatTime(milli) {
      const time = Math.round(milli / 1000);
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time - (hours * 3600)) / 60);
      const seconds = time - (hours * 3600) - (minutes * 60);

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
    changeActivity(event, issueId) {
      this.$store.dispatch('Redmine/changeIssueActivity', {
        issueId,
        activityId: event.target.value,
      });
    },
    changeTimeLog(event, issueId) {
      this.$store.dispatch('Redmine/changeIssueTimeLog', {
        issueId,
        timeLog: event.target.value,
      });

      this.refreshIssuesTimeLogTotal();
    },
    pushActivities() {
      if (this.status !== 'idle') {
        return;
      }

      this.$store.dispatch('Redmine/pushIssuesActivities', {
        defaultActivity: this.defaultActivity,
      });
    },
    openIssue(issueId) {
      if (!issueId) {
        return;
      }

      ipcRenderer.send('browser:open', {
        url: `${api.url}/issues/${issueId}`,
      });
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
          width: 18%;
        }

        &:nth-child(5) {
          width: 17%;
        }
      }

      .td {
        &:first-child, &:nth-child(2) {
          cursor: pointer;

          &:hover {
            color: #f4854e;
          }
        }
      }
    }
  }

  .select-activity {
    border: none;
    width: 90%;
    padding: 0;
    margin: 0;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
  }

  .time-log {
    border: none;
    width: 90%;
    padding: 0;
    margin: 0;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    text-align: center;

    &.error {
      background: #86211a;
      color: #fff;
    }
  }

  .footer {
    position: absolute;
    bottom: 2px;
    left: 2px;
    right: 2px;
    text-align: right;

    .total {
      position: absolute;
      top: 50%;
      left: 4px;
      transform: translateY(-50%);

      .valid {
        color: #5ddc6c;
      }

      .error {
        color: #faa176;
      }
    }
  }

  .button {
    cursor: pointer;
    outline: none;
    background: none;
    border: none;
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

  &.pushing {
    .button-push {
      cursor: default;
      background: #aaa;
      color: #333;
    }
  }

  &.pushed {
    .button-push {
      cursor: default;
      background: #5ddc6c;
    }
  }
}
</style>
