<template>
  <div class="flyout">

    <span class="issue-help">I'm working on</span>

    <input class="issue-id" type="text" value="88888">
    <div class="issue-text">Le CMS de production supprime ses commentaires HTML</div>

    <i class="sheet far fa-clock"></i>
    <i class="options fas fa-cog"></i>

    <div class="logo"></div>
  </div>
</template>

<script>
export default {
  name: 'flyout',
};
</script>

<style lang="scss">
@import '../assets/reset.scss';

:root {
  --color-primary: #29547a;
  --color-background: #121b1e;
}

html, body {
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
@import '../assets/mixins';

.flyout {
  box-sizing: border-box;
  position: absolute;
  top: 2px;
  left: 14px;
  width: (250px - 20px);
  height: 40px;
  padding: 0 2px;
  font-size: 11px;
  color: #aaa;
  background: radial-gradient(ellipse at center, #3f3f3f 0%,#323232 100%);
  border: 2px solid #414141;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.25s $easeOutQuart;

  &:hover {
    top: 0;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }

  .logo {
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
    background: url("../assets/logo.png") no-repeat;
    background-size: 93%;
    background-position: center;
  }

  .issue-help {
    cursor: default;
    user-select: none;
  }

  .issue-id {
    cursor: pointer;
    position: absolute;
    left: 2px;
    bottom: 2px;
    border: 0;
    background: none;
    width: 53px;
    padding: 0;

    &:focus {
      cursor: text;
    }
  }

  .issue-text {
    cursor: default;
    user-select: none;
    position: absolute;
    left: 50px;
    bottom: 2px;
    right: 5px;
    height: 15px;
    color: #fff;
    word-break: break-all;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .sheet, .options {
    cursor: pointer;
    position: absolute;
    top: 3px;
    right: 25px;
    opacity: 0.1;
    transition: all 0.25s $easeOutQuart;

    &:hover {
      color: #ef615b;
    }
  }

  .sheet {
    right: 45px;
  }

  &.flyout:hover {
    .sheet, .options {
      opacity: 1;
    }
  }
}
</style>
