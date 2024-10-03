<script lang='ts' setup>
import { onMounted, onUnmounted, ref, watch, withDefaults } from 'vue'

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

defineSlots<{
  default: () => any
}>()

const prevW = '$$symbol:prevW'
const prevH = '$$symbol:prevH'

let sizeObs: ResizeObserver
let childrenObs: MutationObserver

const layout = ref<HTMLDivElement>()
const layouting = ref(false)

function reLayout() {
  if (layouting.value)
    return
  layouting.value = true

  if (!layout.value)
    return

  requestAnimationFrame(() => {
    try {
      const parent = layout.value
      const children = Array.from(parent.children) as HTMLElement[]
      const len = children.length
      const [gapX, gapY] = Array.isArray(props.gap) ? props.gap : [props.gap, props.gap]

      const colWidth = (parent.offsetWidth - (props.cols - 1) * gapX) / props.cols
      for (const el of children) {
        el.style.width = `${colWidth}px`
      }

      const hs = Array.from({ length: len }, (_, index) => {
        const el = children[index]
        el[prevW] = el.offsetWidth
        el[prevH] = el.offsetHeight
        return el.offsetHeight
      })

      const columnHs = Array.from({ length: props.cols }, () => 0)

      for (let i = 0; i < len; i++) {
        const el = children[i]
        const minColHeight = Math.min(...columnHs)
        const colIndex = columnHs.indexOf(minColHeight)
        const left = colIndex * (colWidth + gapX)
        const top = minColHeight

        el.style.left = `${left}px`
        el.style.top = `${top}px`

        columnHs[colIndex] += hs[i] + gapY
      }

      parent.style.height = `${Math.max(...columnHs) - gapY}px`
    }
    finally {
      layout.value[prevW] = layout.value.offsetWidth
      layout.value[prevH] = layout.value.offsetHeight
      layouting.value = false
    }
  })
}

function sizeListener() {
  const parent = layout.value!
  sizeObs = new ResizeObserver((els) => {
    for (const { target: el } of els) {
      if (el.offsetWidth !== el[prevW] || el.offsetHeight !== el[prevH]) {
        reLayout()
      }
    }
  })
  sizeObs.observe(parent)
  for (const el of parent.children) {
    sizeObs.observe(el)
  }
}

function childrenLisener() {
  const parent = layout.value!
  childrenObs = new MutationObserver((ml) => {
    for (const m of ml) {
      for (const el of m.addedNodes) {
        if (el.nodeType === 1) {
          sizeObs.observe(el as HTMLElement)
        }
      }
      for (const el of m.removedNodes) {
        if (el.nodeType === 1) {
          sizeObs.unobserve(el as HTMLElement)
        }
      }
    }

    reLayout()
  })
  childrenObs.observe(parent, { childList: true, subtree: true })
}

watch(() => [props.cols, props.gap], reLayout)

onMounted(() => {
  reLayout()
  sizeListener()
  childrenLisener()
})

onUnmounted(() => {
  sizeObs.disconnect()
  childrenObs.disconnect()
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
  transition: all 350ms ;
}
</style>
