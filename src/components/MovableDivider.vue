

<!-- 可拖动的分割线 -->
<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  direction: "horizontal" | "vertical"; // 分割线的方向
}>();
const emit = defineEmits<{
  (e: "drag-move", offsetDiff: number): void; // 拖动时触发
  (e: "drag-end"): void; // 拖动结束时触发
}>();

let start = 0; // 初始值，用于计算拖动距离
let mousedown = ref(false); // 是否按下鼠标

/**
 * 鼠标按下事件
 * 记录初始值，如果线是垂直方向，则记录按下的X坐标，如果线是水平方向，则记录按下的Y坐标
 * 注意，按下后要监听document的鼠标事件，防止鼠标抖动导致的拖动不流畅
 * 监听document的mousemove事件，用于计算拖动距离
 * 监听document的mouseup事件，用于结束拖动
 */
function onMouseDown(e: MouseEvent) {
  mousedown.value = true;
  start = props.direction === "vertical" ? e.clientX : e.clientY;
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

/**
 * 鼠标移动事件
 * 如果鼠标按下，则计算拖动距离，并触发拖动事件
 */
function onMouseMove(e: MouseEvent) {
  const offsetDiff =
    (props.direction === "vertical" ? e.clientX : e.clientY) - start;
  emit("drag-move", offsetDiff);
}

/**
 * 鼠标抬起事件
 * 取消document的监听事件
 * 触发拖动结束事件
 */
function onMouseUp() {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
  mousedown.value = false;
  emit("drag-end");
}
</script>

<template>
  <div class="movable-divider" :class="{ mousedown, [direction]: true }" @mousedown="onMouseDown">
    <div class="mask"></div>
    <div class="divider"></div>
  </div>
</template>

<style lang="scss" scoped>
.movable-divider {
  position: relative;
  z-index: 999;
  .mask {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    cursor: col-resize;
    display: none;
    opacity: 0;
  }
  &.mousedown .mask {
    display: block;
    
  }
  .divider {
    position: absolute;
    width: 1px;
    height: 1px;
    cursor: col-resize;
    background-color: var(--primary-border-color);
  }

  &.vertical .divider {
    height: 100%;
  }
  &.vertical .divider:hover, &.mousedown .divider {
    width: 5px;
    transform: translateX(-2px);
    background-color: var(--primary-active-border-color);
  }
}
</style>