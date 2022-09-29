<template>
    <div class="track_list">
        <div class="head_tracks_list">
            <div class="_left_">
                <div class="title_">Title
                    <div class="sort">
                        <span class="material-icons" :class="{active: currentOrderBy === 'title_asc'}" @click="orderBy('title', 'asc')">arrow_drop_up</span>
                        <span class="material-icons" :class="{active: currentOrderBy === 'title_desc'}" @click="orderBy('title', 'desc')">arrow_drop_down</span>
                    </div>
                </div>
                <div class="artist_">Artist
                    <div class="sort">
                        <span class="material-icons" :class="{active: currentOrderBy === 'artist_asc'}" @click="orderBy('artist', 'asc')">arrow_drop_up</span>
                        <span class="material-icons" :class="{active: currentOrderBy === 'artist_desc'}"
                              @click="orderBy('artist', 'desc')">arrow_drop_down</span>
                    </div>
                </div>
                <div class="released_">Released
                    <div class="sort">
                        <span class="material-icons" :class="{active: currentOrderBy === 'released_asc'}"
                              @click="orderBy('released', 'asc')">arrow_drop_up</span>
                        <span class="material-icons" :class="{active: currentOrderBy === 'released_desc'}"
                              @click="orderBy('released', 'desc')">arrow_drop_down</span>
                    </div>
                </div>
                <div class="rating_">Rating
                    <div class="sort">
                        <span class="material-icons" :class="{active: currentOrderBy === 'rating_asc'}" @click="orderBy('rating', 'asc')">arrow_drop_up</span>
                        <span class="material-icons" :class="{active: currentOrderBy === 'rating_desc'}"
                              @click="orderBy('rating', 'desc')">arrow_drop_down</span>
                    </div>
                </div>
                <div class="bpm_">BPM
                    <div class="sort">
                        <span class="material-icons" :class="{active: currentOrderBy === 'bpm_asc'}" @click="orderBy('bpm', 'asc')">arrow_drop_up</span>
                        <span class="material-icons" :class="{active: currentOrderBy === 'bpm_desc'}" @click="orderBy('bpm', 'desc')">arrow_drop_down</span>
                    </div>
                </div>
            </div>
        </div>

        <template v-if="!loader">
            <itemTrack
                v-for="(track, index) in SEARCH_TRACKS_RESULT"
                :key="track.id"
                :track="track"
                :index="index">
            </itemTrack>
        </template>

        <template v-if="loader">
            <v-skeleton-loader
                type="image"
                class="item_track_list"
                v-for="index in 25"
                :key="index"
            ></v-skeleton-loader>
        </template>
        <searchTracksPagination v-if="SEARCH_TRACKS_RESULT.length" :countTracks="SEARCH_COUNT_TRACKS"></searchTracksPagination>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import itemTrack from "@/components/itemTrack";
import searchTracksPagination from "../paginations/search/searchTracksPagination";

export default {
    name: 'tracksSearchList',
    components: {
        searchTracksPagination,
        itemTrack
    },
    data() {
        return {
            loader: false,
            currentOrderBy: 'released_desc'
        }
    },
    watch: {
        SEARCH_TRACKS_ORDER_BY() {
            this.getTracks();
            this.$store.commit('SET_SEARCH_TRACKS_CURRENT_PAGE', 1);
        },
        SEARCH_TRACKS_CURRENT_PAGE() {
            this.getTracks();
            this.toTop();
        },
        SEARCH_STRING() {
            this.$store.commit('SET_SEARCH_TRACKS_CURRENT_PAGE', 1);
        }
    },
    computed: {
        ...mapGetters([
            'SEARCH_STRING',
            'SEARCH_TRACKS_RESULT',
            'SEARCH_COUNT_TRACKS',
            'SEARCH_TRACKS_CURRENT_PAGE',
            'SEARCH_TRACKS_ORDER_BY',
        ]),
    },
    mounted() {

    },
    methods: {
        ...mapActions(['SEARCH_TRACKS']),

        getTracks() {
            this.loader = true;
            let trackParams;

            const title = this.SEARCH_STRING ? {'title': this.SEARCH_STRING} : '';
            const page = this.SEARCH_TRACKS_CURRENT_PAGE ? {page: this.SEARCH_TRACKS_CURRENT_PAGE} : null;
            trackParams = Object.assign(title, page, this.SEARCH_TRACKS_ORDER_BY);

            this.SEARCH_TRACKS(trackParams)
                .then(() => {})
                .catch(err => console.log(`getTracks, ${err}`))
                .finally(() => this.loader = false);
        },

        orderBy: function (key, direction) {
            this.currentOrderBy = `${key}_${direction}`;

            if (key && direction) {
                switch (key) {
                    case 'title':
                        this.$store.commit('SET_SEARCH_TRACKS_ORDER_BY', {'order[title]': `${direction}`});
                        break;
                    case 'artist':
                        this.$store.commit('SET_SEARCH_TRACKS_ORDER_BY', {'order[artist.name]': `${direction}`});
                        break;
                    case 'released':
                        this.$store.commit('SET_SEARCH_TRACKS_ORDER_BY', {'order[releasedAt]': `${direction}`});
                        break;
                    case 'rating':
                        this.$store.commit('SET_SEARCH_TRACKS_ORDER_BY', {'order[rating]': `${direction}`});
                        break;
                    case 'bpm':
                        this.$store.commit('SET_SEARCH_TRACKS_ORDER_BY', {'order[bpm]': `${direction}`});
                        break;
                }
            }
        },
        toTop: function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },
    }
}
</script>

<style lang="scss">
.track_list {
    .item_track_list {
        height: 50px;
        margin-bottom: 6px;
        border-radius: 50px;
    }
}
</style>
