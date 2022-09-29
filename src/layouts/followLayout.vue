<template>
    <div class="p-follow">
        <v-container full-height class="full-height">
            <h2 class="_title">Your Network</h2>
            <div class="follow_nav">
                <router-link :to="{name: 'followers'}">Followers</router-link>
                <router-link :to="{name: 'followings'}">Following</router-link>
                <router-link :to="{name: 'customList'}">Custom list</router-link>

                <div class="custom_switch" @click="switchToggle()" :class="{'active': FOLLOWS_FILTER}" v-if="$router.currentRoute.name !== 'customList'">
                    Filter
                    <div class="switch_thumb"></div>
                </div>
            </div>
            <slot></slot>
        </v-container>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "followLayout",
    data () {
        return {
            followFilter: this.FOLLOWS_FILTER,
        }
    },
    computed: {
        ...mapGetters(['FOLLOWS_FILTER']),
    },
    mounted() {
       this.followFilter = this.FOLLOWS_FILTER;
    },
    methods: {
        switchToggle() {
            this.followFilter = !this.followFilter;
            this.$store.commit('SET_FOLLOWS_FILTER', this.followFilter);
        }
    }
}
</script>

<style lang="scss">
    .p-follow {
        height: 100%;
    }
</style>