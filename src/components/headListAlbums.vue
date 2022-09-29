<template>
    <div class="head_albums">
        <div class="select_view_albums" v-if="viewAlbums === true && which === 'explore'">
            <button type="button" class="view_list" @click="changeVisibleAlbums('list')" :class="{'active': VIEW_ALBUMS === 'list'}"></button>
            <button type="button" class="view_grid" @click="changeVisibleAlbums('grid')" :class="{'active': VIEW_ALBUMS === 'grid'}"></button>
        </div>
        <div class="select_view_albums" v-if="viewAlbums === true && which === 'searchDetails'">
            <button type="button" class="view_list" @click="changeVisibleAlbums('list')" :class="{'active': SEARCH_VIEW_ALBUMS === 'list'}"></button>
            <button type="button" class="view_grid" @click="changeVisibleAlbums('grid')" :class="{'active': SEARCH_VIEW_ALBUMS === 'grid'}"></button>
        </div>
        <div class="select_view_albums" v-if="viewAlbums === true && which === 'library'">
            <button type="button" class="view_list" @click="changeVisibleAlbums('list')" :class="{'active': libraryViewAlbums === 'list'}"></button>
            <button type="button" class="view_grid" @click="changeVisibleAlbums('grid')" :class="{'active': libraryViewAlbums === 'grid'}"></button>
        </div>
        <div class="top_rated_index" v-if="UPPER_FILTER === 'topRated' && which === 'explore'"></div>
        <div class="cover_img_"></div>
        <div class="like_album_" :class="{'hidden_like': hideLike}"></div>
        <div class="title_">Title
            <div class="sort">
                <span class="material-icons" :class="{active: currentOrderBy === 'title_asc'}" @click="orderBy('title', 'asc')">arrow_drop_up</span>
                <span class="material-icons" :class="{active: currentOrderBy === 'title_desc'}" @click="orderBy('title', 'desc')">arrow_drop_down</span>
            </div>
        </div>
        <div class="artist_">Artist
            <div class="sort">
                <span class="material-icons" :class="{active: currentOrderBy === 'artist_asc'}" @click="orderBy('artist', 'asc')">arrow_drop_up</span>
                <span class="material-icons" :class="{active: currentOrderBy === 'artist_desc'}" @click="orderBy('artist', 'desc')">arrow_drop_down</span>
            </div>
        </div>
        <div class="released_" v-if="SHOW_COLUMNS.includes('released')">Released
            <div class="sort">
                <span class="material-icons" :class="{active: currentOrderBy === 'released_asc'}" @click="orderBy('released', 'asc')">arrow_drop_up</span>
                <span class="material-icons" :class="{active: currentOrderBy === 'released_desc'}" @click="orderBy('released', 'desc')">arrow_drop_down</span>
            </div>
        </div>
        <div class="rating_" v-if="SHOW_COLUMNS.includes('rating')">Rating
            <div class="sort">
                <span class="material-icons" :class="{active: currentOrderBy === 'rating_asc'}" @click="orderBy('rating', 'asc')">arrow_drop_up</span>
                <span class="material-icons" :class="{active: currentOrderBy === 'rating_desc'}" @click="orderBy('rating', 'desc')">arrow_drop_down</span>
            </div>
        </div>
        <div class="actions_">
            <v-menu
                    transition="slide-y-transition"
                    :close-on-content-click="false"
                    :nudge-width="120"
                    content-class="menu-pointer charcoal"
                    offset-y
                    nudge-left="60"
                    nudge-bottom="15"
                    origin="top center"
            >
                <template v-slot:activator="{ on, attrs }">
                    <button v-bind="attrs" v-on="on">
                        <span class="material-icons">arrow_drop_down</span>
                    </button>
                </template>
                <v-list>
                    <v-list-item>
                        <div class="material_checkbox">
                            <input type="checkbox" id="label" value="label" v-model="columns"
                                   @change="checkColumn($event)">
                            <label for="label">Label</label>
                        </div>
                    </v-list-item>
                    <v-list-item>
                        <div class="material_checkbox">
                            <input type="checkbox" id="released" value="released" v-model="columns"
                                   @change="checkColumn($event)">
                            <label for="released">Released</label>
                        </div>
                    </v-list-item>
                    <v-list-item>
                        <div class="material_checkbox">
                            <input type="checkbox" id="rating" value="rating" v-model="columns"
                                   @change="checkColumn($event)">
                            <label for="rating">Rating</label>
                        </div>
                    </v-list-item>
                    <v-list-item>
                        <div class="material_checkbox">
                            <input type="checkbox" id="viewes" value="viewes" v-model="columns"
                                   @change="checkColumn($event)">
                            <label for="viewes">Viewes</label>
                        </div>
                    </v-list-item>
                    <v-list-item>
                        <div class="material_checkbox">
                            <input type="checkbox" id="downloads" value="downloads" v-model="columns"
                                   @change="checkColumn($event)">
                            <label for="downloads">Downloads</label>
                        </div>
                    </v-list-item>
                    <v-list-item>
                        <div class="material_checkbox">
                            <input type="checkbox" id="collected" value="collected" v-model="columns"
                                   @change="checkColumn($event)">
                            <label for="collected">Collected</label>
                        </div>
                    </v-list-item>

                </v-list>
            </v-menu>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "headListAlbums",
    props: ['viewAlbums', 'which', 'hideLike'],
    data() {
        return {
            currentOrderBy: 'released_desc',
            columns: this.$store.getters.SHOW_COLUMNS,
            activeViewAlbum: 'grid',
        };
    },
    computed: {
        ...mapGetters([
            'ORDER_BY',
            'SHOW_COLUMNS',
            'VIEW_ALBUMS',
            'SEARCH_VIEW_ALBUMS',
            'UPPER_FILTER'
        ]),
        ...mapGetters({
            libraryViewAlbums: 'libraryFilters/VIEW_ALBUMS'
        })
    },
    mounted() {

    },
    methods: {
        orderBy: function (key, direction) {
            this.currentOrderBy = `${key}_${direction}`;

            if (key && direction) {
                if (key === 'title') {
                    if (this.which === 'searchDetails') {
                        this.$store.dispatch('UPDATE_SEARCH_ALBUMS_ORDER_BY', {'order[title]': `${direction}`});
                    } else {
                        this.$store.dispatch('UPDATE_ORDER_BY', {'order[title]': `${direction}`});
                    }
                }
                if (key === 'artist') {
                    if (this.which === 'searchDetails') {
                        this.$store.dispatch('UPDATE_SEARCH_ALBUMS_ORDER_BY', {'order[artist.name]': `${direction}`});
                    } else {
                        this.$store.dispatch('UPDATE_ORDER_BY', {'order[artist.name]': `${direction}`});
                    }
                }
                if (key === 'released') {
                    if (this.which === 'searchDetails') {
                        this.$store.dispatch('UPDATE_SEARCH_ALBUMS_ORDER_BY', {'order[releasedAt]': `${direction}`});
                    } else {
                        this.$store.dispatch('UPDATE_ORDER_BY', {'order[releasedAt]': `${direction}`});
                    }
                }
                if (key === 'rating') {
                    if (this.which === 'searchDetails') {
                        this.$store.dispatch('UPDATE_SEARCH_ALBUMS_ORDER_BY', {'order[rating]': `${direction}`});
                    } else {
                        this.$store.dispatch('UPDATE_ORDER_BY', {'order[rating]': `${direction}`});
                    }
                }
            }
        },
        checkColumn() {
            this.$store.commit('SET_SHOW_COLUMNS', this.columns);
        },
        changeVisibleAlbums(value) {
            if (this.which === 'library') {
                this.$store.commit('libraryFilters/SET_VIEW_ALBUMS', value);
            }
            else if (this.which === 'searchDetails') {
                this.$store.commit('SET_SEARCH_VIEW_ALBUMS', value);
                this.activeViewAlbum = value;
            } else if (this.which === 'explore') {
                // if (this.UPPER_FILTER === 'topRated') {
                //     return
                // }
                this.$store.commit('SET_VIEW_ALBUMS', value);
                this.activeViewAlbum = value;
            }
        }
    }
}
</script>

<style scoped>
    .select_view_albums {
        position: absolute;
        display: flex;
        height: 100%;
    }
</style>
