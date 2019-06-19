<template>
  <div id="app" class="perfect-panel">
    <div
      class="perfect-panel-container"
      :style="`width: ${width}px; height: ${height}px; top: ${top}px; left: ${left}px;`"
      @contextmenu="onContextmenu"
    >
      <h1>Panel</h1>

      <div class="perfect-panel-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import { ipcRenderer } from 'electron';

export default {
  name: 'perfect-panel',
  mounted() {
    ipcRenderer.on('main:size', (event, size) => this.updateSize(size));
    ipcRenderer.on('main:drag:position', async (event, position) => {
      this.updatePosition(position);

      // await this.$nextTick();

      setTimeout(() => ipcRenderer.send('renderer:drag:ready'));

      // ipcRenderer.send('renderer:drag:ready');
    });
    ipcRenderer.on('main:drag:done', () => this.updatePosition({ x: 0, y: 0 }));

    ipcRenderer.send('renderer:ready');
  },
  data() {
    return {
      top: 0,
      left: 0,
      width: 250,
      height: 250,
    };
  },
  methods: {
    updateSize(size) {
      this.$set(this, 'width', size.width);
      this.$set(this, 'height', size.height);
    },
    updatePosition(position) {
      this.$set(this, 'left', position.x);
      this.$set(this, 'top', position.y);
    },
    onContextmenu() {
      ipcRenderer.send('renderer:drag:toggle', { x: this.left, y: this.top });
    },
  },
};
</script>

<style lang="scss">
@import '@/layouts/assets/page.scss';
</style>

<style lang="scss" scoped>
.perfect-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 0, 0, 0.2);
  color: white;

  .perfect-panel-container {
    position: absolute;
    background: yellow;
    color: black;

    h1 {
      -webkit-app-region: drag;
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 20px;
      margin: 0;
      padding: 1px 5px;
      background: red;
      font-size: 15px;
      font-family: sans-serif;
      font-weight: normal;
      color: white;
    }

    .perfect-panel-content {
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
    }
  }
}
</style>
