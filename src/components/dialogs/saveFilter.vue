<template>
    <v-dialog
        :value="value" @input="$emit('input')"
        persistent
        max-width="574">

        <div class="save_filter_dialog style_dialog">
            <h2 class="header">
                Save filter as
            </h2>
            <div class="cnt">
                <input type="text" placeholder="Filter name" v-model="newFilterName">
            </div>
            <div class="wrap_actions vertical">
                <button type="button" class="save" @click="saveFilter" v-ripple>Save</button>
                <button type="button" class="cancel transparent" @click="dialog = false" v-ripple>Cancel</button>
            </div>
        </div>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "saveFilter",
    props: ['value'],
    data() {
        return {
            GENRE: 'Psytrance',
            newFilterName: '',
            filters: [],
            userID: null,
        }
    },
    computed: {
        ...mapGetters(['SUBGENRE', 'BPM', 'KEYS', 'TAGS', 'CHANGE_FILTERS_STATUS', 'PROFILE_DATA']),
        dialog: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value)
            }
        }
    },
    methods: {
        ...mapActions(['GET_PROFILE', 'CHANGE_FILTERS']),
        saveFilter() {
            this.GET_PROFILE()
                .then(() => {
                    this.filters = this.PROFILE_DATA.searchFilters;
                    this.userID = this.PROFILE_DATA.id;

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

                    this.CHANGE_FILTERS({userID: this.userID, filters: this.filters}).then(() => {
                        this.GET_PROFILE().then(() => {
                            this.$store.commit('SET_SAVED_FILTERS', this.PROFILE_DATA.searchFilters);
                        });
                        this.dialog = false;
                    });
                })
                .catch(err => console.log('GET_PROFILE', err));
        }
    }
}
</script>

<style lang="scss">

</style>
