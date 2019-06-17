<template>
  <div class="flyout">
    <div class="issue" :class="{ error }">
      <span class="issue-help">I'm working on</span>

      <input
        class="issue-id"
        :class="{ empty: !activeIssue.id }"
        type="text"
        :value="activeIssue.id"
        @input="changeIssueId"
      >
      <div
        class="issue-text"
        :class="{ empty: activeIssue.error || !activeIssue.text, error: activeIssue.error }"
        @click="openActiveIssue"
      >{{ activeIssue.error || activeIssue.text }}</div>

      <div class="error-text" v-if="error">{{ error }}</div>

      <button
        v-if="versionUpdateUrl"
        class="version-update far fa-arrow-alt-circle-up"
        @click="openVersionUpdateUrl"
      ></button>
      <button
        ref="buttonSheet"
        class="sheet far fa-clock"
        :class="{ active: panels.activity }"
        @click="togglePanel('activity')"
      ></button>
      <button
        class="options fas fa-cog"
        :class="{ active: panels.options }"
        @click="togglePanel('options')"
      ></button>

      <div v-if="!avatar" class="logo"></div>
      <img v-if="avatar" :src="avatar" class="logo-avatar">
    </div>

    <div class="panel">
      <activity v-if="panels.activity" @close="togglePanel('activity')" />
      <options v-if="panels.options" @close="togglePanel('options')" />
    </div>

    <image-generator :text="idTruncate" :width="32" :height="32" @image="idImageChange" />
  </div>
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import { ipcRenderer } from 'electron';
import { mapState } from 'vuex';
import api from '@/redmine/api';
import store from '@/services/store';
import Activity from '@/activity/views/Activity.vue';
import Options from '@/options/views/Options.vue';
import ImageGenerator from '@/image-generator/views/ImageGenerator.vue';

export default {
  name: 'flyout',
  store,
  components: { Activity, Options, ImageGenerator },
  mounted() {
    setTimeout(() => this.$refs.buttonSheet.focus());

    if (this.activeIssue.id) {
      this.changeIssueId({ target: { value: this.activeIssue.id } });
    }

    this.$store.dispatch('Redmine/test');
    this.$store.dispatch('Options/checkUpdate');
  },
  data() {
    return {
      inputTimeout: null,
      panels: {
        activity: false,
        options: false,
      },
    };
  },
  computed: {
    ...mapState('Redmine', ['error', 'activeIssue']),
    ...mapState('Options', ['avatar', 'versionUpdateUrl']),
    idTruncate() {
      return this.error || this.activeIssue.error || !this.activeIssue.id
        ? ''
        : this.activeIssue.id.toString().slice(-3);
    },
  },
  watch: {
    activeIssue() {
      this.refreshTrayImage();
    },
    error() {
      this.refreshTrayImage();
    },
  },
  methods: {
    togglePanel(name) {
      this.panels[name] = !this.panels[name];

      ipcRenderer.send('panel:opened', { name, opened: this.panels[name] });

      Object.keys(this.panels).forEach((panelName) => {
        this.panels[panelName] = panelName === name
          ? this.panels[panelName]
          : false;
      });
    },
    changeIssueId(event) {
      clearTimeout(this.inputTimeout);

      this.inputTimeout = setTimeout(() => {
        this.$store.dispatch('Redmine/pullActiveIssue', event.target.value);
      }, 500);
    },
    openVersionUpdateUrl() {
      ipcRenderer.send('browser:open', { url: this.versionUpdateUrl });
    },
    openActiveIssue() {
      if (!this.activeIssue.id || this.activeIssue.error) {
        return;
      }

      ipcRenderer.send('browser:open', {
        url: `${api.url}/issues/${this.activeIssue.id}`,
      });
    },
    idImageChange(src) {
      this.refreshTrayImage(src);
    },
    refreshTrayImage(src) {
      if (this.error || this.activeIssue.error || !this.activeIssue.id) {
        ipcRenderer.send('tray:image', { src: null });

        return;
      }

      if (src) {
        ipcRenderer.send('tray:image', { src });
      }
    },
  },
};
</script>

<style lang="scss">
@import '../assets/page.scss';
</style>

<style lang="scss" scoped>
@import '../assets/mixins';

.flyout {
  .issue {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 5px;
    width: (250px - 20px);
    height: 40px;
    padding: 0 2px;
    font-size: 11px;
    color: #aaa;
    background: radial-gradient(ellipse at center, #3f3f3f 0%,#323232 100%);
    border: 2px solid #414141;
    border-radius: 3px;
    box-shadow: 0 2px 3px 2px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

    .logo, .logo-avatar {
      -webkit-app-region: drag;
      z-index: 1;
      user-select: none;
      cursor: grab;
      position: absolute;
      top: 50%;
      right: -15px;
      bottom: 0;
      width: 40px;
      height: 40px;
      transform: translateY(-50%);
    }

    .logo {
      background: url("../assets/icon.png") no-repeat;
      background-size: 93%;
      background-position: center;
    }

    .logo-avatar {
      border-radius: 50%;
      overflow: hidden;
    }

    .issue-help {
      cursor: default;
      user-select: none;
    }

    .issue-id {
      cursor: pointer;
      box-sizing: border-box;
      position: absolute;
      left: 2px;
      bottom: 2px;
      border: 0;
      border-bottom: 1px solid transparent;
      background: none;
      width: 53px;
      padding: 0;

      &:focus {
        cursor: text;
      }

      &.empty {
        border-bottom: 1px solid #aaa;
      }
    }

    .issue-text {
      cursor: pointer;
      user-select: none;
      position: absolute;
      left: 60px;
      bottom: 3px;
      right: 5px;
      height: 15px;
      color: #fff;
      word-break: break-all;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      &:hover {
        color: #f4854e;
      }

      &.empty {
        cursor: default;
      }

      &.error, &.error:hover {
        color: #faa176;
      }
    }

    .error-text {
      position: absolute;
      top: 20px;
      left: 2px;
      width: 200px;
      color: #faa176;
    }

    &.error {
      .issue-help, .issue-id, .issue-text {
        display: none;
      }

      .error-text {
        display: block;
      }
    }

    .version-update, .sheet, .options {
      cursor: pointer;
      position: absolute;
      top: 3px;
      right: 25px;
      opacity: 0.1;
      transition: all 0.25s $easeOutQuart;
      border: none;
      outline: none;
      padding: 0;
      background: none;
      color: #aaa;

      &:hover {
        color: #ef615b;
      }

      &.active {
        color: #ef615b;
        opacity: 1;
      }
    }

    .sheet {
      right: 45px;
    }

    .version-update {
      right: 65px;
      color: #5ddc6c;
      opacity: 1;

      &:hover, &.active {
        color: #5ddc6c;
      }
    }

    &:hover {
      .sheet, .options {
        opacity: 1;
      }
    }
  }

  .panel {
    position: absolute;
    top: 42px + 10px;
    left: 5px;
    right: 5px;
    bottom: 8px;
  }
}
</style>
