<template>
    <div class="advertisement">
        <div class="advertisement-title">Advertisement</div>
        <Adsense
            ins-style=""
            :data-ad-client=client
            :data-ad-slot=slot
            data-ad-format="horizontal"
            data-full-width-responsive=true>
        </Adsense>
    </div>

</template>

<script>
export default {
    name: "googleAdsense",
    props: [],
    data() {
        return {
            client: process.env.VUE_APP_ADSENSE_CLIENT,
            slot: process.env.VUE_APP_ADSENSE_SLOT
        }
    },
    mounted() {
    }
}
</script>

<style scoped>

</style>
