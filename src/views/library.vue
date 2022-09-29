<template>
    <div class="library-page">
        <div class="library_head">
            <v-container>
                <h2>Library</h2>
                <div class="library_nav">
                    <router-link :to="{name: 'collection'}">Collection</router-link>
<!--                    <router-link :to="{name: 'playlist'}">Playlist</router-link>-->
                    <button @click="showComingSoonDialog = true">Playlist</button>
                    <div class="custom_switch" @click="switchFilterToggle()"  :class="{'active': libraryFilter}">
                        Filter
                        <div class="switch_thumb"></div>
                    </div>
                </div>

            </v-container>
        </div>
        <v-container class="full_page">
            <albumsFilter
                v-if="libraryFilter"
                :actions="false"
                :subgenreFilter="'dropdown'"
                :keysFilter="true"
                :filterName="'library'"
                :subgenreClear="true">
            </albumsFilter>

            <transition v-if="this.$route.name === 'collection'">
                <collection></collection>
            </transition>

            <transition v-if="this.$route.name === 'playlist'">
                <playlist></playlist>
            </transition>
        </v-container>

        <ComingSoonDialog v-model="showComingSoonDialog"></ComingSoonDialog>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import albumsFilter from '@/components/albumsFilter';
import collection from '@/views/library/collection';
import playlist from '@/views/library/playlist';

const ComingSoonDialog = () => import("@/components/dialogs/comingSoonDialog");

export default {
    name: 'library',
    components: {
        collection,
        playlist,
        albumsFilter,
        ComingSoonDialog
    },
    data () {
        return {
            libraryFilter: this.$store.getters["libraryFilters/LIBRARY_FILTER"],
            showComingSoonDialog: false,
        }
    },
    watch: {
        // libraryFilter() {
        //
        // }
    },

    computed: {
        ...mapGetters({

        }),
    },

    mounted() {
        this.libraryFilter = this.$store.getters["libraryFilters/LIBRARY_FILTER"];
    },

    methods: {
        ...mapActions({}),
        switchFilterToggle() {
            this.libraryFilter = !this.libraryFilter;
            this.$store.commit('libraryFilters/SET_LIBRARY_FILTER', this.libraryFilter);
            if (!this.libraryFilter) {
                this.$store.dispatch('libraryFilters/CLEAR_FILTERS');
            }
        }
    }
};
</script>
