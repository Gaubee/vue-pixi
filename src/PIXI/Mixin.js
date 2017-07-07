const RUNWITHEVAL = Function(
  ['with_arg', 'eval_code'],
  'with(with_arg){return eval(eval_code)}'
)
export class CalcProp {
  constructor (evalCode) {
    this.evalCode = evalCode
  }
}
export function $calc (evalCode) {
  return new CalcProp(evalCode)
}
export default {
  props: {
    pid: String,
    left: {
      type: [Number, CalcProp],
      default: 0
    },
    top: {
      type: [Number, CalcProp],
      default: 0
    },
    width: {
      type: [Number, CalcProp],
      default: 100
    },
    height: {
      type: [Number, CalcProp],
      default: 100
    },
    right: {
      type: [Number, CalcProp]
    },
    bottom: {
      type: [Number, CalcProp]
    },
    // pointerEvents: { type: [Boolean, CalcProp], default: true },
    cursor: {
      type: [String, CalcProp],
      default: 'auto'
    },
    buttonMode: {
      type: [Boolean, CalcProp],
      default: false
    },
    interactive: {
      type: [Boolean, CalcProp],
      default: true
    }
  },
  data () {
    return {
      REAL_TIME_CALCULATION: false
    }
  },
  beforeCreate () {
    this.$pixiParent = this.$parent.$pixiStage || this.$parent.$pixiEl

    this.$pixiLevel = this.$parent.$pixiLevel + 1
    this.$pixiApp = this.$parent.$pixiApp
    this.$pixiStage = this.$parent.$pixiStage
    this.$pixiRenderer = this.$parent.$pixiRenderer
    this.$pixiTicker = this.$parent.$pixiTicker
    this.$pixiPidElmapList = this.$parent.$pixiPidElmapList
    this.$pixiPidScope = this.$parent.$pixiPidScope

    this.__drawData__ = {
      $vue: this
    }
    const pid = this.$options.propsData.pid
    if (pid) {
      this.$pixiPidElmapList.get(this.$pixiLevel)(pid, this)
      this.$pixiPidScope[pid] = this.__drawData__
    }
  },
  created () {
    const el = this.$pixiEl
    const ticker = this.$pixiTicker
    const propsData = this.$options.propsData
    // const pid = this.$options.propsData.pid
    this.$pixiParent.addChild(el);
    // 绑定事件
    [
      'added',
      'click',
      'mousedown',
      'mousemove',
      'mouseout',
      'mouseover',
      'mouseup',
      'mouseupoutside',
      'pointercancel',
      'pointerdown',
      'pointermove',
      'pointerout',
      'pointerover',
      'pointertap',
      'pointerup',
      'pointerupoutside',
      'removed',
      'rightclick',
      'rightdown',
      'rightup',
      'rightupoutside',
      'tap',
      'touchcancel',
      'touchend',
      'touchendoutside',
      'touchmove',
      'touchstart'
    ].forEach(eventName => {
      el.on(eventName, () => {
        // if (this.pointerEvents) {
        this.$emit(eventName)
        // }
      })
    })

    if (!propsData.hasOwnProperty('interactive')) {
      el.interactive = true
    }
    // 绑定自动按钮模式
    if (!propsData.hasOwnProperty('buttonMode')) {
      for (const eventName of [
        'click',
        'mousedown',
        'pointerdown',
        'tap',
        'touchstart'
      ]) {
        if (this._events[eventName]) {
          el.buttonMode = true
          break
        }
      }
    }

    // 绑定属性到PIXI元素上
    ['cursor', 'buttonMode', 'interactive'].forEach(propName => {
      this.$watch(
        propName,
        propVal => {
          el[propName] = propVal
        }, {
          immediate: true
        }
      )
    })

    // 需要动态计算的，无法委托给VUE了，只能通过PIXI自己的渲染器每一帧都进行计算了
    this.$watch('REALTIME_CALCULATION', REAL_TIME_CALCULATION => {
      console.log('REAL_TIME_CALCULATION', REAL_TIME_CALCULATION)
      if (REAL_TIME_CALCULATION) {
        ticker.add(this.draw)
      } else {
        ticker.remove(this.draw)
      }
    })

    /**
     * 以下关系到核心的布局绑定功能，
     * 可以剥离出来成为一个独立的函数，使得实现对于属性的重新绑定
     * 但是考虑到稳定性，目前觉得应该是另写一个DOM来替代
     */

    // 绑定绘制函数使用的计算属性
    this.$options._propKeys.forEach(key => {
      if (key === 'pid' || key === '$vue') {
        return
      }
      this.$resetCalcProp(key)
    });

    // 实现left、top、right、bottom与with、height之间的约束关系
    ['left', 'width', 'right'].forEach(key => {
      this.$watch(key, this.$resetCalcLWR.bind(this))
    });
    ['top', 'height', 'bottom'].forEach(key => {
      this.$watch(key, this.$resetCalcTHB.bind(this))
    })
    this.$resetCalcLWR()
    this.$resetCalcTHB()
  },
  methods: {
    $getEl (id) {
      const pidElmapList = this.$pixiPidElmapList
      var level = this.$pixiLevel
      // 先找同级的
      var res = pidElmapList[level](id)
      if (res) {
        return res
      }
      // 然后找父级的
      level -= 1
      while (level > 0) {
        res = pidElmapList[level](id)
        if (res) {
          return res
        }
        level -= 1
      }
      // 最后寻找子级的
      level = this.$pixiLevel
      level += 1
      while (level < pidElmapList.length) {
        res = pidElmapList[level](id)
        if (res) {
          return res
        }
        level += 1
      }
    },
    // 生成PID变量作用域，PID对应的对象有且只能有一个
    $generateScope () {
      const pidElmapList = this.$pixiPidElmapList
      var scope = null
      for (var i = pidElmapList.length - 1; i >= 0; i -= 1) {
        var currentLevelElmap = pidElmapList[i]
        if (currentLevelElmap) {
          scope = Object.create(scope)
          var currentLevelEls = currentLevelElmap()
          for (const pid in currentLevelEls) {
            scope[pid] = currentLevelEls[pid].__drawData__
          }
        }
      }
      return scope
    },
    // 获取计算属性的值
    $comProp (comProp) {
      if (comProp instanceof CalcProp) {
        this.REAL_TIME_CALCULATION = true
        return RUNWITHEVAL.call(this.__drawData__, this.$pixiPidScope, comProp.evalCode)
      } else {
        return comProp
      }
    },
    $calc,
    beforeDraw () {
      this.REAL_TIME_CALCULATION = false
    },
    $resetCalcProp (key) {
      Object.defineProperty(this.__drawData__, key, {
        configurable: true,
        get: () => {
          return this.$comProp(this[key])
        }
      })
    },
    $resetCalcLWR () {
      const drawData = this.__drawData__
      const propsData = this.$options.propsData
      const propsHasL = propsData.hasOwnProperty('left') && propsData.left !== '' && propsData.left !== null && propsData.left !== false
      const propsHasR = propsData.hasOwnProperty('right') && propsData.right !== '' && propsData.right !== null && propsData.right !== false
      const propsHasW = propsData.hasOwnProperty('width') && propsData.width !== '' && propsData.width !== null && propsData.width !== false
      const CUR_LRW = '' + propsHasL + propsHasR + propsHasW
      if (this.__CACHE_LRW__ === CUR_LRW) {
        return
      }
      this.__CACHE_LRW__ = CUR_LRW
      if (propsHasL && propsHasR) {
        if (propsHasW) {
          console.warn('left、right、width三个属性不可同时定义，默认忽视width属性')
        }
        const comProp = $calc('this.right - this.left')
        Object.defineProperty(drawData, 'width', {
          configurable: true,
          get: () => {
            return this.$comProp(comProp)
          }
        })
      } else if (propsHasL) {
        // propsHasL+width
        const comProp = $calc('this.left + this.width')
        Object.defineProperty(drawData, 'right', {
          configurable: true,
          get: () => {
            return this.$comProp(comProp)
          }
        })
      } else if (propsHasR) {
        // propsHasR+width
        const comProp = $calc('this.right - this.width')
        Object.defineProperty(drawData, 'left', {
          configurable: true,
          get: () => {
            return this.$comProp(comProp)
          }
        })
      }
    },
    $resetCalcTHB () {
      const drawData = this.__drawData__
      const propsData = this.$options.propsData
      const propsHasT = propsData.hasOwnProperty('top') && propsData.top !== '' && propsData.top !== null && propsData.top !== false
      const propsHasB = propsData.hasOwnProperty('bottom') && propsData.bottom !== '' && propsData.bottom !== null && propsData.bottom !== false
      const propsHasH = propsData.hasOwnProperty('height') && propsData.height !== '' && propsData.height !== null && propsData.height !== false
      const CUR_TBH = '' + propsHasT + propsHasB + propsHasH
      if (this.__CACHE_TBH__ === CUR_TBH) {
        return
      }
      this.__CACHE_TBH__ = CUR_TBH
      if (propsHasT && propsHasB) {
        if (propsHasH) {
          console.warn('top、bottom、height三个属性不可同时定义，默认忽视height属性')
        }
        const comProp = $calc('this.bottom - this.top')
        Object.defineProperty(drawData, 'height', {
          configurable: true,
          get: () => {
            return this.$comProp(comProp)
          }
        })
      } else if (propsHasT) {
        // propsHasT+height
        const comProp = $calc('this.top + this.height')
        Object.defineProperty(drawData, 'bottom', {
          configurable: true,
          get: () => {
            return this.$comProp(comProp)
          }
        })
      } else if (propsHasB) {
        // propsHasB+height
        const comProp = $calc('this.bottom - this.height')
        Object.defineProperty(drawData, 'top', {
          configurable: true,
          get: () => {
            return this.$comProp(comProp)
          }
        })
      }
    }
  },
  computed: {
    // left () {
    //   return this.x + this.width
    // },
    // bottom () {
    //   return this.y + this.height
    // }
  }
}
