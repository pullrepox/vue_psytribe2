<template>
    <followLayout>
        <followFilterBar></followFilterBar>
        <followTable :tableData="FOLLOWERS"></followTable>
    </followLayout>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

import followLayout from "@/layouts/followLayout";
import followFilterBar from "@/components/follow/followFilterBar";
import followTable from "@/components/follow/followTable";


export default {
    name: "followers",
    components: {
        followLayout,
        followFilterBar,
        followTable,
    },
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters(['FOLLOWS_FILTER', 'FOLLOWERS']),
    },
    mounted() {
        this.$store.commit('SET_FOLLOW_LOADER', true);
        this.GET_FOLLOWERS()
            .then(() => {})
            .catch(err => console.log(`GET_FOLLOWERS, ${err}`))
            .finally(() =>  this.$store.commit('SET_FOLLOW_LOADER', false));
    },
    methods: {
        ...mapActions(['GET_FOLLOWERS'])
    }
}
</script>

<style lang="scss">

</style>