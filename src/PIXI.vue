<template>
    <div class="pixi-canvas"
         ref="root">
        <slot></slot>
    </div>
</template>
<script>
import "./lib/pixi.min.js";

function ArrayWithDefault(defaultGenerator, ...args) {
    var res = [];
    res.get = function (index) {
        if (!res[index]) {
            res[index] = defaultGenerator(...args);
        }
        return res[index]
    }
    return res;
}
function MapWithSetter() {
    var res = {};
    return function (hash, obj) {
        if (arguments.length > 1) {
            if (!res[hash]) {
                res[hash] = obj;
            }
        } else if (arguments.length == 0) {
            return res;
        }
        return res[hash]
    }
}

export default {
    data() {
        return {}
    },
    beforeCreate() {
        this.$pixiApp = new PIXI.Application({});
        this.$pixiStage = this.$pixiApp.stage;
        const renderer = this.$pixiRenderer = this.$pixiApp.renderer;
        this.$pixiTicker = this.$pixiApp.ticker;
        this.$pixiLevel = 0;
        this.$pixiPidElmapList = ArrayWithDefault(MapWithSetter);
        this.$pixiPidScope = {
            get R_WIDTH(){
                return renderer.width
            },
            get R_HEIGHT(){
                return renderer.height
            }
        };

        // this.$pixiTicker.add(() => {
        //     console.log("lastTime", this.$pixiTicker.lastTime)
        // })
    },
    methods: {

    },
    mounted() {
        this.$refs.root.appendChild(this.$pixiApp.view);
    }
}
</script>
<style>
.pixi-canvas canvas {
    width: 100%;
    height: 100%;
}

.pixi-canvas>div {
    display: none;
}
</style>
