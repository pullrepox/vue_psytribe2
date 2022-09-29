<template>
    <div style="position: relative; overflow: hidden;">
        <template v-if="!mobile">
            <div class="head_tracks" v-if="detailsTrack">
                <div class="title_" v-if="SHOW_COLUMNS_TRACK.includes('title')">Title</div>
                <div class="artist_" v-if="SHOW_COLUMNS_TRACK.includes('artist')">Artist</div>
                <div class="released_" v-if="SHOW_COLUMNS_TRACK.includes('released')">Released</div>
                <div class="rating_" v-if="SHOW_COLUMNS_TRACK.includes('rating')">Rating
                    <div class="sort">
                        <span class="material-icons" @click="orderBy('rating', 'asc')"
                              :class="{'active': currentOrderBy.name === 'rating_asc'}">arrow_drop_up</span>
                        <span class="material-icons" @click="orderBy('rating', 'desc')" :class="{'active': currentOrderBy.name === 'rating_desc'}">arrow_drop_down</span>
                    </div>
                </div>

                <div class="bpm_" v-if="SHOW_COLUMNS_TRACK.includes('bpm')">BPM
                    <div class="sort">
                        <span class="material-icons" @click="orderBy('bpm', 'asc')" :class="{'active': currentOrderBy.name === 'bpm_asc'}">arrow_drop_up</span>
                        <span class="material-icons" @click="orderBy('bpm', 'desc')"
                              :class="{'active': currentOrderBy.name === 'bpm_desc'}">arrow_drop_down</span>
                    </div>
                </div>

                <div class="key_" v-if="SHOW_COLUMNS_TRACK.includes('key')">KEY
                    <div class="sort">
                        <span class="material-icons" @click="orderBy('key', 'asc')" :class="{'active': currentOrderBy.name === 'key_asc'}">arrow_drop_up</span>
                        <span class="material-icons" @click="orderBy('key', 'desc')"
                              :class="{'active': currentOrderBy.name === 'key_desc'}">arrow_drop_down</span>
                    </div>
                </div>

                <div class="actions_">
                    <v-menu
                        transition="slide-y-transition"
                        :close-on-content-click="false"
                        :nudge-width="120"
                        content-class="menu-pointer charcoal"
                        offset-y
                        nudge-left="60"
                        nudge-bottom="25"
                        origin="top center"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <button v-bind="attrs" v-on="on">
                                <span class="material-icons">arrow_drop_down</span>
                            </button>
                        </template>
                        <v-list>
                            <v-list-item>
                                <div class="material_checkbox">
                                    <input type="checkbox" id="title" value="title" v-model="columns"
                                           @change="checkColumn($event)">
                                    <label for="title">Title</label>
                                </div>
                            </v-list-item>
                            <v-list-item>
                                <div class="material_checkbox">
                                    <input type="checkbox" id="artist" value="artist" v-model="columns"
                                           @change="checkColumn($event)">
                                    <label for="artist">Artist</label>
                                </div>
                            </v-list-item>
                            <v-list-item>
                                <div class="material_checkbox">
                                    <input type="checkbox" id="released" value="released" v-model="columns"
                                           @change="checkColumn($event)">
                                    <label for="released">Released</label>
                                </div>
                            </v-list-item>
                            <v-list-item>
                                <div class="material_checkbox">
                                    <input type="checkbox" id="rating" value="rating" v-model="columns"
                                           @change="checkColumn($event)">
                                    <label for="rating">Rating</label>
                                </div>
                            </v-list-item>
                            <v-list-item>
                                <div class="material_checkbox">
                                    <input type="checkbox" id="bpm" value="bpm" v-model="columns"
                                           @change="checkColumn($event)">
                                    <label for="bpm">BPM</label>
                                </div>
                            </v-list-item>
                            <v-list-item>
                                <div class="material_checkbox">
                                    <input type="checkbox" id="key" value="key" v-model="columns"
                                           @change="checkColumn($event)">
                                    <label for="key">Key</label>
                                </div>
                            </v-list-item>

                        </v-list>
                    </v-menu>
                </div>
            </div>
            <div class="album-playlist">

                <template v-if="albumPlayList.length">
                    <transition-group name="fade" tag="div">
                        <div v-for="(track, index) of albumPlayList" :key="track.id + dynamicKey"
                             class="item_row_track"
                             :class="[{ selected: currentTrack !== null && currentTrack.id && track.song.id === currentTrack.id && playing}]">

                            <div class="track">
                                <button v-if="currentTrack !== null && currentTrack.id === track.song.id && playing" class="pause" @click="pause"></button>
                                <button v-else class="play" @click="playTrack(track, index, album)"></button>

                                <button class="like" v-if="track.song.isFavorite === false" @click="addTrackLike(track.song, album.id)"></button>
                                <button class="like active" v-if="track.song.isFavorite === true" @click="removeTrackLike(track.song, album.id)"></button>

                                <!-- item album list -->
                                <template v-if="!detailsTrack">
                                    <span class="track_name">{{ track.song.title }}</span>
                                    <template v-if="track.song.artist">
                                        <router-link class="artist_name" :to="{ name: 'artist-profile', params: {id: track.song.artist.id} }">
                                            {{ track.song.artist.name }}
                                        </router-link>
                                    </template>
                                    <template v-else>
                                        <div class="artist_name">-</div>
                                    </template>
                                    <div class="duration">
                                        <template v-if="track.song.duration">{{ track.song.duration }}</template>
                                        <template v-else>-</template>
                                    </div>
                                    <div class="bpm">
                                        <template v-if="track.song.bpm && track.song.bpm !== 0">{{ track.song.bpm }}</template>
                                        <template v-else>-</template>
                                    </div>
                                    <div class="key">
                                        <template v-if="track.song.key">{{ track.song.key }}</template>
                                        <template v-else>-</template>
                                    </div>
                                    <div class="rating">
                                        <template v-if="track.song.rating">{{ track.song.rating }}</template>
                                        <template v-else>-</template>
                                    </div>
                                </template>

                                <!-- albumDetails page -->
                                <template v-if="detailsTrack">
                                    <span class="track_name" v-if="SHOW_COLUMNS_TRACK.includes('title')">{{ track.song.title }}</span>

                                    <div v-if="track.song.artist" class="artist_name">
                                        <router-link  v-if="SHOW_COLUMNS_TRACK.includes('artist')"
                                                     :to="{ name: 'artist-profile', params: {id: track.song.artist.id} }">
                                            {{ track.song.artist.name }}
                                        </router-link>
                                    </div>
                                    <template v-else>
                                        <div class="artist_name">-</div>
                                    </template>

                                    <div class="released" v-if="SHOW_COLUMNS_TRACK.includes('released')">
                                        {{ track.song.publishedAt | moment("MMM, YYYY") }}
                                    </div>
                                    <div class="rating" v-if="SHOW_COLUMNS_TRACK.includes('rating')">
                                        <template v-if="track.song.rating"> {{ track.song.rating }}</template>
                                        <template v-else>-</template>
                                    </div>
                                    <div class="bpm" v-if="SHOW_COLUMNS_TRACK.includes('bpm')">
                                        {{ track.song.bpm }}
                                    </div>
                                    <div class="key" v-if="SHOW_COLUMNS_TRACK.includes('key')">-</div>
                                </template>
                            </div>

                            <div class="action_track">
                                <template v-if="track.song.price > 0">
                                    <div class="basket">
                                        <span class="track_price">${{ track.song.price }}</span>
                                    </div>
                                </template>
                                <template v-else>
                                    <a class="download" @click.prevent="downloadTrack(track.song.artist.name, track.song.title, track.song.link)">Download</a>
                                </template>
                                <v-menu
                                    transition="slide-y-transition"
                                    :close-on-content-click="false"
                                    :nudge-width="120"
                                    :v-model="viewMenuTrack"
                                    offset-y
                                    nudge-left="60"
                                    nudge-bottom="15"
                                    origin="top center"
                                    content-class="menu-pointer charcoal">

                                    <template v-slot:activator="{ on, attrs }">
                                        <button type="button" class="more" v-bind="attrs" v-on="on"></button>
                                    </template>
<!--                                    <v-list class="playlists" v-if="viewMenuPlayList === false">-->
                                    <v-list class="playlists">
                                        <v-list-item>
                                            <!-- <button v-if="!trackInPlaylist[track.id]" type="button" @click="addTrackToPlaylist({album, track})">Add to queue</button>-->
                                            <button type="button">Add to queue</button>
                                            <!-- <button v-else class="no_active">Added to queue</button>-->
                                        </v-list-item>
                                        <v-list-item>
                                            <button>Play next</button>
                                        </v-list-item>
                                        <v-list-item>
                                            <button type="button" @click="addTrackToUserPlaylist">Add to Playlist</button>
<!--                                            <button type="button" @click="viewUserPlaylistsDialog = true">Add to Playlist</button>-->
<!--                                            <button type="button" @click="viewMenuPlayList = true; viewMenuTrack = false"-->
<!--                                                    id="btn_open_playlist_menu">Add to Playlist-->
<!--                                            </button>-->
                                        </v-list-item>
                                        <v-list-item>
                                            <button>Report</button>
                                        </v-list-item>
                                    </v-list>

                                    <userPlayLists v-model="viewUserPlaylistsDialog"></userPlayLists>
<!--                                    <v-card v-else class="add_to_playlist" v-click-outside="clickOutsidePlaylistMenu">-->
<!--                                        &lt;!&ndash; v-click-outside="clickOutsidePlaylistMenu" &ndash;&gt;-->
<!--                                        <div class="head_">Add to Playlist</div>-->

<!--                                        <div class="wrapper_playlists">-->
<!--                                            <template v-if="!playlists.length">-->
<!--                                                <div class="none_playlists">You have no playlists</div>-->
<!--                                            </template>-->
<!--                                            <div class="playlists_box">-->
<!--                                                <div class="material_checkbox" v-for="(playlist, index) in playlists"-->
<!--                                                     :key="playlist.id">-->
<!--                                                    <input type="checkbox" :id="index" :value="playlist" v-model="selectedPlaylist"-->
<!--                                                           @change="checkPlaylists(track.song.id, playlist.id)">-->
<!--                                                    <label :for="index">{{ playlist.title }}</label>-->
<!--                                                </div>-->
<!--                                            </div>-->
<!--                                        </div>-->

<!--                                        <div class="action_box">-->
<!--                                            <div class="create_playlist">-->
<!--                                                <input type="text" placeholder="+ New Playlist" v-model="newPlayList">-->
<!--                                            </div>-->
<!--                                            <button v-if="newPlayList || selectedPlaylist.length" type="button"-->
<!--                                                    @click="savePlayList(track.song.id)">Save-->
<!--                                            </button>-->
<!--                                            <button v-if="!newPlayList && !selectedPlaylist.length" type="button"-->
<!--                                                    @click="closeTrackMenu">Done-->
<!--                                            </button>-->
<!--                                        </div>-->
<!--                                    </v-card>-->

                                </v-menu>
                            </div>
                            <dialogNeedLogin v-model="dialogNeedLoginVisible"></dialogNeedLogin>
                        </div>
                    </transition-group>
                </template>

                <button v-if="btnShowAllTracks === true" v-ripple type="button" class="toogle_view_tracks"
                        :class="{'secondary_btn medium': detailsTrack}"
                        @click="toogleViewTracks">
                    {{ (PLAYED_ONLY_FAV_TRACKS === true) ? "View Full Album" : "Hide Not Favourite" }}
                </button>
                <thisActionStopPlay v-model="actionStopPlay"></thisActionStopPlay>
            </div>
        </template>

        <template v-if="mobile">
            <div class="mobile_track_list">
                <div class="item_track"
                     :class="{'playing': currentTrack !== null && currentTrack.id === track.song.id && playing}"
                     v-for="(track, index) of albumPlayList" :key="track.id"
                     @click="playTrack(track, index, album)">
                    <div class="main_info">
                        <div class="index">{{ index + 1 }}</div>
                        <div class="track_descript">
                            <span class="name" v-if="track.song">{{ track.song.title }}</span>
                            <span class="artist" v-if="track">{{ track.song.artist.name }}</span>
                        </div>
                    </div>
                    <div class="other_info">
                        <span class="price"></span>
                        <button type="button" class="more" @click.stop="toogleDrawerTrack(track.id)">
                            <span class="material-icons-outlined">more_vert</span>
                        </button>
                    </div>
                    <v-navigation-drawer
                        v-if="drawerTrackID === track.id"
                        v-model="drawerTrackID"
                        v-touch="{right: () => swipe('Right')}"
                        fixed
                        right
                        mini-variant
                        color="#192234">
                        <div class="wrap_drawer">
                            <div class="wrap_drawer_list">
                                <button type="button" class="favorite" v-if="track.song.isFavorite === false" @click="addTrackLike(track.song, album.id)"></button>
                                <button type="button" class="favorite active" v-if="track.song.isFavorite === true" @click="removeTrackLike(track.song, album.id)"></button>
                                <button type="button" class="share">Share</button>
                                <button type="button" class="add_to_playlist">Add to Playlist</button>
                            </div>
                        </div>
                    </v-navigation-drawer>
                </div>

            </div>
        </template>

    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import thisActionStopPlay from "@/components/dialogs/thisActionStopPlay";
import dialogNeedLogin from '../components/dialogs/needLogin';
import isMobile from "@/mixins/isMobile";
const userPlayLists = () => import('@/components/userPlayLists');
// import userPlayLists from '../components/userPlayLists';

export default {
    name: "albumPlayList",
    components: {
        thisActionStopPlay,
        dialogNeedLogin,
        userPlayLists
    },
    mixins: [isMobile],
    props: {
        detailsTrack: Boolean,
        autoPlayTrack: Number,

        album: {
            type: Object,
            default: () => ({})
        },
        albumLocation: String,
    },
    data() {
        return {
            columns: this.$store.getters.SHOW_COLUMNS_TRACK,

            currentOrderBy: {
                name: '', // bpm_desc
                key: '', // bpm
                direction: '' // desc
            },

            dialogNeedLoginVisible: false,
            actionStopPlay: false,

            viewMenuTrack: false,
            viewMenuPlayList: false,
            newPlayList: '',
            selectedPlaylist: [],
            viewUserPlaylistsDialog: false,

            albumIsFavorite: false,

            albumPlayList: {},
            btnShowAllTracks: false,

            dynamicKey: 0,

            // mobile
            drawerTrackID: '',
        };
    },
    watch: {
        album() {
            this.dynamicKey += 1;
            this.showPlayList();
        },
        PLAYED_ONLY_FAV_TRACKS() {
            this.showPlayList();
        },
        albumPlayList: {
            handler() {
                if (this.PLAYED_ONLY_FAV_TRACKS === false) {
                    let isNoFavorite = this.albumPlayList.find(track => track.song.isFavorite === false);
                    this.album.isFavorite = !isNoFavorite;
                    if (!isNoFavorite) {
                        this.album.isFavorite = true;
                    } else {
                        this.album.isFavorite = false;
                        if (this.CURRENT_PAGE.name === 'collection' || this.$route.params.favourite === 'favourite') {
                            // this.btnShowAllTracks = true;
                            // console.log('true - btnShowAllTracks - handler');
                        }
                    }
                }
            },
            deep: true
        },

        'album.isFavorite'() {
            if (this.album.isFavorite === true) {
                this.btnShowAllTracks = false;
            }
        },
    },
    computed: {
        ...mapGetters({
            authData: 'AUTH_DATA',
            profileData: 'PROFILE_DATA',
            currentTrack: 'CURRENT_TRACK',
            currentAlbum: 'CURRENT_ALBUM',
            playing: 'PLAYING',
            playList: 'PLAY_LIST', // OLD!
            playlists: 'PLAYLISTS',
            playlist2: 'PLAYLIST'
        }),
        ...mapGetters([
            'ALBUM',
            'DISCOVERY',
            'SHOW_COLUMNS_TRACK',
            'PROFILE_DATA',
            'DOWNLOAD_SONG_LINK',
            'DOWNLOAD_SONG_ERROR',
            'PLAYED_ONLY_FAV_TRACKS',
            'CURRENT_PAGE',

            'EXPLORE_GRID_ALBUMS',
            'FAVOURITE_MUSIC_RELEASE',
            'SEARCH_ALBUMS_RESULT',

            'FROM_PAGE',
        ]),
        // trackInPlaylist() {
        //     return Object.fromEntries(
        //         this.album.playList.map(({id}) => [
        //             id, this.playList.some(track => (track.id === id))
        //         ])
        //     );
        // },
    },
    created() {
        this.viewActionPlaylist();
    },
    mounted() {
        this.showPlayList();
        if (!this.PROFILE_DATA) {
            this.getProfile()
                .then(() => {
                    // GET all Play Lists
                    this.getPlaylists({id: this.profileData.id})
                        .then(() => {
                            console.log('saved playlists', this.playlists, {id: this.profileData.id});
                        })
                        .catch(err => {
                            console.log(`getPlaylists, ${err}`)
                        })
                })
                .catch(err => {
                    console.log(`getPlaylists, ${err}`)
                })
        }
    },
    methods: {
        ...mapActions({
            getProfile: 'GET_PROFILE',
            play: 'SET_PLAY',
            pause: 'SET_PAUSE',
            addTrackToPlaylist: 'ADD_TRACK_TO_PLAYLIST',
            addTrackToFavorites: 'ADD_TRACK_TO_FAVORITES',
            removeTrackFromFavorites: 'REMOVE_TRACK_FROM_FAVORITES',
            addTrackStatistic: 'ADD_SONG_STATISTIC',
            getPlaylists: 'GET_PLAYLISTS',
            getPlaylist: 'GET_PLAYLIST',
            createPlaylist: 'CREATE_PLAYLIST',
            GET_DOWNLOAD_SONG_LINK: 'GET_DOWNLOAD_SONG_LINK',
        }),
        ...mapActions([
            'ADD_TRACK_TO_PLAYLISTS',
            'GET_FAVOURITE_MUSIC_RELEASE'
        ]),

        addTrackToUserPlaylist() {
            console.log(111);
            this.viewUserPlaylistsDialog = true;
        },
        showPlayList() {
            this.albumIsFavorite = this.album.isFavorite === true;
            if (this.PLAYED_ONLY_FAV_TRACKS === true) {
                if (this.albumIsFavorite === false) {
                    this.albumPlayList = this.album.playList.filter(track => track.song.isFavorite === true);
                    if (this.detailsTrack) {
                        // this.orderBy(this.currentOrderBy.key, this.currentOrderBy.direction);
                    }
                } else {
                    this.albumPlayList = this.album.playList;
                    if (this.detailsTrack) {
                        // this.orderBy(this.currentOrderBy.key, this.currentOrderBy.direction);
                    }
                }
            } else {
                this.albumPlayList = this.album.playList;
                if (this.detailsTrack) {
                    // this.orderBy(this.currentOrderBy.key, this.currentOrderBy.direction);
                }
            }
        },

        toogleViewTracks() {

            // hide no-favorite tracks
            if (this.PLAYED_ONLY_FAV_TRACKS === false && this.$store.getters.CURRENT_TRACK !== null && this.$store.getters.CURRENT_TRACK.isFavorite === false && this.currentAlbum.id === this.album.id) {
                this.actionStopPlay = true;
            } else {
                if (this.PLAYED_ONLY_FAV_TRACKS === true) {
                    this.$store.dispatch('SET_PLAYED_ONLY_FAV_TRACKS', false);
                } else {
                    this.$store.dispatch('SET_PLAYED_ONLY_FAV_TRACKS', true);
                }
            }
        },

        viewActionPlaylist() {
            if ((this.CURRENT_PAGE.name === 'collection' || this.$route.params.favourite === 'favourite') && this.album.isFavorite !== true) {
                this.btnShowAllTracks = true;
                console.log('true - btnShowAllTracks');
            }

            // ||(this.$store.getters.CURRENT_TRACK && this.$store.getters.CURRENT_TRACK.isFavorite !== false)

            if (this.CURRENT_PAGE.name === 'collection' || this.$route.params.favourite === 'favourite') {
                this.$store.dispatch('SET_PLAYED_ONLY_FAV_TRACKS', true);
            } else {
                this.$store.dispatch('SET_PLAYED_ONLY_FAV_TRACKS', false);
            }

            // all track is no-favorites
            let isFavorite = this.album.playList.find(track => track.song.isFavorite === true);
            if (!isFavorite) {
                this.$store.dispatch('SET_PLAYED_ONLY_FAV_TRACKS', false);
                this.btnShowAllTracks = false;
            }
        },

        playTrack(track, index, album) {

            // SET_PLAYED_ZONE
            if (!this.detailsTrack) { // Album-Details Page
                if (this.albumLocation === 'library') {
                    this.$store.dispatch('SET_PLAYED_ZONE', this.FAVOURITE_MUSIC_RELEASE);
                }
                if (this.albumLocation === 'explore') {
                    this.$store.dispatch('SET_PLAYED_ZONE', this.EXPLORE_GRID_ALBUMS);
                }
                if (this.albumLocation === 'search') {
                    this.$store.dispatch('SET_PLAYED_ZONE', this.SEARCH_ALBUMS_RESULT);
                }
            } else {
                this.$store.dispatch('SET_PLAYED_ZONE', []);
            }

            if (!this.currentTrack || (this.currentTrack.id !== track.song.id)) {
                this.play({
                    fromPlay: 'album_default',
                    track: track.song,
                    index: index,
                    album: this.album,
                    isDiscoveryStatus: this.DISCOVERY
                });
                this.$store.commit('SET_IS_LISTENED_ALBUM', album);
            }

        },

        // ORDER-BY album playList (rating, bpm, key)
        orderBy: function (key, direction) {
            this.currentOrderBy.name = `${key}_${direction}`;
            this.currentOrderBy.key = key;
            this.currentOrderBy.direction = direction;

            if (this.currentOrderBy.key === 'rating') {
                if (this.currentOrderBy.direction === 'asc') {
                    this.albumPlayList.sort((a, b) => (a.song.rating >= b.song.rating) ? 1 : -1);
                }
                if (this.currentOrderBy.direction === 'desc') {
                    this.albumPlayList.sort((a, b) => (a.song.rating <= b.song.rating) ? 1 : -1);
                }
            }
            if (this.currentOrderBy.key === 'bpm') {
                if (this.currentOrderBy.direction === 'asc') {
                    this.albumPlayList.sort((a, b) => (a.song.bpm >= b.song.bpm) ? 1 : -1);
                }
                if (this.currentOrderBy.direction === 'desc') {
                    this.albumPlayList.sort((a, b) => (a.song.bpm <= b.song.bpm) ? 1 : -1);
                }
            }
            if (this.currentOrderBy.key === 'key') {
                if (this.currentOrderBy.direction === 'asc') {
                    this.albumPlayList.sort((a, b) => (a.song.key >= b.song.key) ? 1 : -1);
                }
                if (this.currentOrderBy.direction === 'desc') {
                    this.albumPlayList.sort((a, b) => (a.song.key <= b.song.key) ? 1 : -1);
                }
            }
        },
        checkColumn() {
            this.$store.commit('SET_SHOW_COLUMNS_TRACK', this.columns);
        },

        checkFavTracks() {
            let isFavorite = this.albumPlayList.find(track => track.song.isFavorite === true);
            return !!isFavorite;
        },

        // track like
        checkNoFavTracks() {
            let isFavorite = this.albumPlayList.find(track => track.song.isFavorite === false);
            return !!isFavorite;
        },
        addTrackLike(song, album_id) {
            console.log('addTrackLike');
            if (this.authData.accessToken) {
                song.isFavorite = true;


                // from !collection || !albumDetails page playlist
                if (this.FROM_PAGE.name !== 'collection' || !this.detailsTrack) {
                    this.$store.commit('SET_UPDATE_FAVOURITE_MUSIC_RELEASE', true);
                }
                if (this.FROM_PAGE.name !== 'explore' || !this.detailsTrack) {
                    this.$store.commit('SET_UPDATE_EXPLORE_ALBUMS', true);
                }


                // // all tracks favorite
                if (this.checkNoFavTracks() === false) {
                    this.album.isFavorite = true;
                    this.btnShowAllTracks = false;
                } else if (this.CURRENT_PAGE.name === 'collection' || this.$route.params.favourite === 'favourite') {
                    this.btnShowAllTracks = true;
                    console.log('true - btnShowAllTracks');
                }

                this.addTrackToFavorites({'song_id': song.id, 'album_id': album_id})
                    .then(() => {
                    })
                    .catch(err => {
                        console.log(`addTrackToFavorites, ${err}`);
                    })
            } else {
                this.dialogNeedLoginVisible = true;
            }
        },
        removeTrackLike(song, album_id) {
            if (this.authData.accessToken) {
                song.isFavorite = false;
                this.album.isFavorite = false;

                if (this.FROM_PAGE.name !== 'collection' || !this.detailsTrack) {
                    this.$store.commit('SET_UPDATE_FAVOURITE_MUSIC_RELEASE', true);
                }
                if (this.FROM_PAGE.name !== 'explore' || !this.detailsTrack) {
                    this.$store.commit('SET_UPDATE_EXPLORE_ALBUMS', true);
                }

                if (this.checkFavTracks() === false) {
                    this.$store.commit('SET_UPDATE_FAVOURITE_MUSIC_RELEASE', true);
                    this.$store.dispatch('SET_PLAYED_ONLY_FAV_TRACKS', false);
                    this.btnShowAllTracks = false;
                } else if (this.CURRENT_PAGE.name === 'collection' || this.$route.params.favourite === 'favourite') {

                    this.btnShowAllTracks = true;
                    console.log('true - btnShowAllTracks');
                }


                if (this.PLAYED_ONLY_FAV_TRACKS === true) {
                    this.albumPlayList = this.album.playList.filter(track => track.song.isFavorite === true);
                }

                this.removeTrackFromFavorites({'song_id': song.id, 'album_id': album_id})
                    .then(() => {
                        // this.GET_FAVOURITE_MUSIC_RELEASE();
                    })
                    .catch(err => {
                        console.log(`removeTrackFromFavorites, ${err}`);
                    })
            } else {
                this.dialogNeedLoginVisible = true;
            }
        },

        downloadTrack(trackArtist, trackName, trackLink) {
            const blob = new Blob([trackLink], {type: 'audio/mp3'});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${trackArtist} - ${trackName}.mp3`;
            document.body.appendChild(link);
            link.click();
        },
        // downloadSong(songId) {
        //     if (this.authData.accessToken) {
        //         this.GET_DOWNLOAD_SONG_LINK({'songId': songId}).then(() => {
        //             const link = document.createElement("a");
        //             link.download = name;
        //             link.href = this.DOWNLOAD_SONG_LINK;
        //             link.click();
        //         }).catch(err => {
        //
        //             console.log("err " + "" + err)
        //             // this.$buefy.dialog.alert(this.DOWNLOAD_ERROR); // :TODO -> $buefy NOT USED!!!
        //         })
        //     } else {
        //         // popup
        //         this.dialogNeedLoginVisible = true;
        //     }
        // },

        // clickOutsidePlaylistMenu: function (event) {
        //     if (event.target.parentElement !== null) {
        //         if (event.target.id !== 'btn_open_playlist_menu' && event.target.parentElement.id !== 'btn_open_playlist_menu') {
        //             this.viewMenuTrack = false;
        //             this.viewMenuPlayList = false;
        //         }
        //     }
        // },
        // closeTrackMenu() {
        //     this.viewMenuTrack = false;
        //     this.viewMenuPlayList = false;
        //     // this.drawerTrack = false;
        // },

        // savePlayList(songID) {
        //     if (this.newPlayList) {
        //         this.createNewPlaylist();
        //     }
        //     if (this.selectedPlaylist) {
        //         for (let i = 0; i < this.selectedPlaylist.length; i++) {
        //             let params = {
        //                 'song_id': songID,
        //                 'favorite_list_id': this.selectedPlaylist[i].id
        //             };
        //             this.ADD_TRACK_TO_PLAYLISTS(params)
        //                 .then(() => {
        //
        //                 })
        //                 .catch(err => {
        //                     console.log(`ADD_TRACK_TO_PLAYLISTS, ${err}`);
        //                 })
        //         }
        //
        //         // this.addTrackToPlaylist();
        //         // this.addTrackToPlayList();
        //     }
        // },
        // createNewPlaylist() {
        //     this.createPlaylist({title: this.newPlayList}, {id: this.profileData.id})
        //         .catch(err => {
        //             console.log(`createNewPlaylist, ${err}`);
        //         })
        // },
        // checkPlaylists(trackID, playlistID) {
        //     console.log('selectedPlaylist', this.selectedPlaylist);
        //     console.log('ev', trackID, playlistID);
        //     // add to playlist
        // },


        //mobile
        toogleDrawerTrack(trackID) {
            this.drawerTrackID = trackID;
        },
        swipe(direction) {
            if (direction === 'Right') {
                // this.drawerTrack = false;
            }
        },
    },
};
</script>

<style lang="scss">
//.animated-enter-active, .animated-leave-active {
//    transition: opacity .3s;
//}
//
//.animated-enter, .animated-leave-to /* .fade-leave-active below version 2.1.8 */
//{
//    opacity: 0;
//}
//.expand-transition {
//    transition: all 0.5s ease;
//}
///* .expand-enter defines the starting state for entering */
///* .expand-leave defines the ending state for leaving */
//.expand-enter, .expand-leave {
//    height: 0;
//    opacity: 0;
//}
</style>
