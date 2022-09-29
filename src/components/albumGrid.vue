<template>
    <div
        class="item_grid_album"
        @click="redirectToAlbum(album.id)"
        :class="{
          'playing_album': isCurrentPlaying && playing,
          'current_album': isCurrentPlaying,
          'is_listened': album.isListened,
          'small': small
        }"
        :ref="`album-${album.id}`">
        <div class="album_cover" :class="{'no_img': !album.smallImage}">
            <div class="active_overlay" :class="{'active_like': album.isFavorite === true}">
                <template v-if="!hideLike">
                    <button type="button" class="like" v-if="album.isFavorite === false" @click.stop="addLike(album.id)"></button>
                    <button type="button" class="like active" v-if="album.isFavorite === true" @click.stop="removeLike(album.id)"></button>
                </template>
                <template>
                    <button class="play_album" v-if="!isCurrentPlaying" @click.stop="playAlbum" :class="[isCurrentPlaying ? 'current' : 'not_current']">
                        <span class="material-icons">play_arrow</span>
                    </button>
                    <button class="play_album" v-if="isCurrentPlaying && !playing" @click.stop="play" :class="[isCurrentPlaying ? 'current' : 'not_current']">
                        <span class="material-icons">play_arrow</span>
                    </button>
                    <button type="button" class="pause_album" v-if="isCurrentPlaying && playing" @click.stop="pause">
                        <span></span>
                    </button>
                </template>
            </div>
<!--            <lazyImage :src="album.smallImage"></lazyImage>-->
            <img :src="album.smallImage" alt="" @load="imgLoadedMethod" loading="lazy" :class="imgIsLoaded ? 'show' : ''">
        </div>
        <!--        <router-link class="album_name" :to="{ name: 'albumDetails', params: {id: album.id, favourite: this.isFavouriteSong }}">{{ album.title }}</router-link>-->
        <div class="album_name">{{ album.title }}</div>
        <div class="album_artist" v-if="!hideArtist" @click.stop="redirectToArtistPage(album.artist.id)">
            <template v-if="album.artist">
                <span>by</span>
                {{ album.artist.name }}
            </template>
        </div>

        <dialogNeedLogin v-model="dialogNeedLoginVisible"></dialogNeedLogin>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
// import lazyImage from "@/components/small/lazy-image";

const dialogNeedLogin = () => import('@/components/dialogs/needLogin');

export default {
    name: "albumGrid",
    props: ['album', 'small', 'discoveryStatus', 'isFavouriteSong', 'hideArtist', 'playOnlyLikedTracks', 'hideLike', 'playZone'],
    components: {
        dialogNeedLogin,
        // lazyImage,
    },
    data() {
        return {
            imgIsLoaded: false,
            showAllTracks: false,
            dialogNeedLoginVisible: false,
            // placeholder: 'https://cdn-images-1.medium.com/max/30/1*V0F0-8AH8oV1LUSCbQsX4w.png'
        }
    },
    watch: {
        DISCOVERY() {
            // this.updateAlbum();
        }
    },
    created() {
        if (this.CURRENT_PAGE.name === 'collection') {
            this.$store.dispatch('SET_PLAYED_ONLY_FAV_TRACKS', true);
        } else {
            // this.$store.dispatch('SET_PLAYED_ONLY_FAV_TRACKS', false);
        }
    },
    computed: {
        ...mapGetters({
            authData: 'AUTH_DATA',
            playing: 'PLAYING',
            currentAlbum: 'CURRENT_ALBUM',
            currentTrack: 'CURRENT_TRACK',
            albumExpanded: 'ALBUM_EXPANDED',
        }),
        ...mapGetters(['ALBUM', 'ALBUMS_DYNAMIC_KEY', 'EXPLORE_GRID_ALBUMS', 'DISCOVERY', 'CURRENT_PAGE', 'PLAYED_ONLY_FAV_TRACKS']),
        isCurrentPlaying() {
            return !!this.currentAlbum && this.currentAlbum.id === this.album.id;
        },
    },

    mounted() {
        // for(let album of this.EXPLORE_GRID_ALBUMS) {
        //
        // }
        // if(this.currentTrack.isFavorite===false){
        //     this.pause();
        // }
        // if (this.albumExpanded) {
        //     const currentAlbum = this.$refs[`album-${this.albumExpanded}`];
        //     if (currentAlbum) {
        //         this.$nextTick(() => {
        //             currentAlbum.scrollIntoView({
        //                 behavior: 'smooth',
        //             });
        //         })
        //     }
        // }
    },
    methods: {
        imgLoadedMethod () {
            this.imgIsLoaded = true;
        },
        ...mapActions({
            play: 'SET_PLAY',
            pause: 'SET_PAUSE',
            getAlbum: 'GET_ALBUM',
            // addToPlayedMusicRelease : 'INCREASE_PLAYED_MUSIC_RELEASE',
        }),
        ...mapActions([
            'ADD_ALBUM_TO_FAVORITES',
            'REMOVE_ALBUM_FROM_FAVORITES'
        ]),
        redirectToArtistPage(artistId) {
            this.$router.push({name: 'artist-profile', params: {id: artistId}});
        },
        redirectToAlbum(albumID) {
            this.$router.push({name: 'albumDetails', params: {id: albumID, favourite: this.isFavouriteSong}});
        },
        playAlbum() {
            if (!this.isCurrentPlaying) {
                let albumToPlay;

                if (this.playOnlyLikedTracks === true) {
                    albumToPlay = this.album.playList.filter(track => track.song.isFavorite === true);
                    this.$store.commit('SET_PLAYED_ONLY_FAV_TRACKS', true);
                } else {
                    albumToPlay = this.album.playList;
                    this.$store.commit('SET_PLAYED_ONLY_FAV_TRACKS', false);
                }


                this.$store.dispatch('SET_PLAYED_ZONE', this.playZone);
                this.play({
                    fromPlay: 'album_default',
                    track: albumToPlay[0].song,
                    index: 0,
                    album: this.album,
                    isDiscoveryStatus: this.discoveryStatus
                });

                // this.$store.commit('SET_PLAYED_ALBUMS_LIST', this.EXPLORE_GRID_ALBUMS);
            }
            // this.addToPlayedMusicRelease({'musicReleaseID': this.album.id})
            //     .then(() => {
            //         console.log(`album - ${this.album.id} added to played`);
            //     })
            //     .catch(err => {
            //         console.log(`addTrackToFavorites, ${err}`);
            //     });
        },
        addLike(id) {
            if (this.authData.accessToken) {
                this.album.isFavorite = true;
                this.$store.commit('SET_UPDATE_FAVOURITE_MUSIC_RELEASE', true);
                //this.addAlbumToFavorites({'music_release_id': id})
                this.ADD_ALBUM_TO_FAVORITES({'music_release_id': id})
                    .then(() => {
                        for (let i = 0; i < this.album.playList.length; i++) {
                            this.album.playList[i].song.isFavorite = true;
                        }
                    })
                    .catch(err => {
                        console.log(`addAlbumToFavorites, ${err}`);
                    })
            } else {
                this.dialogNeedLoginVisible = true;
            }
        },
        removeLike(id) {
            if (this.authData.accessToken) {
                this.album.isFavorite = false;
                this.$store.commit('SET_UPDATE_FAVOURITE_MUSIC_RELEASE', true);

                this.REMOVE_ALBUM_FROM_FAVORITES({'music_release_id': id})
                    .then(() => {
                        for (let i = 0; i < this.album.playList.length; i++) {
                            this.album.playList[i].song.isFavorite = false;
                        }
                    })
                    .catch(err => {
                        console.log(`removeAlbumFromFavorites, ${err}`);
                    })
            } else {
                this.dialogNeedLoginVisible = true;
            }
        },
        updateAlbum(albumID) {
            console.log('updateAlbum', albumID);
            // for (let iter = 0; iter < this.MUSIC_RELEASE.length; iter++) {
            //     if (this.MUSIC_RELEASE[iter].id === albumID) {
            //         this.getAlbum(albumID).then(() => {
            //             this.MUSIC_RELEASE[iter] = this.ALBUM;
            //             this.$store.commit('UPDATE_ALBUMS_DYNAMIC_KEY', this.ALBUMS_DYNAMIC_KEY + 1);
            //         }).catch(err => {
            //             console.log(`setRating - getAlbum ${err}`);
            //         })
            //         break;
            //     }
            // }
            for (let iter = 0; iter < this.EXPLORE_GRID_ALBUMS.length; iter++) {
                if (this.EXPLORE_GRID_ALBUMS[iter].id === albumID) {
                    this.getAlbum(albumID).then(() => {
                        this.EXPLORE_GRID_ALBUMS[iter] = this.ALBUM;
                        this.$store.commit('UPDATE_ALBUMS_DYNAMIC_KEY', this.ALBUMS_DYNAMIC_KEY + 1);
                    }).catch(err => {
                        console.log(`setRating - getAlbum ${err}`);
                    })
                    break;
                }
            }
        },
    }
}
</script>

<style scoped>
img {
    opacity: 0;
    transition: 0.3s;
}
img.show {
    opacity: 1;
}
</style>
