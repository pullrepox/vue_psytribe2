<template>
    <div class="wrap_filter_bar_albums" :class="{'full': filterName === 'explore'}">

<!--        <div class="explore_filters" v-if="filterName === 'explore'">-->
<!--            <button type="button" :class="{'active': !UPPER_FILTER || UPPER_FILTER === 'new_releases'}" @click="selectUpperFilter('new_releases')">New-->
<!--                Releases-->
<!--            </button>-->
<!--            <button type="button" :class="{'active': UPPER_FILTER === 'popular'}" @click="selectUpperFilter('popular')">Top Rated 1</button>-->
<!--            <button type="button" :class="{'active': UPPER_FILTER === 'trending'}" @click="selectUpperFilter('trending')">Top Rated 2</button>-->
<!--            <button type="button" :class="{'active': UPPER_FILTER === 'top_rated'}" @click="selectUpperFilter('top_rated')">Top Rated 3</button>-->

<!--            <div class="filter_actions" :class="{active: STATUS_FILTER}">-->
<!--                <v-tooltip bottom>-->
<!--                    <template v-slot:activator="{ on, attrs }">-->
<!--                        <button type="button" class="additional_filter" :class="{active: STATUS_FILTER}" @click="toogleFilters" v-bind="attrs" v-on="on">-->
<!--                        </button>-->
<!--                    </template>-->
<!--                    <span v-if="!STATUS_FILTER">Filters</span>-->
<!--                    <span v-if="STATUS_FILTER">Hide</span>-->
<!--                </v-tooltip>-->

<!--                <transition name="fade" mode="out-in">-->
<!--                    <div class="wrap_buttons" v-if="STATUS_FILTER === true">-->
<!--                        <v-tooltip bottom>-->
<!--                            <template v-slot:activator="{ on, attrs }">-->
<!--                                <button type="button" class="clear_filter" v-bind="attrs" v-on="on" @click="clearFilters"-->
<!--                                        :class="{'active': ACTIVE_SAVED_FILTER === ''}"></button>-->
<!--                            </template>-->
<!--                            <span>Clear</span>-->
<!--                        </v-tooltip>-->

<!--                        <v-menu-->
<!--                            v-model="menuSaveFilterVisible"-->
<!--                            :close-on-content-click="false"-->
<!--                            :nudge-width="200"-->
<!--                            offset-y-->
<!--                            nudge-left="100"-->
<!--                            nudge-bottom="20"-->
<!--                            origin="top center"-->
<!--                            content-class="menu-pointer">-->
<!--                            <template v-slot:activator="{ on, attrs }">-->
<!--                                <v-tooltip bottom :class="{'hide': !menuSaveFilterVisible}" :disabled="menuSaveFilterVisible">-->
<!--                                    <template v-slot:activator="{ on, attrs }">-->
<!--                                        <button type="button" class="bookmark" v-bind="attrs" v-on="on" @click="openSavedFilters"-->
<!--                                                :class="{'focus': menuSaveFilterVisible, 'active': ACTIVE_SAVED_FILTER !== ''}"></button>-->
<!--                                    </template>-->
<!--                                    <span>Bookmarks</span>-->
<!--                                </v-tooltip>-->
<!--                            </template>-->

<!--                            <v-card class="saved_filter">-->
<!--                                <div class="head_">Saved filters</div>-->
<!--                                <div class="wrapper_saves_filters" :class="{'loading_': deleteSavedFilterStatus}">-->
<!--                                    <template v-if="!PROFILE_DATA && !PROFILE_DATA.searchFilters.length">-->
<!--                                        <div class="none_saved_filters">Nothing saved yet</div>-->
<!--                                    </template>-->
<!--                                    <div class="item_filter" v-for="item of PROFILE_DATA.searchFilters" :key="item.id"-->
<!--                                         :class="{'active': ACTIVE_SAVED_FILTER === item.name}">-->
<!--                                        <span @click="apply_filter(item)">{{ item.name }}</span>-->
<!--                                        <button type="button" class="delete_filter" @click="deleteFilter(item)"></button>-->
<!--                                    </div>-->
<!--                                    <div class="cover_bg" v-if="deleteSavedFilterStatus">-->
<!--                                        <v-progress-circular-->
<!--                                            indeterminate-->
<!--                                            color="#E94E4E"-->
<!--                                        ></v-progress-circular>-->
<!--                                    </div>-->

<!--                                </div>-->
<!--                                <div class="box_bottom">-->
<!--                                    <div class="wrap_new_saved_filter">-->
<!--                                        <input type="text" class="save_current_filter" placeholder="+ Save current filter" v-model="newFilterName"></input>-->
<!--                                        <button v-if="newFilterName" type="button" class="clear_input" @click="clearInputNewFilter"></button>-->
<!--                                    </div>-->
<!--                                    <span class="hint_text" v-if="saveSavedFilterStatus === false">*Filter name already exists</span>-->
<!--                                    <button v-if="newFilterName" type="button" class="done" @click="saveFilter">Save</button>-->
<!--                                    <button v-if="!newFilterName" type="button" class="done" @click="menuSaveFilterVisible = false">Done</button>-->
<!--                                </div>-->
<!--                            </v-card>-->
<!--                        </v-menu>-->

<!--                        <dialogNeedLogin v-model="dialogNeedLogin"></dialogNeedLogin>-->

<!--                        <v-tooltip bottom>-->
<!--                            <template v-slot:activator="{ on, attrs }">-->
<!--                                <button type="button" class="discovery" v-bind="attrs" v-on="on" @click="toggle_discovery"-->
<!--                                        :class="{active: DISCOVERY}"></button>-->
<!--                            </template>-->
<!--                            <span>Discovery mode.<br> Hides music youve already heard</span>-->
<!--                        </v-tooltip>-->
<!--                    </div>-->
<!--                </transition>-->
<!--            </div>-->
<!--        </div>-->
        <div class="filter_bar_" v-if="filterName === 'library' || STATUS_FILTER">

            <div class="filters_">

                <!-- GENRE -->
                <div class="genre">
                    <div class="material_input">
                        <input type="text" readonly required id="btn-open-genres" v-model="GENRE">
                        <label>Genre</label>
                    </div>
                </div>

                <!-- SUB-GENRE -->
                <div class="subgenre">
                    <div class="material_input">

                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <input type="text" v-if="filterName === 'explore'" required v-bind="attrs" v-on="on" v-model="SUBGENRE.name"
                                       @click="viewKeysFilter = false">
                                <input type="text" v-if="filterName === 'library'" required v-bind="attrs" v-on="on" v-model="librarySubgenre.name"
                                       @click="viewKeysFilter = false">
                            </template>

                            <v-list>
                                <v-list-item v-for="item of SUBGENRES" :key="item.id" @click="selectSubgenre(item)">
                                    {{ item.name }}
                                    <span class="count" v-if="filterName === 'explore'">{{ item.musicReleasesCount }}</span>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <label>Sub-Genre</label>
                    </div>
                    <div class="clear_subgenre" v-if="subgenreClear && librarySubgenre.name" @click="clearSubgenre">
                        <span class="material-icons">cancel</span>
                    </div>
                </div>

                <!-- BPM -->
                <div class="bpm">
                    <v-menu v-model="bpmOptions.show"
                            :close-on-content-click="false"
                            :min-width="310"
                            offset-y
                            :menu-props="{ contentClass: 'bpm_menu' }">

                        <template v-slot:activator="{ on, attrs }">
                            <div class="material_input" v-bind="attrs" v-on="on">
                                <input v-if="BPM.length && filterName === 'explore'" type="text" required v-model="BPM[0] +' - '+ BPM[1]"
                                       @click="viewKeysFilter = false">
                                <input v-if="libraryBPM.length && filterName === 'library'" type="text" required v-model="libraryBPM[0] +' - '+ libraryBPM[1]"
                                       @click="viewKeysFilter = false">
                                <input v-else type="text" required @click="viewKeysFilter = false">
                                <label>BPM</label>
                            </div>
                        </template>

                        <v-card class="border_radius_12">
                            <v-list>
                                <div class="bpm_body">
                                    <div class="wrap_slider">
                                        <v-range-slider
                                            v-model="bpm"
                                            :max="300"
                                            :min="0"
                                            hide-details
                                            :thumb-color="'#7481A6'"
                                            :thumb-size='20'
                                            :tick-size='100'
                                            class="align-center">
                                        </v-range-slider>
                                    </div>
                                    <div class="wrap_inputs">
                                        <input type="text" v-model="bpm[0]">
                                        <span>-</span>
                                        <input type="text" v-model="bpm[1]">
                                    </div>
                                </div>
                            </v-list>
                        </v-card>
                    </v-menu>

                    <div class="bpm_action" v-if="bpmOptions.show">
                        <button type="button" class="clear_close" @click="cancelBPM">
                            <span class="material-icons">cancel</span>
                        </button>

                        <button type="button" class="apply_bpm" :class="{'active': bpm.length}" @click="saveBPM">
                            <span class="material-icons">check_circle</span>
                        </button>
                    </div>

                </div>

                <!-- KEYS -->
                <div class="key">
                    <div class="material_input" @click="viewFilter('keys')" id="btn-open-keys">
                        <input type="text" v-if="filterName === 'explore'" required v-model="KEYS">
                        <input type="text" v-if="filterName === 'library'" required v-model="libraryKeys">
                        <label>Key</label>
                    </div>
                    <!-- <template v-if="KEYS.length > 4">Multiple</template> -->
                    <!-- <template v-else v-for="item in KEYS"> -->
                    <div class="key_action" v-if="keysFilter && viewKeysFilter">
                        <button type="button" class="clear_close" @click="clear_close_keys">
                            <span class="material-icons">cancel</span>
                        </button>

                        <button v-if="filterName === 'explore'" type="button" class="apply_keys" :class="{'active': KEYS.length}" @click="apply_keys">
                            <span class="material-icons">check_circle</span>
                        </button>
                        <button v-if="filterName === 'library'" type="button" class="apply_keys" :class="{'active': libraryKeys.length}" @click="apply_keys">
                            <span class="material-icons">check_circle</span>
                        </button>
                    </div>
                </div>

                <!-- FILTER ACTIONS BUTTONS -->
                <template v-if="actions">
                    <div class="filter_actions">
                        <button type="button" class="open_buttons" :class="{active: actionsButtons}" @click="open_actions_buttons">
                            <span class="material-icons">tune</span>
                        </button>
                        <transition name="fade">
                            <div class="wrap_buttons" v-if="actionsButtons === true">
                                <button type="button" class="save_filter" @click="saveFilter">
                                    <span class="material-icons">bookmark</span>
                                </button>

                                <dialogSaveFilter v-model="dialogSaveFilterVisible"></dialogSaveFilter>
                                <dialogNeedLogin v-model="dialogNeedLogin"></dialogNeedLogin>

                                <button type="button" class="show_tags" @click="showTags" :class="{active: showTagsInput}">
                                    <span class="material-icons">local_offer</span>
                                </button>
                                <button type="button" class="delete_filter" @click="clearFilters">
                                    <span class="material-icons">clear</span>
                                </button>
                            </div>
                        </transition>
                    </div>
                </template>
            </div>

            <!-- TAGS -->
            <template v-if="filterName === 'explore'">
                <div class="tags_input_" v-if="showTagsInput || actions === false || TAGS.length">
                    <div class="tags">
                        <v-chip
                            v-for="(item, index) in TAGS"
                            :key="index"
                            close
                            @click:close="TAGS.splice(index,1)">
                            {{ item }}
                        </v-chip>
                        <input type="text" placeholder="#Tags" @keypress="updateTags($event)" v-model="newTag" @keydown.delete="removeTags($event)">
                    </div>
                </div>
            </template>
            <template v-if="filterName === 'library'">
                <div class="tags_input_" v-if="showTagsInput || actions === false || libraryTags.length">
                    <div class="tags">
                        <v-chip
                            v-for="(item, index) in libraryTags"
                            :key="index"
                            close
                            @click:close="libraryTags.splice(index,1)">
                            {{ item }}
                        </v-chip>
                        <input type="text" placeholder="#Tags" @keypress="updateTags($event)" v-model="newTag" @keydown.delete="removeTags($event)">
                    </div>
                </div>
            </template>

            <keys v-if="keysFilter && viewKeysFilter" class="filter_keys" :filterName="filterName" v-click-outside="clickOutsideKeys"></keys>
        </div>

    </div>

</template>

<script>
import {mapGetters, mapActions} from "vuex";
import dialogSaveFilter from '../components/dialogs/saveFilter';
import dialogNeedLogin from '../components/dialogs/needLogin';
import keys from "../components/keys";

export default {
    name: "albumsFilter",
    components: {
        dialogSaveFilter,
        dialogNeedLogin,
        keys
    },
    props: ['actions', 'subgenreFilter', 'keysFilter', 'filterName', 'subgenreClear'],
    data() {
        return {
            GENRE: 'Psychedelic Trance',
            bpmOptions: {
                show: false,
                min: 0,
                max: 300,
            },
            bpm: [0, 300],
            // tags: this.$store.getters.TAGS,
            tags: [],
            newTag: '',

            actionsButtons: false,
            showTagsInput: false,
            filters: [],
            userID: null,
            dialogSaveFilterVisible: false,
            dialogNeedLogin: false,
            viewKeysFilter: false,
            bookmarkStatus: false,


            // saved filters
            menuSaveFilterVisible: false,
            newFilterName: '',
            activeSavedFilter: '',
            deleteSavedFilterStatus: false,
            saveSavedFilterStatus: true,
            discovery: false,
        };
    },
    watch: {
        BPM() {
            // this.bpmOptions.numbers = this.BPM;
        },
        TAGS() {
            // this.tags = this.TAGS;
        },
        KEYS() {
            // console.log('KEYS', this.KEYS);
        }
    },
    computed: {
        ...mapGetters(['AUTH_DATA', 'PROFILE_DATA',
            'UPPER_FILTER',
            'GENRES', 'SUBGENRE', 'BPM', 'KEYS', 'TAGS',
            'CHANGE_FILTERS_STATUS', 'DISCOVERY',
            'STATUS_FILTER', 'ACTIVE_SAVED_FILTER', 'SAVED_FILTERS', 'SUBGENRES']),
        ...mapGetters({
            librarySubgenre: 'libraryFilters/SUBGENRE',
            libraryBPM: 'libraryFilters/BPM',
            libraryKeys: 'libraryFilters/KEYS',
            libraryTags: 'libraryFilters/TAGS',
        })
    },
    mounted() {
        if (this.AUTH_DATA.accessToken) {
            this.getSavedFilters();
        }
        if (!this.SUBGENRES.length) {
            this.getSubgenres();
        }

        // bpm
        if (this.filterName === 'explore') {
            if (this.BPM.length) {
                this.bpm = this.BPM;
            }
            if (this.TAGS.length) {
                this.tags = this.TAGS;
                this.$store.commit('SET_STATUS_FILTER', true);
            }
        }
        if (this.filterName === 'library') {
            if (this.libraryBPM.length) {
                this.bpm = this.libraryBPM;
            }
            if (this.libraryTags.length) {
                this.tags = this.libraryTags;
            }
        }
    },
    methods: {
        ...mapActions(['GET_PROFILE', 'CHANGE_FILTERS', 'UPDATE_DISCOVERY', 'GET_GENRES', 'GET_SUBGENRES', 'CLEAN_EXPLORE_GRID_ALBUMS']),
        toggle_discovery() {
            this.discovery = !this.discovery;
            this.$store.dispatch('UPDATE_DISCOVERY', this.discovery);
        },

        // value filters
        getSubgenres() {
            const subgenresParams = {
                genre: 2, // Psychedelic Trance
                'order[musicReleasesCount]': 'DESC'
            }
            this.GET_SUBGENRES(subgenresParams);
        },
        selectSubgenre(subgenre) {
            if (this.filterName === 'explore') {
                this.$store.dispatch('UPDATE_SUBGENRE', subgenre);
            }
            if (this.filterName === 'library') {
                this.$store.commit('libraryFilters/SET_SUBGENRE', subgenre);
            }
        },

        selectUpperFilter(upperFilter) {
            this.$store.commit('SET_UPPER_FILTER', upperFilter);
        },

        saveBPM() {
            if (this.filterName === 'explore') {
                this.$store.dispatch('UPDATE_BPM', this.bpm);
            }
            if (this.filterName === 'library') {
                this.$store.commit('libraryFilters/SET_BPM', this.bpm);
            }
            this.bpmOptions.show = false;
        },
        cancelBPM() {
            this.bpmOptions.show = false;
            if (this.filterName === 'explore') {
                this.$store.dispatch('UPDATE_BPM', []);
            }
            if (this.filterName === 'library') {
                this.$store.commit('libraryFilters/SET_BPM', []);
            }
            this.bpm = [this.bpmOptions.min, this.bpmOptions.max];
        },

        updateTags(evt) {
            evt = (evt) ? evt : window.event;
            let charCode = (evt.which) ? evt.which : evt.keyCode;

            // Enter || Space || Comma
            if (charCode === 13 || charCode === 32 || charCode === 44) {
                evt.preventDefault();
                if (this.filterName === 'explore') {
                    if (this.newTag.length >= 1) {
                        this.tags.push(this.newTag);
                        this.$store.commit('SET_TAGS', this.tags);
                    }
                }
                if (this.filterName === 'library') {
                    if (this.newTag.length >= 1) {
                        this.libraryTags.push(this.newTag);
                        this.$store.commit('libraryFilters/SET_TAGS', this.libraryTags);
                    }
                }
                this.newTag = '';
            }

        },
        removeTags(ev) {
            if (ev.key === 'Backspace') {
                if (this.filterName === 'explore') {
                    if (this.newTag.length) {
                        return;
                    } else if (!this.newTag.length) {
                        this.tags.splice(-1, 1);
                    }
                }
                if (this.filterName === 'library') {
                    if (this.newTag.length) {
                        return;
                    } else if (!this.newTag.length) {
                        this.libraryTags.splice(-1, 1);
                    }
                }
            }
        },

        viewFilter(filter) {
            this.$store.dispatch('UPDATE_VIEW_FILTER', filter);

            if (this.viewKeysFilter === true) {
                this.viewKeysFilter = false;
            } else if (this.viewKeysFilter === false) {
                this.viewKeysFilter = true;
            }
        },
        clickOutsideKeys: function (event) {
            if (event.target.parentElement !== null) {
                if (event.target.id !== 'btn-open-keys' && event.target.parentElement.id !== 'btn-open-keys') {
                    this.viewKeysFilter = false;
                }
            }
        },
        clear_close_keys() {
            this.actionsButtons = false;
            if (this.filterName === 'explore') {
                this.$store.dispatch('UPDATE_KEYS', []);
            }
            if (this.filterName === 'library') {
                this.$store.commit('libraryFilters/SET_KEYS', []);
            }
            this.$store.commit('SET_ALBUM_EXPANDED', null);
        },
        apply_keys() {
            if (this.filterName === 'explore') {
                this.$store.commit('SET_APPLY_KEYS', true);
            }
            if (this.filterName === 'library') {
                this.$store.commit('libraryFilters/SET_APPLY_KEYS', true);
            }
        },
        open_actions_buttons() {
            this.actionsButtons = !this.actionsButtons;
        },
        showTags() {
            this.showTagsInput = !this.showTagsInput;
        },

        toogleFilters() {
            // close filters
            if (this.STATUS_FILTER === true) {
                this.$store.commit('SET_STATUS_FILTER', false);
                this.$store.commit('SET_ALBUM_EXPANDED', null);
                this.menuSaveFilterVisible = false;
                if (this.SUBGENRE.name || this.BPM.length || this.KEYS.length || this.TAGS.length) {
                    this.CLEAN_EXPLORE_GRID_ALBUMS();
                    this.clearFilters();
                }
                this.$store.commit('SET_VIEW_ALBUMS', 'grid');

                // open filters
            } else {
                this.$store.commit('SET_STATUS_FILTER', true);
            }
        },
        clearFilters() {
            this.$store.dispatch('CLEAN_FILTERS');
            this.$store.commit('SET_ALBUMS_CURRENT_PAGE', 1);
            this.bpm = [this.bpmOptions.min, this.bpmOptions.max];
        },
        clearSubgenre() {
            this.$store.commit('libraryFilters/SET_SUBGENRE', '');
        },
        openSavedFilters() {
            if (this.AUTH_DATA.accessToken) {
                this.menuSaveFilterVisible = true;
            } else {
                this.dialogNeedLogin = true;
            }
        },

        // saved filters
        getSavedFilters() {
            if (this.AUTH_DATA.accessToken) {
                if (!this.PROFILE_DATA) {
                    this.GET_PROFILE().then(() => {
                        this.$store.commit('SET_SAVED_FILTERS', this.PROFILE_DATA.searchFilters);
                    });
                }
            }
        },
        saveFilter() {
            if (this.AUTH_DATA.accessToken) {
                this.GET_PROFILE()
                    .then(() => {
                        this.filters = this.PROFILE_DATA.searchFilters;
                        this.userID = this.PROFILE_DATA.id;

                        this.filters.find((filters) => {
                            if (filters.name === this.newFilterName) {
                                this.saveSavedFilterStatus = false;
                                setTimeout(() => {
                                    this.saveSavedFilterStatus = true;
                                }, 1500);
                            }
                        });


                        if (this.saveSavedFilterStatus === true) {
                            const newFilter = {
                                name: this.newFilterName,
                                genre: this.GENRE,
                                subgenre: this.SUBGENRE,
                                bpm: this.BPM,
                                keys: this.KEYS,
                                tags: this.TAGS
                            }
                            if (this.filters === null) {
                                this.filters = [];
                            }
                            this.filters.push(newFilter);
                            this.newFilterName = '';
                            this.CHANGE_FILTERS({userID: this.userID, filters: this.filters})
                                .then(() => {
                                    this.GET_PROFILE().then(() => {
                                        this.$store.commit('SET_SAVED_FILTERS', this.PROFILE_DATA.searchFilters);
                                    });
                                    this.dialog = false;
                                })
                                .catch(err => {
                                    console.log(`CHANGE_FILTERS, ${err}`);
                                });
                        }
                    })
                    .catch(err => console.log('GET_PROFILE', err));
            } else {
                this.dialogNeedLogin = true;
            }
        },
        apply_filter(filter) {
            this.$store.dispatch('UPDATE_SUBGENRE', filter.subgenre);
            this.$store.dispatch('UPDATE_BPM', filter.bpm);
            this.$store.dispatch('UPDATE_KEYS', filter.keys);
            this.$store.dispatch('UPDATE_TAGS', filter.tags);

            this.$store.dispatch('UPDATE_ACTIVE_SAVED_FILTER', filter.name);
            if (this.BPM.length || this.KEYS.length) {
                this.showAlbumsOrTracks = 'tracks';
            }
            this.menuSaveFilterVisible = false;
        },
        deleteFilter(filter) {
            this.deleteSavedFilterStatus = true;
            let filtered = this.SAVED_FILTERS.filter(function (item) {
                return item.name !== filter.name;
            });

            this.CHANGE_FILTERS({userID: this.PROFILE_DATA.id, filters: filtered}).then(() => {
                this.GET_PROFILE().then(() => {
                    this.$store.commit('SET_SAVED_FILTERS', this.PROFILE_DATA.searchFilters);
                    this.deleteSavedFilterStatus = false;
                });
            });
        },
        clearInputNewFilter() {
            this.newFilterName = '';
        }
    }
};
</script>
