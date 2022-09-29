<template>
    <div>
        <div class="artists_list">
            <router-link class="item_artist" :to="{name: 'artist-profile', params: {'id': artist.id}}" v-for="artist of SEARCH_ARTISTS_RESULT" :key="artist.id">
                <div class="img">
                    <img :src="artist.img || artistNoImage" :alt="artist.name">
                </div>
                <div class="descript">
                    <div class="name">{{ artist.name }}</div>
                    <!--                                <span>Record label here</span>-->
                    <!--                                <span>Producer - DJ - Promoter</span>-->
                </div>
            </router-link>
            <v-progress-circular v-if="artistsLoader"
                                 :size="100"
                                 :width="3"
                                 color="#20C4F5"
                                 indeterminate
            ></v-progress-circular>
        </div>
        <artistsPagination v-if="SEARCH_ARTISTS_RESULT" :countArtists="SEARCH_COUNT_ARTISTS"></artistsPagination>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import artistsPagination from '../paginations/search/searchArtistsPagination';

export default {
    name: 'artistsSearchList',
    components: {
        artistsPagination
    },
    data() {
        return {
            artistsLoader: false,
            artistNoImage: require('../../assets/image/default_ava.png'),
        }
    },
    watch: {
        SEARCH_ARTISTS_CURRENT_PAGE() {
            this.getArtists();
        },
    },
    computed: {
        ...mapGetters([
            'SEARCH_STRING',
            'SEARCH_ARTISTS_RESULT',
            'SEARCH_COUNT_ARTISTS',
            'SEARCH_ARTISTS_CURRENT_PAGE'
        ]),
    },
    mounted() {

    },
    methods: {
        ...mapActions(['SEARCH_ARTISTS']),
        getArtists() {
            this.artistsLoader = true;
            let artistsParams;
            const name = this.SEARCH_STRING ? {'name': this.SEARCH_STRING} : '';
            const page = this.SEARCH_ARTISTS_CURRENT_PAGE ? {page: this.SEARCH_ARTISTS_CURRENT_PAGE} : null;
            artistsParams = Object.assign(name, page);

            this.SEARCH_ARTISTS(artistsParams)
                .then(() => {
                    this.artistsLoader = false;
                })
                .catch(err => {
                    this.artistsLoader = false;
                    console.log(`SEARCH_ARTISTS, ${err}`)
                });
        }
    }
}
</script>

<style scoped>

</style>
