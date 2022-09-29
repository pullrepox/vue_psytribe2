<template>
    <div class="track_list">
        <div class="head_tracks_list">
            <div class="_left_">
                <div class="title_">Title
                    <div class="sort">
                        <span class="material-icons" :class="{active: currentOrderBy === 'title_asc'}" @click="orderBy('title', 'asc')">arrow_drop_up</span>
                        <span class="material-icons" :class="{active: currentOrderBy === 'title_desc'}" @click="orderBy('title', 'desc')">arrow_drop_down</span>
                    </div>
                </div>
                <div class="artist_">Artist
                    <div class="sort">
                        <span class="material-icons" :class="{active: currentOrderBy === 'artist_asc'}" @click="orderBy('artist', 'asc')">arrow_drop_up</span>
                        <span class="material-icons" :class="{active: currentOrderBy === 'artist_desc'}" @click="orderBy('artist', 'desc')">arrow_drop_down</span>
                    </div>
                </div>
                <div class="released_" v-if="SHOW_COLUMNS_TRACK.includes('released')">Released
                    <div class="sort">
                        <span class="material-icons" :class="{active: currentOrderBy === 'released_asc'}" @click="orderBy('released', 'asc')">arrow_drop_up</span>
                        <span class="material-icons" :class="{active: currentOrderBy === 'released_desc'}" @click="orderBy('released', 'desc')">arrow_drop_down</span>
                    </div>
                </div>
                <div class="rating_" v-if="SHOW_COLUMNS_TRACK.includes('rating')">Rating
                    <div class="sort">
                        <span class="material-icons" :class="{active: currentOrderBy === 'rating_asc'}" @click="orderBy('rating', 'asc')">arrow_drop_up</span>
                        <span class="material-icons" :class="{active: currentOrderBy === 'rating_desc'}" @click="orderBy('rating', 'desc')">arrow_drop_down</span>
                    </div>
                </div>
                <div class="bpm_" v-if="SHOW_COLUMNS_TRACK.includes('bpm')">BPM
                    <div class="sort">
                        <span class="material-icons" :class="{active: currentOrderBy === 'bpm_asc'}" @click="orderBy('bpm', 'asc')">arrow_drop_up</span>
                        <span class="material-icons" :class="{active: currentOrderBy === 'bpm_desc'}" @click="orderBy('bpm', 'desc')">arrow_drop_down</span>
                    </div>
                </div>
                <div class="key_" v-if="SHOW_COLUMNS_TRACK.includes('key')">KEY
                    <div class="sort">
                        <span class="material-icons" :class="{active: currentOrderBy === 'key_asc'}" @click="orderBy('key', 'asc')">arrow_drop_up</span>
                        <span class="material-icons" :class="{active: currentOrderBy === 'key_desc'}" @click="orderBy('key', 'desc')">arrow_drop_down</span>
                    </div>
                </div>
            </div>


            <div class="_right_ actions_">
                <v-menu
                    transition="slide-y-transition"
                    :close-on-content-click="false"
                    :nudge-width="120"
                    content-class="menu-pointer"
                    offset-y
                    nudge-left="60"
                    nudge-bottom="15"
                    origin="top center">
                    <template v-slot:activator="{ on, attrs }">
                        <span class="material-icons" v-bind="attrs" v-on="on">arrow_drop_down</span>
                    </template>
                    <v-list>
                        <v-list-item>
                            <div class="material_checkbox">
                                <input type="checkbox" id="label" value="label" v-model="tracksColumns"
                                       @change="checkTrackColumn($event)">
                                <label for="label">Label</label>
                            </div>
                        </v-list-item>
                        <v-list-item>
                            <div class="material_checkbox">
                                <input type="checkbox" id="released" value="released" v-model="tracksColumns"
                                       @change="checkTrackColumn($event)">
                                <label for="released">Released</label>
                            </div>
                        </v-list-item>
                        <v-list-item>
                            <div class="material_checkbox">
                                <input type="checkbox" id="rating" value="rating" v-model="tracksColumns"
                                       @change="checkTrackColumn($event)">
                                <label for="rating">Rating</label>
                            </div>
                        </v-list-item>
                        <v-list-item>
                            <div class="material_checkbox">
                                <input type="checkbox" id="viewes" value="viewes" v-model="tracksColumns"
                                       @change="checkTrackColumn($event)">
                                <label for="viewes">Viewes</label>
                            </div>
                        </v-list-item>
                        <v-list-item>
                            <div class="material_checkbox">
                                <input type="checkbox" id="downloads" value="downloads" v-model="tracksColumns"
                                       @change="checkTrackColumn($event)">
                                <label for="downloads">Downloads</label>
                            </div>
                        </v-list-item>
                        <v-list-item>
                            <div class="material_checkbox">
                                <input type="checkbox" id="collected" value="collected" v-model="tracksColumns"
                                       @change="checkTrackColumn($event)">
                                <label for="collected">Collected</label>
                            </div>
                        </v-list-item>
                        <v-list-item>
                            <div class="material_checkbox">
                                <input type="checkbox" id="bpm" value="bpm" v-model="tracksColumns"
                                       @change="checkTrackColumn($event)">
                                <label for="bpm">BPM</label>
                            </div>
                        </v-list-item>
                        <v-list-item>
                            <div class="material_checkbox">
                                <input type="checkbox" id="key" value="key" v-model="tracksColumns"
                                       @change="checkTrackColumn($event)">
                                <label for="key">Key</label>
                            </div>
                        </v-list-item>

                    </v-list>
                </v-menu>
            </div>

        </div>

        <template v-if="!loaderTracks">
            <itemTrack
                v-for="(track, index) in TRACKS"
                :key="+track.id + dynamicTrackKey"
                :track="track"
                :index="index"
            ></itemTrack>
        </template>

        <template v-if="loaderTracks">
            <v-skeleton-loader
                type="image"
                class="item_track_list"
                v-for="index in 25"
                :key="index"
            ></v-skeleton-loader>
        </template>

        <tracksPagination v-if="TRACKS.length && !loaderTracks" :countTracks="COUNT_TRACKS"></tracksPagination>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import itemTrack from "@/components/itemTrack";
import tracksPagination from '../paginations/explore/tracksPagination';

export default {
    name: 'trackList',
    components: {
        itemTrack,
        tracksPagination
    },
    props: ['whatTracks'],
    data() {
        return {
            dynamicTrackKey: 0,
            currentOrderBy: null,
            tracksColumns: this.$store.getters.SHOW_COLUMNS_TRACK,
            tracks: [],
            loaderTracks: false,
        }
    },

    watch: {
        SUBGENRE() {
            this.$store.commit('SET_TRACKS_CURRENT_PAGE', 1);
            this.getTracks();
        },
        BPM() {
            this.$store.commit('SET_TRACKS_CURRENT_PAGE', 1);
            this.$store.dispatch('UPDATE_TRACKS_ORDER_BY', {'order[bpm]': `asc`});
            this.currentOrderBy = 'bpm_asc';
            this.getTracks();
        },
        // KEYS() {
            // this.getTracks();
        // },
        APPLY_KEYS() {
            if (this.APPLY_KEYS === true) {
                this.$store.commit('SET_TRACKS_CURRENT_PAGE', 1);
                this.getTracks();
            }
        },
        TAGS() {
            this.$store.commit('SET_TRACKS_CURRENT_PAGE', 1);
            this.getTracks();
        },
        TRACKS_ORDER_BY() {
            this.$store.commit('SET_TRACKS_CURRENT_PAGE', 1);
            this.getTracks();
        },
        TRACKS_CURRENT_PAGE() {
            this.getTracks();
            this.scrollTop();
        },
        SEARCH_STRING() {
            this.getTracks();
        }
    },
    computed: {
        ...mapGetters(['TRACKS', 'COUNT_TRACKS', 'TRACKS_CURRENT_PAGE', 'CURRENT_TRACK', 'CURRENT_ALBUM', 'PLAYING',
            'SUBGENRE', 'KEYS', 'APPLY_KEYS', 'BPM', 'TRACKS_ORDER_BY', 'TAGS', 'SEARCH_STRING', 'SHOW_COLUMNS_TRACK'])
    },
    mounted() {
        if (!this.TRACKS.length || this.whatTracks !== undefined) {
            this.CLEAN_TRACKS();
            this.$store.dispatch('UPDATE_TRACKS_ORDER_BY', {'order[bpm]': `asc`});
            this.currentOrderBy = 'bpm_asc';
            this.getTracks();
        }
    },
    methods: {
        ...mapActions(['GET_TRACKS', 'CLEAN_TRACKS', 'SET_PLAY', 'SET_PAUSE']),
        scrollTop() {
            const el = document.getElementById('explore-nav-id');
            if (el) {
                el.scrollIntoView({behavior: 'smooth'});
            }
        },
        playTrack(track, index) {
            // this.$store.dispatch('SET_TRACK_LIST', this.TRACKS);
            this.SET_PLAY({
                fromPlay: 'track_default',
                track: track,
                index: index,
                album: track.playLists[0].musicRelease
            });
        },
        orderBy: function (key, direction) {
            this.currentOrderBy = `${key}_${direction}`;

            if (key && direction) {
                switch (key) {
                    case 'title':
                        this.$store.dispatch('UPDATE_TRACKS_ORDER_BY', {'order[title]': `${direction}`});
                        break;
                    case 'artist':
                        this.$store.dispatch('UPDATE_TRACKS_ORDER_BY', {'order[artist.name]': `${direction}`});
                        break;
                    case 'released':
                        this.$store.dispatch('UPDATE_TRACKS_ORDER_BY', {'order[releasedAt]': `${direction}`});
                        break;
                    case 'rating':
                        this.$store.dispatch('UPDATE_TRACKS_ORDER_BY', {'order[rating]': `${direction}`});
                        break;
                    case 'bpm':
                        this.$store.dispatch('UPDATE_TRACKS_ORDER_BY', {'order[bpm]': `${direction}`});
                        break;
                }
            }
        },
        getTracks() {
            this.loaderTracks = true;
            this.$store.commit('SET_APPLY_KEYS', false);

            // const subGenre = this.SUBGENRE.name ? {'style': this.SUBGENRE.name} : ``;
            const subGenre = this.SUBGENRE.id ? {'playLists.musicRelease.subGenres.id': this.SUBGENRE.id} : ``;
            const bpm = this.BPM.length ? {'bpm[between]': `${this.BPM[0]}` + '..' + `${this.BPM[1]}`} : null;
            const keys = this.KEYS ? {'key': Array(this.KEYS)} : null;
            const tags = this.TAGS ? {'multiple_search_playLists.album.tags': Array(this.TAGS)} : null;
            const page = {page: this.TRACKS_CURRENT_PAGE};

            let params = {...page, ...this.TRACKS_ORDER_BY, ...subGenre, ...bpm, ...tags, ...keys};

            this.GET_TRACKS(params)
                .then(() => {
                    this.dynamicTrackKey += 1;
                })
                .catch(err => {
                    console.log(`getTracks, ${err}`);
                })
                .finally(() => this.loaderTracks = false);
        },
        checkTrackColumn() {
            this.$store.commit('SET_SHOW_COLUMNS_TRACK', this.tracksColumns);
        },
        downloadTrack(trackArtist, trackName, trackLink) {
            const blob = new Blob([trackLink], {type: 'audio/mp3'});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${trackArtist} - ${trackName}.mp3`;
            document.body.appendChild(link);
            link.click();
        },
    }
}
</script>

<style lang="scss">
.track_list {
    .item_track_list {
        height: 50px;
        margin-bottom: 6px;
        border-radius: 50px;
    }
}
</style>
