import type { PropType, VNode } from 'vue'
import { defineComponent, h, onMounted, onUnmounted, ref, watch } from 'vue'

const prevW = Symbol('prevW')
const prevH = Symbol('prevH')

export default /* #__PURE__ */ defineComponent({
  name: 'FlowLayout',
  props: {
    cols: {
      type: Number as PropType<number>,
      default: 2,
    },
    gap: {
      type: [Number, Array] as PropType<number | [number, number]>,
      default: 4,
    },
    transition: {
      type: [Boolean, Number] as PropType<boolean | number>,
      default: true,
    },
  },
  setup(props, { slots }) {
    let sizeObs: ResizeObserver
    let childrenObs: MutationObserver

    const layout = ref<HTMLDivElement | null>(null)
    const layouting = ref(false)

    const reLayout = () => {
      if (layouting.value || !layout.value)
        return
      layouting.value = true

      requestAnimationFrame(() => {
        try {
          const parent = layout.value!
          const children = Array.from(parent.children) as HTMLElement[]
          const len = children.length
          const [gapX, gapY] = Array.isArray(props.gap) ? props.gap : [props.gap, props.gap]

          const colWidth = (parent.offsetWidth - (props.cols - 1) * gapX) / props.cols
          for (const el of children) {
            el.style.width = `${colWidth}px`
          }

          const hs = Array.from({ length: len }, (_, index) => {
            const el = children[index] as any
            el[prevW] = el.offsetWidth
            el[prevH] = el.offsetHeight
            return el.offsetHeight
          })

          const columnHs = Array.from({ length: props.cols }, () => 0)

          for (let i = 0; i < children.length; i++) {
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
          if (layout.value) {
            (layout.value as any)[prevW] = layout.value.offsetWidth;
            (layout.value as any)[prevH] = layout.value.offsetHeight
          }
          layouting.value = false
        }
      })
    }

    const sizeListener = () => {
      if (!layout.value)
        return
      const parent = layout.value
      sizeObs = new ResizeObserver((els) => {
        for (const { target: el } of els) {
          if ((el as any).offsetWidth !== (el as any)[prevW] || (el as any).offsetHeight !== (el as any)[prevH]) {
            reLayout()
          }
        }
      })
      sizeObs.observe(parent)
      for (const el of parent.children) {
        sizeObs.observe(el)
      }
    }

    const childrenListener = () => {
      if (!layout.value)
        return
      const parent = layout.value
      childrenObs = new MutationObserver((ml) => {
        for (const m of ml) {
          for (const el of m.addedNodes) {
            if (el.nodeType === 1)
              sizeObs.observe(el as HTMLElement)
          }
          for (const el of m.removedNodes) {
            if (el.nodeType === 1)
              sizeObs.unobserve(el as HTMLElement)
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
      childrenListener()
    })

    onUnmounted(() => {
      sizeObs.disconnect()
      childrenObs.disconnect()
    })

    return () => {
      const parentStyle = {
        position: 'relative',
        display: 'block',
        boxSizing: 'border-box',
        overflow: 'unset !important',
      }

      const childStyle = {
        position: 'absolute',
        boxSizing: 'border-box',
        ...props.transition
          ? {
              transition: `all ${typeof props.transition === 'number' ? `${props.transition}ms` : '350ms'}`,
            }
          : {},
      }

      const children = slots.default?.()

      function setStyle(vnode: VNode, style: Record<string, string>, depath = 1) {
        if (Array.isArray(vnode.children) && depath > 0) {
          vnode.children.forEach((vvnode) => {
            setStyle(vvnode as VNode, style, depath - 1)
          })
        }
        else {
          const props = (vnode.props = vnode.props || {})
          props.style = {
            ...props.style,
            ...childStyle,
          }
        }
      }

      children?.forEach((child) => {
        setStyle(child, childStyle)
      })

      return h(
        'div',
        {
          id: 'vue-flow-layout',
          ref: layout,
          style: parentStyle,
        },
        children,
      )
    }
  },
})
