<template>
    <div class="explore">
        <div class="head_banner">
            <v-container full-height class="full-height">
                <h3>explore psychedelic trance</h3>
                <nav class="explore_nav" ref="explore_nav" id="explore-nav-id">
                    <ul>
                        <li>
                            <button type="button" @click="selectSubGenre({})" :class="{'active': !SUBGENRE}">All</button>
                        </li>
                        <li v-for="item in SUBGENRES" :key="item.id" :class="{'active': SUBGENRE.name === item.name}" ref="subgenrePosition">
                            <button type="button" @click="selectSubGenre(item)">{{ item.name }}</button>
                        </li>
                        <div class="animation_active_li" :style="{left: activeSubgenrePosition + 'px', width: activeSubgenreWidth + 'px'}" :class="SUBGENRE"></div>
                    </ul>
                </nav>
            </v-container>
        </div>

        <div class="container full_page">
            <template v-if="mobile">
                <mainSubgenres></mainSubgenres>
            </template>
            <template v-else>

                <albumsNav></albumsNav>
                <albumsFilter :actions="false" :subgenreFilter="'dropdown'" :keysFilter="true" :filterName="'explore'"></albumsFilter>

                <albumsList :whatAlbums="'all'" v-if="showAlbumsOrTracks === 'albums'"></albumsList>
                <trackList v-if="showAlbumsOrTracks === 'tracks'" :whatTracks="'all'"></trackList>

                <googleAdsense></googleAdsense>
            </template>

        </div>
    </div>
</template>


<script>
import {mapGetters, mapActions} from 'vuex';

import albumsNav from '@/components/explore/albumsNav';
import albumsFilter from '@/components/albumsFilter';
import albumsList from "@/components/explore/albumsList";
const trackList = () => import('@/components/explore/trackList');
import googleAdsense from "@/components/googleAdsense";

// mobile
import mainSubgenres from "@/components/mobile/mainSubgenres";

export default {
    name: 'explore',
    components: {
        albumsNav,
        albumsFilter,
        albumsList,
        trackList,
        googleAdsense,

        // mobile
        mainSubgenres,
    },
    data: () => ({
        showAlbumsOrTracks: 'albums',
        activeSubgenrePosition: '',
        activeSubgenreWidth: '',
        mobile: false,
        mobileSubgenresLoading: false,
    }),
    watch: {
        BPM() {
            this.visibleAlbumsOrTracks();
        },
        APPLY_KEYS() {
            this.visibleAlbumsOrTracks();
        },
        // KEYS() {
        //     this.visibleAlbumsOrTracks();
        // },
        SUBGENRE() {
            this.$nextTick(() => {
                this.activeSubgenre();
            });
        }
    },
    computed: {
        ...mapGetters([
            'SEARCH_STRING',
            'AUTH_DATA', 'PROFILE_DATA',
            'STATUS_FILTER',
            'COUNT_MUSIC_RELEASE', 'MUSIC_RELEASE', 'ALBUMS_CURRENT_PAGE',
            'SUBGENRE', 'BPM', 'KEYS', 'APPLY_KEYS', 'TAGS', 'ACTIVE_SAVED_FILTER', 'UPPER_FILTER',
            'ORDER_BY',
            'VIEW_ALBUMS', 'ALBUM_EXPANDED', 'SAVED_FILTERS', 'SUBGENRES'])
    },
    created() {
        if (this.VIEW_ALBUMS !== 'grid') {
            this.$store.commit('SET_VIEW_ALBUMS', 'grid');
        }
        this.mobile = this.isMobile();
        if (!this.SUBGENRES.length) {
            this.getSubgenres();
        } else {
            this.activeSubgenre();
        }
    },
    mounted() {
        this.visibleAlbumsOrTracks();
    },

    methods: {
        ...mapActions(['GET_MUSIC_RELEASE', 'GET_PROFILE', 'CHANGE_FILTERS', 'GET_SUBGENRES']),
        isMobile() {
            return screen.width <= 760;
        },

        visibleAlbumsOrTracks() {
            if (this.BPM.length || this.KEYS.length) {
                this.showAlbumsOrTracks = 'tracks';
                // this.$store.dispatch('UPDATE_UPPER_FILTER', '');
            } else {
                this.showAlbumsOrTracks = 'albums';
            }
        },
        selectSubGenre(item) {
            this.$store.commit('SET_SUBGENRE', item);
        },
        getSubgenres() {
            this.mobileSubgenresLoading = true;
            const subgenresParams = {
                genre: 2, // Psychedelic Trance
                'order[musicReleasesCount]': 'DESC'
            }
            this.GET_SUBGENRES(subgenresParams)
                .catch(err => console.log(`GET_SUBGENRES, ${err}`))
                .finally(() => {
                    this.activeSubgenre();
                    this.mobileSubgenresLoading = false;
                });
        },
        activeSubgenre() {
            if (!this.mobile) {
                this.$nextTick(() => {
                    let active = this.$refs['subgenrePosition'].find(el => el._prevClass === 'active');
                    if (active) {
                        this.activeSubgenrePosition = active.offsetLeft;
                        this.activeSubgenreWidth = active.offsetWidth;
                    } else {
                        this.activeSubgenrePosition = 6;
                        this.activeSubgenreWidth = 80;
                    }
                });
            }

        }
    },

};
</script>
