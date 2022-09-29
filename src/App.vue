<template>
    <!--    <div id="app" @keydown.32.prevent="togglePlayer" ref="app" tabindex=1>-->
    <div id="app" ref="app" tabindex=1>
        <v-app>
            <v-banner v-if="shown" color="info" dark class="text-left">
                Get our free app. It won't take up space on your phone and also works offline!
                <template v-slot:actions>
                    <v-btn text @click="dismissPrompt">Dismiss</v-btn>
                    <v-btn text @click="installPWA">Install</v-btn>
                </template>
            </v-banner>

            <mainHeader></mainHeader>

            <projectIsUnderConstructionWarning />
            <v-main>
                <router-view/>
            </v-main>
            <mainFooter></mainFooter>

            <play-list/>

            <!-- Player -->
            <KeepAlive>
                <player/>
            </KeepAlive>

            <transition name="fade" v-if="scY > 300">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <div id="page-top" @click="toTop" v-bind="attrs" v-on="on"></div>
                    </template>
                    <span>Back to top</span>
                </v-tooltip>
            </transition>

            <attentionMobileVersion v-model="attentionMobileVersionDialog"></attentionMobileVersion>
            <snackNextAlbum></snackNextAlbum>
            <thisActionStopPlay v-model="actionStopPlay"></thisActionStopPlay>
        </v-app>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

import mainHeader from '@/components/header';
import mainFooter from '@/components/footer';

const player = () => import("@/components/player");
const playList = () => import("@/components/playlist");
const projectIsUnderConstructionWarning = () => import('@/components/projectIsUnderConstructionWarning');
const attentionMobileVersion = () => import('@/components/dialogs/attentionMobileVersion');
const snackNextAlbum = () => import('@/components/snackbars/snackNextAlbum');
const thisActionStopPlay = () => import("@/components/dialogs/thisActionStopPlay");

export default {
    components: {
        mainHeader,
        mainFooter,
        player,
        playList,
        projectIsUnderConstructionWarning,
        attentionMobileVersion,
        snackNextAlbum,
        thisActionStopPlay
    },
    data: () => ({
        shown: false,
        name: '',
        scTimer: 0,
        scY: 0,
        attentionMobileVersionDialog: false,
        actionStopPlay: false,
    }),
    computed: {
        ...mapGetters({
            playList: 'PLAY_LIST',
            playerStatus: 'PLAYER_STATUS',
            playing: 'PLAYING',
            albums: 'PLAY_LIST_ALBUMS',
            currentTrack: 'CURRENT_TRACK',
            currentAlbum: 'CURRENT_ALBUM',
            currentTrackIdx: 'CURRENT_TRACK_IDX',

        }),
        playListFirstTrack() {
            return this.playList[0];
        },
        firstTrackAlbum() {
            return this.albums.find(album => (album.playList.find((track) => (track.id === this.playListFirstTrack.id))));
        }
    },
    created() {
        window.addEventListener('beforeunload', (event) => {
            if (this.playing === true) {
                event.preventDefault();
                event.returnValue = 'Any string';
                return 'Any string';
                // this.actionStopPlay = true;
            }
        });


        if (localStorage.getItem('psytranc_understand') !== 'isSet') {
            this.attentionMobileVersionDialog = this.isMobile();
        }

        this.getDataFromStore();
    },
    beforeMount() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()
            this.installEvent = e;
            this.shown = true;
        });
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
        // this.$fbCustomerChat.setOptions({
        //   theme_color: '#333333'
        // })
        // this.$refs.app.focus();
        // document.onreadystatechange = () => {
        //   if (document.readyState === "complete") {
        //     let links = document.getElementsByTagName('A');
        //     for (let i = 0; i < links.length; i++) {
        //       let itemLink = links[i];
        //       let domain = 'http://localhost:8080';
        //       // let domain = 'http://psytrancenetwork.com';
        //       let regex_http = /(http(.)*:\/\/)/;
        //       if ((itemLink.href != null) && (itemLink.href.match(domain) == null) && itemLink.href.match(regex_http) != null) {
        //         itemLink.target = "_blank";
        //       }
        //     }
        //   }
        // }
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        ...mapActions({
            getDataFromStore: 'GET_DATA_FROM_STORE',
            play: 'SET_PLAY',
            pause: 'SET_PAUSE',
        }),
        dismissPrompt() {
            this.shown = false;
        },
        installPWA() {
            this.installEvent.prompt()
            this.installEvent.userChoice.then((choice) => {
                this.dismissPrompt() // Hide the prompt once the user's clicked
                if (choice.outcome === 'accepted') {
                    // Do something additional if the user chose to install
                } else {
                    // Do something additional if the user declined
                }
            })
        },
        isMobile() {
            return screen.width <= 760;
        },
        togglePlayer() {
            if (this.playing) {
                this.pause();
            } else {
                if (this.currentTrack) {
                    this.play({
                        track: this.currentTrack,
                        index: this.currentTrackIdx,
                        album: this.currentAlbum
                    });
                } else {
                    if (this.playList && this.playList.length) {
                        this.play({
                            track: this.playListFirstTrack,
                            index: 0,
                            album: this.firstTrackAlbum
                        })
                    }
                }
            }
        },
        handleScroll: function () {
            if (this.scTimer) return;
            this.scTimer = setTimeout(() => {
                this.scY = window.scrollY;
                clearTimeout(this.scTimer);
                this.scTimer = 0;
            }, 100);
        },
        toTop: function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },
    },
}
import 'vuetify/dist/vuetify.min.css'
</script>

<style lang="scss">
@import 'assets/styles/main';

.v-application--wrap {
    position: relative;
}

#page-top {
    position: fixed;
    bottom: 120px;
    right: 100px;
    width: 55px;
    height: 55px;
    background-color: rgba(#fff, .1);
    border-radius: 50%;
    @include btnBackToTop('dcdcdc');
    background-position: center 18px;
    cursor: pointer;
    transition: 0.2s;
    z-index: 1000;
    @include max767 {
        display: none;
    }

    &:hover {
        background-color: rgba(196, 196, 196, 0.3);
    }
}

.page_top_container {
    width: 1330px;
    max-width: 1330px;
    height: 55px;
    padding: 0 20px;
    position: fixed;
    left: 50%;
    margin-left: -665px;
    bottom: 100px;
}
</style>
