<template>
    <div class="skeleton-loader" :class="parent">
        <v-skeleton-loader
            type="image"
            class="item_track"
            v-for="index in count"
            :key="index"
        ></v-skeleton-loader>
    </div>
</template>

<script>
export default {
    name: "playlistSkeletonLoader",
    props: ['parent', 'count']
}
</script>

<style scoped>
/*album-details-playlist*/
</style>