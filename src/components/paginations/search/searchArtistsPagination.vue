<template>
    <div class="pagination">
        <div class="left_line"></div>
        <div class="center_box">
            <button type="button" class="previous_page" @click="previous_page" :disabled="SEARCH_ARTISTS_CURRENT_PAGE === 1">Previous</button>

            <div class="select_page">
                <div class="pagination_status" id="pagination-status" @click="toogleListPagination">Page {{SEARCH_ARTISTS_CURRENT_PAGE}} of {{Math.ceil(countArtists / 30)}}</div>
                <v-list class="pagination_list" v-if="viewListPagination" id="pagination-list" :class="{'show': viewListPagination}" v-click-outside="clickOutsidePagination">
                    <v-list-item v-for="(item, i) of Math.ceil(countArtists / 30)" :key="i" @click="selectPage(item)" :id="`list-item-${item}`">
                        <v-list-item-title :class="{'active': item === SEARCH_ARTISTS_CURRENT_PAGE}">Page {{ item }} of {{Math.ceil(countArtists / 30)}}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </div>

            <button type="button" class="next_page" @click="next_page" :disabled="+SEARCH_ARTISTS_CURRENT_PAGE >= Math.ceil(countArtists / 30)">Next</button>
        </div>
        <div class="right_line"></div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
    name: 'searchArtistsPagination',
    props: ['countArtists'],
    data() {
        return {
            viewListPagination: false
        };
    },
    computed: {
        ...mapGetters([
            'SEARCH_COUNT_ARTISTS', 'SEARCH_ARTISTS_RESULT', 'SEARCH_ARTISTS_CURRENT_PAGE',
        ]),
    },
    methods: {
        previous_page() {
            if (Number(this.SEARCH_ARTISTS_CURRENT_PAGE) < 1) {
                this.$store.commit('SET_SEARCH_ALBUMS_CURRENT_PAGE', 1);
            }
            this.$store.commit('SET_SEARCH_ALBUMS_CURRENT_PAGE', Number(this.SEARCH_ARTISTS_CURRENT_PAGE) - 1);
        },
        next_page() {
            if (Number(this.SEARCH_ARTISTS_CURRENT_PAGE) >= Math.ceil(this.SEARCH_ARTISTS_RESULT / 30)) {
                this.$store.commit('SET_SEARCH_ALBUMS_CURRENT_PAGE', this.SEARCH_COUNT_ARTISTS / 30);
            }
            this.$store.commit('SET_SEARCH_ALBUMS_CURRENT_PAGE', Number(this.SEARCH_ARTISTS_CURRENT_PAGE) + 1);
        },
        selectPage(item) {
            this.$store.commit('SET_SEARCH_ALBUMS_CURRENT_PAGE', item);
            this.viewListPagination = false;
        },
        toogleListPagination() {
            this.viewListPagination = !this.viewListPagination;
            document.getElementById(`list-item-${this.SEARCH_ARTISTS_CURRENT_PAGE}`).scrollIntoView();
        },
        clickOutsidePagination: function (event) {
            if (event.target.parentElement !== null) {
                if (event.target.id !== 'pagination-status' && event.target.parentElement.id !== 'pagination-list') {
                    this.viewListPagination = false;
                }
            }
        }
    },
};
</script>
