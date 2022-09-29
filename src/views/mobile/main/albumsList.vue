<!-- used only for mobile version  -->
<template>
    <div class="container p_albums_list" :class="{'discovery': discoveryMode === true}">
        <div id="top-anchor"></div>
        <div class="head_bar">

            <div class="subgenre_name">
                <template v-if="id && id !== 'all_new'">{{ SUBGENRE_INFO.name }}</template>
                <template v-else>All new</template>
            </div>
            <div class="buttons_row">
                <button type="button" class="play_all" @click.once="playAll" v-ripple>
                    <span class="icon"></span>
                    Play all
                </button>
                <button type="button" class="shuffle" @click.once="playAllShuffle" v-ripple>
                    <span class="icon"></span>
                    Shuffle
                </button>
            </div>
            <div class="discovery_mode" @click="clickDiscovery">
                Discovery Mode
                <v-switch
                    v-model="discoveryMode.value"
                    :disabled="discoveryMode.disable"
                    color="#20C4F5"
                ></v-switch>
            </div>
        </div>
        <div class="wrap_grid_albums">
            <template v-if="loading">
                <albumGridSkeletonLoader v-for="index in 30" :key="index" :parent="'default_grid_albums'"></albumGridSkeletonLoader>
            </template>
            <template v-if="!loading">
                <albumGrid
                    v-for="album of EXPLORE_GRID_ALBUMS"
                    :album="album"
                    :key="album.id"
                    :discoveryStatus="DISCOVERY"
                    :isFavouriteSong="'allSong'">
                </albumGrid>
            </template>
        </div>


        <albumPagination v-if="EXPLORE_GRID_ALBUMS.length" :countAlbums="COUNT_EXPLORE_GRID_ALBUMS"></albumPagination>
        <dialogNeedLogin v-model="dialogNeedLoginVisible"></dialogNeedLogin>
    </div>

</template>

<script>
import {mapActions, mapGetters} from "vuex";
import albumGrid from "@/components/albumGrid";
import albumPagination from '@/components/paginations/explore/albumPagination';
const dialogNeedLogin = () => import('@/components/dialogs/needLogin');
import albumGridSkeletonLoader from "@/components/small/skeleton-loaders/albumGridSkeletonLoader";

export default {
    name: "albumsList",
    components: {
        albumGrid,
        albumPagination,
        dialogNeedLogin,
        albumGridSkeletonLoader
    },
    props: ['id'], // subgenre id
    data() {
        return {
            discoveryMode: {
                value: false,
                disable: true,
            },
            loading: false,

            dynamicKey: 0,
            dialogNeedLoginVisible: false,
        }
    },
    watch: {
        'discoveryMode.value'() {
            if (this.AUTH_DATA.accessToken) {
                this.$store.dispatch('UPDATE_DISCOVERY', this.discoveryMode.value);
                this.getAlbums();
            } else {
                this.discoveryMode.value = false;
            }
        },
        ALBUMS_CURRENT_PAGE() {
            this.getAlbums();
            this.scrollTop();
        },
    },
    computed: {
        ...mapGetters(['AUTH_DATA',
            'EXPLORE_GRID_ALBUMS', 'COUNT_EXPLORE_GRID_ALBUMS', 'ALBUMS_CURRENT_PAGE',
            'SUBGENRE_INFO', 'SUBGENRES', 'SUBGENRE', 'DISCOVERY',
            'CURRENT_ALBUM', 'PLAYING']),
    },
    created() {
        if (this.AUTH_DATA.accessToken) {
            this.discoveryMode.disable = false;
        }
        this.discoveryMode.value = this.DISCOVERY;
    },
    mounted() {
        if (this.id) {
            const params = {id: this.id}
            this.GET_SUBGENRE(params)
                .then(() => {
                    // console.log('created subgenre,', this.SUBGENRE_INFO.name);
                })
                .catch(err => console.log(`GET_SUBGENRE, ${err}`));
        }
        if (!this.EXPLORE_GRID_ALBUMS.length) {
            this.getAlbums();
        }
    },
    methods: {
        clickDiscovery() {
            if (!this.AUTH_DATA.accessToken) {
                this.dialogNeedLoginVisible = true;
            }
        },
        ...mapActions(['GET_EXPLORE_GRID_ALBUMS', 'SET_PLAY', 'SET_PAUSE', 'GET_SUBGENRE']),
        getAlbums() {
            this.loading = true;
            let params = {
                'order[releasedAt]': 'DESC',
                'page': this.ALBUMS_CURRENT_PAGE,
            };
            if (this.id) { // subgenre
                params['subGenres'] = this.id;
            }
            const discovery = this.DISCOVERY === true ? {'exists[playedMusicReleases.user]': false} : '';
            if (this.AUTH_DATA.accessToken) {
                if (this.DISCOVERY === true) {
                    // params['exists[playedMusicReleases.user]'] = false;
                    Object.assign(params, discovery);
                }
            }
            this.GET_EXPLORE_GRID_ALBUMS(params)
                .then(() => {
                    // console.log('EXp', this.EXPLORE_GRID_ALBUMS[0].title);
                    // this.dynamicKey += 1;
                })
                .catch(err => console.log(`mobile GET_EXPLORE_GRID_ALBUMS, ${err}`))
                .finally(() => this.loading = false);
        },
        playAll() {
            this.SET_PLAY({
                fromPlay: 'album_default',
                track: this.EXPLORE_GRID_ALBUMS[0].playList[0].song,
                index: 0,
                album: this.EXPLORE_GRID_ALBUMS[0],
            });
        },
        playAllShuffle() {
            let randIndexAlbum = Math.floor(Math.random() * this.EXPLORE_GRID_ALBUMS.length);
            let randIndexTrack = Math.floor(Math.random() * this.EXPLORE_GRID_ALBUMS[randIndexAlbum].playList.length);
            if (!this.isCurrentPlaying) {
                this.SET_PLAY({
                    track: this.EXPLORE_GRID_ALBUMS[randIndexAlbum].playList[randIndexTrack].song,
                    index: 0,
                    album: this.EXPLORE_GRID_ALBUMS[randIndexAlbum],
                });
            }
        },
        scrollTop() {
            const el = document.getElementById('top-anchor');
            if (el) {
                el.scrollIntoView({
                    behavior: 'auto',
                });
            }
        },
    },

}
</script>

<style lang="scss">
.skeleton-loader {
    width: 100%;
}
</style>
