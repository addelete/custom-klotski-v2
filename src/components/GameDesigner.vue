

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from "vue";
import {} from "konva";
import useResize from "../hooks/useResize";

const [containerRef, containerSize] = useResize();
const spaceDown = ref(false);
const stageOrigin = ref({ x: 0, y: 0 });


onMounted(() => {
  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      spaceDown.value = true;
    }
  });
  document.addEventListener("keyup", (event) => {
    if (event.code === "Space") {         
      spaceDown.value = false;
    }
  });
});

// 格子大小
const gridSize = ref(50);
// 画布大小
const canvasSize = ref<Size>({
  width: 500,
  height: 500,
});

const stageScale = ref(1);

let initStageOffset = false
const stageOffset = ref<Point>({
  x: 300,
  y: 300,
});


watchEffect(() => {
  if(containerSize.value && canvasSize.value && !initStageOffset) {
    initStageOffset = true
    stageOffset.value = {
      x: (containerSize.value.width - canvasSize.value.width) / 2,
      y: (containerSize.value.height - canvasSize.value.height) / 2,
    }
  }
})

const lineColor = "#ddd";

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

let mousedown = false;

const onMouseDown = (e: MouseEvent) => {
  mousedown = true;
};

const onMouseMove = (e: MouseEvent) => {
  if (spaceDown.value && mousedown) {
    console.log(e);
    stageOffset.value = {
      x: e.movementX + stageOffset.value.x,
      y: e.movementY + stageOffset.value.y,
    };
  }
};

const onWheel = (e: WheelEvent) => {
  if (containerSize.value) {
    const newOriginX = e.clientX - containerSize.value.x;
    const newOriginY = e.clientY - containerSize.value.y;
    const oldOriginX = stageOrigin.value.x;
    const oldOriginY = stageOrigin.value.y;
    if (
      oldOriginX !== newOriginX ||
      oldOriginY !== newOriginY
    ) {
      const oldOffsetX = stageOffset.value.x;
      const oldOffsetY = stageOffset.value.y;
      const scale = stageScale.value;
      const realOffsetX = oldOffsetX + (oldOffsetX - oldOriginX) * (scale - 1);
      const realOffsetY = oldOffsetY + (oldOffsetY - oldOriginY) * (scale - 1);
      const newOffsetX = (realOffsetX + newOriginX * (scale - 1)) / scale;
      const newOffsetY = (realOffsetY + newOriginY * (scale - 1)) / scale;
      stageOffset.value = {
        x: newOffsetX,
        y: newOffsetY,
      };
      stageOrigin.value = {
        x: newOriginX,
        y: newOriginY,
      };
    }
    if (e.deltaY > 0) {
      stageScale.value = Math.min(stageScale.value + 0.05, 2);
    } else {
      stageScale.value = Math.max(stageScale.value - 0.05, 0.5);
    }
  }
};

</script>

<template>
  <div
    class="game-designer"
    ref="containerRef"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @wheel="onWheel"
  >
    <div class="trace">
      <div>缩放：{{ stageScale.toFixed(2) }}</div>
    </div>
    <div class="move-mask" :class="{ spaceDown }"></div>
    <div
      class="stage-wraper"
      :style="{
        width: canvasSize.width + 'px',
        height: canvasSize.height + 'px',
        transformOrigin: stageOrigin.x + 'px ' + stageOrigin.y + 'px',
        transform:
          'scale(' + stageScale + ') translate(' + stageOffset.x + 'px, ' + stageOffset.y + 'px)',
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

<style lang="scss" scoped>
.game-designer {
  width: 100%;
  height: 100%;
  position: relative;
  .move-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: none;
    &.spaceDown {
      display: block;
      cursor: grab;
    }
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