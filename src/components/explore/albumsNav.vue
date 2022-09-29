<template>
    <div class="explore_albums_nav">
        <div class="left_buttons" v-if="!STATUS_FILTER || STATUS_FILTER === false">
            <button type="button" class="view_list" @click="changeVisibleAlbums('list')" :class="{'active': VIEW_ALBUMS === 'list'}"></button>
            <button type="button" class="view_grid" @click="changeVisibleAlbums('grid')" :class="{'active': VIEW_ALBUMS === 'grid'}"></button>
        </div>

        <template v-if="AUTH_DATA.accessToken">
            <button type="button" @click="selectionAlbums('undiscovered')" :class="{active: UPPER_FILTER === 'undiscovered'}">Undiscovered</button>
        </template>

        <button type="button" @click="selectionAlbums('newest')" :class="{active: UPPER_FILTER === 'newest'}">Newest</button>
        <button type="button" @click="selectionAlbums('popular')" :class="{active: UPPER_FILTER === 'popular'}">Popular</button>
        <button type="button" @click="selectionAlbums('trending')" :class="{active: UPPER_FILTER === 'trending'}">Trending</button>
        <button type="button" @click="selectionAlbums('topRated')" :class="{active: UPPER_FILTER === 'topRated'}">Top rated</button>

        <div class="right_buttons">
            <button type="button" v-if="STATUS_FILTER === true" class="bookmarks" @click="bookmarks">Bookmarks</button>
            <button type="button" class="show_clear_filter" :class="{'active': STATUS_FILTER === true}" @click="toogleFilter">
                {{ (STATUS_FILTER === true) ? 'Clear' : 'Filters' }}
            </button>
        </div>
        <ComingSoonDialog v-model="showComingSoonDialog"></ComingSoonDialog>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
const ComingSoonDialog = () => import("@/components/dialogs/comingSoonDialog");

export default {
    name: "albumsNav",
    components: {
        ComingSoonDialog
    },
    data() {
        return {
            showComingSoonDialog: false,
        }
    },
    watch: {
        UPPER_FILTER() {
            if (this.UPPER_FILTER === 'topRated') {
                this.$store.commit('SET_VIEW_ALBUMS', 'list');
            } else {
                this.$store.commit('SET_VIEW_ALBUMS', 'grid');
            }
            this.$store.commit('SET_ALBUM_EXPANDED', '');
            this.$store.commit('SET_ALBUMS_CURRENT_PAGE', 1);

            // this.$store.commit('SET_STATUS_FILTER', false);
            this.$store.dispatch('UPDATE_BPM', []);
            this.$store.dispatch('UPDATE_KEYS', []);
        },
    },
    computed: {
        ...mapGetters(['AUTH_DATA', 'UPPER_FILTER', 'STATUS_FILTER', 'VIEW_ALBUMS', 'ALBUM_EXPANDED', 'ALBUMS_CURRENT_PAGE'])
    },
    created() {
        if (!this.UPPER_FILTER) {
            if (this.AUTH_DATA.accessToken) {
                this.$store.dispatch('UPDATE_UPPER_FILTER', 'undiscovered');
            } else {
                this.$store.dispatch('UPDATE_UPPER_FILTER', 'newest');
            }
        }
    },
    mounted() {
        if (this.UPPER_FILTER === 'topRated') {
            this.$store.commit('SET_VIEW_ALBUMS', 'list');
        }
    },
    methods: {
        selectionAlbums(value) {
            this.$store.dispatch('UPDATE_UPPER_FILTER', value);
        },
        toogleFilter() {
            if (this.STATUS_FILTER === true) {
                this.$store.commit('SET_STATUS_FILTER', false);
                this.$store.dispatch('CLEAN_FILTERS');
                this.$store.commit('SET_ALBUMS_CURRENT_PAGE', 1);
                this.$store.commit('SET_ALBUM_EXPANDED','');
            } else {
                this.$store.commit('SET_STATUS_FILTER', true);
            }
        },
        // showFilter() {
        //
        // },
        // clearFilter() {
        //
        // },
        changeVisibleAlbums(value) {
            this.$store.commit('SET_VIEW_ALBUMS', value);
        },
        bookmarks() {
            this.showComingSoonDialog = true;
        }
    }
}
</script>

<style scoped>

</style>