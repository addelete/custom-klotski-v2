<script setup lang='ts'>

import { computed } from "@vue/runtime-core";
import MyIcon from "./MyIcon";
import { useCounterStore } from '../stores/counter';

const counter = useCounterStore();

const props = defineProps<{
  title: string; // 标题
  tips?: string; // 提示信息
  icon?: string; // 图标
  active?: boolean; // 是否激活
}>();

const compTips = computed(() => {
  return props.tips || props.title;
});

const count = computed(() => {
  return counter.count;
});

function incCount() {
  counter.increment();
}


</script>

<template>
  <div class="bar-button" :class="{active}" :title="compTips" @click="incCount">
    <my-icon :type="icon" v-if="icon" />
    <span class="title">{{ title }}</span>
  </div>
</template>
  
<style scoped lang="scss">
  .bar-button {
    width: 100%;
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    &.active {
      background-color: #ccc;
    }
    &:not(.active):hover {
      background-color: #ddd;
    }
    .title {
      font-size: 13px;
      letter-spacing: 2px;
    }
    
  }
</style>