<template>
    <v-snackbar v-model="snackbar" :top="true" :right="true">

<!--        <audio autoplay id="mySound" src="../../assets/audio/8-bit.mp3" type="audio/mpeg"></audio>-->

        <template v-if="alertNextAlbum.album">
            Next album: {{alertNextAlbum.album.title}} <br>
        </template>

        <template v-if="alertNextAlbum.album && alertNextAlbum.album.artist">
            by {{alertNextAlbum.album.artist.name}}
        </template>
        <template v-else>
            by Various Artists
        </template>


        <template v-slot:action="{ attrs }">
            <v-btn
                color="pink"
                text
                v-bind="attrs"
                @click="snackbar = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "snackNextAlbum",
    data() {
        return {
            snackbar: false,
            timeout: 2000,
        }
    },
    watch: {
        alertNextAlbum() {
            if (this.playing) {
                this.snackbar = true;
                // document.getElementById('mySound').play();
            }
        }
    },
    computed: {
        ...mapGetters({
            alertNextAlbum: 'ALERT_NEXT_ALBUM',
            playing: 'PLAYING'
        })
    }
}
</script>

<style scoped>

</style>