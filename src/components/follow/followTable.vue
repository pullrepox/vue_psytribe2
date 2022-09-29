<template>
    <div class="grid_table">
        <div class="item_row heading">
            <div class="ava">
                <div class="view_list"></div>
                <div class="view_map"></div>
            </div>
            <div class="name">
                <span>Name</span>
                <div class="sort">
                    <div class="asc"></div>
                    <div class="desc"></div>
                </div>
            </div>
            <div class="location">Location</div>
            <div class="role">Role</div>
            <div class="common">
                <span>in Common</span>
                <div class="sort">
                    <div class="asc"></div>
                    <div class="desc"></div>
                </div>
            </div>
            <div class="supporter">
                <span>Supporter</span>
                <div class="sort">
                    <div class="asc"></div>
                    <div class="desc"></div>
                </div>
            </div>
            <div class="followers">
                <span>Followers</span>
                <div class="sort">
                    <div class="asc"></div>
                    <div class="desc"></div>
                </div>
            </div>
            <div class="more">
                <span></span>
            </div>
        </div>

        <div class="item_row data" v-for="(item, index) in tableData" :key="item.id + index">
            <div class="ava">
                <img :src="apiUrl.slice(0, -1) + `${item.photo}`" alt="photo">
            </div>
            <div class="name">

<!--                <router-link :to="{'name'}"-->
                <router-link :to="{name: 'user-profile', params: {id: item.id}}" target="_blank">
                    {{item.fullName}}
                </router-link>
            </div>
            <div class="location">{{item.address}}</div>
            <div class="role">{{item.userRoles}}</div>
<!--            <div class="role">-->
<!--                <template v-if="item.isDj">-->
<!--                    <span>Dj</span>-->
<!--                    <span>, </span>-->
<!--                </template>-->
<!--                <template v-if="item.isProducer">-->
<!--                    <span>Producer</span>-->
<!--                    <span>, </span>-->
<!--                </template>-->
<!--                <template v-if="item.isPromoter">-->
<!--                    <span>Promoter</span>-->
<!--                    <span>, </span>-->
<!--                </template>-->
<!--                <template v-if="item.isVendor">-->
<!--                    <span>Vendor</span>-->
<!--                    <span>, </span>-->
<!--                </template>-->
<!--                <template v-if="item.isDecoArtist">-->
<!--                    <span>Deco Artist</span>-->
<!--                    <span>, </span>-->
<!--                </template>-->
<!--            </div>-->
            <div class="common">-</div>
            <div class="supporter">-</div>
            <div class="followers">{{item.followersCount}}</div>
            <div class="more">
                <button type="button" class="like"></button>
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

        <template v-if="!FOLLOW_LOADER && !tableData.length">
            <nothingHereYet></nothingHereYet>
        </template>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import nothingHereYet from "@/components/small/nothingHereYet";

export default {
    name: "followTable",
    props: ['tableData'],
    components: {
        nothingHereYet
    },
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            loader: false,
        }
    },
    computed: {
        ...mapGetters(['FOLLOW_LOADER']),
    },
    mounted() {
        this.loader = true;
        // console.log('tableData', this.tableData);
    }
}
</script>

<style lang="scss">

</style>