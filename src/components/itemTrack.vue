<template>
    <div class="item_track" :class="[{ selected: CURRENT_TRACK !== null && CURRENT_TRACK.id && track.id === CURRENT_TRACK.id && PLAYING}]">
        <div class="_left_">
            <div class="play_pause">
                <button
                    v-if="CURRENT_TRACK !== null && CURRENT_TRACK.id && track.id === CURRENT_TRACK.id && PLAYING"
                    class="pause" @click="SET_PAUSE">
                    <span class="material-icons">pause</span>
                </button>
                <button v-else class="play" @click="playTrack(track, index)">
                    <span class="material-icons">play_arrow</span>
                </button>
            </div>
            <router-link v-if="track.playLists[0].musicRelease" class="track_name" :to="{ name: 'albumDetails', params: {id: track.playLists[0].musicRelease.id}}">
                {{ track.title }}
            </router-link>
            <div v-else class="track_name">{{track.title}}</div> <!-- :TODO temp v-if -->

            <router-link class="artist_name" v-if="track.artist" :to="{ name: 'artist-profile', params: {id: track.artist.id}}">
                {{ track.artist.name }}
            </router-link>

            <div class="track_released" v-if="SHOW_COLUMNS_TRACK.includes('released')">
                {{ track.publishedAt | moment("MMM YYYY") }}
            </div>
            <div class="track_rating" v-if="SHOW_COLUMNS_TRACK.includes('rating')">
                <template v-if="track.rating">{{ track.rating }}</template>
                <template v-else>-</template>
            </div>
            <div class="track_bpm" v-if="SHOW_COLUMNS_TRACK.includes('bpm')">{{ track.bpm }}</div>
            <div class="track_key" v-if="SHOW_COLUMNS_TRACK.includes('key')">
                <template v-if="track.key">{{ track.key }}</template>
                <template v-else>-</template>
            </div>
        </div>
        <div class="_right_">
            <button class="download_track" @click.prevent="downloadTrack(track.artist.name, track.title, track.link)">
                Download
            </button>

            <v-menu
                transition="slide-y-transition"
                :close-on-content-click="false"
                :nudge-width="120"
                content-class="menu-pointer charcoal"
                offset-y
                nudge-left="60"
                nudge-bottom="15"
                origin="top center">
                <template v-slot:activator="{ on, attrs }">
                    <button type="button" v-ripple class="more" v-bind="attrs" v-on="on"></button>
                </template>
                <v-list>
                    <v-list-item v-ripple>
                        <button type="button">Add to queue</button>
                    </v-list-item>
                    <v-list-item v-ripple>
                        <button type="button">Play next</button>
                    </v-list-item>
                    <v-list-item v-ripple>
                        <button type="button">Report</button>
                    </v-list-item>
                </v-list>
            </v-menu>

        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: 'itemTrack',
    props: ['track', 'index'],
    computed: {
        ...mapGetters(['CURRENT_TRACK', 'PLAYING', 'CURRENT_ALBUM', 'SHOW_COLUMNS_TRACK', 'TRACKS'])
    },
    methods: {
        ...mapActions(['SET_PLAY', 'SET_PAUSE']),

        playTrack(track, index) {
            this.$store.dispatch('SET_TRACK_LIST', this.TRACKS);
            this.SET_PLAY({
                fromPlay: 'track_default',
                track: track,
                index: index,
                album: track.playLists[0].musicRelease
            });
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

<style scoped>

</style>
