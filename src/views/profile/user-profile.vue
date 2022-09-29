<template>
    <div class="user_profile">
        <div class="content-page">

            <!-- Skeleton Loader -->
            <div class="head_profile" v-if="loader === true && !mobile">
                <div class="container">
                    <headSkeletonLoader :parent="'user-profile'"></headSkeletonLoader>
                </div>
            </div>

            <div class="head_profile" v-if="loader === false">
                <div class="container">
                    <div class="user_photo">
                        <v-img
                            min-width="100%"
                            min-height="100%"
                            :src="smallImageUrl"
                            :class="{'default-image': isImageDefault}"
                            @click="$refs['modal-image'].show()"
                        ></v-img>
                    </div>
                    <div class="user_info artist_info">
                        <h2 class="artist_name">
                            {{ PROFILE_USER.fullName }}
                        </h2>
                        <div class="artist_roles">
                            <span class="material-icons fingerprint">fingerprint</span>
                            <template v-if="userRoles.includes('Dj')">
                                <span>Dj</span>
                                <span class="material-icons dot">fiber_manual_record</span>
                            </template>
                            <template v-if="userRoles.includes('Producer')">
                                <span>Producer</span>
                                <span class="material-icons dot">fiber_manual_record</span>
                            </template>
                            <template v-if="userRoles.includes('Promoter')">
                                <span>Promoter</span>
                                <span class="material-icons dot">fiber_manual_record</span>
                            </template>
                            <template v-if="userRoles.includes('Vendor')">
                                <span>Vendor</span>
                                <span class="material-icons dot">fiber_manual_record</span>
                            </template>
                            <template v-if="userRoles.includes('Deco Artist')">
                                <span>Deco Artist</span>
                                <span class="material-icons dot">fiber_manual_record</span>
                            </template>
                        </div>
                        <div class="artist_location" v-if="PROFILE_USER.address">
                            <span class="material-icons-outlined">place</span>
                            {{ PROFILE_USER.address }}
                        </div>

                        <div class="artist_projects" v-if="USER_ARTISTS.length">
                            Projects:
                            <div class="artists" v-for="artist in USER_ARTISTS" :key="artist.id">
                                <router-link :to="{name: 'artist-profile', params: {id: artist.id}}" target="_blank">
                                    {{ artist.name.trim() }}
                                </router-link>
                                <span v-if="USER_ARTISTS.length > 1">,</span>
                            </div>
                        </div>

                        <div class="follows">
                            <div class="followers">
                                <span class="count">0</span>
                                <div>Followers</div>
                            </div>
                            <div class="following">
                                <span class="count">0</span>
                                <div>Following</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


            <div class="wrap_profile_music_events">
                <div class="head_profile_music_events">
                    <v-container>
                        <v-tabs
                            background-color="transparent"
                            color="#fff"
                            v-model="tabs">
                            <v-tab v-for="tab in tabsSection" :key="tab">
                                {{ tab }}
                            </v-tab>
                        </v-tabs>
                        <div class="actions">
                            <v-btn class="medium tetriatary_btn follow_btn" @click="follow">
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
                                                <button type="button" v-ripple v-bind="attrs" v-on="on">Share</button>
                                            </template>
                                            <template v-slot:default="dialog">
                                                <div class="content_popup_share">
                                                    <div class="head_popup">Share</div>
                                                    <div class="input_box">
                                                        <input type="text" id="input-share-link-user-profile" v-model="shareLink">
                                                        <button type="button" v-ripple @click="copyUserLink">Copy</button>
                                                    </div>
                                                    <button type="button" v-ripple @click="dialog.value = false" class="close">Close</button>
                                                </div>
                                            </template>
                                        </v-dialog>
                                    </v-list-item>
                                    <!-- Report -->
                                    <v-list-item>
                                        <button type="button" v-ripple class="report">Report</button>
                                    </v-list-item>
                                </v-list>
                            </v-menu>

                        </div>
                    </v-container>
                </div>
                <div class="content_profile_music_events">
                    <v-tabs-items v-model="tabs">
                        <v-tab-item>
                            <div class="music_section">

                                <div class="uploaded_music">
                                    <v-container>
                                        <template>
                                            <div class="head_profile_content">
                                                <span class="_head_name">Releases</span>
                                            </div>

                                            <div class="wrap_music">
                                                <template v-if="releasesAlbumsLoader">
                                                    <albumGridSkeletonLoader v-for="index in 6" :key="index" :parent="'default_grid_albums'"></albumGridSkeletonLoader>
                                                </template>
                                                <template v-if="USER_UPLOADED_ALBUMS.length && !releasesAlbumsLoader">
                                                    <albumGrid
                                                        v-for="album in USER_UPLOADED_ALBUMS.slice(0, 6)"
                                                        :key="album.id"
                                                        :album="album"
                                                        :small="true"
                                                        :playZone="USER_UPLOADED_ALBUMS">
                                                    </albumGrid>
                                                </template>
                                            </div>
                                            <template>
                                                <div class="nothing_albums" v-if="!releasesAlbumsLoader && !USER_UPLOADED_ALBUMS.length">
                                                    Nothing here yet<br> Go explore!
                                                </div>
                                            </template>
                                        </template>
                                    </v-container>
                                </div>


                                <div class="recently_liked" style="display: none;">
                                    <div class="container">
                                        <div class="head_profile_content">
                                            <h3 class="_head_name">Recently liked</h3>
                                            <template v-if="!recentlyLikedAlbumsLoader && USER_RECENTLY_LIKED_ALBUMS.length">
                                                <button type="button" class="show_more_link" @click="showComingSoonDialog = true">Library</button>
                                            </template>

                                        </div>
                                        <div class="wrap_music">
                                            <template v-if="recentlyLikedAlbumsLoader">
                                                <albumGridSkeletonLoader v-for="index in 6" :key="index" :parent="'default_grid_albums'"></albumGridSkeletonLoader>
                                            </template>
                                            <template v-if="!recentlyLikedAlbumsLoader && USER_RECENTLY_LIKED_ALBUMS.length">
                                                <albumGrid v-for="album in USER_RECENTLY_LIKED_ALBUMS.slice(0, 6)"
                                                           :key="album.id"
                                                           :album="album"
                                                           :small="true"
                                                           :playZone="USER_RECENTLY_LIKED_ALBUMS">
                                                </albumGrid>
                                            </template>
                                        </div>
                                        <template>
                                            <div class="nothing_albums" v-if="!recentlyLikedAlbumsLoader && !USER_RECENTLY_LIKED_ALBUMS.length">
                                                Nothing here yet<br> Go explore!
                                            </div>
                                        </template>
                                    </div>
                                </div>

<!--                                <div class="nothing_here_yet" v-if="(!releasesAlbumsLoader && !USER_UPLOADED_ALBUMS.length) && (!recentlyLikedAlbumsLoader && !USER_RECENTLY_LIKED_ALBUMS.length)">-->
<!--                                    <div class="container">-->
<!--                                        Nothing here yet-->
<!--                                    </div>-->
<!--                                </div>-->
                            </div>
                        </v-tab-item>
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
                        <v-tab-item>
                            <div class="about_section">
                                <v-container>
                                    <div class="head_profile_content">
                                        <span class="_head_name">
                                          Bio
                                        </span>
                                    </div>
                                    <div class="wrap_about_section">
                                        <div class="_roles">
                                            <span class="material-icons fingerprint">fingerprint</span>
                                            <template v-if="userRoles.includes('Dj')">
                                                <span>Dj</span>
                                                <span class="material-icons dot">fiber_manual_record</span>
                                            </template>
                                            <template v-if="userRoles.includes('Producer')">
                                                <span>Producer</span>
                                                <span class="material-icons dot">fiber_manual_record</span>
                                            </template>
                                            <template v-if="userRoles.includes('Promoter')">
                                                <span>Promoter</span>
                                                <span class="material-icons dot">fiber_manual_record</span>
                                            </template>
                                            <template v-if="userRoles.includes('Vendor')">
                                                <span>Vendor</span>
                                                <span class="material-icons dot">fiber_manual_record</span>
                                            </template>
                                            <template v-if="userRoles.includes('Deco Artist')">
                                                <span>Deco Artist</span>
                                                <span class="material-icons dot">fiber_manual_record</span>
                                            </template>
                                        </div>
                                        <div class="_location" v-if="PROFILE_USER.address">
                                            <span class="material-icons-outlined">place</span>
                                            {{ PROFILE_USER.address }}
                                        </div>
                                        <div class="_projects" v-if="USER_ARTISTS.length">
                                            Projects:
                                            <div class="artists" v-for="artist in USER_ARTISTS" :key="artist.id">
                                                <router-link :to="{name: 'artist-profile', params: {id: artist.id}}" target="_blank">
                                                    {{ artist.name.trim() }}
                                                </router-link>
                                                <span v-if="USER_ARTISTS.length > 1">,</span>
                                            </div>
                                        </div>
                                        <div class="_description" v-if="PROFILE_USER.description">
                                            {{ PROFILE_USER.description }}
                                        </div>
                                        <template v-else>
                                            <div class="nothing_here_yet">
                                                <div class="container">
                                                    Nothing here yet
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </v-container>
                            </div>
                        </v-tab-item>
                    </v-tabs-items>
                </div>
            </div>
        </div>

        <ComingSoonDialog v-model="showComingSoonDialog"></ComingSoonDialog>

        <!------------------ Modal Image ------------------>
        <modalImage ref="modal-image" :image="imageUrl"/>

    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import albumGrid from '../../components/albumGrid';
import headSkeletonLoader from "@/components/small/skeleton-loaders/headSkeletonLoader";

const ComingSoonDialog = () => import("@/components/dialogs/comingSoonDialog");
const ModalImage = () => import ("@/components/public/modalImage");
import isMobile from "@/mixins/isMobile";
import albumGridSkeletonLoader from "@/components/small/skeleton-loaders/albumGridSkeletonLoader";

export default {
    name: 'user-profile',
    props: ['id'],
    components: {
        albumGrid,
        ComingSoonDialog,
        ModalImage,
        headSkeletonLoader,
        albumGridSkeletonLoader
    },
    mixins: [isMobile],
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            imageUrl: '',
            smallImageUrl: '',
            isImageDefault: false,
            tabs: null,
            userRoles: [],
            tabsSection: ['Music', 'Events', 'About'],
            defaultAva: '',
            selectSortByArtistAlbums: 'Release Date',
            sortByArtistAlbums: [
                'Release Date'
            ],
            userID: '',
            shareLink: `${window.location.hostname}/user/${this.id}`,
            showComingSoonDialog: false,
            loader: false,
            releasesAlbumsLoader: false,
            recentlyLikedAlbumsLoader: false,
        }
    },
    computed: {
        ...mapGetters([
            'PROFILE_USER',
            'USER_UPLOADED_ALBUMS',
            'USER_RECENTLY_LIKED_ALBUMS',
            'USER_ARTISTS'
        ]),
    },
    created() {
        this.getUserData();
    },
    mounted() {
        this.getReleasesAlbums();
        this.getRecentlyLikedAlbums();
    },
    methods: {
        ...mapActions([
            'GET_USER_ARTISTS',
            'GET_PROFILE_USER',
            'GET_USER_UPLOADED_ALBUMS',
            'GET_USER_RECENTLY_LIKED_ALBUMS',
            'FOLLOW'
        ]),

        getUserData() {
            this.loader = true;
            this.GET_PROFILE_USER(this.id)
                .then(() => {
                    if (this.PROFILE_USER.id) {
                        this.imageUrl = `${this.apiUrl + this.PROFILE_USER.photo.contentUrl}`;
                        this.smallImageUrl = this.PROFILE_USER.photo ? `${this.apiUrl}media/resolve/user/${this.PROFILE_USER.photo.contentName}` : require('@/assets/image/privat-profile-ava.png');
                        this.isImageDefault = !this.PROFILE_USER.photo;
                        if (this.PROFILE_USER.isProducer === true && !this.userRoles.includes('Producer')) {
                            this.userRoles.push('Producer');
                        }
                        if (this.PROFILE_USER.isDecoArtist === true && !this.userRoles.includes('Deco Artist')) {
                            this.userRoles.push('Deco Artist');
                        }
                        if (this.PROFILE_USER.isDj === true && !this.userRoles.includes('Dj')) {
                            this.userRoles.push('Dj');
                        }
                        if (this.PROFILE_USER.isPromoter === true && !this.userRoles.includes('Promoter')) {
                            this.userRoles.push('Promoter');
                        }
                        if (this.PROFILE_USER.isVendor === true && !this.userRoles.includes('Vendor')) {
                            this.userRoles.push('Vendor');
                        }
                    } else {
                        this.$router.push({name: 'explore'});
                    }
                })
                .catch(err => console.log(`GET_PROFILE_USER, ${err}`))
                .finally(() => this.loader = false);
        },
        getReleasesAlbums() {
            this.releasesAlbumsLoader = true;
            const params = {owner: this.id};
            this.GET_USER_ARTISTS(params)
                .then(() => {
                    if (this.USER_ARTISTS.length) {
                        let userArtistsID = [];
                        for (let i = 0; i < this.USER_ARTISTS.length; i++) {
                            userArtistsID.push(this.USER_ARTISTS[i].id);
                        }

                        this.GET_USER_UPLOADED_ALBUMS({'artist': userArtistsID})
                            .catch(err => console.log(`getReleasesAlbums, ${err}`))
                            .finally(() => this.releasesAlbumsLoader = false);
                    } else {
                        this.releasesAlbumsLoader = false;
                    }
                })
        },
        getRecentlyLikedAlbums() {
            this.recentlyLikedAlbumsLoader = true;
            const params = {user: this.id};
            this.GET_USER_RECENTLY_LIKED_ALBUMS(params)
                .catch(err => console.log(`getRecentlyLikedAlbums, ${err}`))
                .finally(() => this.recentlyLikedAlbumsLoader = false);
        },

        follow() {
            this.FOLLOW(this.id);
        },

        selectSortBy(val) {

        },
        copyUserLink() {
            let copyText = document.querySelector("#input-share-link-user-profile");
            copyText.select();
            document.execCommand("copy");
        }
    }
}
</script>

<style scoped>

</style>
