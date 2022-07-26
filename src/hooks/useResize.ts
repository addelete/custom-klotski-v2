import { nextTick, onMounted, onUnmounted, Ref, ref } from "vue";

export default function useResize() {
  const nodeRef = ref<HTMLElement>();
  const size = ref<DOMRect | undefined>();
  let ro: ResizeObserver;
  
  onMounted(() => {
    nextTick(() => {
      const container = nodeRef.value;
      if (container) {
        size.value = container.getBoundingClientRect();
        ro = new ResizeObserver(() => {
          // const entry = entries[0];
          // const cr = entry.contentRect;
          size.value = container.getBoundingClientRect();
        })
        ro.observe(container)
      }
    });
  });
  
  onUnmounted(() => {
    if (ro) {
      ro.disconnect();
    }
  });
  return [nodeRef, size] as [
    Ref<HTMLElement>,
    Ref<DOMRect | undefined>
  ];
}