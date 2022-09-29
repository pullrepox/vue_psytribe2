<template>
    <div v-if="albumDetails"
         :class="['album', { short: ALBUM_EXPANDED !== albumDetails.id }, { active: isCurrentPlaying }, { is_listened: albumDetails.isListened }]"
         :ref="`album-${albumDetails.id}`">

        <!-- SHORT ALBUM -->
        <div v-if="ALBUM_EXPANDED !== albumDetails.id" class="short_album" @click="changeVisibilityStatus(albumDetails.id)">
            <div class="description_info">

                <div v-if="UPPER_FILTER === 'topRated' && this.$route.name === 'explore'" class="top_rating">{{ index + 1 }}</div>
                <div class="cover_img" :class="{active: isCurrentPlaying}">
                    <img :src="albumDetails.smallImage" alt="">
                    <button v-if="!isCurrentPlaying" @click="playAlbum" class="play_album" :class="[isCurrentPlaying ? 'current' : 'not_current']">
                        <span class="material-icons">play_arrow</span>
                    </button>
                    <button v-if="isCurrentPlaying && playing" class="pause_album">
                        <span @click.self.prevent="pause"></span>
                    </button>
                    <button v-if="isCurrentPlaying && !playing" @click="play" class="play_album">
                        <span class="material-icons">play_arrow</span>
                    </button>
                </div>
                <div class="wrap_like_album" :class="{'hidden_like_album': hideLike}">
                    <template v-if="!hideLike">
                        <button v-if="albumDetails.isFavorite === false" class="like" @click.stop="addLike(albumDetails.id)"></button>
                        <button v-if="albumDetails.isFavorite === true" class="like active" @click.stop="removeLike(albumDetails.id)"></button>
                    </template>
                </div>

                <div class="name">
                    <span @click="redirectToAlbum(albumDetails.id)">
                        {{ albumDetails.title }}
                    </span>

                    <!--                    <router-link :to="{ name: 'albumDetails', params: {id: albumDetails.id}}">-->
                    <!--                        {{ albumDetails.title }}-->
                    <!--                    </router-link>-->
                </div>

                <div class="artist">
                    <template v-if="albumDetails.type === 'album'">
                        <router-link v-if="albumDetails.artist" :to="{ name: 'artist-profile',params: {id: albumDetails.artist.id}}">
                            {{ albumDetails.artist.name }}
                        </router-link>
                        <div class="artist" v-else>-</div>
                    </template>
                    <template v-if="albumDetails.type === 'collection'">
                        <span>Various Artists</span>
                    </template>
                </div>

                <!--                <div class="released" v-if="SHOW_COLUMNS.includes('released') && this.$route.name === 'library' || this.$route.name === 'collection'">-->
                <!--                    {{ albumDetails.releasedAt.date | moment("MMM, YYYY") }}-->
                <!--                </div>-->
                <div class="released" v-if="SHOW_COLUMNS.includes('released')">
                    {{ albumDetails.releasedAt | moment("MMM, YYYY") }}
                </div>
                <div class="rating" v-if="SHOW_COLUMNS.includes('rating')">
                    <!--                    <template v-if="UPPER_FILTER === 'topRated'">-->
                    <!--                        &lt;!&ndash; {{ Math.round(albumDetails.rating) }} &ndash;&gt;-->
                    <!--                        {{ albumDetails.rating3 }}-->
                    <!--                    </template>-->
                    <!--                    <template v-if="!UPPER_FILTER || UPPER_FILTER === 'newest'">-->
                    <!--                        &lt;!&ndash; {{ Math.round(albumDetails.rating) }} &ndash;&gt;-->
                    <!--                        {{ albumDetails.rating }}-->
                    <!--                    </template>-->
                    {{ albumDetails.rating }}
                </div>
                <div class="downloads" v-if="SHOW_COLUMNS.includes('downloads')">{{ albumDetails.downloaded }}</div>
            </div>

            <div class="actions_albums">
                <v-menu
                    transition="slide-y-transition"
                    :close-on-content-click="true"
                    offset-y
                    nudge-left="0"
                    nudge-bottom="10"
                    origin="top center"
                    content-class="menu-pointer charcoal"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <button v-ripple type="button" class="download" v-bind="attrs" v-on="on">Download</button>
                    </template>
                    <v-list>
                        <v-list-item v-if="albumDetails.links"><a :href="albumDetails.links.mp3">MP3</a></v-list-item>
                        <v-list-item v-if="albumDetails.links"><a :href="albumDetails.links.flac">FLAC</a></v-list-item>
                        <v-list-item v-if="albumDetails.links"><a :href="albumDetails.links.wav">WAV</a></v-list-item>
                    </v-list>
                </v-menu>

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
                        <button type="button" v-ripple class="more" v-bind="attrs" v-on="on"></button>
                    </template>
                    <v-list>
                        <v-list-item v-ripple v-if="isAdmin">
                            <button type="button" @click="editAlbum(albumDetails.id)">Edit Album</button>
                        </v-list-item>
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

        <!-- EXTEND ALBUM-->
        <div v-if="ALBUM_EXPANDED === albumDetails.id" class="album_content item_list">
            <div class="left_box">
                <div class="cover_album">
                    <div class="license">
                        <span>Released under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">Creative Commons license</a></span>
                        <span>For direct access visit <a href="https://ektoplazm.com/" target="_blank">www.Ektoplazm.com</a></span>
                    </div>
                    <img :src="albumDetails.smallImage" @click="$refs['modal-image'].show()" :alt="albumDetails.title">

                    <!------------------ Modal Image ------------------>
                    <modalImage ref="modal-image" :image="albumDetails.bigImage"/>
                </div>

                <template v-if="!PLAYED_ONLY_FAV_TRACKS">
                    <div class="wrap_rating" :class="{'active_loader': ratingLoader}">
                        <template v-if="UPPER_FILTER === 'popular'">
                            <!--                            {{ albumDetails.rating1 }}-->
                        </template>
                        <template v-if="UPPER_FILTER === 'trending'">
                            <!--                            {{ albumDetails.rating2 }}-->
                        </template>
                        <template v-if="UPPER_FILTER === 'topRated'">
                            <!--                            {{ albumDetails.rating3 }}-->
                        </template>
                        <template v-if="!UPPER_FILTER || UPPER_FILTER === 'new_releases'">
                            <!--                        {{ Math.round(albumDetails.rating) }}-->
                            <!--                            {{ albumDetails.rating }}-->
                        </template>
                        <image-rating
                            v-if="!ratingLoader"
                            :src="srcRating"
                            :item-size="20"
                            :spacing="3.37"
                            :increment="1"
                            :show-rating="false"
                            @rating-selected='setRating($event, albumDetails.id)'
                            :read-only="!this.setAllowRating"
                            v-model="albumRating">
                        </image-rating>
                        <div class="rating_info">
                            <div class="rating_loader" v-if="ratingLoader">Thank you for voting!</div>
                            <div v-if="!ratingLoader">{{ albumDetails.musicReleaseRatingsCount }} Votes</div>
                        </div>
                        <dialogNeedLogin v-model="dialogNeedLoginVisible"></dialogNeedLogin>
                    </div>
                </template>

            </div>

            <div class="info_album">
                <div class="head_album">
                    <div class="titles" @click="redirectToAlbum(albumDetails.id)">
                        {{ albumDetails.title }}
                        <!--                        <router-link class="album_title" :to="{ name: 'albumDetails', params: {id: albumDetails.id}}">-->
                        <!--                            {{ albumDetails.title }}-->
                        <!--                        </router-link>-->
                        <div class="album_artist">by
                            <template v-if="albumDetails.type === 'album'">
                                <router-link v-if="albumDetails.artist" :to="{ name: 'artist-profile', params: {id: albumDetails.artist.id}}">
                                    {{ albumDetails.artist.name }}
                                </router-link>
                                <div class="artist" v-else>-</div>

                                <a @click="dialogAreYouThisArtistVisible = true" v-if="!isAdmin" class="is_this_you">(Is this you?)</a>
                                <are-you-this-artist-dialog :artist="albumDetails.artist" v-model="dialogAreYouThisArtistVisible"></are-you-this-artist-dialog>
                            </template>
                            <template v-if="albumDetails.type === 'collection'">
                                <span>Various Artists</span>
                            </template>
                        </div>
                    </div>
                    <div class="actions">
                        <div class="date">{{ albumDetails.releasedAt  | moment('LL') }}</div>
                        <!--                        <button v-if="albumDetails.isFavorite === false" class="like" @click="addLike(albumDetails.id)"></button>-->
                        <!--                        <button v-if="albumDetails.isFavorite === true" class="like active" @click="removeLike(albumDetails.id)"></button>-->
                        <albumDetailsLikeButton :checked="albumDetails.isFavorite === true" :album="albumDetails"></albumDetailsLikeButton>
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
                                <button type="button" v-ripple class="more_btn" v-bind="attrs" v-on="on"></button>
                            </template>
                            <v-list>
                                <v-list-item v-ripple v-if="isAdmin">
                                    <button type="button" @click="editAlbum(albumDetails.id)">Edit Album</button>
                                </v-list-item>
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

                <div class="tags_list">
                    <span v-ripple v-for="(tag, index) of albumDetails.tags" :key="tag + index" @click="selectTag(tag)">{{ tag }}</span>
                </div>

                <!-- Download Album -->
                <template v-if="!PLAYED_ONLY_FAV_TRACKS">
                    <template v-if="albumDetails > 0">
                        Buy Now
                        <span class="buy_value">${{ albumDetails.price }}</span>
                    </template>
                    <template v-else-if="!albumDetails.price || albumDetails.price === 0 || albumDetails.price === null">
                        <div class="buy_now">
                            <v-menu
                                transition="slide-y-transition"
                                :close-on-content-click="true"
                                offset-y
                                nudge-left="0"
                                nudge-bottom="15"
                                origin="top center"
                                content-class="menu-pointer download-album charcoal">

                                <template v-slot:activator="{ on, attrs }">
                                    <button v-ripple type="button" class="download_album c2a_btn small" v-bind="attrs" v-on="on">
                                        Download
                                    </button>
                                </template>
                                <v-list>
                                    <v-list-item v-ripple v-if="albumDetails.links"><a :href="albumDetails.links.mp3">MP3</a></v-list-item>
                                    <v-list-item v-ripple v-if="albumDetails.links"><a :href="albumDetails.links.flac">FLAC</a></v-list-item>
                                    <v-list-item v-ripple v-if="albumDetails.links"><a :href="albumDetails.links.wav">WAV</a></v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </template>
                </template>

                <!-- Description Album -->
                <template v-if="albumDetails.description !== null && albumDetails.description !== undefined">
                    <div class="descript_info text" v-if="albumDetails.description.length < albumDescriptionLength" v-html="albumDetails.description"></div>
                    <template v-else>
                      <span class="descript_info text">
                        <p v-html="albumDetails.description.substring(0, albumDescriptionLength)"></p>
                        <p>... </p>
                        <p v-if="albumDetails.description.length > albumDescriptionLength" class="see_more"
                           @click="seeMore">See more</p>
                      </span>
                    </template>
                </template>

                <album-play-list
                    :album="albumDetails"
                    :albumLocation="albumLocation">
                </album-play-list>

            </div>

            <div class="album_background" v-bind:style="{'background-image': 'url('+(albumDetails.smallImage)+')'}"></div>
        </div>

    </div>

</template>

<script>
import albumPlayList from './albumPlayList.vue';
import {mapActions, mapGetters} from 'vuex';
import {ImageRating} from 'vue-rate-it';
import dialogNeedLogin from '../components/dialogs/needLogin';
import areYouThisArtistDialog from '../components/dialogs/areYouThisArtist';
import ModalImage from "@/components/public/modalImage";
import albumDetailsLikeButton from '@/components/small/albumDetailsLikeButton';

export default {
    name: 'album',
    props: ['albumDetails', 'discoveryStatus', 'index', 'isFavouriteSong', 'hideLike', 'albumLocation', 'playZone', 'playOnlyLikedTracks'],

    components: {
        albumPlayList,
        ImageRating,
        dialogNeedLogin,
        areYouThisArtistDialog,
        ModalImage,
        albumDetailsLikeButton
    },
    data() {
        return {
            isAdmin: false,
            selectedAlbum: null,
            DownloadBtnShow: false,
            activeTabs: null,
            showAlbum: null,
            artistID: null,
            artistName: null,
            albumDescriptionLength: 500,
            srcRating: require('@/assets/image/diamond20x20.svg'),
            dialogNeedLoginVisible: false,
            dialogAreYouThisArtistVisible: false,
            coverAlbumDialog: false,
            albumRating: Number(Math.round(this.albumDetails.rating)),
            setAllowRating: true,
            ratingLoader: false,
            // showTopRated: false,
            // showAll: {
            //     type: Boolean,
            //     default: true
            // },
            showDownloadAlbum: true,
        }
    },
    watch: {
        // UPPER_FILTER() {
        //     if (this.UPPER_FILTER.length && this.UPPER_FILTER !== 'new_releases') {
        //         this.showTopRated = true;
        //     }
        // }
    },
    created() {
        // this.showAll = this.$route.params.favourite !== 'favourite';
    },
    computed: {
        ...mapGetters({
            playing: 'PLAYING',
            currentAlbum: 'CURRENT_ALBUM',
            playList: 'PLAY_LIST',
        }),
        ...mapGetters([
            'AUTH_DATA', 'SHOW_COLUMNS', 'ALBUM_RATING', 'ALBUM_EXPANDED', 'ALBUM',
            'MUSIC_RELEASE', 'ALBUMS_DYNAMIC_KEY', 'EXPLORE_GRID_ALBUMS', 'UPPER_FILTER',
            'PLAYED_ONLY_FAV_TRACKS'
        ]),
        isCurrentPlaying() {
            return !!this.currentAlbum && this.currentAlbum.id === this.albumDetails.id;
        },
        albumInPlayList() {
            const playlist = Object.fromEntries(this.playList.map(({id}) => [id, true]));
            return this.albumDetails.playList.every(({id}) => (playlist[id]));
        },
    },
    mounted() {
        if (this.ALBUM_EXPANDED) {
            const currentAlbum = this.$refs[`album-${this.ALBUM_EXPANDED}`];
            if (currentAlbum) {
                this.$nextTick(() => {
                    currentAlbum.scrollIntoView({
                        behavior: 'smooth',
                    });
                })
            }
        }
    },
    methods: {
        ...mapActions({
            play: 'SET_PLAY',
            pause: 'SET_PAUSE',
            addAlbumToPlaylist: 'ADD_ALBUM_TO_PLAYLIST',
            addAlbumToFavorite: 'ADD_ALBUM_TO_FAVORITES',
            removeAlbumFromFavorites: 'REMOVE_ALBUM_FROM_FAVORITES',
            addAlbumRating: 'ADD_MUSIC_RELEASED_RATING',
            getAlbum: 'GET_ALBUM',
            getAlbums: 'GET_MUSIC_RELEASE',
            // addToPlayedMusicRelease: 'INCREASE_PLAYED_MUSIC_RELEASE'
        }),
        redirectToAlbum(albumID) {
            this.$router.push({name: 'albumDetails', params: {id: albumID, favourite: this.isFavouriteSong}});
        },
        setRating(event, albumID) {
            this.albumRating = Number(Math.round(this.albumDetails.rating));
            this.setAllowRating = false;
            if (this.AUTH_DATA.accessToken) {
                this.ratingLoader = true;
                this.albumRating = Number(Math.round(this.albumDetails.rating));
                this.addAlbumRating({albumID: albumID, rating: event})
                    .then(() => {
                        // this.updateAlbum(albumID);
                    })
                    .catch(err => {
                        console.log(`addAlbumRating, ${err}`);
                    })
            } else {
                // popup
                this.dialogNeedLoginVisible = true;
            }
        },

        changeVisibilityStatus(id) {
            this.$store.commit('SET_ALBUM_EXPANDED', id);

            if (this.ALBUM_EXPANDED) {
                const currentAlbum = this.$refs[`album-${id}`];

                if (currentAlbum) {
                    this.$nextTick(() => {
                        currentAlbum.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'  // nearest
                        });
                    });
                }
            }
        },
        tabs(activeTab) {
            this.activeTabs = activeTab;
        },
        playAlbum() {
            if (!this.isCurrentPlaying) {

                this.$store.dispatch('SET_PLAYED_ZONE', this.playZone);
                let albumToPlay;

                if (this.playOnlyLikedTracks === true) {
                    albumToPlay = this.albumDetails.playList.filter(track => track.song.isFavorite === true);
                } else {
                    albumToPlay = this.albumDetails.playList;
                }

                this.play({
                    fromPlay: 'album_default',
                    track: albumToPlay[0].song,
                    index: 0,
                    album: this.albumDetails,
                    isDiscoveryStatus: this.discoveryStatus
                });
                // this.$store.commit('SET_PLAYED_ALBUMS_LIST', this.EXPLORE_GRID_ALBUMS);
                // this.changeVisibilityStatus(this.currentAlbum.id);
            }
        },
        addLike(albumID) {
            if (this.AUTH_DATA.accessToken) {
                this.albumDetails.isFavorite = true;
                this.$store.commit('SET_UPDATE_FAVOURITE_MUSIC_RELEASE', true);
                for (let i = 0; i < this.albumDetails.playList.length; i++) {
                    this.albumDetails.playList[i].song.isFavorite = true;
                }
                this.$store.dispatch('SET_PLAYED_ONLY_FAV_TRACKS', false);
                this.addAlbumToFavorite({'music_release_id': albumID})
                    .then(() => {
                    })
                    .catch(err => {
                        console.log(`albumDetails addLike, ${err}`);
                    })
            } else {
                this.dialogNeedLoginVisible = true;
            }
        },
        removeLike(albumID) {
            if (this.AUTH_DATA.accessToken) {
                this.albumDetails.isFavorite = false;
                this.$store.commit('SET_UPDATE_FAVOURITE_MUSIC_RELEASE', true);
                for (let i = 0; i < this.albumDetails.playList.length; i++) {
                    this.albumDetails.playList[i].song.isFavorite = false;
                }
                this.removeAlbumFromFavorites({'music_release_id': albumID})
                    .then(() => {
                    })
                    .catch(err => {
                        console.log(`albumDetails removeLike, ${err}`);
                    })
            } else {
                this.dialogNeedLoginVisible = true;
            }
        },

        showDownload(data) {
            this.showDownloadAlbum = data;
        },
        seeMore() {
            this.albumDescriptionLength = 1000;
        },
        selectTag(tag) {
            // this.$store.dispatch('UPDATE_SUBGENRE', {});
            // this.$store.dispatch('UPDATE_BPM', []);
            // this.$store.dispatch('UPDATE_KEYS', []);
            this.$store.dispatch('UPDATE_TAGS', [tag]);
            this.$store.commit('SET_ALBUM_EXPANDED', null);
            this.scrollTop();
            this.$store.commit('SET_STATUS_FILTER', true);
        },
        editAlbum(albumID) {
            this.$store.commit('SET_EDIT_ALBUM_ID', albumID);
            this.$router.push({name: 'musicUpload'});
        },
        scrollTop() {
            const el = document.getElementById('explore-nav-id');
            if (el) {
                el.scrollIntoView({behavior: 'smooth'});
            }
        },
    },

}
</script>
