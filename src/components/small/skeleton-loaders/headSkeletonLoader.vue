<template>
    <div class="skeleton-loader" :class="parent">

        <div class="left_img">
            <v-skeleton-loader type="image" class="skeleton_photo"></v-skeleton-loader>
        </div>

        <div class="right_info">
            <v-skeleton-loader type="image" class="line_215"></v-skeleton-loader>
            <v-skeleton-loader type="image" class="line_230"></v-skeleton-loader>
            <v-skeleton-loader type="image" class="line_330"></v-skeleton-loader>
            <v-skeleton-loader type="image" class="line_190"></v-skeleton-loader>
            <v-skeleton-loader type="image" class="line_190"></v-skeleton-loader>
            <v-skeleton-loader type="image" class="line_description"></v-skeleton-loader>
        </div>
    </div>
</template>

<script>
export default {
    name: "headSkeletonLoader",
    props: ['parent']
}
</script>

<style scoped>

</style>