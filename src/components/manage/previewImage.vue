<template>
    <div class="preview-image">
        <div class="image-thumbnail" @click="zoomed = true">
            <v-img
                lazy-src="https://via.placeholder.com/158"
                :width="width"
                :height="height"
                :src="src"
            ></v-img>
        </div>
        <div v-if="zoomed" class="zoom-box" @click.stop="zoomed = false">
            <div class="image-container" @click.stop="zoomed = true">
                <img alt="" :src="src">
                <a class="close" @click.stop="zoomed = false"></a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'preview-image',
    props: {
        'src': String,
        'width': {
            type: Number,
            default: 158
        },
        'height': {
            type: Number,
            default: 158
        },
    },
    data() {
        return {
            zoomed: false,
        }
    },
}
</script>

<style lang="scss">
.preview-image {
    position: relative;

    .image-thumbnail {
        border: 1px solid #5F6986;
        border-radius: 5px;
        overflow: hidden;
        cursor: pointer;

        &:after {
            content: '';
            position: absolute;
            display: none;
            width: 100%;
            height: 100%;
            border-radius: 5px;
            top: 0;
            left: 0;
            z-index: 5;
            background: url('~@/assets/img/upload-verification/zoom-in-layer.svg') no-repeat center center;
        }

        &:hover {
            &:after {
                display: block;
            }
        }
    }

    .zoom-box {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: rgba(0,0,0, 0.5);
        z-index: 10;

        .image-container {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            max-height: 100%;
            max-width: 100%;

            img {
                max-height: 100%;
                max-width: 100%;
            }

            .close {
                position: absolute;
                right: 10px;
                top: 10px;
                display: block;
                width: 40px;
                height: 40px;
                background: url('~@/assets/img/upload-verification/close-box.svg') no-repeat center center;
            }
        }
    }
}

</style>
