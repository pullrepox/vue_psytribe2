<template>
    <div>
        <header :class="{ 'is-authenticated': AUTH_DATA.accessToken }">
            <div class="container">
                <div class="left_box">
                    <div class="logo" @click="goToHome"></div>
                </div>

                <div class="right_box">
<!--                    <div class="search" :class="{'active': searchActive}">-->
<!--                        <span class="material-icons">search</span>-->
<!--                        <input type="text" ref="inputSearch" placeholder="Search music" v-model="searchText" @click="goToSearchPage"-->
<!--                               v-on:keyup.enter.exact="Search()">-->
<!--                        <button type="button" class="close" v-if="visibleExitBtn" @click="goToHome"></button>-->
<!--                    </div>-->
<!--                    <button type="button" v-ripple class="mobile_search" @click="showMobileSearch"></button>-->
                    <nav>
                        <ul class="right_nav">
                            <li>
                                <router-link :to="{name: 'search'}" class="search" v-ripple></router-link>
                            </li>
                            <!-- Upload Music & Add an Event -->
                            <li class="upload_music_event">
                                <v-menu
                                    transition="slide-y-transition"
                                    :close-on-content-click="true"
                                    :nudge-width="125"
                                    offset-y
                                    nudge-left="62"
                                    nudge-bottom="10"
                                    origin="top center"
                                    content-class="menu-pointer yankees">
                                    <template v-slot:activator="{ on, attrs }">
                                        <button type="button" class="upload" v-bind="attrs" v-on="on" v-ripple>
                                            <span class="material-icons" >add_circle</span>
                                        </button>
                                    </template>
                                    <v-list>
                                        <v-list-item v-ripple>
                                            <router-link :to="{name: 'musicUpload'}">Upload Music</router-link>
<!--                                            <button @click="showComingSoonDialog = true">Upload Music</button>-->
                                        </v-list-item>
                                        <v-list-item v-ripple>
                                            <button @click="showComingSoonDialog = true">Add an Event</button>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </li>

                            <li v-if="AUTH_DATA.userRoles.includes('ROLE_ADMIN')">
                                <admin-menu></admin-menu>
                            </li>
                            <li v-if="AUTH_DATA.accessToken || AUTH_DATA.accessToken === ''">
                                <UserMenu v-if="AUTH_DATA.accessToken"></UserMenu>
                                <router-link v-else-if="AUTH_DATA.accessToken === ''" class="login" :to="{name: 'login'}" v-ripple>Log In</router-link>
                            </li>
                        </ul>
                    </nav>
<!--                    <button type="button" v-ripple class="mobile_nav" @click="mainMobileMenuDrawer = !mainMobileMenuDrawer"></button>-->
                </div>

                <div class="mobile_input_search" v-if="mobileSearch">
                    <input type="text" v-model="searchText" v-on:keyup.enter="runMobileSearch()" ref="mobile_search">
                    <button type="button" class="close" v-ripple @click="closeMobileSearch"></button>
                </div>

            </div>

            <ComingSoonDialog v-model="showComingSoonDialog"></ComingSoonDialog>

        </header>
        <v-navigation-drawer
            app
            fixed
            right
            temporary
            class=""
            v-model="mainMobileMenuDrawer"
            color="#141E35">
            <v-layout fill-height>
                <!--                <v-card-->
                <!--                    height=100%-->
                <!--                >-->
                <v-list-item>
                    <v-list-item-title>Item 1</v-list-item-title>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Item 2</v-list-item-title>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Item 3</v-list-item-title>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Item 4</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>Item 5</v-list-item-title>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Item 6</v-list-item-title>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Item 7</v-list-item-title>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Item 8</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>Item 8</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>Item 8</v-list-item-title>
                </v-list-item>
                <!--                </v-card>-->
            </v-layout>

        </v-navigation-drawer>
    </div>

</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import UserMenu from './menu/userMenu';
import AdminMenu from "./menu/adminMenu";
import ComingSoonDialog from "@/components/dialogs/comingSoonDialog";

export default {
    name: 'mainHeader',
    components: {
        UserMenu,
        AdminMenu,
        ComingSoonDialog
    },
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            showComingSoonDialog: false,
            searchText: '',
            searchActive: false,
            visibleExitBtn: false,
            mobileSearch: false,
            mainMobileMenuDrawer: false,
        };
    },
    watch: {
        '$route'(to, from) {
            if (to.name === 'search' || to.name === 'searchDetails' || (this.SEARCH_STRING.length)) {
                this.visibleExitBtn = true;
                // this.$refs.inputSearch.focus();
            } else {
                this.visibleExitBtn = false;
            }
        },
        SEARCH_STRING() {
            if (!this.SEARCH_STRING.length) {
                this.visibleExitBtn = false;
            }
        },
    },
    computed: {
        ...mapGetters([
            'AUTH_DATA',
            'SEARCH_STRING',
            'PROFILE_DATA',
        ]),
    },
    created() {
    },

    mounted() {
        this.searchText = this.SEARCH_STRING;
        if (this.$router.history.current.name === 'search' || this.$router.history.current.name === 'searchDetails') {
            this.visibleExitBtn = true;
            // this.$refs.inputSearch.focus();
        } else if (this.$router.history.current.name === 'explore' && this.SEARCH_STRING.length) {
            this.visibleExitBtn = true;
        }
    },

    methods: {
        ...mapActions([
            'SEARCH_ARTISTS',
            'SEARCH_ALBUMS',
            'SEARCH_TRACKS',
            'CLEAN_SEARCH_RESULT',
        ]),
        goToSearchPage() {
            this.searchActive = true;
            if (this.$router.history.current.name === 'search' || this.$router.history.current.name === 'searchDetails') {
                this.visibleExitBtn = true;
            } else {
                this.$router.push({name: 'search'});
            }
        },
        runMobileSearch() {
            if (this.searchText.length >= 1) { // TODO: what is the min. number of characters
                this.$store.commit('UPDATE_SEARCH_STRING', this.searchText);
                this.CLEAN_SEARCH_RESULT();
                this.runSearch();
                this.$router.push({name: 'search'});
            }
        },
        showMobileSearch() {
            this.mobileSearch = true;
            this.$nextTick(() => this.$refs.mobile_search.focus())
        },
        closeMobileSearch() {
            this.mobileSearch = false;
            this.$store.commit('UPDATE_SEARCH_STRING', '');
        },
        goToHome() {
            this.searchActive = false;
            this.$router.push({name: 'explore'});
            // if (this.$router.history.current.name !== 'explore') {
            //     this.$router.push({name: 'explore'});
            // } else if (this.$router.history.current.name === 'explore') {
            //     window.location.reload();
            // }
            this.$store.commit('UPDATE_SEARCH_STRING', '');
            this.searchText = this.SEARCH_STRING;
            this.CLEAN_SEARCH_RESULT();
        },
        // Search() {
        //     this.$store.commit('UPDATE_SEARCH_STRING', this.searchText);
        //     this.CLEAN_SEARCH_RESULT();
        //     this.runSearch();
        // },

        async runSearch() {
            this.$store.commit('UPDATE_SEARCH_LOADER', true);

            await this.SEARCH_ARTISTS({'name': this.searchText.trim()}).catch(err => console.error(`SEARCH_ARTISTS ${err}`));
            await this.SEARCH_ALBUMS({'title': this.searchText.trim(), 'order[releasedAt]': `DESC`}).catch(err => console.error(`SEARCH_ALBUMS ${err}`));
            await this.SEARCH_TRACKS({'title': this.searchText.trim(), 'order[releasedAt]': 'DESC'}).catch(err => console.error(`SEARCH_TRACKS ${err}`));

            this.$store.commit('UPDATE_SEARCH_LOADER', false);
        },
    },


};
</script>
