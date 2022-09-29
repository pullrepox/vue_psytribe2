<template>
    <div>
        <div class="wrap_keys filter_keys" v-if="filterName === 'explore'">
            <div class="b_section">
                <div v-for="key in groupKeysB" :key="key.mark" @click="select_key(key.mark)" :class="{'active': keys.includes(key.mark)}">
                    <span class="material-icons" v-if="keys.includes(key.mark)">check_circle</span>
                    <div class="_mark">{{ key.mark }}</div>
                    <div class="_name">{{ key.name }}</div>
                </div>
            </div>
            <div class="a_section">
                <div v-for="key in groupKeysA" :key="key.mark" @click="select_key(key.mark)" :class="{'active': keys.includes(key.mark)}">
                    <span class="material-icons" v-if="keys.includes(key.mark)">check_circle</span>
                    <div class="_mark">{{ key.mark }}</div>
                    <div class="_name">{{ key.name }}</div>
                </div>
            </div>
        </div>
        <div class="wrap_keys filter_keys" v-if="filterName === 'library'">
            <div class="b_section">
                <div v-for="key in groupKeysB" :key="key.mark" @click="select_key(key.mark)" :class="{'active': libraryKeys.includes(key.mark)}">
                    <span class="material-icons" v-if="libraryKeys.includes(key.mark)">check_circle</span>
                    <div class="_mark">{{ key.mark }}</div>
                    <div class="_name">{{ key.name }}</div>
                </div>
            </div>
            <div class="a_section">
                <div v-for="key in groupKeysA" :key="key.mark" @click="select_key(key.mark)" :class="{'active': libraryKeys.includes(key.mark)}">
                    <span class="material-icons" v-if="libraryKeys.includes(key.mark)">check_circle</span>
                    <div class="_mark">{{ key.mark }}</div>
                    <div class="_name">{{ key.name }}</div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
    name: 'keys',
    props: ['filterName'],
    data() {
        return {
            groupKeysB: [
                {mark: '1B', name: 'B-Major'},
                {mark: '2B', name: 'F-Sharp Major'},
                {mark: '3B', name: 'd-flat Major'},
                {mark: '4B', name: 'a-flat Major'},
                {mark: '5B', name: 'e-flat Major'},
                {mark: '6B', name: 'b-flat Major'},
                {mark: '7B', name: 'F Major'},
                {mark: '8B', name: 'C Major'},
                {mark: '9B', name: 'G Major'},
                {mark: '10B', name: 'D Major'},
                {mark: '11B', name: 'A Major'},
                {mark: '12B', name: 'E Major'},
            ],
            groupKeysA: [
                {mark: '1A', name: 'A-flat Minor'},
                {mark: '2A', name: 'E-flat Minor'},
                {mark: '3A', name: 'B-flat Minor'},
                {mark: '4A', name: 'F Minor'},
                {mark: '5A', name: 'C Minor'},
                {mark: '6A', name: 'G Minor'},
                {mark: '7A', name: 'D Minor'},
                {mark: '8A', name: 'A Minor'},
                {mark: '9A', name: 'E Minor'},
                {mark: '10A', name: 'B Minor'},
                {mark: '11A', name: 'F-sharp Minor'},
                {mark: '12A', name: 'D-flat Minor'},
            ],
            keys: this.$store.getters.KEYS,
            libraryKeys: this.$store.getters['libraryFilters/KEYS'],
        }
    },
    computed: {
        ...mapGetters(['SONG_KEYS', '']),
    },
    mounted() {
        // this.getSongKeys();
    },
    methods: {
        ...mapActions(['GET_SONG_KEYS']),
        select_key(key) {
            if (this.filterName === 'explore') {
                if (this.keys.includes(key)) {
                    this.keys = this.keys.filter(el => el !== key);
                    this.$store.dispatch('UPDATE_KEYS', this.keys);
                } else {
                    this.keys.push(key);
                }
            }
            if (this.filterName === 'library') {
                if (this.libraryKeys.includes(key)) {
                    this.libraryKeys = this.libraryKeys.filter(el => el !== key);
                    this.$store.commit('libraryFilters/SET_KEYS', this.libraryKeys);
                } else {
                    this.libraryKeys.push(key);
                }
            }
        },

        getSongKeys() {
            this.GET_SONG_KEYS()
                .then(() => {
                    console.log('SONG_KEYS', this.SONG_KEYS);
                })
                .catch(err => console.log(`GET_SONG_KEYS, ${err}`));
        }
    }
}
</script>
