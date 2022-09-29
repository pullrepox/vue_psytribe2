<template>
    <div class="box_input_search" :class="{'focus': isFocus}" v-click-outside="removeFocus" @click="addFocus">
        <input type="text" ref="inputSearch" placeholder="Search..." v-model="searchText" v-on:keyup.enter.exact="runSearch()" >
        <button type="button" class="clear_search" v-if="SEARCH_STRING" @click="clearSearch"></button>
        <button type="button" class="run_search" :class="{'active': searchText.length}" v-if="!SEARCH_STRING" @click="runSearch()"></button>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "boxInputSearch",
    data() {
        return {
            searchText: '',
            isFocus: false,
        }
    },
    watch: {
        SEARCH_STRING() {
            this.$store.commit('SET_ARTISTS_CURRENT_PAGE', 1);
            this.$store.commit('SET_SEARCH_ALBUMS_CURRENT_PAGE', 1);
            this.$store.commit('SET_TRACKS_CURRENT_PAGE', 1);
        }
    },
    computed: {
        ...mapGetters(['SEARCH_STRING', 'SEARCH_LOADER'])
    },
    mounted() {
        this.searchText = this.SEARCH_STRING;
        this.$refs.inputSearch.focus();
        this.isFocus = true;
    },

    methods: {
        ...mapActions(['CLEAN_SEARCH_RESULT', 'SEARCH_ARTISTS', 'SEARCH_ALBUMS', 'SEARCH_TRACKS']),

        async runSearch() {
            if (this.searchText.length) {
                this.CLEAN_SEARCH_RESULT();
                this.$store.commit('UPDATE_SEARCH_STRING', this.searchText);
                this.$store.commit('UPDATE_SEARCH_LOADER', true);

                await this.SEARCH_ARTISTS({'name': this.searchText.trim()}).catch(err => console.error(`SEARCH_ARTISTS ${err}`));
                await this.SEARCH_ALBUMS({'title': this.searchText.trim(), 'order[releasedAt]': `DESC`}).catch(err => console.error(`SEARCH_ALBUMS ${err}`));
                await this.SEARCH_TRACKS({'title': this.searchText.trim(), 'order[releasedAt]': 'DESC'}).catch(err => console.error(`SEARCH_TRACKS ${err}`));

                this.$store.commit('UPDATE_SEARCH_LOADER', false);
            }
        },
        clearSearch() {
            this.CLEAN_SEARCH_RESULT();
            this.searchText = '';
            this.$store.commit('UPDATE_SEARCH_STRING', '');

            if (this.$route.name !== 'search') {
                this.$router.push({name: 'search'});
            }
        },
        removeFocus(event) {
            if (event.target.className !== 'search active router-link-active') {
                this.isFocus = false;
            }

        },
        addFocus() {
            this.isFocus = true;
        }


    }
}
</script>

<style scoped>

</style>