<template>
  <div id="app" class="perfect-panel" @contextmenu="dragging = !dragging">
    <div class="dragging-mask" v-if="dragging"></div>

    <h1>Panel</h1>

    <div class="perfect-panel-content">
      <router-view />
    </div>

    <button class="dragging-stop" v-if="dragging" @click="dragging = false">x</button>
  </div>
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import { ipcRenderer } from 'electron';

export default {
  name: 'perfect-panel',
  mounted() {
    ipcRenderer.send('renderer:ready');
  },
  data() {
    return {
      dragging: false,
    };
  },
};
</script>

<style lang="scss">
@import '@/layouts/assets/page.scss';
</style>

<style lang="scss" scoped>
.perfect-panel {
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: yellow;
  color: black;

  .dragging-mask {
    -webkit-app-region: drag;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: orange;
  }

  .dragging-stop {
    -webkit-app-region: no-drag;
    outline: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: blue;
    color: red;
  }

  h1 {
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
</style>
