<script setup lang="ts">
import PngIcon from "./PngIcon.vue";
</script>

<template>
  <div class="design-tools">
    <div class="tool active"><PngIcon name="hand" /></div>
    <div class="tool"><PngIcon name="cursor" /></div>
    <div class="tool"><PngIcon name="wall" /></div>
    <div class="tool"><PngIcon name="paint" /></div>
    <div class="tool"><PngIcon name="eraser" /></div>
    <div class="tool"><PngIcon name="zoom" /></div>
  </div>
</template>

<style lang="scss" scoped>
.design-tools {
  position: absolute;
  z-index: 999;
  width: 40px;
  background-color: #F3F3F3;
  left: 12px;
  top: 12px;
  border-radius: 6px;
  box-shadow: 5px 5px 6px rgba(0, 0, 0, 0.2); // TODO
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  

  .tool {
    width: 26px;
    height: 26px;
    cursor: pointer;
    
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;

    & + .tool {
      margin-top: 8px;
    }
    &.active {
      background: #ccc;
      box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.3); // TODO
    }
  }
}
</style>

<style lang="scss">
.design-tools {
  cursor: default !important;
  * {
    cursor: default !important;
  }
  .png-icon {
    font-size: 24px;
  }
}
</style>