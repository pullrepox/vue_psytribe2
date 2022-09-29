<template>
    <div class="pagination">
        <div class="left_line"></div>
        <div class="center_box">
            <button type="button" class="previous_page" @click="previous_page" :disabled="+TRACKS_CURRENT_PAGE === 1">Previous</button>

            <div class="select_page">
                <div class="pagination_status" id="pagination-status" @click="toogleListPagination">Page {{TRACKS_CURRENT_PAGE}} of {{Math.ceil(countTracks / 30)}}</div>
                <v-list class="pagination_list" v-if="viewListPagination" id="pagination-list" :class="{'show': viewListPagination}" v-click-outside="clickOutsidePagination">
                    <v-list-item v-for="(item, i) of Math.ceil(countTracks / 30)" :key="i" @click="selectPage(item)" :id="`list-item-${item}`">
                        <v-list-item-title :class="{'active': item === TRACKS_CURRENT_PAGE}">Page {{ item }} of {{Math.ceil(countTracks / 30)}}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </div>

            <button type="button" class="next_page" @click="next_page" :disabled="+TRACKS_CURRENT_PAGE >= Math.ceil(COUNT_TRACKS / 30)">Next</button>
        </div>
        <div class="right_line"></div>

    </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
    name: 'tracksPagination',
    props: ['countTracks'],
    data() {
        return {
            viewListPagination: false
        };
    },
    computed: {
        ...mapGetters([
            'COUNT_TRACKS', 'TRACKS', 'TRACKS_CURRENT_PAGE'
        ]),
    },

    methods: {
        previous_page() {
            if (Number(this.TRACKS_CURRENT_PAGE) < 1) {
                this.$store.commit('SET_TRACKS_CURRENT_PAGE', 1);
            }
            this.$store.commit('SET_TRACKS_CURRENT_PAGE', Number(this.TRACKS_CURRENT_PAGE) - 1);
        },
        next_page () {
            if (Number(this.TRACKS_CURRENT_PAGE) >= Math.ceil(this.TRACKS / 30)) {
                this.$store.commit('SET_TRACKS_CURRENT_PAGE', this.COUNT_TRACKS / 30);
            }
            this.$store.commit('SET_TRACKS_CURRENT_PAGE', Number(this.TRACKS_CURRENT_PAGE) + 1);
        },
        selectPage(item) {
            this.$store.commit('SET_TRACKS_CURRENT_PAGE', item);
            this.viewListPagination = false;
        },
        toogleListPagination() {
            this.viewListPagination = !this.viewListPagination;
            document.getElementById(`list-item-${this.TRACKS_CURRENT_PAGE}`).scrollIntoView();
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
