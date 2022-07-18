<script setup lang="ts">
import { onMounted } from "vue";
import MovableDivider from "./components/MovableDivider.vue";
import BarButton from "./components/BarButton.vue";
import { useGameStore } from "./stores/gameStore";
import useResizable from "./hooks/useResizable";

const gameStore = useGameStore();

onMounted(() => {
  gameStore.loadGameList();
});

const [leftSideWidth, leftSideOnResize, leftSideOnResizeEnd] = useResizable({
  cacheKey: "leftSideWidth",
  defaultSize: 280,
  styleKey: "width",
  positive: true,
});

const [rightSideWidth, rightSideOnResize, rightSideOnResizeEnd] = useResizable({
  cacheKey: "rightSideWidth",
  defaultSize: 280,
  styleKey: "width",
  positive: false,
});

</script>

<template>
  <div class="headbar">顶边栏，放置工具按钮、设置按钮</div>
  <div class="body">
    <div class="leftbar">
      <bar-button title="布局列表" icon="icon-database" active />
      <bar-button title="线上列表" icon="icon-cloud-server" />
    </div>

    <div
      class="leftside"
      :style="{
        width: leftSideWidth + 'px',
      }"
    >
      左侧栏，可显示布局列表，布局概览。
    </div>
    <MovableDivider
      direction="vertical"
      @drag-move="leftSideOnResize"
      @drag-end="leftSideOnResizeEnd"
    />
    <div class="main">
      主体区域，放置布局设计器，布局胜利条件、布局解答步骤、布局玩一玩
    </div>
    <MovableDivider
      direction="vertical"
      @drag-move="rightSideOnResize"
      @drag-end="rightSideOnResizeEnd"
    />
    <div class="rightside" :style="{
        width: rightSideWidth + 'px',
      }">
      右侧栏，可显示设计布局的操作历史，玩一玩布局的操作历史，用于撤销、重做操作
    </div>
    <div class="rightbar">右边栏, 放一些按钮用于展示/隐藏右侧栏的内容</div>
  </div>
  <div class="footbar">footbar, 显示状态、通知</div>
</template>

<style lang="scss">
html,
body {
  -webkit-font-smoothing: antialiased;
  position: fixed;
  overflow: hidden;
  margin: 0;
  padding: 0;
  --primary-background-color: #f3f3f3;
  --primary-border-color: #ddd;
  --primary-active-border-color: #c9ddee;
}

* {
  user-select: none;
  -webkit-user-select: none;
  cursor: default;
  box-sizing: border-box;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--primary-background-color);
  .headbar {
    padding: 0 8px;
    height: 30px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--primary-border-color);
  }
  .body {
    flex: 1;
    display: flex;
    overflow: hidden;
    .leftbar {
      writing-mode: vertical-lr;
      width: 24px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      border-right: 1px solid var(--primary-border-color);
    }
    .rightbar {
      writing-mode: vertical-lr;
      width: 24px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      border-left: 1px solid var(--primary-border-color);
    }
    .leftside {
      width: 280px;
      flex-shrink: 0;
      overflow: auto;
    }
    .rightside {
      width: 280px;
      flex-shrink: 0;
      overflow: auto;
    }
    .main {
      flex: 1;
    }
  }
  .footbar {
    padding: 0 8px;
    height: 30px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    border-top: 1px solid var(--primary-border-color);
  }
}
</style>
