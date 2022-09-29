<template>
    <div>
        <!-- ***** ALBUMS ***** -->
        <template v-if="showAlbumsOrTracks === 'albums'">
            <div class="albums_list">
                <div class="head_grid_albums" v-if="(viewAlbums === 'grid' && !mobile) || (libraryFilter && mobile)">
                    <div class="select_view_albums">
                        <button type="button" v-ripple class="view_list" @click="changeVisibleAlbums('list')" :class="{'active': viewAlbums === 'list'}"></button>
                        <button type="button" v-ripple class="view_grid" @click="changeVisibleAlbums('grid')" :class="{'active': viewAlbums === 'grid'}"></button>
                    </div>
                    <div class="sortable">
                        <span>Sort by</span>

<!--                        <v-menu-->
<!--                            :close-on-content-click="true"-->
<!--                            offset-y-->
<!--                            nudge-left="0"-->
<!--                            nudge-bottom="-3"-->
<!--                            origin="top center"-->
<!--                            content-class="yankees"-->
<!--                        >-->
<!--                            <template v-slot:activator="{ on, attrs }">-->
<!--                                <button type="button" class="sort_by_btn" v-bind="attrs" v-on="on" aria-role="list">-->
<!--                                    <template v-if="String(Object.keys(ORDER_BY)) === 'order[title]'">Title</template>-->
<!--                                    <template v-if="String(Object.keys(ORDER_BY)) === 'order[artist.name]'">Artist-->
<!--                                    </template>-->
<!--                                    <template v-if="String(Object.keys(ORDER_BY)) === 'order[releasedAt]'">Release Date-->
<!--                                    </template>-->
<!--                                    <template v-if="String(Object.keys(ORDER_BY)) === 'order[rating]'">Rating</template>-->
<!--                                    <span></span>-->
<!--                                </button>-->
<!--                            </template>-->
<!--                            <v-list class="sort_by_list">-->
<!--                                <v-list-item-->
<!--                                    v-for="(item, index) in sortByAlbums" :key="index">-->
<!--                                    <button type="button" @click="selectSortBy(item)">{{ item }}</button>-->
<!--                                </v-list-item>-->
<!--                            </v-list>-->
<!--                        </v-menu>-->

                    </div>
                </div>
                <headAlbums v-if="viewAlbums === 'list'" :viewAlbums="true" :which="'library'" :hideLike="true"></headAlbums>

                <div class="wrap_albums" :class="viewAlbums">

                    <!-- ***** GRID ALBUMS ***** -->
                    <template v-if="viewAlbums === 'grid'">
                        <template v-if="loader === true">
                            <albumGridSkeletonLoader v-for="index in 30" :key="index" :parent="'default_grid_albums transparent'"></albumGridSkeletonLoader>
                        </template>

                        <template v-if="loader === false">
                            <albumGrid
                                v-for="album in FAVOURITE_MUSIC_RELEASE"
                                :key="album.id"
                                :album="album"
                                :discoveryStatus="DISCOVERY"
                                :isFavouriteSong="'favourite'"
                                :playOnlyLikedTracks="true"
                                :hideLike="true"
                                :playZone="FAVOURITE_MUSIC_RELEASE">
                            </albumGrid>
                        </template>
                    </template>

                     <!-- ***** LIST ALBUMS ***** -->
                    <template v-if="viewAlbums === 'list'">
                        <template v-if="loader === true">
                            <albumListSkeletonLoader :count="25" :parent="'default_list_albums transparent'"></albumListSkeletonLoader>
                        </template>
                        <template v-if="loader === false">
                            <albumList
                                v-for="(album, index) in FAVOURITE_MUSIC_RELEASE"
                                :key="album.id"
                                :albumDetails="album"
                                :view="albumExpanded[album.id] ? '' : 'short'"
                                @changeVisibilityStatus="changeVisibilityStatus"
                                :discoveryStatus="DISCOVERY"
                                :isFavouriteSong="'favourite'"
                                :playOnlyLikedTracks="true"
                                :index="index"
                                :hideLike="true"
                                :playZone="FAVOURITE_MUSIC_RELEASE"
                                :albumLocation="'library'">
                            </albumList>
                        </template>
                    </template>

                </div>
                <template v-if="!FAVOURITE_MUSIC_RELEASE.length && loader === false">
                    <nothingHereYet></nothingHereYet>
                </template>

            </div>
<!--            <albumPagination v-if="FAVOURITE_MUSIC_RELEASE.length" :countAlbums="10"></albumPagination>-->
        </template>

        <!-- ***** LIST ***** -->
        <template v-if="showAlbumsOrTracks === 'tracks'">
            <div class="track_list">
                <template v-if="!loaderTracks">
                    <itemTrack
                        v-for="(track, index) in FAVOURITE_TRACKS"
                        :key="track.id + dynamicTrackKey"
                        :track="track.song"
                        :index="index"
                    ></itemTrack>
                </template>

                <template v-if="loaderTracks">
                    <v-skeleton-loader
                        type="image"
                        class="item_track_list"
                        v-for="index in 25"
                        :key="index"
                    ></v-skeleton-loader>
                </template>
                <template v-if="!FAVOURITE_TRACKS.length && !loaderTracks">
                    <nothingHereYet></nothingHereYet>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

import headAlbums from '@/components/headListAlbums';
import albumGrid from '../../components/albumGrid';
import albumList from "@/components/album";
import itemTrack from "@/components/itemTrack";
import nothingHereYet from "@/components/small/nothingHereYet";
import albumGridSkeletonLoader from "@/components/small/skeleton-loaders/albumGridSkeletonLoader";
import albumListSkeletonLoader from "@/components/small/skeleton-loaders/albumListSkeletonLoader";

import changeVisibleAlbum from "@/mixins/changeVisibleAlbum";
import isMobile from "@/mixins/isMobile";
import albumPagination from '@/components/paginations/library/albumPagination';

import Defer from "@/utils/defer";

export default {
    name: "collection",
    components: {
        headAlbums,
        albumGrid,
        albumList,
        itemTrack,
        nothingHereYet,
        albumGridSkeletonLoader,
        albumListSkeletonLoader,
        albumPagination
    },
    mixins: [
        changeVisibleAlbum,
        isMobile
    ],
    data() {
        return {
            loader: false,
            loaderTracks: false,
            showAlbumsOrTracks: 'albums',
            dynamicTrackKey: 0,
            albumExpanded: {},
            albumsPage: 1,
        }
    },
    watch: {
        subgenre() {
            this.$store.commit('SET_ALBUM_EXPANDED', '');
            if (this.showAlbumsOrTracks === 'albums') {
                this.selectFavoriteAlbums();
            } else {
                this.selectFavoriteTracks();
            }
        },
        bpm() {
            // this.showAlbumsOrTracks = 'tracks';
            this.visibleAlbumsOrTracks();
            this.selectFavoriteTracks();
        },
        applyKeys() {
            // this.showAlbumsOrTracks = 'tracks';
            this.visibleAlbumsOrTracks();
            this.selectFavoriteTracks();
        },
        tags() {
            if (this.showAlbumsOrTracks === 'albums') {
                this.selectFavoriteAlbums();
            } else {
                this.selectFavoriteTracks();
            }
        },
        viewAlbums() {
            this.$store.commit('SET_ALBUM_EXPANDED', '');
        },
    },
    computed: {
        ...mapGetters({
            subgenre: 'libraryFilters/SUBGENRE',
            bpm: 'libraryFilters/BPM',
            keys: 'libraryFilters/KEYS',
            tags: 'libraryFilters/TAGS',
            applyKeys: 'libraryFilters/APPLY_KEYS',

            viewAlbums: 'libraryFilters/VIEW_ALBUMS',
            libraryFilter: 'libraryFilters/LIBRARY_FILTER'
        }),
        ...mapGetters([
            'STATUS_FILTER',
            'FAVOURITE_MUSIC_RELEASE',
            'UPDATE_FAVOURITE_MUSIC_RELEASE',
            'FAVOURITE_TRACKS',
            'DISCOVERY',
        ]),
    },
    created() {
        // this.mobile = this.isMobile();
        this.showAlbumsOrTracks = 'albums';
        this.$store.commit('SET_ALBUM_EXPANDED', '');
        this.$store.commit('libraryFilters/SET_VIEW_ALBUMS', 'grid');
    },
    mounted() {
        this.visibleAlbumsOrTracks();
        if (this.UPDATE_FAVOURITE_MUSIC_RELEASE === true || !this.FAVOURITE_MUSIC_RELEASE.length) {
            this.selectFavoriteAlbums();
        }
    },
    methods: {
        ...mapActions({
            getFavoriteAlbums: 'GET_FAVOURITE_MUSIC_RELEASE',
            getFavoriteTracks: 'GET_FAVORITE_TRACKS'
        }),

        visibleAlbumsOrTracks() {
            if (this.bpm.length || this.keys.length) {
                this.showAlbumsOrTracks = 'tracks';
            } else {
                this.showAlbumsOrTracks = 'albums';
            }
        },

        changeVisibleAlbums(value) {
            this.$store.commit('libraryFilters/SET_VIEW_ALBUMS', value);
        },
        selectFavoriteAlbums() {
            this.loader = true;

            let params = {};
            if (this.subgenre.id) {
                params['subGenres'] = this.subgenre.id;
            }
            if (this.tags.length) {
                params['tags'] = this.tags;
            }

            this.getFavoriteAlbums(params)
                .then(() => {
                    this.$store.commit('SET_UPDATE_FAVOURITE_MUSIC_RELEASE', false);
                })
                .catch(err => {
                    console.error(`getFavoriteAlbums, ${err}`);
                })
                .finally(() => this.loader = false);
        },
        selectFavoriteTracks() {
            this.loaderTracks = true;
            this.$store.commit('libraryFilters/SET_APPLY_KEYS', false);

            let params = {};
            if (this.subgenre.id) {
                params['musicRelease.subGenres.name'] = this.subgenre.name;
            }
            if (this.bpm.length) {
                params['song.bpm[between]'] = `${this.bpm[0]}` + '..' + `${this.bpm[1]}`;
            }
            if (this.tags.length) {
                params['musicRelease.tags'] = Array(this.tags);
            }

            this.getFavoriteTracks(params)
                .then(() => {
                    this.dynamicTrackKey += 1;
                })
                .catch(err => console.error(`getFavoriteTracks, ${err}`))
                .finally(() => this.loaderTracks = false);
        }
    }
}
</script>

<style lang="scss">
.wrapper_albums {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 33px;
    row-gap: 43px;
    margin-bottom: 60px;
}

.track_list {
  .item_track_list {
      height: 50px;
      margin-bottom: 6px;
      border-radius: 50px;
  }
}

</style>
