<template>
    <div>
        <transition name="back-in" :duration="{ enter: 500, leave: 200 }">
            <div class="player bounceInUp" v-if="playerStatus" :class="{'toggle-width': playerToggleWidth}">
                <div class="left_">
                    <button class="prev" @click="skip('prev')"></button>
                    <div class="toogle_actions">
                        <button type="button" v-ripple class="toogle_play" v-if="!playing" @click="play"></button>
                        <button type="button" v-ripple class="toogle_pause" v-if="playing" @click="pause"></button>
                        <button type="button" v-ripple class="mobile_menu" @click="openPlayerMobileMenu">
                            <span class="material-icons-outlined">more_vert</span>
                        </button>
                    </div>
                    <button class="next" @click="skip('next')"></button>

                    <button class="next_album" v-if="playZone && playZone.length" @click="nextAlbum"></button>

                    <div class="info_track">
                        <div class="img" v-if="currentAlbum.smallImage || currentAlbum.image">
                            <img :src="currentAlbum.smallImage || currentAlbum.image" :alt="currentAlbum.title">
                        </div>
                        <div class="title_artist">
                            <router-link
                                :to="{ name: 'albumDetails', params: {id: currentAlbum.id}}"
                                class="track_title">
                                {{ currentTrack.title }}
                                <span class="bpm" v-if="currentTrack.bpm !== 0">({{ currentTrack.bpm }} BPM)</span>
                                <!--                            <span class="key" v-if="currentTrack.key || currentTrack.key !== null">({{currentTrack.key}})</span>-->
                            </router-link>


                            <!--                        <template v-if="albumDetails.type === 'album'">-->
                            <!--                            <router-link v-if="albumDetails.artist" :to="{ name: 'artist-profile',params: {id: albumDetails.artist.id}}">-->
                            <!--                                {{ albumDetails.artist.name }}-->
                            <!--                            </router-link>-->
                            <!--                            <div class="artist" v-else>-</div>-->
                            <!--                        </template>-->
                            <!--                        <template v-if="albumDetails.type === 'collection'">-->
                            <!--                            <span>Various Artists</span>-->
                            <!--                        </template>-->
                            <router-link v-if="currentTrack.artist"
                                         :to="{ name: 'artist-profile', params: {id: currentTrack.artist.id} }"
                                         class="track_artist">
                                <span>By</span>{{ currentTrack.artist.name }}
                            </router-link>
                            <div v-else class="track_artist">-</div>
                        </div>
                    </div>
                </div>

                <div class="progress">
<!--                    <span class="time_current" v-if="changeProgress !== false">{{ seek | minutes }}</span>-->
                    <span class="time_current">{{ duration/100 * progress | minutes }}</span>

                    <v-slider
                        color="#20C4F5"
                        track-color="#ffffff"
                        track-fill-color="#20C4F5"
                        thumb-color="#20C4F5"
                        thumb-size="0"
                        v-model="progress"
                        step="0.1"
                        @change="changeSetSeek($event)"
                        @mousedown="mouseDownSetSeek()"
                        @mouseup="mouseUpSetSeek($event)"
                        min="0"
                    >
                    </v-slider>
                    <v-progress-circular
                        v-if="trackOnload === false"
                        indeterminate
                        color="amber"
                        size="20"
                    ></v-progress-circular>
                    <span class="time_end">{{ duration | minutes }}</span>
                </div>

                <div class="right_box">

                    <!-- SEPARATOR -->
                    <div class="separator"></div>

                    <!-- SHARE -->
                    <v-dialog
                        transition="dialog-bottom-transition"
                        max-width="600">
                        <template v-slot:activator="{ on, attrs }">
                            <button type="button" v-ripple class="share_link" v-bind="attrs" v-on="on"
                                    @click="createLinkTrack"></button>
                        </template>
                        <template v-slot:default="dialog">
                            <div class="content_popup_share">
                                <div class="head_popup">Share</div>
                                <div class="input_box">
                                    <input type="text" id="input-share-track-link" v-model="shareLink">
                                    <button type="button" v-ripple @click="copyLinkPsytrance">Copy</button>
                                </div>
                                <button type="button" v-ripple @click="dialog.value = false" class="close">Close</button>
                            </div>
                        </template>
                    </v-dialog>

                    <!-- FAVORITE -->
                    <button v-if="currentTrack && currentTrack.isFavorite === false" @click="addToFavorites" class="like">
                        <span class="material-icons">favorite_border</span>
                    </button>
                    <button v-if="currentTrack && currentTrack.isFavorite === true" @click="removeFromFavorites" class="like active">
                        <span class="material-icons">favorite</span>
                    </button>

                    <!-- PLAYLIST ADD -->
                    <button class="playlist-add">
                        <span class="material-icons">playlist_add</span>
                    </button>

                    <!-- RATING -->
                    <div class="rating">
                        <!-- open-on-hover -->
                        <v-menu
                            transition="slide-y-transition"
                            :close-on-content-click="true"
                            content-class="player_bar_rating"
                            offset-y
                            nudge-left="20"
                            nudge-top="80"
                            origin="bottom left"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <button v-bind="attrs" v-on="on">
                                    <span class="material-icons"></span>
                                </button>
                            </template>
                            <v-list>
                                <image-rating
                                    :src="srcRating"
                                    :item-size="20"
                                    :spacing="11"
                                    :increment="1"
                                    :background-opacity="0.3"
                                    :show-rating="false"
                                    @rating-selected='setTrackRating($event, currentTrack.id)'
                                    v-model="trackRating">
                                </image-rating>
                            </v-list>
                        </v-menu>
                    </div>
                    <dialogNeedLogin v-model="dialogNeedLoginVisible"></dialogNeedLogin>

                    <!-- MORE -->
                    <button class="more">
                        <span class="material-icons">more_vert</span>
                    </button>

                    <!-- TOGGLE WIDTH -->
                    <button @click="playerToggleWidth = !playerToggleWidth" class="toggle-width">
                        <span class="material-icons">keyboard_arrow_down</span>
                    </button>

                    <!-- LOOP -->
                    <!--    <button :class="[loop ? 'loop_on' : '', 'loop']" @click="toggleLoop"></button>-->

                    <!-- VOLUME -->
                    <!--                    <div class="volume-controls-wrapper">-->
                    <!--                        <button class="volume"-->
                    <!--                                :class="[muted ? 'mute' : 'unmute', '']"-->
                    <!--                                @click="toggleMute"-->
                    <!--                                @mouseenter="showVolume"-->
                    <!--                        ></button>-->
                    <!--                        <div-->
                    <!--                            @mouseenter="setVolumeBarStatus(true)"-->
                    <!--                            @mouseleave="setVolumeBarStatus(false)"-->
                    <!--                            v-show="volumeStatus">-->
                    <!--                            <vue-slider @change="updateVolume" v-bind="volumeOptions"></vue-slider>-->
                    <!--                        </div>-->
                    <!--                    </div>-->

                    <!--QUEUE OF SONGS -->
                    <!--                    <button class="play_list" @click="changePlaylistStatus(!showPlayList)"-->
                    <!--                            :class="{'active': showPlayList}"></button>-->

                    <!--                    <button :class="[shuffle ? 'shuffle_on' : '', 'shuffle']" @click="toggleShuffle"></button>-->

                </div>

            </div>


        </transition>

        <v-navigation-drawer
            v-model="drawerPlayer"
            fixed
            bottom
            color="#192234">
            <div class="wrap_drawer"
                 v-touch="{down: () => swipe('Down')}">

                <div class="wrap_drawer_player">
                    <div class="action_buttons">
                        <button type="button" v-ripple class="prev_track" @click="skip('prev')"></button>
                        <div class="toogle_play">
                            <button type="button" v-ripple class="play" v-if="!playing" @click="play"></button>
                            <button type="button" v-ripple class="pause" v-if="playing" @click="pause"></button>
                        </div>
                        <button type="button" v-ripple class="next_track" @click="skip('next')"></button>
                    </div>
                    <div class="track_progress">
<!--                        <span class="time_current">{{ seek | minutes }}</span>-->
                        <span class="time_current">{{ duration/100 * progress | minutes }}</span>
                        <v-slider
                            color="#20C4F5"
                            track-color="#ffffff"
                            track-fill-color="#20C4F5"
                            thumb-color="#20C4F5"
                            thumb-size="0"
                            v-model="progress"
                            step="0.1"
                            @change="changeSetSeek($event)"
                            @mousedown="mouseDownSetSeek()"
                            @mouseup="mouseUpSetSeek($event)"
                            @start="startMove"
                            min="0"
                        >
                        </v-slider>
                        <span class="time_end">{{ duration | minutes }}</span>
                    </div>
                </div>
                <div class="wrap_drawer_list">
                    <button type="button" v-if="currentTrack && currentTrack.isFavorite === false" @click="addToFavorites" v-ripple class="favorite">Favorite</button>
                    <button type="button" v-if="currentTrack && currentTrack.isFavorite === true" @click="removeFromFavorites" v-ripple class="active favorite">Favorite</button>
                    <button type="button" v-ripple class="share">Share</button>
                    <button type="button" v-ripple class="add_to_playlist">Add to Playlist</button>
                </div>
                <button type="button" v-ripple class="close_drawer" @click="closePlayerMobileMenu">Cancel</button>

            </div>
        </v-navigation-drawer>
    </div>

</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {ImageRating} from 'vue-rate-it';
import dialogNeedLogin from '../components/dialogs/needLogin';

export default {
    name: "playerControlBars",
    components: {
        ImageRating,
        dialogNeedLogin
    },
    data() {
        return {
            seek: 0,
            progress: 0,
            // duration: 0,
            like: false,
            shareLink: '',
            volumeStatus: false,
            volumeBar: false,
            volume: 0.5,
            volumeOptions: {
                direction: 'btt',
                tooltip: 'none',
                min: 0.1,
                max: 1,
                interval: 0.1
            },
            srcRating: require('@/assets/image/diamond20x20.svg'),
            trackRating: null,
            setAllowRating: true,
            dialogNeedLoginVisible: false,
            hasScrolledToBottom: false,
            drawerPlayer: false,
            playerToggleWidth: false,
            changeProgress: false,
            currentSeekInterval: '',
        }
    },
    watch: {
        playerStatus() {
            if (this.playerStatus) {
                // window.addEventListener('scroll', this.onScroll);
            }
            // console.log('playerStatus', this.playerStatus);
        },

        playing(value) {
            if (value) {
                this.currentSeekInterval = setInterval(() => {
                    if (this.changeProgress !== true) {
                        this.seek = this.sound.seek();
                        this.progress = (this.seek / this.sound.duration()) * 100 || 0;
                    }
                }, 250);

                window.addEventListener('keydown', this.handleKeydown, null);
            } else {
                window.removeEventListener('keydown', this.handleKeydown);
            }
        },
    },
    computed: {
        ...mapGetters({
            authData: 'AUTH_DATA',
            playing: 'PLAYING',
            playerStatus: 'PLAYER_STATUS',
            currentTrack: 'CURRENT_TRACK',
            currentAlbum: 'CURRENT_ALBUM',
            trackList: 'TRACKS',
            sound: 'SOUND',
            shuffle: 'SHUFFLE',
            currentTrackIdx: 'CURRENT_TRACK_IDX',
            loop: 'LOOP',
            muted: 'MUTED',
            duration: 'DURATION',
            showPlayList: 'SHOW_PLAY_LIST',
            discovery: 'DISCOVERY',
            currentFromPlay: 'CURRENT_FROM_PLAY',
            playZone: 'PLAYED_ZONE',
            trackOnload: 'TRACK_ONLOAD'
        }),
    },
    mounted() {
        window.addEventListener('scroll', this.onScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.onScroll);
        clearInterval(this.currentSeekInterval);
    },
    methods: {
        ...mapActions({
            play: 'SET_PLAY',
            pause: 'SET_PAUSE',
            toggleShuffle: 'TOGGLE_SHUFFLE',
            toggleLoop: 'TOGGLE_LOOP',
            nextAlbum: 'SET_NEXT_ALBUM',
            setNextAlbum: 'SET_NEXT_ALBUM',
            toggleMute: 'TOGGLE_MUTE',
            setSoundVolume: 'SET_SOUND_VOLUME',
            changePlaylistStatus: 'CHANGE_PLAY_LIST_STATUS',
            addTrackRating: 'ADD_TRACK_RATING',
            addTrackToFavorites: 'ADD_TRACK_TO_FAVORITES',
            removeTrackFromFavorites: 'REMOVE_TRACK_FROM_FAVORITES',
        }),

        changeSetSeek(percents) {
            // this.changeProgress = true;
            // console.log('percents', percents);
        },
        mouseDownSetSeek() {
            this.changeProgress = true;
        },
        mouseUpSetSeek() {
            this.changeProgress = false;
            this.sound.seek((this.sound.duration() / 100) * this.progress);
        },
        startMove() {
            this.changeProgress = true;
        },
        handleKeydown(e) {
            switch (e.keyCode) {
                case 37:
                    this.updateSeek('prev');
                    break;
                case 39:
                    this.updateSeek('next');
                    break;
            }
        },
        updateSeek(direction) {
            if (this.sound.playing()) {
                if (direction === 'prev') {
                    this.sound.seek(this.sound.seek() - 10);
                }
                if (direction === 'next') {
                    this.sound.seek(this.sound.seek() + 10);
                }
            }
        },
        swipe(direction) {
            if (direction === 'Down') {
                this.drawerPlayer = false;
            }
        },
        setTrackRating(event, trackID) {
            this.trackRating = (Number(Math.ceil(this.currentTrack.rating)) === 0) ? null : Number(Math.ceil(this.currentTrack.rating));
            this.setAllowRating = false;
            if (this.authData.accessToken) {
                this.trackRating = this.currentTrack.rating;
                this.addTrackRating({trackID: trackID, rating: event});
            } else {
                this.dialogNeedLoginVisible = true;
            }
        },

        skip(direction) {
            this.$store.dispatch('SKIP_TRACK', direction);
            // let index = 0;
            // let lastIndex;
            // if (this.currentAlbum.playList) {
            //     lastIndex = this.currentAlbum.playList.length - 1;
            // } else {
            //     lastIndex = this.trackList.length - 1;
            // }
            //
            // if (this.shuffle) {
            //     index = Math.round(Math.random() * lastIndex);
            //     while (index === this.currentTrackIdx) {
            //         index = Math.round(Math.random() * lastIndex);
            //     }
            // }
            // if (direction === 'prev') {
            //     index = this.currentTrackIdx - 1;
            //
            //     if (!window.showAllTracks && this.$route.name === 'collection') {
            //         index = this.favIndexFinder(direction);
            //     }
            //     if (index < 0) {
            //         if (this.currentAlbum.playList) {
            //             index = this.currentAlbum.playList.length - 1;
            //         } else {
            //             index = this.trackList.length - 1;
            //         }
            //     }
            // }
            // if (direction === 'next') {
            //     index = this.currentTrackIdx + 1;
            //
            //     if (!window.showAllTracks && this.$route.name === 'collection') {
            //         index = this.favIndexFinder(direction);
            //     }
            //
            //     if (!this.currentAlbum.playList) {
            //         if (index >= this.trackList.length) {
            //             index = 0;
            //         }
            //     } else {
            //         if (index >= this.currentAlbum.playList.length) {
            //             index = 0;
            //         }
            //     }
            // }
            //
            // this.skipTo(index);
        },

        showVolume() {
            this.volumeStatus = true;
            setTimeout(() => {
                if (!this.volumeBar) {
                    this.volumeStatus = false;
                }
            }, 1000);
        },
        setVolumeBarStatus(status) {
            this.volumeBar = status;
            if (!status) {
                this.volumeStatus = status;
            }
        },
        createLinkTrack() {
            // console.log('this.currentAlbum.id', this.currentAlbum.playList);
            // let track = this.currentAlbum.playList.filter(item => +item === +this.currentTrack.id);
            let track = this.currentAlbum.playList.filter((item, index) => index === +this.currentTrack.id);
            console.log('track', track);
            this.shareLink = `https://${window.location.hostname}/album/${this.currentAlbum.id}/${track[0].id}`;
        },
        copyLinkPsytrance() {
            let copyText = document.querySelector("#input-share-track-link");
            copyText.select();
            document.execCommand("copy");
        },

        addToFavorites() {
            this.currentTrack.isFavorite = true;
            this.addTrackToFavorites({'song_id': this.currentTrack.id, 'album_id': this.currentAlbum.id})
                .then(() => {
                    // console.log('this.currentAlbum.playlist', this.currentAlbum.playList);
                    // let isNoFavorite = this.currentAlbum.playList.find(track => track.song.isFavorite === false);
                    // if (!isNoFavorite) {
                    //     this.currentAlbum.isFavorite = true;
                    // }
                })
                .catch(err => {
                    console.log(`onLike, ${err}`);
                })
        },
        removeFromFavorites() {
            this.currentTrack.isFavorite = false;
            this.removeTrackFromFavorites({'song_id': this.currentTrack.id, 'album_id': this.currentAlbum.id})
                .then(() => {
                    // this.currentAlbum.isFavorite = false;
                })
                .catch(err => {
                    console.log(`removeFromFavorites, ${err}`)
                })
        },

        updateVolume(event) {
            this.setSoundVolume(event);
        },
        onScroll: function () {
            window.onscroll = () => {
                this.hasScrolledToBottom = document.documentElement.scrollTop + window.innerHeight + 42 >= document.documentElement.scrollHeight;
            };
        },
        openPlayerMobileMenu() {
            this.drawerPlayer = true;
        },
        closePlayerMobileMenu() {
            this.drawerPlayer = false;
        },
    },

}
</script>

<style scoped lang="scss">

</style>
