<template>
    <div class="private_profile">
        <div class="content-page">

            <!-- Skeleton Loader -->
            <div class="head_profile" v-if="loader === true">
                <div class="container">
                    <headSkeletonLoader :parent="'private-profile'"></headSkeletonLoader>
                </div>
            </div>

            <div class="head_profile" :class="viewContent" v-if="loader === false">
                <div class="container">
                    <privateProfileAvatar></privateProfileAvatar>
                    <div class="artist_info">
                        <!-- VIEW PROFILE -->
                        <template v-if="viewContent === 'my-profile'">
                            <h2 class="artist_name">
                                {{ USER.fullName }}
                                <button type="button" class="tootle_description" @click="toogleDescription" :class="{'expand': showDescription}"></button>
                                <button type="button" class="edit_profile" @click="editProfile"></button>
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
                            <div class="artist_location" v-if="USER.address">
                                <span class="material-icons-outlined">place</span>
                                {{ USER.address }}
                            </div>
                            <div class="artist_projects" v-if="YOUR_ARTISTS.length">
                                Projects:
                                <div class="artists" v-for="artist in YOUR_ARTISTS" :key="artist.id">
                                    <router-link :to="{name: 'artist-profile', params: {id: artist.id}}" target="_blank">
                                        {{ artist.name.trim() }}
                                    </router-link>
                                    <span v-if="YOUR_ARTISTS.length > 1">,</span>
                                </div>
                            </div>
                            <div class="follows">
                                <div class="followers">
                                    <span class="count">0</span>
                                    <router-link :to="{name: 'followers'}">Followers</router-link>
                                </div>
                                <div class="following">
                                    <span class="count">0</span>
                                    <router-link :to="{name: 'followings'}">Following</router-link>
                                </div>
                            </div>
                        </template>

                        <!-- EDIT-PROFILE -->
                        <template v-if="viewContent === 'edit-profile'">
                            <div class="input-style-4">
                                <label for="full-name">Full Name</label>
                                <input type="text" id="full-name" required v-model="USER.fullName">
                            </div>
                            <div class="input-style-4">
                                <label for="address">Location</label>

                                <vue-google-autocomplete
                                    v-model="USER.address"
                                    id="map"
                                    classname="form-control"
                                    placeholder="City, state"
                                    types="(cities)"
                                    v-on:keyup="keypressLocation"
                                    v-on:placechanged="getAddressData">
                                </vue-google-autocomplete>
                            </div>

                            <div class="about">
                                <label for="">Services</label>
                                <div class="wrap_checkbox_roles">
                                    <div class="material_checkbox">
                                        <input type="checkbox" id="dj" value="Dj" v-model="userRoles">
                                        <label for="dj">Dj</label>
                                    </div>
                                    <div class="material_checkbox">
                                        <input type="checkbox" id="producer" value="Producer" v-model="userRoles">
                                        <label for="producer">Producer</label>
                                    </div>
                                    <div class="material_checkbox">
                                        <input type="checkbox" id="promoter" value="Promoter" v-model="userRoles">
                                        <label for="promoter">Promoter</label>
                                    </div>
                                    <div class="material_checkbox">
                                        <input type="checkbox" id="vendor" value="Vendor" v-model="userRoles">
                                        <label for="vendor">Vendor</label>
                                    </div>
                                    <div class="material_checkbox">
                                        <input type="checkbox" id="deco-artist" value="Deco Artist" v-model="userRoles">
                                        <label for="deco-artist">Deco Artist</label>
                                    </div>
                                </div>
                            </div>
                        </template>

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
                            <v-tab v-for="tab in tabsSections" :key="tab.index">
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
                                                <button type="button" v-bind="attrs" v-on="on">Share</button>
                                            </template>
                                            <template v-slot:default="dialog">
                                                <div class="content_popup_share">
                                                    <div class="head_popup">Share</div>
                                                    <div class="input_box">
                                                        <input type="text" id="input-share-link"
                                                               v-model="shareLink">
                                                        <button type="button" @click="copyUserLink">Copy</button>
                                                    </div>
                                                    <button type="button" @click="dialog.value = false"
                                                            class="close">Close
                                                    </button>
                                                </div>
                                            </template>
                                        </v-dialog>
                                    </v-list-item>
                                    <!-- Report -->
                                    <v-list-item>
                                        <button type="button" class="report">Report</button>
                                    </v-list-item>
                                </v-list>
                            </v-menu>

                        </div>
                    </v-container>
                </div>
                <div class="content_profile_music_events">
                    <v-tabs-items v-model="tabs">
                        <v-tab-item> <!-- MUSIC SECTION -->
                            <div class="music_section">

                                <!-- ************** RECENTLY PLAYED ALBUMS ************** -->
                                <div class="recently_played" :class="{'empty': !recentlyPlayedLoader && !PRIVATE_PROFILE_RECENTLY_PLAYED_ALBUMS.length}">
                                    <v-container>
                                        <div class="head_profile_content">
                                            <span class="_head_name">Recently played</span>
                                            <button type="button" class="show_more_link" @click="showComingSoonDialog = true">History</button>
                                        </div>


                                        <div class="albums_row">
                                            <template v-if="recentlyPlayedLoader">
                                                <albumGridSkeletonLoader v-for="index in 6" :key="index" :parent="'default_grid_albums'"></albumGridSkeletonLoader>
                                            </template>
                                            <template v-if="!recentlyPlayedLoader && PRIVATE_PROFILE_RECENTLY_PLAYED_ALBUMS.length">
                                                <albumGrid v-for="album in PRIVATE_PROFILE_RECENTLY_PLAYED_ALBUMS.slice(0, 6)"
                                                           :key="album.id"
                                                           :album="album"
                                                           :small="true"
                                                           :playZone="PRIVATE_PROFILE_RECENTLY_PLAYED_ALBUMS">
                                                </albumGrid>
                                            </template>
                                        </div>
                                        <div class="nothing_albums" v-if="!recentlyPlayedLoader && !PRIVATE_PROFILE_RECENTLY_PLAYED_ALBUMS.length">
                                            Nothing here yet<br> Go explore!
                                        </div>
                                    </v-container>
                                </div>

                                <!-- ************** RECENTLY LIKED ALBUMS ************** -->
                                <div class="recently_liked" :class="{'empty': !recentlyLikedLoader && !PRIVATE_PROFILE_RECENTLY_LIKED_ALBUMS.length}">
                                    <v-container>
                                        <div class="head_profile_content">
                                            <span class="_head_name">
                                                Recently liked
                                            </span>
                                            <router-link :to="{name: 'library'}" v-ripple class="show_more_link">Library</router-link>
                                        </div>

                                        <div class="albums_row" >
                                            <template v-if="recentlyLikedLoader">
                                                <albumGridSkeletonLoader v-for="index in 6" :key="index" :parent="'default_grid_albums'"></albumGridSkeletonLoader>
                                            </template>
                                            <template v-if="!recentlyLikedLoader && PRIVATE_PROFILE_RECENTLY_LIKED_ALBUMS.length">
                                                <albumGrid v-for="album in PRIVATE_PROFILE_RECENTLY_LIKED_ALBUMS.slice(0, 6)"
                                                           :key="album.id"
                                                           :album="album"
                                                           :small="true"
                                                           :playZone="PRIVATE_PROFILE_RECENTLY_LIKED_ALBUMS">
                                                </albumGrid>
                                            </template>
                                        </div>
                                        <div class="nothing_albums" v-if="!recentlyLikedLoader && !PRIVATE_PROFILE_RECENTLY_LIKED_ALBUMS.length">
                                            Nothing here yet<br> Go explore!
                                        </div>
                                    </v-container>
                                </div>

                                <!-- ************** UPLOADER ALBUMS ************** -->
                                <div class="uploaded_music">
                                    <v-container>
                                        <div class="head_profile_content">
                                            <span class="_head_name">
                                                Uploaded
                                            </span>
                                            <router-link :to="{name: 'manageUploaded'}" class="show_more_link">Manage Uploaded</router-link>
                                        </div>
                                        <div class="wrap_music">
                                            <div class="upload_music">
                                                <span class="material-icons">add_circle_outline</span>
                                                Upload Music
                                            </div>
                                            <template v-if="uploadedAlbumsLoader">
                                                <albumGridSkeletonLoader v-for="index in 5" :key="index" :parent="'default_grid_albums'"></albumGridSkeletonLoader>
                                            </template>
                                            <template v-if="!uploadedAlbumsLoader && PRIVATE_PROFILE_UPLOADED_ALBUMS.length">
                                                <!--                                                :small="true"-->
                                                <albumGrid
                                                    v-for="album in PRIVATE_PROFILE_UPLOADED_ALBUMS.slice(0, 6)"
                                                    :key="album.id"
                                                    :album="album"
                                                    :hide-artist="true"
                                                    :playZone="PRIVATE_PROFILE_UPLOADED_ALBUMS">
                                                </albumGrid>
                                            </template>

                                        </div>
                                    </v-container>
                                </div>

                            </div>
                        </v-tab-item>
                        <v-tab-item> <!-- EVENTS SECTION -->
                            <div class="events_section">
                                <div class="uploaded_events">
                                    <v-container>
                                        <div class="head_profile_content">
                                            <span class="_head_name">
                                               Hosting
                                            </span>
                                            <router-link :to="{name: '#'}">Manage Events</router-link>
                                        </div>
                                        <div class="wrap_uploaded_events">
                                            <div class="upload_event">
                                                <span class="material-icons">add_circle_outline</span>
                                                Add an event
                                            </div>
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
                                            <!--                                                <router-link :to="{name: '#'}">Manage Events</router-link>-->
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
                        <v-tab-item> <!-- ABOUT SECTION -->
                            <div class="about_section">
                                <v-container>
                                    <div class="head_profile_content">
                                        <span class="_head_name">
                                          Bio
                                        </span>
                                    </div>
                                    <div class="wrap_about_section">
                                        <template v-if="viewContent === 'edit-profile'">
                                            <TextareaAutosize v-model="USER.description"></TextareaAutosize>
                                            <div class="wrap_action_btn">
                                                <button type="button" class="save" v-ripple @click="saveUserData">Save</button>
                                                <button type="button" class="close" v-ripple @click="cancel">Cancel</button>
                                            </div>
                                        </template>

                                        <template v-else>
                                            <template v-if="USER.description">
                                                {{ USER.description }}
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
        </div>

        <ComingSoonDialog v-model="showComingSoonDialog"></ComingSoonDialog>
    </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import VueGoogleAutocomplete from 'vue-google-autocomplete';

import headSkeletonLoader from "@/components/small/skeleton-loaders/headSkeletonLoader";
import albumGridSkeletonLoader from "@/components/small/skeleton-loaders/albumGridSkeletonLoader";
import privateProfileAvatar from "@/components/profile/privateProfileAvatar";
import albumGrid from '@/components/albumGrid';

const ComingSoonDialog = () => import("@/components/dialogs/comingSoonDialog");

export default {
    name: "profile-private",
    components: {
        privateProfileAvatar,
        albumGrid,
        ComingSoonDialog,
        VueGoogleAutocomplete,
        headSkeletonLoader,
        albumGridSkeletonLoader
    },
    data() {
        return {
            showComingSoonDialog: false,
            viewContent: 'my-profile',
            userRoles: [],
            shareLink: '',

            tabsSections: [
                {index: 0, name: 'Music'},
                {index: 1, name: 'Events'},
                {index: 2, name: 'About'}
            ],
            tabs: null,

            showDescription: false, // mobile

            loader: false,
            changeDataLoader: false,
            recentlyPlayedLoader: false,
            recentlyLikedLoader: false,
            uploadedAlbumsLoader: false,
            location: '',
        }
    },

    watch: {},

    computed: {
        ...mapGetters(['USER', 'AUTH_DATA', 'PROFILE_DATA',
            'YOUR_ARTISTS',
            'PRIVATE_PROFILE_UPLOADED_ALBUMS',
            'PRIVATE_PROFILE_RECENTLY_PLAYED_ALBUMS',
            'PRIVATE_PROFILE_RECENTLY_LIKED_ALBUMS',
        ])
    },
    mounted() {
        this.getData();
        this.getRecentlyPlayed();
        this.getRecentlyLiked();
    },
    methods: {
        ...mapActions([
            'GET_USER', 'GET_PROFILE', 'CHANGE_USER_DATA', 'GET_YOUR_ARTISTS',
            'GET_RECENTLY_PLAYED',
            'GET_PRIVATE_PROFILE_UPLOADED_ALBUMS',
            'GET_PRIVATE_PROFILE_RECENTLY_PLAYED_ALBUMS',
            'GET_PRIVATE_PROFILE_RECENTLY_LIKED_ALBUMS'
        ]),

        getData() {
            this.loader = true;
            this.uploadedAlbumsLoader = true;

                this.GET_PROFILE()
                    .then(() => {
                        // if (this.PROFILE_DATA.photo) {
                        //     this.imageUrl = `${this.apiUrl + this.PROFILE_DATA.photo.contentUrl}`;
                        // }

                        this.shareLink = `${window.location.hostname}/user/${this.PROFILE_DATA.id}`;

                        if (this.PROFILE_DATA.isProducer === true && !this.userRoles.includes('Producer')) {
                            this.userRoles.push('Producer');
                        }
                        if (this.PROFILE_DATA.isDecoArtist === true && !this.userRoles.includes('Deco Artist')) {
                            this.userRoles.push('Deco Artist');
                        }
                        if (this.PROFILE_DATA.isDj === true && !this.userRoles.includes('Dj')) {
                            this.userRoles.push('Dj');
                        }
                        if (this.PROFILE_DATA.isPromoter === true && !this.userRoles.includes('Promoter')) {
                            this.userRoles.push('Promoter');
                        }
                        if (this.PROFILE_DATA.isVendor === true && !this.userRoles.includes('Vendor')) {
                            this.userRoles.push('Vendor');
                        }

                        this.GET_USER(this.PROFILE_DATA.id)
                            .catch(err => {
                                console.log(`profile-private, GET_USER, ${err}`);
                            });


                        this.GET_YOUR_ARTISTS({owner: this.PROFILE_DATA.id})
                            .then(() => {
                                if (this.YOUR_ARTISTS.length) {
                                    let userArtistsID = [];
                                    for (let i = 0; i < this.YOUR_ARTISTS.length; i++) {
                                        userArtistsID.push(this.YOUR_ARTISTS[i].id);
                                    }

                                    this.GET_PRIVATE_PROFILE_UPLOADED_ALBUMS({'artist': userArtistsID})
                                        .catch(err => console.log(`GET_ARTIST_ALBUMS, ${err}`))
                                        .finally(() => this.uploadedAlbumsLoader = false);
                                } else {
                                    this.uploadedAlbumsLoader = false;
                                }
                            });
                    })
                    .catch(err => console.log(`getProfile, ${err}`))
                    .finally(() => this.loader = false);

        },

        getRecentlyPlayed() {
            this.recentlyPlayedLoader = true;
            this.GET_PRIVATE_PROFILE_RECENTLY_PLAYED_ALBUMS()
                .catch(err => console.log(`getRecentlyPlayed, ${err}`))
                .finally(() => {
                    this.recentlyPlayedLoader = false;
                })
        },
        getRecentlyLiked() {
            this.recentlyLikedLoader = true;
            this.GET_PRIVATE_PROFILE_RECENTLY_LIKED_ALBUMS() // TODO: need to sort by date added to the library
                .catch(err => console.log(`getRecentlyLiked, ${err}`))
                .finally(() => {
                    this.recentlyLikedLoader = false;
                })
        },

        saveUserData() {
            this.viewContent = 'my-profile';
            this.changeDataLoader = true;

            const userData = {
                id: this.PROFILE_DATA.id,
                fullName: this.USER.fullName,
                address: this.USER.address,
                description: this.USER.description,

                // roles
                isProducer: this.userRoles.includes('Producer') || false,
                isPromoter: this.userRoles.includes('Promoter') || false,
                isDecoArtist: this.userRoles.includes('Deco Artist') || false,
                isVendor: this.userRoles.includes('Vendor') || false,
                isDj: this.userRoles.includes('Dj') || false,
            };

            this.CHANGE_USER_DATA(userData)
                .then(() => {

                })
                .catch(err => {
                    console.log(`saveUserData, ${err}`);
                })
                .finally(() => this.changeDataLoader = false);
        },

        keypressLocation(event) {
            this.USER.address = event.target.value;
        },
        getAddressData: function (addressData, placeResultData) {
            if (addressData.country === 'United States') {
                this.USER.address = `${addressData.locality},  ${addressData.administrative_area_level_1}, ${addressData.country}`;
            } else {
                this.USER.address = `${addressData.locality}, ${addressData.country}`;
            }
            // console.log('addressData', addressData);
            // console.log('placeResultData', placeResultData);
        },
        editProfile() {
            this.viewContent = 'edit-profile';
            this.tabs = 2; // aboutSection
        },
        cancel() {
            this.viewContent = 'my-profile';
            this.tabs = 0; // musicSection
        },
        copyUserLink() {
            let copyText = document.querySelector("#input-share-link");
            copyText.select();
            document.execCommand("copy");
        },
        toogleDescription() {
            this.showDescription = !this.showDescription;
        },
    }
}
</script>

<style>

</style>
