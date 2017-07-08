import Hello from './Hello.vue'
import HelloJsx from './Hello.jsx'

import PIXI from './PIXI.vue'
import Rectangle from './PIXI/Rectangle'
import PIXIText from './PIXI/pixi-Text'

export * from './PIXI/Mixin'

function plugin (Vue) {
  Vue.component('hello', Hello)
  Vue.component('PIXI', PIXI)
  Vue.component('hello-jsx', HelloJsx)
  Vue.component('Rectangle', Rectangle)
  Vue.component('pixi-Text', PIXIText)

  // Vue.mixins({
  //   created () {
  //     console.log('zzzz')
  //   }
  // })
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
const version = '__VERSION__'
// Export all components too
export {
  Hello,
  HelloJsx,
  version,
  PIXI,
  PIXIText,
  Rectangle
}
