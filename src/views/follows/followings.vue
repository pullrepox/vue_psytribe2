<template>
    <followLayout>
        <followFilterBar></followFilterBar>
        <followTable :tableData="FOLLOWINGS"></followTable>
    </followLayout>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

import followLayout from "@/layouts/followLayout";
import followFilterBar from "@/components/follow/followFilterBar";
import followTable from "@/components/follow/followTable";

export default {
    name: "followings",
    components: {
        followLayout,
        followFilterBar,
        followTable
    },
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters(['FOLLOWS_FILTER', 'FOLLOWINGS']),
    },
    mounted() {
        this.$store.commit('SET_FOLLOW_LOADER', true);
        this.GET_FOLLOWINGS()
            .then(() => {})
            .catch(err => console.log(`GET_FOLLOWINGS, ${err}`))
            .finally(() =>  this.$store.commit('SET_FOLLOW_LOADER', false));
    },
    methods: {
        ...mapActions(['GET_FOLLOWINGS'])
    }
}
</script>

<style scoped>

</style>