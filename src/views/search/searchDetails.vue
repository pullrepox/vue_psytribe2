<template>
    <div class="p-search-details">
        <div class="content-page">
            <v-container>

                <boxInputSearch></boxInputSearch>

                <div class="block_search_results">
                    <template v-if="whatContent === 'artists' || SEARCH_DETAILS_CONTENT === 'artists'">
                        <div class="head_content">
                            <router-link :to="{name: 'search'}"><span class="material-icons">keyboard_arrow_left</span></router-link>
                            Artists
                        </div>
                        <artistsSearchList></artistsSearchList>
                    </template>

                    <template v-if="whatContent === 'albums' || SEARCH_DETAILS_CONTENT === 'albums'">
                        <div class="head_content">
                            <router-link :to="{name: 'search'}"><span class="material-icons">keyboard_arrow_left</span></router-link>
                            Albums
                        </div>
                        <albumsSearchList></albumsSearchList>
                    </template>

                    <template v-if="whatContent === 'tracks' || SEARCH_DETAILS_CONTENT === 'tracks'">
                        <div class="head_content">
                            <router-link :to="{name: 'search'}"><span class="material-icons">keyboard_arrow_left</span></router-link>
                            Tracks
                        </div>
                        <tracksSearchList></tracksSearchList>
                    </template>
                </div>
            </v-container>
        </div>

    </div>
</template>

<script>
import {mapGetters} from 'vuex';

import boxInputSearch from "@/components/search/boxInputSearch";
import artistsSearchList from '@/components/search/artistsSearchList';
import albumsSearchList from '@/components/search/albumsSearchList';
import tracksSearchList from '@/components/search/tracksSearchList';

export default {
    name: 'searchDetails',
    components: {
        boxInputSearch,
        artistsSearchList,
        albumsSearchList,
        tracksSearchList
    },
    props: ['whatContent'],
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters(['SEARCH_DETAILS_CONTENT']),
    },
    mounted() {
        if (this.whatContent) {
            this.$store.commit('UPDATE_SEARCH_DETAILS_CONTENT', this.whatContent);
        }

        if (!this.whatContent && !this.SEARCH_DETAILS_CONTENT) {
            this.$router.push({name: 'search'});
        }
    },
    methods: {

    }
}
</script>
