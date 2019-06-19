<template>
  <div class="panel-parent">
    Parent
  </div>
</template>

<script>
export default {
  name: 'panel-parent',
};
</script>

<style lang="scss" scoped>
.panel-parent {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background: blue;
  color: white;
}
</style>
