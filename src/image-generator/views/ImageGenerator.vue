<template>
  <div class="image-generator">{{ text }}
    <canvas
      ref="canvas"
      :style="`width: ${width}px; height: ${height}px`"
      :width="width * 2"
      :height="height * 2"
    ></canvas>
  </div>
</template>

<script>
export default {
  name: 'image-generator',
  props: {
    width: Number,
    height: Number,
    text: String,
  },
  data() {
    return {
      context: null,
    };
  },
  mounted() {
    this.context = this.$refs.canvas.getContext('2d');
    // this.context.imageSmoothingEnabled = false;
    this.context.scale(2, 2);
    this.generateImage();
  },
  watch: {
    text() {
      this.generateImage();
    },
  },
  methods: {
    generateImage() {
      if (!this.text) {
        return;
      }

      const { context } = this;
      const size = {
        width: context.canvas.clientWidth,
        height: context.canvas.clientHeight,
      };

      context.clearRect(0, 0, size.width, size.height);

      context.font = 'normal 20px sans-serif';
      context.fillStyle = '#ffffff';
      context.fillText(this.text, 0, 25);

      this.$emit('image', context.canvas.toDataURL().replace('data:image/png;base64,', ''));
    },
  },
};
</script>

<style lang="scss" scoped>
.image-generator {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  overflow: hidden;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
  }
}
</style>
