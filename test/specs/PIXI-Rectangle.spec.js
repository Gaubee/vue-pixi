import { PIXI, Rectangle, $calc } from 'src/'
import { createVM } from '../helpers/utils.js'
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
  it('测试计算属性', function () {
    const vm = createVM(
      this,
      `
        <PIXI ref="pixi">
            <Rectangle pid="rect1" :left="x" :top="y" :color="color1"></Rectangle>
            <Rectangle pid="rect2" :right="isFollow?$calc('rect1.right+100'):$calc('R_WIDTH-100')" :left="isFollow?$calc('rect1.left-100'):100" :top="isFollow?$calc('rect1.top-100'):100" :bottom="isFollow?$calc('rect1.bottom+100'):$calc('R_HEIGHT-100')" :alpha="0.5" :color="color2" @click="toggleFellow()"></Rectangle>
        </PIXI>
      `,
      {
        components: { PIXI, Rectangle },
        data () {
          return {
            color1: 0xffffff * Math.random(),
            color2: 0xffffff * Math.random(),
            x: Math.random() * 100,
            y: Math.random() * 100,
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
            const maxX = pixiRenderer.width - 100 // rect.width
            const maxY = pixiRenderer.height - 100 // rect.height
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
