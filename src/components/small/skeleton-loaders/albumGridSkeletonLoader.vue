<template>
    <div class="skeleton-loader" :class="parent">
        <v-skeleton-loader
            type="image, list-item-two-line"
            class="item_grid_album">
        </v-skeleton-loader>
    </div>
</template>

<script>
export default {
    name: "albumGridSkeletonLoader",
    props: ['parent']
}
</script>

<style lang="scss">
.skeleton-loader {
    width: 100%;
}
</style>