<template>
    <div class="rectangle"
         :left="left"
         :top="top"
         :width="width"
         :height="height"
         :color="color"
         :alpha="alpha">
        <slot></slot>
    </div>
</template>

<script>
import PIXIMixin, { CalcProp } from './Mixin';
export default {
    mixins: [PIXIMixin],
    props: {
        color: { type: [Number, CalcProp], default: 0xffffff },
        alpha: { type: [Number, CalcProp], default: 1 },
    },
    beforeCreate() {
        this.$pixiEl = new PIXI.Graphics();
    },
    created() {
        this.draw();
    },
    beforeUpdate() {
        this.draw();
    },
    methods: {
        draw() {
            this.beforeDraw();
            const el = this.$pixiEl;
            const drawData = this.__drawData__;
            el.clear();
            el.beginFill(drawData.color, drawData.alpha);
            el.drawRect(drawData.left, drawData.top, drawData.width, drawData.height);
            el.endFill();
        }
    }
}
</script>