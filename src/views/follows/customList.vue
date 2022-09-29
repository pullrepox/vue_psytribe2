<template>
    <div>
        <followLayout>
            <div class="grid_table custom_follow">
                <div class="item_row heading">
                    <div class="custom_ava"></div>
                    <div class="custom_name">
                        <span>Name</span>
                        <div class="sort">
                            <div class="asc"></div>
                            <div class="desc"></div>
                        </div>
                    </div>
                    <div class="custom_date_created">Date Created</div>
                    <div class="custom_user">Users</div>
                    <div class="more">
                        <span></span>
                    </div>
                </div>
                <div class="item_row data new_list" @click="newList">
                    <div class="custom_ava">
                        <span class="material-icons">add_circle_outline</span>
                    </div>
                    <div class="custom_name">New list</div>
                </div>
                <div class="item_row data">
                    <div class="custom_ava"></div>
                    <div class="custom_name">Producers willing to play</div>
                    <div class="custom_date_created">Juli 2022</div>
                    <div class="custom_user">52</div>
                    <div class="more">
                        <v-menu
                            transition="slide-y-transition"
                            :close-on-content-click="false"
                            :nudge-width="120"
                            offset-y
                            nudge-left="60"
                            nudge-bottom="15"
                            origin="top center"
                            content-class="menu-pointer charcoal"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <button type="button" v-ripple class="more_menu" v-bind="attrs" v-on="on"></button>
                            </template>
                            <v-list>
                                <v-list-item v-ripple>
                                    <button type="button">Add to queue</button>
                                </v-list-item>
                                <v-list-item v-ripple>
                                    <button type="button">Play next</button>
                                </v-list-item>
                                <v-list-item v-ripple disabled>
                                    <button type="button">Report</button>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </div>
                </div>

                <template v-if="FOLLOW_LOADER">
                    <v-skeleton-loader
                        type="image"
                        class="table_item_row"
                        v-for="index in 25"
                        :key="index"
                    ></v-skeleton-loader>
                </template>
            </div>

        </followLayout>

    </div>

</template>

<script>
import {mapActions, mapGetters} from "vuex";
import followLayout from "@/layouts/followLayout";

export default {
    name: "customList",
    components: {
        followLayout,
    },
    computed: {
        ...mapGetters(['FOLLOW_LOADER', 'CUSTOM_FOLLOWS']),
    },
    mounted() {
        this.$store.commit('SET_FOLLOW_LOADER', true);
        this.GET_CUSTOM_FOLLOWS()
            .then(() => {})
            .catch(err => console.log(`GET_CUSTOM_FOLLOWS, ${err}`))
            .finally(() =>  this.$store.commit('SET_FOLLOW_LOADER', false));
    },
    methods: {
        ...mapActions(['GET_CUSTOM_FOLLOWS']),

        newList() {
            console.log('new list');
        }
    }
}
</script>

<style scoped>

</style>