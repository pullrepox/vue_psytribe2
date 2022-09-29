<template>
    <v-menu offset-y :nudge-bottom="12">
        <template v-slot:activator="{ attrs, on }">
            <div class="search">
                <span class="material-icons">search</span>
                <input type="text" placeholder="Search music" v-bind="attrs" v-on="on" v-model="searchText"
                       v-on:keyup.enter.exact="goToSearch()">
            </div>
        </template>

        <v-list class="search" v-if="historySearch.length">
            <v-list-item v-for="(item, index) of historySearch" :key="index + keyDynamic" @click="selectSearchText(item)">
                <span class="material-icons-outlined">schedule</span>
                {{ item }}
                <button type="button" class="delete_search_text" @click="deleteItemSearch(item)">
                    <span class="material-icons-outlined">clear</span>
                </button>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
    name: 'searchBar',
    data() {
        return {
            searchText: '',
            historySearch: [],
            keyDynamic: '',
        }
    },
    watch: {
        SEARCH_STRING() {
            console.log(this.SEARCH_STRING);
        }
    },
    computed: {
        ...mapGetters(['SEARCH_STRING'])
    },
    created() {
        if (localStorage.getItem('historySearch')) {
            this.historySearch = JSON.parse(localStorage.getItem('historySearch') || []);
        }
    },
    methods: {
        ...mapActions(['SEARCH_ARTISTS', 'SEARCH_ALBUMS', 'SEARCH_TRACKS']),
        async runSearch() {

            if (this.$route.name !== 'search') {
                this.$router.push({name: 'search'}).catch(err => {
                    console.log('ERR', err);
                });
            }
            await this.SEARCH_ARTISTS({'name': this.searchText})
                .then(() => {

                })
                .catch(err => {

                    console.log(`SEARCH_ARTISTS ${err}`);
                });
            await this.SEARCH_ALBUMS({'title': this.searchText})
                .then(() => {

                })
                .catch(err => {

                    console.log(`SEARCH_ALBUMS ${err}`);
                });
            await this.SEARCH_TRACKS({'title': this.searchText})
                .then(() => {

                })
                .catch(err => {

                    console.log(`SEARCH_TRACKS ${err}`);
                });
            this.$store.commit('UPDATE_SEARCH_LOADER', false);
        },
        goToSearch() {
            this.keyDynamic += 1;
            if (this.historySearch.length > 10) {
                this.historySearch.pop();
            }
            this.historySearch.unshift(this.searchText);
            localStorage.setItem('historySearch', JSON.stringify(this.historySearch));
            this.$store.commit('UPDATE_SEARCH_STRING', this.searchText);
            this.runSearch();
        },
        selectSearchText(textSearch) {
            this.searchText = textSearch;
            this.$store.commit('UPDATE_SEARCH_STRING', textSearch);
            this.runSearch();
        },
        deleteItemSearch(item) {
            this.historySearch = this.historySearch.filter(el => el !== item);
            localStorage.setItem('historySearch', JSON.stringify(this.historySearch));
        },
    }
}
</script>

<style scoped>

</style>
