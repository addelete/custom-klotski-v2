

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import useResize from "../hooks/useResize";
import DesignTools from "./DesignTools.vue";

const [containerRef, containerSize] = useResize(); // 容器缩放hooks
const canvasOrigin = ref({ x: 0, y: 0 }); // 画布原点，用于缩放

// 画布大小
const canvasSize = ref<Size>({
  width: 500,
  height: 500,
});
// 画布缩放比例
const canvasScale = ref(1);

// 是否初始化过画布偏移
let initCanvasOffset = false;
// 画布偏移
const canvasOffset = ref<Point>({
  x: 300,
  y: 300,
});

/**
 * 容器尺寸和画布尺寸确定后，初始化画布偏移，使画布居中，发生在页面加载完成后，初始化仅执行一次
 */
watchEffect(() => {
  if (containerSize.value && canvasSize.value && !initCanvasOffset) {
    initCanvasOffset = true;
    canvasOffset.value = {
      x: (containerSize.value.width - canvasSize.value.width) / 2,
      y: (containerSize.value.height - canvasSize.value.height) / 2,
    };
  }
});

// 格子大小
const gridSize = ref(50);
// 格子线的颜色
const lineColor = "#ddd";
// 水平线数组
const hLines = computed(() => {
  const lines = [];
  if (containerSize.value) {
    for (
      let i = gridSize.value;
      i < containerSize.value.height;
      i += gridSize.value
    ) {
      lines.push([0, i, containerSize.value.width, i]);
    }
  }
  return lines;
});
// 垂直线数组
const vLines = computed(() => {
  const lines = [];
  if (containerSize.value) {
    for (
      let i = gridSize.value;
      i < containerSize.value.width;
      i += gridSize.value
    ) {
      lines.push([i, 0, i, containerSize.value.height]);
    }
  }
  return lines;
});

// 容器鼠标按下状态
let containerMousedown = false;

// 容器鼠标按下事件
const onContainerMouseDown = (e: MouseEvent) => {
  containerMousedown = true;
  // 容器鼠标拖动事件，用于移动画布
  const onMouseMove = (e: MouseEvent) => {
    canvasOffset.value = {
      x: e.movementX / canvasScale.value + canvasOffset.value.x,
      y: e.movementY / canvasScale.value + canvasOffset.value.y,
    };
  };
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", () => {
    containerMousedown = false;
    document.removeEventListener("mousemove", onMouseMove);
  });
};

// 容器鼠标滚轮事件，用于缩放画布
const onContainerWheel = (e: WheelEvent) => {
  if (containerSize.value && e.altKey) {
    const newOriginX = e.clientX - containerSize.value.x;
    const newOriginY = e.clientY - containerSize.value.y;
    const oldOriginX = canvasOrigin.value.x;
    const oldOriginY = canvasOrigin.value.y;
    if (oldOriginX !== newOriginX || oldOriginY !== newOriginY) {
      const oldOffsetX = canvasOffset.value.x;
      const oldOffsetY = canvasOffset.value.y;
      const scale = canvasScale.value;
      const realOffsetX = oldOffsetX + (oldOffsetX - oldOriginX) * (scale - 1);
      const realOffsetY = oldOffsetY + (oldOffsetY - oldOriginY) * (scale - 1);
      const newOffsetX = (realOffsetX + newOriginX * (scale - 1)) / scale;
      const newOffsetY = (realOffsetY + newOriginY * (scale - 1)) / scale;
      canvasOffset.value = {
        x: newOffsetX,
        y: newOffsetY,
      };
      canvasOrigin.value = {
        x: newOriginX,
        y: newOriginY,
      };
    }
    if (e.deltaY > 0) {
      canvasScale.value = Math.min(canvasScale.value + 0.05, 2);
    } else {
      canvasScale.value = Math.max(canvasScale.value - 0.05, 0.5);
    }
  }
};
</script>

<template>
  <div
    class="game-designer"
    ref="containerRef"
    @mousedown="onContainerMouseDown"
    @wheel="onContainerWheel"
  >
    <DesignTools />
    <div class="trace">
      <div>缩放：{{ canvasScale.toFixed(2) }}</div>
    </div>
    <div
      class="stage-wraper"
      :style="{
        width: canvasSize.width + 'px',
        height: canvasSize.height + 'px',
        transformOrigin: canvasOrigin.x + 'px ' + canvasOrigin.y + 'px',
        transform:
          'scale(' +
          canvasScale +
          ') translate(' +
          canvasOffset.x +
          'px, ' +
          canvasOffset.y +
          'px)',
        backgroundColor: '#ddd',
      }"
    >
      <v-stage :width="canvasSize.width" :height="canvasSize.height">
        <v-layer>
          <v-rect
            :width="canvasSize.width"
            :height="canvasSize.height"
            fill="#fff"
          ></v-rect>
          <v-line
            v-for="points in hLines"
            :key="points[1]"
            :points="points"
            :stroke="lineColor"
            :strokeWidth="1"
          ></v-line>
          <v-line
            v-for="points in vLines"
            :key="points[0]"
            :points="points"
            :stroke="lineColor"
            :strokeWidth="1"
          ></v-line>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<style lang="scss">
.game-designer {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #888;
  cursor: grab;
  * {
    cursor: grab;
  }
  .trace {
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 100px;
    z-index: 2;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 10px;
    padding: 5px 10px;
  }
}
</style>
