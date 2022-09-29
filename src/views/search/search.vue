<template>
    <div class="p-search full_page"
         :class="{'nothing_found': !SEARCH_ARTISTS_RESULT.length && !SEARCH_ALBUMS_RESULT.length && !SEARCH_TRACKS_RESULT.length && SEARCH_STRING && !SEARCH_LOADER,
                  'empty_page': !SEARCH_STRING,
                  'loading':  SEARCH_LOADER}">
        <div class="overlay">
            <v-container fluid fill-height>

                <boxInputSearch></boxInputSearch>

                <div v-if="SEARCH_LOADER" class="box_loading">
                    <v-progress-circular :size="100" :width="3" color="#20C4F5" indeterminate></v-progress-circular>
                </div>

                <!-- RESULTS -->
                <template v-if="SEARCH_STRING && (SEARCH_ARTISTS_RESULT.length || SEARCH_ALBUMS_RESULT.length || SEARCH_TRACKS_RESULT.length)">
                    <div class="wrap_box_results">
                        <!-- ARTISTS -->
                        <div class="box_result artists" v-if="SEARCH_ARTISTS_RESULT.length">
                            <div class="_head">
                                <h3>Artists <span v-if="SEARCH_COUNT_ARTISTS">{{ SEARCH_COUNT_ARTISTS }}</span></h3>
                                <router-link v-if="SEARCH_ARTISTS_RESULT.length > 4" class="view-all" v-ripple
                                             :to="{name: 'searchDetails', params: {'whatContent': 'artists'}}">
                                    View all
                                    <span class="material-icons">navigate_next</span>
                                </router-link>
                            </div>
                            <div class="result">
                                <router-link class="item_artist"
                                             :to="{name: 'artist-profile', params: {'id': artist.id}}"
                                             v-for="artist of SEARCH_ARTISTS_RESULT.slice(0, 4)"
                                             :key="artist.id">
                                    <div class="img">
                                        <img :src="artist.img || artistNoImage" :alt="artist.name">
                                    </div>
                                    <div class="descript">
                                        <div class="name">{{ artist.name }}</div>
                                        <!--                                <span>Record label here</span>-->
                                        <!--                                <span>Producer - DJ - Promoter</span>-->
                                    </div>
                                </router-link>
                            </div>
                        </div>

                        <!-- Albums -->
                        <div class="box_result albums" v-if="SEARCH_ALBUMS_RESULT.length">
                            <div class="_head">
                                <h3>Albums <span v-if="SEARCH_COUNT_ALBUMS">{{ SEARCH_COUNT_ALBUMS }}</span></h3>
                                <router-link v-if="SEARCH_ALBUMS_RESULT.length > 5" class="view-all" v-ripple
                                             :to="{name: 'searchDetails', params: {'whatContent': 'albums'}}">
                                    View all
                                    <span class="material-icons">navigate_next</span>
                                </router-link>
                            </div>
                            <div class="result">
                                <template v-for="item of SEARCH_ALBUMS_RESULT.slice(0, 5)">
                                    <albumGrid
                                        :album="item"
                                        :key="item.id"
                                    ></albumGrid>
                                </template>
                            </div>
                        </div>

                        <!-- Tracks -->
                        <div class="box_result tracks" v-if="SEARCH_TRACKS_RESULT.length">
                            <div class="_head">
                                <h3>Tracks <span v-if="SEARCH_COUNT_TRACKS">{{ SEARCH_COUNT_TRACKS }}</span></h3>
                                <router-link v-if="SEARCH_TRACKS_RESULT.length > 3" class="view-all"  v-ripple
                                             :to="{name: 'searchDetails', params: {'whatContent': 'tracks'}}">
                                    View all
                                    <span class="material-icons">navigate_next</span>
                                </router-link>
                            </div>
                            <div class="result track_list">
                                <itemTrack
                                    v-for="(track, index) in SEARCH_TRACKS_RESULT.slice(0, 3)"
                                    :key="track.id"
                                    :track="track"
                                    :index="index"
                                ></itemTrack>
                            </div>
                        </div>

                    </div>
                    <Adsense
                        data-ad-client="ca-pub-7900064573502982"
                        data-ad-slot="8115767007"
                        data-ad-format="horizontal"
                        data-full-width-responsive=true>
                    </Adsense>
                </template>

                <!--  Nothing Found -->
                <div class="nothing_found_block" v-if="!SEARCH_ARTISTS_RESULT.length && !SEARCH_ALBUMS_RESULT.length && !SEARCH_TRACKS_RESULT.length && SEARCH_STRING && !SEARCH_LOADER">
                    <div class="search_nothing_found">Nothing found</div>
                </div>

            </v-container>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import boxInputSearch from "@/components/search/boxInputSearch";
import albumGrid from '../../components/albumGrid';
import itemTrack from "@/components/itemTrack";

export default {
    name: 'search',
    components: {
        boxInputSearch,
        albumGrid,
        itemTrack
    },
    data() {
        return {
            artistNoImage: require('../../assets/image/privat-profile-ava.png'),
        }
    },

    computed: {
        ...mapGetters([
            'SEARCH_STRING', 'SEARCH_LOADER',

            // Artists
            'SEARCH_ARTISTS_RESULT',
            'SEARCH_COUNT_ARTISTS',

            // Albums
            'SEARCH_ALBUMS_RESULT',
            'SEARCH_COUNT_ALBUMS',

            // Tracks
            'SEARCH_TRACKS_RESULT',
            'SEARCH_COUNT_TRACKS',
        ]),
    },

    mounted() {
        this.$store.commit('UPDATE_SEARCH_LOADER', false);
    },
    methods: {
        ...mapActions(['CLEAN_SEARCH_RESULT', 'SEARCH_ARTISTS', 'SEARCH_ALBUMS', 'SEARCH_TRACKS']),
    }
}
</script>

<style lang="scss">

</style>