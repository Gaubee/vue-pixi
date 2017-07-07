import PIXI from 'src/PIXI.vue'
import { createVM } from '../helpers/utils.js'

describe('PIXI.vue', function () {
  it('渲染一个PIXI绘制用的canvas', function () {
    const vm = createVM(
      this,
      `
<PIXI ref='pixi'></PIXI>
`,
      {
        components: { PIXI },
        mounted () {
          console.log(this.$refs.pixi)
        }
      }
    )
    console.assert(vm.$el.querySelector('canvas') !== null, '找不到canvas DOM对象')
    // (vm.$pixi_stage instanceof PIXI.Stage).should.be.ok()
  })
})
