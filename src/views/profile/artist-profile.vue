<template>
    <div class="artist_profile">
        <div class="artist_profile_head">
            <div v-if="!headBackgroundDefault" class="profile_head_background" v-bind:style="{'background-image': 'url('+(headBackground)+')'}"></div>
            <div v-if="headBackgroundDefault" class="profile_head_background default"></div>
            <v-container>
                <div class="artist_data">

                    <artistProfileAvatar :isAdmin="isAdmin"></artistProfileAvatar>

                    <div class="artist_info">
                        <h2 class="artist_name">
                            <template v-if="viewContent === 'edit-profile'">
                                <input type="text" v-model="ARTIST.name">
                            </template>
                            <template v-else>
                                {{ ARTIST.name }}
                            </template>
                            <button v-if="isAdmin && viewContent !== 'edit-profile'" type="button" class="edit_profile" @click="editArtistProfile"></button>
                            <button type="button" @click="dialogAreYouThisArtistVisible = true" class="is-this-you-link" v-if="!isAdmin && ARTIST.name">(Is this you?)</button>
                        </h2>

                        <are-you-this-artist-dialog :artist="ARTIST" v-model="dialogAreYouThisArtistVisible"></are-you-this-artist-dialog>
                        <div class="artist_owner" v-if="ARTIST_OWNER">
                            Author
                            <router-link :to="{name: 'user-profile', params: {id: ownerID}}">
                                {{ ARTIST_OWNER.fullName }}
                            </router-link>
                        </div>
                    </div>
                </div>
            </v-container>
        </div>

        <div class="wrap_profile_music_events">

            <div class="head_profile_music_events">
                <v-container>
                    <div class="head_content">
                        <v-tabs
                            background-color="transparent"
                            color="#fff"
                            v-model="tabs">
                            <v-tab v-for="tab in tabsSection" :key="tab.index">
                                {{ tab.name }}
                            </v-tab>
                        </v-tabs>
                        <div class="actions">
                            <v-btn class="medium tetriatary_btn follow_btn" @click="showComingSoonDialog = true">
                                <span class="material-icons-outlined">favorite</span>
                                Follow
                            </v-btn>
                            <v-btn class="medium tetriatary_btn message_btn" @click="showComingSoonDialog = true">
                                <span class="material-icons-outlined">email</span>
                                Message
                            </v-btn>
                            <v-btn class="medium tetriatary_btn support_btn" @click="showComingSoonDialog = true">
                                <span class="material-icons-outlined">payments</span>
                                Support
                            </v-btn>

                            <!-- more button -->
                            <v-menu
                                transition="slide-y-transition"
                                :close-on-content-click="true"
                                offset-y
                                nudge-left="21"
                                nudge-bottom="10"
                                origin="top center"
                                content-class="menu-pointer charcoal"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon color="#7481A6" class="more" v-bind="attrs" v-on="on">
                                        <span class="material-icons">more_vert</span>
                                    </v-btn>
                                </template>
                                <v-list>
                                    <!-- popup share link -->
                                    <v-list-item>
                                        <v-dialog
                                            transition="dialog-bottom-transition"
                                            max-width="600">
                                            <template v-slot:activator="{ on, attrs }">
                                                <button v-ripple type="button" v-bind="attrs" v-on="on">Share</button>
                                            </template>
                                            <template v-slot:default="dialog">
                                                <div class="content_popup_share">
                                                    <div class="head_popup">Share</div>
                                                    <div class="input_box">
                                                        <input type="text" id="input-share-link"
                                                               v-model="shareLink">
                                                        <button v-ripple type="button" @click="copyLinkPsytrance">Copy
                                                        </button>
                                                    </div>
                                                    <button v-ripple type="button" @click="dialog.value = false"
                                                            class="close">Close
                                                    </button>
                                                </div>
                                            </template>
                                        </v-dialog>
                                    </v-list-item>
                                    <!-- Report -->
                                    <v-list-item v-ripple>
                                        <button type="button" class="report">Report</button>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </div>
                </v-container>
            </div>
            <div class="content_profile_music_events">
                <v-tabs-items v-model="tabs">

                    <!-- Music Tab -->
                    <v-tab-item>
                        <div class="music_section artist_releases">

                            <div class="popular_tracks">

                            </div>

                            <div class="uploaded_music" v-if="(releasesAlbumsloader && !ARTIST_PROFILE_RELEASES_ALBUMS.length) || (!releasesAlbumsloader && ARTIST_PROFILE_RELEASES_ALBUMS.length)">
                                <v-container>
                                    <div class="head_profile_content" :class="{'nothing_releases': !ARTIST && !ARTIST.musicReleases.length}">
                                        <span class="_head_name">
                                            Releases
                                        </span>
                                    </div>

                                    <div v-if="releasesAlbumsloader" class="wrap_music skeleton-loader">
                                        <albumGridSkeletonLoader v-for="index in 6" :key="index" :parent="'default_grid_albums'"></albumGridSkeletonLoader>
                                    </div>

                                    <div class="wrap_music group" v-if="!releasesAlbumsloader && ARTIST_PROFILE_RELEASES_ALBUMS.length">
                                        <template class="year_group" v-for="group of groupArtistAlbums">

                                            <div class="item" v-for="(item, index) in group"
                                                 :class="{
                                                        'group_end': index + 1 === group.length && group.length > 1,
                                                        'one': index === 0 && group.length === 1
                                                        }">
                                                <div class="wrap_year">
                                                    <span class="year" v-if="index === 0">{{ String(Object.keys(group[0])) }}</span>
                                                    <span class="line"></span>
                                                </div>
                                                <albumGrid
                                                    v-for="album of item"
                                                    :key="album.id"
                                                    :class="{'first_album_in_group': index === 0}"
                                                    :hide-artist="true"
                                                    :album="album"
                                                    :small="true"
                                                    :playZone="ARTIST_PROFILE_RELEASES_ALBUMS">
                                                </albumGrid>
                                            </div>
                                        </template>
                                    </div>


<!--                                    <div v-if="!releasesAlbumsloader && !ARTIST_PROFILE_RELEASES_ALBUMS.length" class="nothing_here_yet">-->
<!--                                        <div class="container">-->
<!--                                            Nothing here yet-->
<!--                                        </div>-->
<!--                                    </div>-->
                                </v-container>
                            </div>
                            <div class="appears_on" v-if="defer(2) && appearsAlbums.length">
                                <div class="container">
                                    <div class="head_profile_content">
                                        <h3 class="_head_name">Appears on</h3>
                                    </div>
                                    <div class="wrap_music">
                                        <albumGrid v-for="album in appearsAlbums"
                                                   :key="album.id"
                                                   :album="album"
                                                   :small="true"
                                                   :hide-artist="true"
                                                   ::playZone="appearsAlbums"
                                        ></albumGrid>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-tab-item>

                    <!-- Events Tab -->
                    <v-tab-item>
                        <div class="events_section">
                            <div class="uploaded_events">
                                <v-container>
                                    <div class="head_profile_content">
                                            <span class="_head_name">
                                               Hosting
                                            </span>
                                        Sort by
                                    </div>
                                    <div class="wrap_uploaded_events">
                                        <!--                                            <div class="upload_event">-->
                                        <!--                                                <span class="material-icons">add_circle_outline</span>-->
                                        <!--                                                Add an event-->
                                        <!--                                            </div>-->
                                        <div class="event_box">
                                            <div class="event_img"></div>
                                            <div class="event_description">
                                                <div class="name">Dance of Life</div>
                                                <div class="location">Chernivtsi, Ukraine</div>
                                                <div class="date">SAT, Sep 18 at 19:00 EDT</div>
                                                <div class="genre">Downtempo, Hard Dance and more</div>
                                            </div>
                                        </div>
                                    </div>
                                </v-container>
                            </div>
                            <div class="following_section">
                                <v-container>
                                    <div class="head_profile_content">
                                            <span class="_head_name">
                                               Following
                                            </span>
                                        Sort by
                                        <!--                                            <router-link :to="{name: '#'}">Manage Events</router-link>-->
                                    </div>
                                    <div class="wrap_uploaded_music">
                                        <div class="event_box">
                                            <div class="event_img"></div>
                                            <div class="event_description">
                                                <div class="name">Dance of Life</div>
                                                <div class="location">Chernivtsi, Ukraine</div>
                                                <div class="date">SAT, Sep 18 at 19:00 EDT</div>
                                                <div class="genre">Downtempo, Hard Dance and more</div>
                                            </div>
                                        </div>
                                    </div>
                                </v-container>
                            </div>
                        </div>
                    </v-tab-item>

                    <!-- About Tab -->
                    <v-tab-item>
                        <div class="artist_about">
                            <v-container>
                                <div class="head_profile_content">
                                    <span class="_head_name">
                                       Bio
                                    </span>
                                </div>
                                <div class="wrap_about_section">
                                    <template v-if="viewContent === 'edit-profile'">
                                        <TextareaAutosize v-model="ARTIST.description"></TextareaAutosize>
                                        <div class="wrap_action_btn">
                                            <button type="button" class="save" v-ripple @click="changeArtistData">Save</button>
                                            <button type="button" class="close" v-ripple @click="cancel">Cancel</button>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <template v-if="ARTIST.description">
                                            {{ ARTIST.description }}
                                        </template>
                                        <template v-else>
                                            <div class="nothing_here_yet">
                                                <div class="container">
                                                    Nothing here yet
                                                </div>
                                            </div>
                                        </template>
                                    </template>
                                </div>
                            </v-container>
                        </div>
                    </v-tab-item>
                </v-tabs-items>
            </div>

        </div>


        <ComingSoonDialog v-model="showComingSoonDialog"></ComingSoonDialog>

        <!------------------ Modal Image ------------------>
<!--        <modalImage ref="modal-image" :image="imageUrl"/>-->

    </div>
</template>
<script>
import {mapGetters, mapActions} from "vuex";
import moment from 'moment';

import artistProfileAvatar from "@/components/profile/artistProfileAvatar";
import albumGridSkeletonLoader from "@/components/small/skeleton-loaders/albumGridSkeletonLoader";

import albumGrid from '@/components/albumGrid';

const ComingSoonDialog = () => import("@/components/dialogs/comingSoonDialog");
const areYouThisArtistDialog = () => import('@/components/dialogs/areYouThisArtist');

import Defer from '@/utils/defer';

export default {
    name: 'artist-profile',
    props: ['id'],
    components: {
        albumGridSkeletonLoader,
        artistProfileAvatar,
        albumGrid,
        ComingSoonDialog,
        areYouThisArtistDialog,
        // ModalImage
    },
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            loader: false,
            releasesAlbumsloader: false,
            isAdmin: false,
            dialogAreYouThisArtistVisible: false,

            viewContent: 'view-profile',
            shareLink: window.location.href,

            tabs: null,
            tabsSection: [
                {index: 0, name: 'Music'},
                {index: 1, name: 'Events'},
                {index: 2, name: 'About'}
            ],

            sortByAlbumArtist: [
                'Release Date'
            ],
            selectSortByArtistAlbums: 'Release Date',

            headBackground: '',
            headBackgroundDefault: false,

            ownerID: '',
            groupArtistAlbums: [],
            appearsAlbums: [],
            showComingSoonDialog: false,
            artistAlbums: true,
            albums: [],
        }
    },
    mixins: [
        Defer()
    ],
    watch: {
        id() {
            this.getArtistData();
            this.getReleasesAlbums();
            this.getAppearsOnAlbums();
        },
    },
    computed: {
        ...mapGetters(['AUTH_DATA', 'userID', 'ARTIST', 'ARTIST_ALBUMS', 'CHANGE_ARTIST_DATA_STATUS', 'MUSIC_RELEASE', 'USER', 'FILE_URL', 'ARTIST_OWNER', 'APPEARS_ON', 'PROFILE_DATA',
            'ARTIST_PROFILE_RELEASES_ALBUMS',
            'ARTIST_PROFILE_APPEARS_ON_ALBUMS',
        ]),
    },
    created: function () {
        this.moment = moment;
        this.getArtistData();
    },
    mounted() {
        this.getReleasesAlbums();
        this.getAppearsOnAlbums();
    },
    methods: {
        ...mapActions(['GET_ARTIST', 'GET_ARTIST_ALBUMS', 'CHANGE_ARTIST_DATA',
            'GET_MUSIC_RELEASE', 'GET_USER', 'ADD_FILE', 'GET_ARTIST_OWNER', 'GET_APPEARS_ON', 'GET_PROFILE',
            'GET_ARTIST_PROFILE_RELEASES_ALBUMS',
            'GET_ARTIST_PROFILE_APPEARS_ON_ALBUMS',
        ]),

        getArtistData() {
            this.loader = true;
            this.$store.commit('SET_ARTIST_OWNER', '');

            this.GET_ARTIST(this.id)
                .then(() => {
                    if (this.ARTIST.id) {
                        // this.imageUrl = `${this.apiUrl}${this.ARTIST.avatar.contentUrl}`;
                        this.headBackground = this.ARTIST.avatar ? `${this.apiUrl}media/resolve/artist/${this.ARTIST.avatar.contentName}`: require('@/assets/image/user-default.png');
                        this.headBackgroundDefault = !this.ARTIST.avatar;

                        this.ownerID = this.ARTIST.owner.split('/')[2];
                        if (this.ownerID && (+this.userID === +this.ownerID)) {
                            this.isAdmin = true;
                        }
                        this.GET_ARTIST_OWNER(this.ownerID).catch(err => console.log(`GET_USER, ${err}`));

                        // Releases (ARTIST.musicReleases)
                        // for (let i = 0; i < this.ARTIST.musicReleases.length; i++) {
                        //     const year = moment(this.ARTIST.musicReleases[i].releasedAt).year();
                        //     this.groupArtistAlbums[year] = this.groupArtistAlbums[year] || [];
                        //     this.groupArtistAlbums[year].push({[year]: this.ARTIST.musicReleases[i]});
                        // }
                        // this.groupArtistAlbums.reverse();
                    } else {
                        this.$router.push({name: 'explore'});
                    }
                })
                .catch(err => console.log(`getArtist, ${err})`))
                .finally(() => this.loader = false);
        },

        getReleasesAlbums() {
            this.releasesAlbumsloader = true;
            this.groupArtistAlbums = [];
            this.GET_ARTIST_PROFILE_RELEASES_ALBUMS({artist: this.id})
                .then(() => {
                    for (let i = 0; i < this.ARTIST_PROFILE_RELEASES_ALBUMS.length; i++) {
                        const year = moment(this.ARTIST_PROFILE_RELEASES_ALBUMS[i].releasedAt).year();
                        this.groupArtistAlbums[year] = this.groupArtistAlbums[year] || [];
                        this.groupArtistAlbums[year].push({[year]: this.ARTIST_PROFILE_RELEASES_ALBUMS[i]});
                    }
                    this.groupArtistAlbums.reverse();
                })
                .catch(err => console.log(`getReleasesAlbums, ${err}`))
                .finally(() => this.releasesAlbumsloader = false);
        },
        getAppearsOnAlbums() {
            this.GET_ARTIST_PROFILE_APPEARS_ON_ALBUMS({'playList.song.artist': this.id})
                .then(() => {
                    this.appearsAlbums = this.ARTIST_PROFILE_APPEARS_ON_ALBUMS.filter(album => album.artist === null);
                })
                .catch(err => console.log(`getAppearsOnAlbums, ${err}`))
        },

        editArtistProfile() {
            this.viewContent = 'edit-profile';
            this.tabs = 2; // aboutSection
        },
        cancel() {
            this.viewContent = 'view-profile';
            this.tabs = 0; // musicSection
        },

        changeArtistData() {
            this.viewContent = 'view-profile';

            const changeArtistData = {
                id: this.id,
                name: this.ARTIST.name,
                description: this.ARTIST.description,
            };
            this.CHANGE_ARTIST_DATA(changeArtistData)
                .catch(err => console.log(`CHANGE_ARTIST_DATA, ${err}`));
        },
        copyLinkPsytrance() {
            let copyText = document.querySelector("#input-share-link");
            copyText.select();
            document.execCommand("copy");
        },
    },
}
</script>

<style lang="scss">

</style>
