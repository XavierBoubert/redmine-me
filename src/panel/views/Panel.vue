<template>
  <div class="panel">
    Child
  </div>
</template>

<script>
export default {
  name: 'panel',
};
</script>

<style lang="scss" scoped>
.panel {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background: green;
  color: white;
}
</style>
