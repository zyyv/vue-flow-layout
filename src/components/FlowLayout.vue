<script lang='ts' setup>
import type { VNode } from 'vue'
import { onMounted, ref, withDefaults } from 'vue'

defineOptions({
  name: 'FlowLayout',
})

const props = withDefaults(defineProps<{
  cols?: number
  gap?: number | [number, number]
}>(), {
  cols: 2,
  gap: 4,
})

const slots = defineSlots<{
  default: () => any
}>()

const layout = ref<HTMLDivElement>()

onMounted(() => {
  const children = slots.default()

  children.forEach((vnode: VNode<HTMLElement>, index: number) => {
    const col = index % props.cols
    const row = Math.floor(index / props.cols)
    const gap = Array.isArray(props.gap) ? props.gap : [props.gap, props.gap]
    const el = vnode.el!

    el.style.left = `${col * (el.offsetWidth + gap[0])}px`
    el.style.top = `${row * (el.offsetHeight + gap[1])}px`
  })
})
</script>

<template>
  <div id="flow-layout" ref="layout">
    <slot />
  </div>
</template>

<style scoped>
#flow-layout {
  position: relative;
  display: block;
  box-sizing: border-box !important;
  overflow: unset !important;
}

#flow-layout > * {
  position: absolute;
  box-sizing: border-box;
}
</style>
