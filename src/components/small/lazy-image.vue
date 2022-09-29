<template>
<div>
    <img
        v-if="src"
        :class="imgIsLoaded ? 'show' : ''"
        :src="src"
        loading="lazy"
        @load="imgLoadedMethod"
    >
</div>

<!--    <div class="album_cover_image">-->
<!--        <v-lazy-image-->
<!--            :src="src"-->
<!--            :src-placeholder="placeholder">-->
<!--        </v-lazy-image>-->
<!--        <v-skeleton-loader-->
<!--            type="image, list-item-two-line"-->
<!--            class="item_grid_album"-->
<!--        ></v-skeleton-loader>-->
<!--    </div>-->
</template>

<script>
// import VLazyImage from "v-lazy-image/v2";
export default {
    name: "lazy-image",
    components: {
        // VLazyImage
    },
    props: ['src', 'srcPlaceholder'],
    data () {
        return {
            imgIsLoaded: false,
        }
    },
    created: {
    },
    methods: {
        imgLoadedMethod () {
            this.imgIsLoaded = true;
        }
    }
}
</script>

<style scoped>
img {
    opacity: 0;
    transition: 0.4s;
}
img.show {
    opacity: 1;
}
/* Zoom-In */
/*.v-lazy-image {*/
/*    opacity: 0;*/
/*    transform: scale3d(0.3, 0.3, 0.3);*/
/*    transition: opacity 0.5s, transform 0.5s;*/
/*}*/
/*.v-lazy-image-loaded {*/
/*    opacity: 1;*/
/*    transform: translate3d(0, 0, 0);*/
/*}*/

/* fadeIn */
/*.v-lazy-image {*/
/*    filter: blur(5px);*/
/*    transition: filter 1s;*/
/*    will-change: filter;*/
/*}*/
/*.v-lazy-image-loaded {*/
/*    filter: blur(0);*/
/*}*/
</style>