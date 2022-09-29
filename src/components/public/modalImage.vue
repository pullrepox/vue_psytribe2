<template>
    <div
        class="mj-modal-image"
        :class="{'image-zoom-in': isZoomIn, 'can-be-zoom': canBeZoom}"
        v-show="showModal"
        @click="hide"
        ref="image_modal">

        <div class="close-modal" @click="showModal = false">
            <span class="material-icons-outlined">close</span>
        </div>
        <div class="image-container" ref="image_container">
            <img
                :src="image"
                @click="zoom"
                ref="image"
                @load="canBeZoomCheck"
                class="mj-modal-main-image">
        </div>
    </div>
</template>


<script>
export default {
    name: "modalImage",

    props: {
        image: {
            default: ''
        }
    },

    data() {
        return {
            isZoomIn: false,
            canBeZoom: false,
            imageWidth: 0,
            imageHeight: 0,
            windowHeight: 0,
            showModal: false
        }
    },

    methods: {
        zoom() {
            if (this.canBeZoom) {
                this.isZoomIn = !this.isZoomIn;
            }
        },

        canBeZoomCheck() {
            if (this.$refs.image) {
                this.imageWidth = this.$refs.image.naturalWidth;
                this.imageHeight = this.$refs.image.naturalHeight;
                this.windowHeight = window.innerHeight;

                // image can be zoom if image height is greater than image width
                if (this.imageWidth < this.imageHeight) {
                    this.canBeZoom = true;
                }

                // center align image if image height is less than window height
                if(this.windowHeight > this.imageHeight) {
                    this.$refs.image_container.style.cssText = 'display: flex; justify-content: center; align-items: center;';
                }
            }
        },

        show() {
            this.showModal = true;
            document.addEventListener('keydown', this.hide)
        },

        hide() {
            // press escape on keyboard
            if (event.type === "keydown" && event.code === "Escape") {
                this.showModal = false;
                document.removeEventListener('keydown', this.hide)
            }

            // mouse click out of image
            let clickedElement = event.srcElement;
            if (event.type === "click" && !clickedElement.classList.contains('mj-modal-main-image')) {
                this.showModal = false;
                document.removeEventListener('keydown', this.hide)
            }
        }
    },

    watch: {
        showModal(val) {
            // improve main element z-index to show modal top of "To top page button"
            const mainElement = document.querySelector('main.v-main')

            if(val) {
                mainElement.style.cssText = 'position: relative; z-index: 10000;';
            } else {
                mainElement.style.cssText = '';
            }
        }
    }
}
</script>
