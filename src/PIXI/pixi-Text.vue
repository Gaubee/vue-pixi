<template>
    <div class="rectangle"
         :text="text">
        <slot></slot>
    </div>
</template>
<script>
import PIXIMixin, { CalcProp } from './Mixin';
export default {
    mixins: [PIXIMixin],
    props: {
        text: { type: [String, CalcProp], default: "csacs" },
        color: { type: [Number, CalcProp], default: 0xffffff },
    },
    beforeCreate() {
        this.__style = new PIXI.TextStyle({
            fill:0xffffff
        })
        this.$pixiEl = new PIXI.Text("", this.__style);
    },
    methods: {
        draw(el, drawData) {
            el.text = drawData.text;
        }
    },
    watch: {
        text(new_text) {
            console.log("new_text", new_text)
        },
        color(new_color) {
            console.log("new_color", new_color)
        }
    }
}
</script>