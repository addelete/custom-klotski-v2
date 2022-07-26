import { Ref, ref } from 'vue';
import cache from '../utils/cache';

/**
 * 
 * 配合MovableDivider组件使用
 * 
 * @param {object} options 参数配置
 * @param {string} options.cacheKey 缓存key
 * @param {number} options.defaultSize 缓存没有时的默认值
 * @param {'width' | 'height'} options.styleKey 样式key
 * @param {boolean} options.positive 是否正相关，用于onResize
 * @returns {[Ref<number>, (offsetDiff: number) => void, () => void]} [size, onResize, onResizeEnd]
 * 
 * @example
 * const [size, onResize, onResizeEnd] = useResizable({
 *  cacheKey: 'movable-divider-size',
 *  defaultSize: 100,
 *  styleKey: 'width',
 *  positive: true,
 * });
 * 
 * <div class="box" :style="{width: size + 'px'}">
 * 
 * <MovableDivider
 *   direction="vertical"
 *   v-on:drag-move="onResize"
 *   v-on:drag-end="onResizeEnd"
 *  />
 */
export default function useResizable(
  options: {
    cacheKey: string; // 缓存key
    defaultSize: number; // 缓存没有时的默认值
    styleKey: 'width' | 'height'; // 样式key
    positive: boolean; // 是否正相关，用于onUpdateSize
  }
): [Ref<number>, (offsetDiff: number) => void, () => void] {
  let cacheSize = cache.getItem<number>(options.cacheKey, options.defaultSize);
  let size = ref(cacheSize); // 尺寸
  const onResize = (offsetDiff: number) => {
    if (!options.positive) {
      offsetDiff = -offsetDiff;
    }

    size.value = cacheSize + offsetDiff;
  };

  const onResizeEnd = () => {
    cacheSize = size.value;
    cache.setItem(options.cacheKey, cacheSize);
  };

  return [size, onResize, onResizeEnd];
}
