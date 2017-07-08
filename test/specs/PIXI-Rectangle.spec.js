import plugin,{$calc} from 'src/'
import {
  createVM,
  Vue
} from '../helpers/utils.js'
plugin(Vue)
// describe('Rectangle.vue', function () {
//   it('测试color,x,y属性的绑定', function () {
//     const vm = createVM(
//       this,
//       `
//         <PIXI ref='pixi'>
//             <Rectangle ref="rect" :left="x" :top="y" :color="color"></Rectangle>
//         </PIXI>
//       `,
//       {
//         components: { PIXI, Rectangle },
//         data () {
//           return {
//             color: 0xffffff * Math.random(),
//             x: Math.random() * 100,
//             y: Math.random() * 100
//           }
//         },
//         mounted () {
//           const rect = this.$refs.rect
//           const pixiRenderer = rect.$pixiRenderer
//           var xAcc = 1
//           var yAcc = 1
//           rect.$pixiTicker.add(() => {
//             const maxX = pixiRenderer.width - rect.width
//             const maxY = pixiRenderer.height - rect.height
//             this.x += xAcc
//             this.y += yAcc
//             if (this.x < 0 || this.x > maxX) {
//               xAcc *= -1
//             }
//             if (this.y < 0 || this.y > maxY) {
//               yAcc *= -1
//             }
//           })
//         }
//       }
//     )
//     console.assert(vm.$el.querySelector('canvas') !== null, '找不到canvas DOM对象')
//     // (vm.$pixi_stage instanceof PIXI.Stage).should.be.ok()
//   })
// })

// describe('Rectangle.vue', function () {
//   it('测试click事件绑定', function () {
//     const vm = createVM(
//       this,
//       `
//         <PIXI>
//             <Rectangle :color="color" @click="testClick"></Rectangle>
//         </PIXI>
//       `,
//       {
//         components: { PIXI, Rectangle },
//         data () {
//           return {
//             color: 0xffffff * Math.random()
//           }
//         },
//         methods: {
//           testClick () {
//             this.color = 0xffffff * Math.random()
//           }
//         }
//       }
//     )
//     console.assert(vm.$el.querySelector('canvas') !== null, '找不到canvas DOM对象')
//     // (vm.$pixi_stage instanceof PIXI.Stage).should.be.ok()
//   })
// })
describe('Rectangle.vue', function () {
  it('测试计算属性，点击切换布局模式', function () {
    const vm = createVM(
      this,
      `
        <PIXI ref="pixi">
            <Rectangle
              pid="rect1"
              :width="width"
              :height="height"
              :left="x"
              :top="y"
              :color="color1"></Rectangle>
            <pixi-Text :text="$calc('rect1.left')" :color="0xffffff"></pixi-Text>
            <Rectangle
              v-if="isFollow"
              pid="rect2"
              :right="$calc('rect1.right+100')"
              :left="$calc('rect1.left-100')"
              :top="$calc('rect1.top-100')"
              :bottom="$calc('rect1.bottom+100')"
              :alpha="0.5"
              :color="color2"
              @click="toggleFellow()">
            </Rectangle>
            <Rectangle
              v-else
              pid="rect2"
              :right="$calc('R_WIDTH-100')"
              :left="100"
              :top="100"
              :bottom="$calc('R_HEIGHT-100')"
              :alpha="0.5"
              :color="color2"
              @click="toggleFellow()">
            </Rectangle>
        </PIXI>
      `, {
        components: {
          // PIXI,
          // Rectangle,
          // PIXIText
        },
        data () {
          return {
            color1: 0xffff00,
            color2: 0xff00ff,
            width: 100,
            height: 100,
            x: 50,
            y: 50,
            isFollow: false,
            x2: 300,
            y2: 200
          }
        },
        mounted () {
          const pixi = this.$refs.pixi
          const pixiRenderer = pixi.$pixiRenderer
          var xAcc = 1
          var yAcc = 1
          pixi.$pixiTicker.add(() => {
            this.width += xAcc / 2
            this.height += yAcc / 2
            const maxX = pixiRenderer.width - this.width
            const maxY = pixiRenderer.height - this.height
            this.x += xAcc
            this.y += yAcc
            if (this.x < 0 || this.x > maxX) {
              xAcc *= -1
            }
            if (this.y < 0 || this.y > maxY) {
              yAcc *= -1
            }
          })
        },
        methods: {
          $calc,
          toggleFellow () {
            this.isFollow = !this.isFollow
          }
        }
      }
    )
    console.assert(vm.$el.querySelector('canvas') !== null, '找不到canvas DOM对象')
    // (vm.$pixi_stage instanceof PIXI.Stage).should.be.ok()
  })
})
