<template>
    <div class="content-page p-album-details">

        <div class="container auto_height album_details_page" v-if="!mobile">

            <!-- Skeleton Loader -->
            <template v-if="infoAlbumLoader">
                <headSkeletonLoader :parent="'album-details'"></headSkeletonLoader>
            </template>


            <!-- desktop version. D >= 768 -->
            <div class="album inside_album">
                <div class="album_content" v-if="!infoAlbumLoader">
                    <div class="left_box">
                        <div class="cover_album" :class="{'no-img': !albumDetails.smallImage}">
                            <div class="license">
                                  <span>Released under
                                    <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">Creative Commons license</a>
                                  </span>
                                <span>For direct access visit
                                    <a href="https://ektoplazm.com/" target="_blank">www.Ektoplazm.com</a>
                                  </span>
                            </div>
                            <img :src="albumDetails.smallImage" @click="$refs['modal-image'].show()">
                        </div>
                    </div>

                    <div class="info_album" id="album-details-info">
                        <div class="head_album">
                            <div class="titles">
                                <div class="date mobile">{{ albumDetails.releasedAt  | moment('LL') }}</div>
                                <div class="album_title"> {{ albumDetails.title }}</div>

                                <div class="owner">
                                    <router-link
                                        class="album_artist"
                                        v-if="albumDetails.artist && albumDetails.type !== 'collection'"
                                        :to="{ name: 'artist-profile', params: {id: albumDetails.artist.id}}">
                                        <span>By</span> {{ albumDetails.artist.name }}
                                    </router-link>
                                    <div class="album_artist" v-else-if="albumDetails.type === 'collection'">
                                        <span>By Various Artists</span>
                                    </div>
                                    <button
                                        type="button"
                                        @click="dialogAreYouThisArtistVisible = true"
                                        class="is-this-you-link"
                                        v-if="!isAdmin && albumDetails.type !== 'collection'"
                                    >(Is this you?)
                                    </button>
                                    <are-you-this-artist-dialog :artist="ARTIST" v-model="dialogAreYouThisArtistVisible"></are-you-this-artist-dialog>
                                </div>

                            </div>
                            <div class="actions">
                                <div class="date">{{ albumDetails.releasedAt  | moment('LL') }}</div>

                                <div v-if="albumDetails.isFavorite === false" class="album_details_like_button" @click="addAlbumLike"
                                     :class="{'active': albumDetails.isFavorite === true}">
                                    <svg id="heart-svg" :class="{'heart_svg': true}" width="21" height="18" viewBox="5 -2 10 16" fill="none">
                                        <path id="heart" class="heart_path" fill="#AAB8C2"
                                              d="M10.2031 18L8.75313 16.7052C3.60313 12.1243 0.203125 9.103 0.203125 5.3951C0.203125 2.37384 2.62313 0 5.70312 0C7.44312 0 9.11312 0.794551 10.2031 2.05014C11.2931 0.794551 12.9631 0 14.7031 0C17.7831 0 20.2031 2.37384 20.2031 5.3951C20.2031 9.103 16.8031 12.1243 11.6531 16.715L10.2031 18Z"/>
                                    </svg>
                                    <dialogNeedLogin v-model="dialogNeedLoginVisible"></dialogNeedLogin>
                                </div>

                                <div v-if="albumDetails.isFavorite === true" class="album_details_like_button" @click="removeAlbumLike"
                                     :class="{'active': albumDetails.isFavorite === true}">
                                    <svg id="heart-svg" :class="{'heart_svg': true}" width="21" height="18" viewBox="5 -2 10 16" fill="none">
                                        <path id="heart" class="heart_path" fill="#AAB8C2"
                                              d="M10.2031 18L8.75313 16.7052C3.60313 12.1243 0.203125 9.103 0.203125 5.3951C0.203125 2.37384 2.62313 0 5.70312 0C7.44312 0 9.11312 0.794551 10.2031 2.05014C11.2931 0.794551 12.9631 0 14.7031 0C17.7831 0 20.2031 2.37384 20.2031 5.3951C20.2031 9.103 16.8031 12.1243 11.6531 16.715L10.2031 18Z"/>
                                    </svg>
                                    <dialogNeedLogin v-model="dialogNeedLoginVisible"></dialogNeedLogin>
                                </div>


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
                                            <button type="button" @click="markUndiscovered(albumDetails)">Mark undiscovered</button>
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
                        <!--END head_album -->

                        <div class="tags_list" :class="{'edit_tags': isEditTags === true && AUTH_DATA.userRoles.includes('ROLE_ADMIN')}">
                            <span v-ripple v-for="tag of albumDetails.tags" :key="tag" @click="selectTag(tag)">
                                {{ tag }}
                                <button v-if="isEditTags && AUTH_DATA.userRoles.includes('ROLE_ADMIN')" type="button" class="btn_delete_tag"
                                        @click="deleteTag(tag)"></button>
                            </span>

                            <span class="new_tag" v-if="showNewTag">
                                <input type="text" v-model="nameNewTag" ref="actionNewTag" @keydown.enter="addTagToTags">
                            </span>
                            <button v-if="isEditTags && AUTH_DATA.userRoles.includes('ROLE_ADMIN')" type="button" class="btn_add_tag" @click="addTag">Add Tag
                            </button>

                            <button type="button" class="btn_edit_tags" v-if="isEditTags === false && AUTH_DATA.userRoles.includes('ROLE_ADMIN')"
                                    @click="isEditTags = true; editTags()">Edit
                            </button>
                            <button type="button" class="btn_edit_tags" v-if="isEditTags === true && AUTH_DATA.userRoles.includes('ROLE_ADMIN')"
                                    @click="isEditTags = false; saveTags()">Save
                            </button>
                        </div>

                        <div v-if="!PLAYED_ONLY_FAV_TRACKS" class="d-inline-block">
                            <div class="wrap_rating">
                                <image-rating
                                    :src="srcRating"
                                    :item-size="20"
                                    :spacing="3.37"
                                    :increment="1"
                                    :show-rating="false"
                                    @rating-selected='setRating($event, albumDetails.id)'
                                    :read-only="!this.setAllowRating"
                                    v-model="albumDetails.rating">
                                </image-rating>

                                <div class="rating_info">
                                    <!--                                {{ Math.ceil(ALBUM.rating) }} Rating-->
                                    {{ albumDetails.musicReleaseRatingsCount }} Votes
                                </div>
                                <div class="thank_you_voting" :class="{'active': showThankYouVoting}">Thank you for voting!</div>
                                <dialogNeedLogin v-model="dialogNeedLoginVisible"></dialogNeedLogin>
                            </div>
                        </div>

                        <div class="buy_now" v-if="albumDetails.isFavorite || !PLAYED_ONLY_FAV_TRACKS">
                            <template v-if="albumDetails.price > 0">
                                Buy Now
                                <span class="buy_value">${{ ALBUM.price }}</span>
                            </template>
                            <template v-else-if="!albumDetails.price || albumDetails.price === 0 || albumDetails.price === null">

                                <template v-if="this.$route.params.favourite === 'favourite'">
                                    <template v-if="albumDetails.isFavorite || !PLAYED_ONLY_FAV_TRACKS">
                                        <button type="button" class="download_album c2a_btn small" @click="downloadAlbum">Download</button>
                                    </template>
                                </template>
                                <template v-else>
                                    <button type="button" class="download_album c2a_btn small" @click="downloadAlbum">Download</button>
                                </template>
                            </template>
                        </div>

                        <!-- description -->
                        <template v-if="albumDetails.description !== null && albumDetails.description !== undefined">
                            <div class="descript_info text"
                                 v-if="albumDetails.description.length < albumDescriptionLength"
                                 v-html="albumDetails.description">
                            </div>
                            <template v-else>
                              <span class="descript_info text">
                                <p v-html="albumDetails.description.substring(0, albumDescriptionLength)"></p>
                                <p>... </p>
                                <p v-if="albumDetails.description.length > albumDescriptionLength" class="see_more" @click="seeMore">See more</p>
                              </span>
                            </template>
                        </template>

                    </div>
                </div>
                <div class="descript_info text mobile" v-html="albumDetails.description"></div>
                <!-- END album_content-->

                <div class="wrap_album_playlist">
                    <album-play-list
                        v-if="!infoAlbumLoader"
                        :album="albumDetails"
                        :detailsTrack="true"
                        :autoPlayTrack="+trackID">
                    </album-play-list>

                    <playlistSkeletonLoader v-if="infoAlbumLoader" :parent="'album-details-playlist'" :count="5"></playlistSkeletonLoader>
                </div>

            </div>

        </div>
        <div class="album_background" v-bind:style="{'background-image': 'url('+(albumDetails.smallImage)+')'}"></div>


        <!-- mobile version. D < 768 -->
        <div class="mobile_album_details" v-if="mobile && albumDetails">
            <div class="container">
                <div class="cover_album">
                    <button type="button" v-ripple class="add_like" v-if="albumDetails.isFavorite === false" @click="addAlbumLike(albumDetails.id)"></button>
                    <button type="button" v-ripple class="remove_like" v-if="albumDetails.isFavorite === true"
                            @click="removeAlbumLike(albumDetails.id)"></button>
                    <div class="license">
                          <span>Released under
                            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">Creative Commons license</a>
                          </span>
                        <span>For direct access visit
                            <a href="https://ektoplazm.com/" target="_blank">www.Ektoplazm.com</a>
                        </span>
                    </div>
                    <img :src="albumDetails.smallImage" alt="">
                    <template>
                        <button type="button" v-ripple class="album_play" v-if="!isCurrentPlaying" @click="playAlbum"
                                :class="[isCurrentPlaying ? 'current' : 'not_current']"></button>
                        <button type="button" v-ripple class="album_play" v-if="isCurrentPlaying && !playing" @click="play"
                                :class="[isCurrentPlaying ? 'current' : 'not_current']"></button>
                        <button type="button" v-ripple class="album_pause" v-if="isCurrentPlaying && playing" @click="pause"></button>
                    </template>
                </div>
            </div>
            <album-play-list
                :album="albumDetails"
                :detailsTrack="true"
                :autoPlayTrack="+trackID">
            </album-play-list>
            <!--            <div class="mobile_track_list">-->
            <!--                <div class="item_track"-->
            <!--                     :class="{'playing': currentTrack !== null && currentTrack.id === track.song.id && playing}"-->
            <!--                     v-for="(track, index) of albumDetails.playList" :key="track.id"-->
            <!--                     @click="mobilePlayTrack(track, index, albumDetails)">-->
            <!--                    <div class="main_info">-->
            <!--                        <div class="index">{{ index + 1 }}</div>-->
            <!--                        <div class="track_descript">-->
            <!--                            <span class="name" v-if="track.song">{{ track.song.title }}</span>-->
            <!--                            <span class="artist" v-if="track">{{ track.song.artist.name }}</span>-->
            <!--                        </div>-->
            <!--                    </div>-->
            <!--                    <div class="other_info">-->
            <!--                        <span class="price"></span>-->
            <!--                        <button type="button" class="more" @click="drawerTrack = true">-->
            <!--                            <span class="material-icons-outlined">more_vert</span>-->
            <!--                        </button>-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--                <v-navigation-drawer v-touch="{right: () => swipe('Right')}"-->
        </div>

        <v-overlay :value="loader && mobile">
            <v-progress-circular
                :size="80"
                :width="2"
                color="#20C4F5"
                indeterminate
            ></v-progress-circular>
        </v-overlay>


        <!------------------ Supporters ------------------>
        <div class="supporters" v-if="albumDetails && defer(3)">
            <div class="container">
                <h3>Supporters <span class="count" v-if="SUPPORTERS.length">{{ SUPPORTERS.length }}</span></h3>
                <template v-if="SUPPORTERS.length">
                    <div class="supporters_cnt" v-for="supporter of SUPPORTERS" :key="supporter.id">

                        <!--                    <b-tooltip position="is-top" multilined>-->
                        <!--                      <div class="item_supporter"></div>-->
                        <!--                      <template v-slot:content>-->
                        <!--                        <div class="supporter">-->
                        <!--                          <span class="name">Brian Hollister</span>-->
                        <!--                          <span class="nick">(McDubbin)</span>-->
                        <!--                        </div>-->
                        <!--                      </template>-->
                        <!--                    </b-tooltip>-->

                        <div class="item_supporter">{{ supporter }}</div>
                    </div>
                    <button class="show_more">Show More</button>
                </template>
                <template v-else>
                    <div class="none_supporters">Nothing here yet</div>
                </template>
            </div>
        </div>

        <div class="mobile_tags" v-if="albumDetails.tags">
            <div class="container">
                <h3 class="tags_title">Tags</h3>
                <div class="wrap_tags">
                    <span v-ripple v-for="tag of albumDetails.tags" :key="tag" @click="selectTag(tag)">{{ tag }}</span>
                </div>
            </div>
        </div>

        <!------------------ Comments ------------------>
        <section class="comments" id="comments-section" v-if="albumDetails && defer(3)">
            <div class="container">
                <template v-if="albumDetails.id">
                    <Comments :albumID="albumDetails.id"></Comments>
                </template>
            </div>
        </section>

        <!------------------ More Artist Albums ------------------>
        <div class="more_from_artist" v-if="moreArtistAlbums.length && defer(3)">
            <v-container>
                <div class="_head_section">More from artist</div>
                <div class="wrap_more_albums">
                    <albumGrid v-for="album in moreArtistAlbums"
                               :key="album.id"
                               :album="album"
                               :class="'small'"
                               :hideArtist="true">
                    </albumGrid>
                </div>
            </v-container>
        </div>

        <!------------------ Modal Image ------------------>
        <modalImage ref="modal-image" :image="albumDetails.bigImage"/>

        <downloadMessageDialog v-model="downloadMessageDialogVisible" :downloadDisable="downloadDisable"
                               :limit="downloadLimit" :downloaded="numberOfDownload"
                               v-on:callDownloadMethod="downloadAlbum"></downloadMessageDialog>
        <v-progress-circular
            v-if="loading"
            :size="80"
            :width="2"
            color="#20C4F5"
            indeterminate
        ></v-progress-circular>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {ImageRating} from 'vue-rate-it';

import albumGrid from '@/components/albumGrid';
import albumPlayList from '@/components/albumPlayList';
import headSkeletonLoader from "@/components/small/skeleton-loaders/headSkeletonLoader";
import playlistSkeletonLoader from "@/components/small/skeleton-loaders/playlistSkeletonLoader";

const Comments = () => import('@/components/commentsV2');
const dialogNeedLogin = () => import('@/components/dialogs/needLogin');
const modalImage = () => import("@/components/public/modalImage");
const areYouThisArtistDialog = () => import ('@/components/dialogs/areYouThisArtist');

import Defer from '@/utils/defer';

const downloadMessageDialog = () => import('@/components/dialogs/downloadMessage');

export default {
    name: "albumDetails",
    props: ['id', 'trackID', 'isFavouriteSong', 'isFavourite'],
    components: {
        albumPlayList,
        albumGrid,
        Comments,
        ImageRating,
        dialogNeedLogin,
        modalImage,
        areYouThisArtistDialog,
        headSkeletonLoader,
        playlistSkeletonLoader,
        downloadMessageDialog
    },
    data() {
        return {
            infoAlbumLoader: false,
            isHidden: true,
            loader: false,
            artistId: null,
            albumID: null,
            albumDetails: '',
            albumDescriptionLength: 500,
            albumDetailsSong: '',
            albumDetailFavouriteSong: '',
            srcRating: require('@/assets/image/diamond20x20.svg'),
            setAllowRating: true,
            albumRating: 0,
            columns: this.$store.getters.SHOW_COLUMNS_TRACK,

            moreArtistAlbums: [],

            // Carousel
            options: {
                rewind: true,
                perPage: 6,
                gap: '50px',
                pagination: false,
            },
            dialogNeedLoginVisible: false,
            downloadMessageDialogVisible: false,
            coverAlbumDialog: false,
            mobile: false,
            albumDescription: false,

            isAdmin: false,
            isEditTags: false,
            showNewTag: false,
            nameNewTag: '',


            tempEditTags: [],
            ownerID: '',
            dialogAreYouThisArtistVisible: false,
            showThankYouVoting: false,
            showAllTracks: false,
            downloadLink: '',

            downloadLimit: 0,
            numberOfDownload: 0,
            loading: false,
            downloadDisable: false,
        };
    },
    mixins: [
        Defer()
    ],
    computed: {
        ...mapGetters([
            'userID', // authData
            'ARTIST',
            'PROFILE_DATA',
            'ARTIST_OWNER',
            'AUTH_DATA',
            'ALBUM',
            'ARTIST_ALBUMS',
            'ALBUM_RATING',
            'SHOW_COLUMNS_TRACK',
            'MUSIC_RELEASE_RATING',
            'SUPPORTERS',
            'EXPLORE_GRID_ALBUMS',
            'FAVOURITE_MUSIC_RELEASE',
            'SEARCH_ALBUMS_RESULT',
            'VIEW_ALBUMS',
            'PLAY_LIST',
            'DOWNLOAD_ERROR',
            'DOWNLOAD_LINK',
            'USER',
            'DISCOVERY',
            'PLAYED_ONLY_FAV_TRACKS',
            'FROM_PAGE',
            'CHECK_MUSIC_RELEASE_DOWNLOAD'
        ]),
        ...mapGetters({
            currentTrack: 'CURRENT_TRACK',
            currentAlbum: 'CURRENT_ALBUM',
            playing: 'PLAYING',
            playList: 'PLAY_LIST'
        }),
        isCurrentPlaying() {
            return !!this.currentAlbum && this.currentAlbum.id === this.albumDetails.id;
        },
    },
    watch: {
        id() {
            this.getAlbum();
        },
    },
    created() {
        this.mobile = this.isMobile();

        let album;

        if (this.FROM_PAGE.name) {
            switch (this.FROM_PAGE.name) {
                case 'search':
                    album = this.SEARCH_ALBUMS_RESULT.filter(album => album.id === this.id);
                    break;
                case 'searchDetails':
                    album = this.SEARCH_ALBUMS_RESULT.filter(album => album.id === this.id);
                    break;
                case 'collection':
                    album = this.FAVOURITE_MUSIC_RELEASE.filter(album => album.id === this.id);
                    break;
                case 'explore':
                    album = this.EXPLORE_GRID_ALBUMS.filter(album => album.id === this.id);
                    break;
            }
        } else {
            // this.getAlbum();
        }


        if (album && album.length) {
            this.albumDetails = album[0];
            this.checkUserIsOwnerAlbum();
            this.getMoreArtistAlbums();
        } else {
            this.getAlbum();
        }

        if (this.albumDetails.isFavorite === true) {
            for (let i = 0; i < this.albumDetails.playList.length; i++) {
                this.albumDetails.playList[i].song.isFavorite = true;
            }
        }

        this.getExternalLinks();
    },

    mounted() {
        this.GET_SUPPORTERS().catch(err => console.log(`GET_SUPPORTERS, ${err}`));
        this.getExternalLinks();
    },
    methods: {
        ...mapActions([
            'GET_ARTIST',
            'GET_PROFILE',
            'GET_ARTIST_OWNER',
            'GET_ALBUM',
            'ADD_ALBUM_TO_FAVORITES',
            'REMOVE_ALBUM_FROM_FAVORITES',
            'GET_ARTIST_ALBUMS',
            'GET_MUSIC_RELEASED_RATING',
            'ADD_MUSIC_RELEASED_RATING',
            'GET_SUPPORTERS',
            'GET_DOWNLOAD_LINK',
            'EDIT_ALBUM_ID',
            'GET_USER',
            'CHANGE_ALBUM_TAGS',
            'GET_CHECK_MUSIC_RELEASE_DOWNLOAD',
        ]),
        ...mapActions({
            play: 'SET_PLAY',
            pause: 'SET_PAUSE',
            addTrackToPlaylist: 'ADD_TRACK_TO_PLAYLIST',
        }),
        ...mapActions({
            playlist: 'PLAY_LIST'
        }),


        // GET MAIN DATA
        getAlbum() {
            this.loader = true;
            this.infoAlbumLoader = true;
            this.GET_ALBUM(Number(this.id))
                .then(() => {
                    this.albumDetails = this.ALBUM;
                    this.albumID = this.albumDetails.id;
                    this.albumRating = this.albumDetails.rating;

                    // redirect - track autoPlay
                    if (this.trackID !== undefined) {
                        let track = this.ALBUM.playList.filter(track => +track.id === +this.trackID);
                        let index = this.ALBUM.playList.findIndex(track => +track.id === +this.trackID);
                        this.play({
                            fromPlay: 'album_default',
                            track: track[0].song,
                            index: index,
                            album: this.albumDetails,
                            isDiscoveryStatus: this.DISCOVERY
                        });
                    }
                    this.checkUserIsOwnerAlbum();
                    this.getMoreArtistAlbums();
                })
                .catch(err => {
                    console.log(`albumDetails, getAlbum, ${err}`);
                })
                .finally(() => {
                    this.loader = false;
                    this.infoAlbumLoader = false;
                    setTimeout(() => {
                        this.getExternalLinks();
                    }, 500)
                })
        },
        getMoreArtistAlbums() {
            if (this.albumDetails.artist) {
                let params = {
                    artist: this.albumDetails.artist.id,
                }
                this.GET_ARTIST_ALBUMS(params)
                    .then(() => {
                        this.moreArtistAlbums = this.ARTIST_ALBUMS.filter(album => album.id !== this.albumDetails.id);
                    })
                    .catch(err => {
                        console.log(`getAlbum-GET_ARTIST_ALBUMS, ${err}`);
                    })
            }
        },
        checkUserIsOwnerAlbum() {
            if (this.userID) {
                if (this.albumDetails.artist && this.albumDetails.artist.id) {
                    this.GET_ARTIST(this.albumDetails.artist.id)
                        .then(() => {
                            if (this.ARTIST.owner) {
                                this.ownerID = this.ARTIST.owner.split('/')[2];
                                if (+this.userID === +this.ownerID) {
                                    this.isAdmin = true;
                                }
                            }
                        })
                        .catch(err => console.log(`getArtist, ${err})`))
                        .finally(() => this.loader = false);
                } else {
                    console.log('this album - By Various Artists');
                }
            }
        },

        seeMore() {
            this.albumDescriptionLength = 10000;
            setTimeout(() => {
                this.getExternalLinks();
            }, 500)
        },
        getExternalLinks() {
            if (this.albumDetails.description && this.albumDetails.description.length) {
                let box = document.getElementsByClassName('descript_info')[0];
                if (box) {
                    let links = box.getElementsByTagName('A');
                    if (links.length) {
                        for (let i = 0; i < links.length; i++) {
                            links[i].target = "_blank";
                        }
                    }
                }
            }
        },


        // Rating
        setRating(event, albumID) {
            this.albumRating = (Number(Math.ceil(this.ALBUM.rating)) === 0) ? null : Number(Math.ceil(this.ALBUM.rating));

            this.setAllowRating = false;
            if (this.AUTH_DATA.accessToken) {
                this.albumRating = this.ALBUM.rating;
                this.ADD_MUSIC_RELEASED_RATING({albumID: albumID, rating: event})
                    .then(() => {
                        // show thank you message
                        this.showThankYouVoting = true;
                        const _this = this
                        setTimeout(function () {
                            _this.showThankYouVoting = false;
                        }, 2000);

                        // this.getAlbumRating(); // :TODO wait ~backend~
                        // this.GET_MUSIC_RELEASED_RATING(this.id)
                        //     .then(() => {
                        //         console.log('GET_MUSIC_RELEASED_RATING', this.MUSIC_RELEASE_RATING);
                        //     })
                        //     .catch(err => {
                        //         console.log(`GET_MUSIC_RELEASED_RATING, ${err}`);
                        //     })
                    })
                    .catch(err => {
                        console.log(`albumDetails setRating, ${err}`);
                    })
            } else {
                // popup
                this.dialogNeedLoginVisible = true;
            }
        },

        playAlbum() {
            if (!this.isCurrentPlaying) {
                this.play({
                    fromPlay: 'album_default',
                    track: this.albumDetails.playList[0].song,
                    index: 0,
                    album: this.albumDetails,
                    isDiscoveryStatus: this.DISCOVERY
                });
            }
        },

        checkDownloadAlbum() {
            if (this.AUTH_DATA.accessToken) {
                this.loading = true;
                this.GET_CHECK_MUSIC_RELEASE_DOWNLOAD({}).then(() => {
                    const donwnloadLimit = this.CHECK_MUSIC_RELEASE_DOWNLOAD.data.limit;
                    const downloaded = this.CHECK_MUSIC_RELEASE_DOWNLOAD.data.downloaded;
                    console.log(downloaded)
                    console.log(donwnloadLimit)
                    this.downloadLimit = donwnloadLimit
                    this.numberOfDownload = downloaded
                    if (downloaded >= downloaded) {
                        this.downloadDisable = true;
                    }

                    this.downloadMessageDialogVisible = true;
                    this.loading = false;

                }).catch(err => {
                    this.loading = false;

                    console.log("err " + "" + err)
                    // this.$buefy.dialog.alert(this.DOWNLOAD_ERROR); // :TODO -> $buefy NOT USED!!!
                })
            } else {
                // popup
                this.dialogNeedLoginVisible = true;
            }
        },
        downloadAlbum() {
            if (this.AUTH_DATA.accessToken) {
                this.loading = true;
                this.GET_DOWNLOAD_LINK({'musicReleaseID': this.albumDetails.id}).then(() => {
                    console.log(this.DOWNLOAD_LINK)
                    console.log("this.DOWNLOAD_LINK")
                    let link = document.createElement("a");
                    link.download = name;
                    link.href = this.DOWNLOAD_LINK;
                    link.click();
                    this.loading = false;
                }).catch(err => {
                    this.loading = false;
                })
            } else {
                // popup
                this.dialogNeedLoginVisible = true;
            }
        },
        showDownload(item) {
            this.showAllTracks = item;
        },

        editAlbum(albumID) {
            this.$store.commit('SET_EDIT_ALBUM_ID', albumID);
            this.$router.push({name: 'musicUpload'});
        },

        // edit-save tags
        selectTag(tag) {
            if (this.isEditTags) {
                return;
            }
            // this.$store.dispatch('UPDATE_SUBGENRE', {});
            // this.$store.dispatch('UPDATE_BPM', []);
            // this.$store.dispatch('UPDATE_KEYS', []);
            this.$store.dispatch('UPDATE_TAGS', [tag]);
            this.$store.commit('SET_ALBUM_EXPANDED', null);
            this.$router.push({name: 'explore'});
        },

        editTags() {
            this.tempEditTags = this.albumDetails.tags;
        },
        addTag() {
            this.showNewTag = true;
            this.$nextTick(() => {
                this.$refs.actionNewTag.focus();
            });
        },
        addTagToTags() {
            if (this.nameNewTag.length > 1) {
                this.albumDetails.tags.push(this.nameNewTag);
                this.showNewTag = false;
                this.nameNewTag = '';
            }
        },
        deleteTag(tag) {
            this.albumDetails.tags = this.albumDetails.tags.filter(tags => tags !== tag);
        },
        saveTags() {
            let params = {
                id: this.albumDetails.id,
                tags: this.albumDetails.tags
            };
            this.CHANGE_ALBUM_TAGS(params)
                .then(() => {
                    console.log('CHANGE_ALBUM_TAGS - success');
                })
                .catch(err => console.log(`CHANGE_ALBUM_TAGS, ${err}`))
        },


        // Mobile
        isMobile() {
            return screen.width <= 760;
        },
        // mobilePlayTrack(track, index, album) {
        //     this.play({
        //         fromPlay: 'track_default',
        //         track: track.song,
        //         index: index,
        //         album: album,
        //         isDiscoveryStatus: this.DISCOVERY
        //     });
        // },
        tootleAlbumDescription() {
            this.albumDescription = !this.albumDescription;
        },

        addAlbumLike() {
            if (this.AUTH_DATA.accessToken) {
                this.albumDetails.isFavorite = true;
                this.$store.commit('SET_UPDATE_FAVOURITE_MUSIC_RELEASE', true);
                for (let i = 0; i < this.albumDetails.playList.length; i++) {
                    this.albumDetails.playList[i].song.isFavorite = true;
                }
                if (this.FROM_PAGE.name !== 'explore') {
                    this.$store.commit('SET_UPDATE_EXPLORE_ALBUMS', true);
                }


                this.ADD_ALBUM_TO_FAVORITES({'music_release_id': this.albumDetails.id})
                    .then(() => {
                    })
                    .catch(err => {
                        console.log(`albumDetails addLike, ${err}`);
                    });
            } else {
                this.dialogNeedLoginVisible = true;
            }
        },
        removeAlbumLike() {
            if (this.AUTH_DATA.accessToken) {
                this.albumDetails.isFavorite = false;
                this.$store.commit('SET_UPDATE_FAVOURITE_MUSIC_RELEASE', true);
                for (let i = 0; i < this.albumDetails.playList.length; i++) {
                    this.albumDetails.playList[i].song.isFavorite = false;
                }
                if (this.FROM_PAGE.name !== 'explore') {
                    this.$store.commit('SET_UPDATE_EXPLORE_ALBUMS', true);
                }

                this.REMOVE_ALBUM_FROM_FAVORITES({'music_release_id': this.albumDetails.id})
                    .then(() => {
                    })
                    .catch(err => {
                        console.log(`albumDetails removeLike, ${err}`);
                    })
            } else {
                this.dialogNeedLoginVisible = true;
            }
        },
        markUndiscovered(album) {
            album.isListened = false;
        }

    },


};
</script>


<style lang="scss">

</style>
