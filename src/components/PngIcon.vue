<script setup lang="ts">
import { computed } from "vue-demi";

  const props = defineProps<{
    name: string; // 名称
  }>();
  const url = computed(() => new URL(`../assets/icons/${props.name}.png`, import.meta.url).href)
</script>

<template>
  <div class="png-icon">
    <img :src="url" class="img" />
  </div>
</template>

<style scoped lang="scss">
  .png-icon {
    display: inline-flex;
    .img {
      width: 1em;
      height: 1em;
    }
  }
</style>