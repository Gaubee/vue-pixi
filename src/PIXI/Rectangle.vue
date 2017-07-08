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
    },
    beforeCreate() {
        this.$pixiEl = new PIXI.Graphics();
    },
    methods: {
        draw(el, drawData) {
            el.clear();
            el.beginFill(drawData.color, drawData.alpha);
            el.drawRect(0, 0, drawData.width, drawData.height);
            el.endFill();
        }
    }
}
</script>