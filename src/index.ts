import type { App } from 'vue'
import FlowLayout from './FlowLayout'

export {
  FlowLayout,
}

export default {
  install: (app: App) => {
    app.component('FlowLayout', FlowLayout)
  },
}
