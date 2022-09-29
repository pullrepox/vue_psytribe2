<template>
    <div class="albums_list">
        <!-- HEAD GRID ALBUMS-->
        <template>
            <div class="head_grid_albums" v-if="SEARCH_VIEW_ALBUMS === 'grid'">
                <div class="select_view_albums">
                    <button type="button" class="view_list" @click="changeVisibleAlbums('list')" :class="{'active': SEARCH_VIEW_ALBUMS === 'list'}"></button>
                    <button type="button" class="view_grid" @click="changeVisibleAlbums('grid')" :class="{'active': SEARCH_VIEW_ALBUMS === 'grid'}"></button>
                </div>
                <div class="sortable">
                    <span>Sort by</span>

                    <v-menu
                        :close-on-content-click="true"
                        offset-y
                        nudge-left="0"
                        nudge-bottom="-3"
                        origin="top center"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <button type="button" class="sort_by_btn" v-bind="attrs" v-on="on" aria-role="list">
                                <template v-if="String(Object.keys(SEARCH_ALBUMS_ORDER_BY)) === 'order[title]'">Title</template>
                                <template v-if="String(Object.keys(SEARCH_ALBUMS_ORDER_BY)) === 'order[artist.name]'">Artist</template>
                                <template v-if="String(Object.keys(SEARCH_ALBUMS_ORDER_BY)) === 'order[releasedAt]'">Release Date</template>
                                <template v-if="String(Object.keys(SEARCH_ALBUMS_ORDER_BY)) === 'order[rating]'">Rating</template>
                                <span></span>
                            </button>
                        </template>
                        <v-list class="sort_by_list">
                            <v-list-item
                                v-for="(item, index) in sortByAlbums" :key="index">
                                <button type="button" @click="selectSortBy(item)">{{ item }}</button>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                </div>
            </div>

            <!-- HEAD LIST ALBUMS-->
            <headListAlbums
                v-if="SEARCH_VIEW_ALBUMS === 'list'"
                :viewAlbums="true"
                :which="'searchDetails'">
            </headListAlbums>
        </template>

        <div class="wrap_albums" :class="SEARCH_VIEW_ALBUMS">
            <template v-if="SEARCH_VIEW_ALBUMS === 'grid'">

                <template v-if="loader">
                    <albumGridSkeletonLoader v-for="index in 25" :key="index" :parent="'default_grid_albums'"></albumGridSkeletonLoader>
                </template>

                <template v-if="!loader">
                    <albumGrid
                        v-for="album in SEARCH_ALBUMS_RESULT"
                        :key="album.id"
                        :album="album"
                        :playZone="SEARCH_ALBUMS_RESULT">
                    </albumGrid>
                </template>
            </template>

            <template v-if="SEARCH_VIEW_ALBUMS === 'list'">
                <albumListSkeletonLoader v-if="loader" :count="25" :parent="'default_list_albums transparent'"></albumListSkeletonLoader>
                <template v-if="!loader">
                    <album
                        v-for="album in SEARCH_ALBUMS_RESULT"
                        :key="album.id"
                        :albumDetails="album"
                        :view="albumExpanded[album.id] ? '' : 'short'"
                        @changeVisibilityStatus="changeVisibilityStatus"
                        :albumLocation="'search'">
                    </album>
                </template>
            </template>

        </div>
        <searchAlbumsPagination v-if="SEARCH_ALBUMS_RESULT.length" :countAlbums="SEARCH_COUNT_ALBUMS"></searchAlbumsPagination>
        <v-progress-circular v-if="loader" :size="100" :width="3" color="#20C4F5" indeterminate></v-progress-circular>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

import headListAlbums from "../headListAlbums";
import albumGridSkeletonLoader from "@/components/small/skeleton-loaders/albumGridSkeletonLoader";
import albumListSkeletonLoader from "@/components/small/skeleton-loaders/albumListSkeletonLoader";
import albumGrid from '../albumGrid';
import album from '../album';

import searchAlbumsPagination from "../paginations/search/searchAlbumPagination";

export default {
    name: 'albumsSearchList',
    components: {
        headListAlbums,
        albumGridSkeletonLoader,
        albumListSkeletonLoader,
        album,
        albumGrid,
        searchAlbumsPagination
    },
    data() {
        return {
            loader: false,
            albumExpanded: {},
            sortByAlbums: ['Title', 'Artist', 'Release Date', 'Rating'],
        }
    },
    watch: {
        SEARCH_ALBUMS_ORDER_BY() {
            this.searchAlbums();
            this.$store.commit('SET_SEARCH_ALBUMS_CURRENT_PAGE', 1);
        },
        SEARCH_ALBUMS_CURRENT_PAGE() {
            this.searchAlbums();
            this.toTop();
        },
        SEARCH_VIEW_ALBUMS() {
            this.$store.commit('SET_ALBUM_EXPANDED', '');
        },
        SEARCH_STRING() {
            this.$store.commit('SET_SEARCH_ALBUMS_CURRENT_PAGE', 1);
        }
    },
    computed: {
        ...mapGetters([
            'SEARCH_ALBUMS_RESULT',
            'SEARCH_COUNT_ALBUMS',
            'SEARCH_VIEW_ALBUMS',
            'SEARCH_ALBUMS_ORDER_BY',
            'SEARCH_ALBUMS_CURRENT_PAGE',
            'SEARCH_STRING'
        ]),
    },
    methods: {
        ...mapActions(['SEARCH_ALBUMS', 'UPDATE_SEARCH_ALBUMS_ORDER_BY']),
        selectSortBy(selectSortByValue) {
            this.selectSortByValue = selectSortByValue;
            let direction = 'DESC';
            switch (selectSortByValue) {
                case 'Title':
                    this.$store.dispatch('UPDATE_SEARCH_ALBUMS_ORDER_BY', {'order[title]': `${direction}`});
                    break;
                case 'Artist':
                    this.$store.dispatch('UPDATE_SEARCH_ALBUMS_ORDER_BY', {'order[artist.name]': `${direction}`});
                    break;
                case 'Release Date':
                    this.$store.dispatch('UPDATE_SEARCH_ALBUMS_ORDER_BY', {'order[releasedAt]': `${direction}`});
                    break;
                case 'Rating':
                    this.$store.dispatch('UPDATE_SEARCH_ALBUMS_ORDER_BY', {'order[rating]': `${direction}`});
                    break;
            }
        },
        changeVisibilityStatus(id) {
            let [album] = Object.keys(this.albumExpanded).filter(expanded => this.albumExpanded[expanded]);
            if (+id !== +album) {
                this.albumExpanded[album] = false;
            }
            this.albumExpanded[id] = !this.albumExpanded[id];
        },
        changeVisibleAlbums(value) {
            this.$store.commit('SET_SEARCH_VIEW_ALBUMS', value);
        },
        searchAlbums() {
            this.loader = true;
            const search = {'title': this.SEARCH_STRING};
            const page = {'page': this.SEARCH_ALBUMS_CURRENT_PAGE};
            let params = Object.assign(search, page, this.SEARCH_ALBUMS_ORDER_BY);
            this.SEARCH_ALBUMS(params)
                .then(() => {

                })
                .catch(err => console.log(`searchAlbums, ${err}`))
                .finally(() => {
                    this.loader = false;
                })
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

<style scoped>

</style>
