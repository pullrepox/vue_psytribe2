<template>
    <div class="albums_list" :class="{'discovery_mode' : DISCOVERY}">
        <template v-if="defer(3)">
            <div class="head_grid_albums" v-if="VIEW_ALBUMS === 'grid' && STATUS_FILTER === true">
                <div class="select_view_albums">
                    <button type="button" v-ripple class="view_list" @click="changeVisibleAlbums('list')" :class="{'active': VIEW_ALBUMS === 'list'}"></button>
                    <button type="button" v-ripple class="view_grid" @click="changeVisibleAlbums('grid')" :class="{'active': VIEW_ALBUMS === 'grid'}"></button>
                </div>
                <div class="sortable">
                    <span>Top Rated</span>

                    <v-menu
                        :close-on-content-click="true"
                        offset-y
                        nudge-left="0"
                        nudge-bottom="-3"
                        origin="top center"
                        content-class="yankees"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <button type="button" class="sort_by_btn" v-bind="attrs" v-on="on" aria-role="list">
                                <template v-if="String(Object.keys(ORDER_BY)) === 'order[title]'">Title</template>
                                <template v-if="String(Object.keys(ORDER_BY)) === 'order[artist.name]'">Artist
                                </template>
                                <template v-if="String(Object.keys(ORDER_BY)) === 'order[releasedAt]'">Release Date
                                </template>
                                <template v-if="String(Object.keys(ORDER_BY)) === 'order[rating]'">Rating</template>
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
            <headListAlbums v-if="VIEW_ALBUMS === 'list' && STATUS_FILTER === true" :viewAlbums="true" :which="'explore'"></headListAlbums>
        </template>

        <div class="wrap_albums" :class="VIEW_ALBUMS">

            <!-- GRID ALBUMS-->
            <template v-if="VIEW_ALBUMS === 'grid'">
                <template v-if="loader === true">
                    <albumGridSkeletonLoader v-for="index in 30" :key="index" :parent="'default_grid_albums'"></albumGridSkeletonLoader>
                </template>

                <template v-if="loader === false">
                    <albumGrid
                        v-for="album in EXPLORE_GRID_ALBUMS"
                        :key="album.id + ALBUMS_DYNAMIC_KEY"
                        :album="album"
                        :discoveryStatus="DISCOVERY"
                        :playZone="EXPLORE_GRID_ALBUMS">
                    </albumGrid>
                </template>
            </template>


            <!-- LIST ALBUMS-->
            <template v-if="defer(3) && VIEW_ALBUMS === 'list'">
                <template v-if="loader === true">
                    <albumListSkeletonLoader :count="25" :parent="'default_list_albums'"></albumListSkeletonLoader>
                </template>

                <template v-if="loader === false">
                    <albumList
                        v-for="(album, index) in EXPLORE_GRID_ALBUMS"
                        :key="album.id + ALBUMS_DYNAMIC_KEY"
                        :albumDetails="album"
                        :view="albumExpanded[album.id] ? '' : 'short'"
                        @changeVisibilityStatus="changeVisibilityStatus"
                        :discoveryStatus="DISCOVERY"
                        :index="index"
                        :playZone="EXPLORE_GRID_ALBUMS"
                        :albumLocation="'explore'">
                    </albumList>
                </template>
            </template>

        </div>
        <template v-if="loader === false && !EXPLORE_GRID_ALBUMS.length">
            <nothingHereYet></nothingHereYet>
        </template>
        <albumPagination v-if="EXPLORE_GRID_ALBUMS.length" :countAlbums="COUNT_EXPLORE_GRID_ALBUMS"></albumPagination>
    </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import Defer from '@/utils/defer';

import albumGrid from '../albumGrid';
import headListAlbums from "../headListAlbums";
import albumList from '../album';
import albumPagination from "../paginations/explore/albumPagination";
import albumGridSkeletonLoader from "@/components/small/skeleton-loaders/albumGridSkeletonLoader";
import albumListSkeletonLoader from "@/components/small/skeleton-loaders/albumListSkeletonLoader";
import nothingHereYet from "@/components/small/nothingHereYet";

export default {
    name: 'albumsList',
    components: {
        headListAlbums,
        albumList,
        albumGrid,
        albumPagination,
        albumGridSkeletonLoader,
        albumListSkeletonLoader,
        nothingHereYet
    },
    mixins: [
        Defer()
    ],
    data() {
        return {
            loader: false,
            albumExpanded: {},
            dynamicAlbumKey: 0,
            selectSortByValue: '',
            sortByAlbums: ['Title', 'Artist', 'Release Date', 'Rating'],
        };
    },
    watch: {
        SUBGENRE() {
            console.log('SUBGENRE');
            this.CLEAN_EXPLORE_GRID_ALBUMS();
            this.$store.commit('SET_ALBUMS_CURRENT_PAGE', 1);
            this.$store.commit('SET_ALBUM_EXPANDED', '');
            this.selectAlbums();
        },
        TAGS() {
            console.log('TAGS');
            this.CLEAN_EXPLORE_GRID_ALBUMS();
            this.$store.commit('SET_ALBUMS_CURRENT_PAGE', 1);
            this.selectAlbums();
        },
        ORDER_BY() {
            console.log('ORDER_BY');
            this.CLEAN_EXPLORE_GRID_ALBUMS();
            this.$store.commit('SET_ALBUMS_CURRENT_PAGE', 1);
            this.selectAlbums();
        },
        ALBUMS_CURRENT_PAGE() {
            console.log('ALBUMS_CURRENT_PAGE');
            this.CLEAN_EXPLORE_GRID_ALBUMS();
            this.selectAlbums();
            this.$store.commit('SET_ALBUM_EXPANDED', '');
            this.scrollTop();
        },
        DISCOVERY() {
            console.log('DISCOVERY');
            this.CLEAN_EXPLORE_GRID_ALBUMS();
            this.$store.commit('SET_ALBUMS_CURRENT_PAGE', 1);
            this.selectAlbums();
        },
        VIEW_ALBUMS() {
            this.$store.commit('SET_ALBUM_EXPANDED', '');
        },
        UPPER_FILTER() {
            this.CLEAN_EXPLORE_GRID_ALBUMS();
            this.selectAlbums();
        }
    },
    computed: {
        ...mapGetters([
            'AUTH_DATA',
            'STATUS_FILTER',
            'VIEW_ALBUMS',
            'ALBUM_EXPANDED',
            'MUSIC_RELEASE', 'COUNT_MUSIC_RELEASE', 'ALBUMS_CURRENT_PAGE', 'SEARCH_ALBUMS_RESULT',
            'EXPLORE_GRID_ALBUMS', 'COUNT_EXPLORE_GRID_ALBUMS',
            'ORDER_BY',
            'SEARCH_STRING',
            'UPPER_FILTER',
            'SUBGENRE',
            'TAGS',
            'ALBUMS_DYNAMIC_KEY',
            'DISCOVERY',
            'PLAYED_MUSIC_RELEASE',
            'UPDATE_EXPLORE_ALBUMS'
        ]),
    },

    mounted() {
        if (!this.EXPLORE_GRID_ALBUMS.length || this.TAGS.length || this.UPDATE_EXPLORE_ALBUMS === true) {
            this.selectAlbums();
        }
    },

    methods: {
        ...mapActions([
            'GET_MUSIC_RELEASE', 'CLEAN_EXPLORE_GRID_ALBUMS', 'CLEAN_MUSIC_RELEASE',
            'SEARCH_ALBUMS',
            'GET_EXPLORE_GRID_ALBUMS',
            'GET_PLAYED_MUSIC_RELEASE'
        ]),

        changeVisibilityStatus(id) {
            let [album] = Object.keys(this.albumExpanded).filter(expanded => this.albumExpanded[expanded]);
            if (+id !== +album) {
                this.albumExpanded[album] = false;
            }
            this.albumExpanded[id] = !this.albumExpanded[id];
        },
        changeVisibleAlbums(value) {
            this.$store.commit('SET_VIEW_ALBUMS', value);
        },

        selectAlbums() {
            const subGenre = {'subGenres': this.SUBGENRE.id};
            const tags = this.TAGS ? {'multiple_search_tags': this.TAGS} : [];
            const page = this.ALBUMS_CURRENT_PAGE ? {page: this.ALBUMS_CURRENT_PAGE} : 1;
            const discovery = this.DISCOVERY ? {'exists[playedMusicReleases.user]': false} : '';
            const limit = {limit: 30};

            let params;

            if (this.UPPER_FILTER === 'undiscovered') {
                params = Object.assign(subGenre, tags, this.ORDER_BY, limit, discovery, page);
                params['exists[playedMusicReleases.user]'] = false;
            }
            if (this.UPPER_FILTER === 'newest') {
                params = Object.assign(subGenre, tags, this.ORDER_BY, limit, page);
            }
            if (this.UPPER_FILTER === 'popular') {
                return false;
                // params = Object.assign({'order[rating1]': 'DESC'}, subGenre, tags, discovery, limit, page);
            }
            if (this.UPPER_FILTER === 'trending') {
                return false;
                // params = Object.assign({'order[rating2]': 'DESC'}, subGenre,tags, discovery, limit, page);
            }
            if (this.UPPER_FILTER === 'topRated') {
                params = Object.assign({'order[rating3]': 'DESC'}, subGenre, tags, limit, page);
            }

            // if (!this.UPPER_FILTER || this.UPPER_FILTER === 'newest') {
            //     params = Object.assign(subGenre, tags, this.ORDER_BY, limit, discovery, page);
            // } else {
            //     if (this.UPPER_FILTER === 'popular') {
            //         params = Object.assign({'order[rating1]': 'DESC'}, subGenre, tags, discovery, limit, page);
            //     }
            //     if (this.UPPER_FILTER === 'trending') {
            //         params = Object.assign({'order[rating2]': 'DESC'}, subGenre,tags, discovery, limit, page);
            //     }
            //     if (this.UPPER_FILTER === 'topRated') {
            //         params = Object.assign({'order[rating3]': 'DESC'}, subGenre, tags, limit, discovery, page);
            //     }
            // }


            this.loader = true;
            this.GET_EXPLORE_GRID_ALBUMS(params)
                .then(() => {
                    this.dynamicAlbumKey += 1;
                    this.$store.commit('UPDATE_ALBUMS_DYNAMIC_KEY', this.dynamicAlbumKey);
                    this.$store.commit('SET_UPDATE_EXPLORE_ALBUMS', false);
                    if (this.VIEW_ALBUMS === 'list') {
                        this.EXPLORE_GRID_ALBUMS.forEach(album => {
                            this.$set(this.albumExpanded, album.id, false);
                        });
                    }
                })
                .catch(err => {
                    console.log(`GET_EXPLORE_GRID_ALBUMS, ${err}`);
                })
                .finally(() => {
                    this.loader = false;
                });
        },
        selectSortBy(selectSortByValue) {
            this.selectSortByValue = selectSortByValue;
            let direction = 'DESC';
            switch (selectSortByValue) {
                case 'Title':
                    this.$store.dispatch('UPDATE_ORDER_BY', {'order[title]': `${direction}`});
                    break;
                case 'Artist':
                    this.$store.dispatch('UPDATE_ORDER_BY', {'order[artist.name]': `${direction}`});
                    break;
                case 'Release Date':
                    this.$store.dispatch('UPDATE_ORDER_BY', {'order[releasedAt]': `${direction}`});
                    break;
                case 'Rating':
                    this.$store.dispatch('UPDATE_ORDER_BY', {'order[rating]': `${direction}`});
                    break;
                default: this.$store.dispatch('UPDATE_ORDER_BY', {'order[releasedAt]': `${direction}`});
            }
        },
        scrollTop() {
            const el = document.getElementById('explore-nav-id');
            if (el) {
                el.scrollIntoView({behavior: 'smooth'});
            }
        },
    },
};
</script>
