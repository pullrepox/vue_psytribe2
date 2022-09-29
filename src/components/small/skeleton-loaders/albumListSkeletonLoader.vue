<template>
    <div class="skeleton-loader" :class="parent">
        <v-skeleton-loader
            type="image"
            class="item_list_albums"
            v-for="index in count"
            :key="index"
        ></v-skeleton-loader>
    </div>

</template>

<script>
export default {
    name: "albumListSkeletonLoader",
    props: ['count', 'parent']
}
</script>

<style scoped>
.item_list_albums {
    height: 55px;
    margin-top: 5px;
}
</style>