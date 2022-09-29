<!--<template>-->
<!--    <div>-->
<!--        <div class="artists_list">-->
<!--            <router-link v-for="artist of ARTISTS" :key="artist.id" class="item_artist" :to="{name: 'artist-profile', params: {'id': artist.id}}">-->
<!--                <div class="img">-->
<!--                    <img :src="artist.img || artistNoImage" :alt="artist.name">-->
<!--                </div>-->
<!--                <div class="descript">-->
<!--                    <div class="name">{{ artist.name }}</div>-->
<!--                    &lt;!&ndash;                                <span>Record label here</span>&ndash;&gt;-->
<!--                    &lt;!&ndash;                                <span>Producer - DJ - Promoter</span>&ndash;&gt;-->
<!--                </div>-->
<!--            </router-link>-->
<!--            <v-progress-circular v-if="artistsLoader"-->
<!--                                 :size="100"-->
<!--                                 :width="3"-->
<!--                                 color="#20C4F5"-->
<!--                                 indeterminate-->
<!--            ></v-progress-circular>-->
<!--        </div>-->
<!--        <artistsPagination v-if="SEARCH_ARTISTS_RESULT" :countArtists="SEARCH_COUNT_ARTISTS"></artistsPagination>-->
<!--    </div>-->
<!--</template>-->

<!--<script>-->
<!--import {mapActions, mapGetters} from 'vuex';-->
<!--import artistsPagination from '../components/paginations/artistsPagination';-->

<!--export default {-->
<!--    name: 'artistsList',-->
<!--    components: {-->
<!--        artistsPagination-->
<!--    },-->
<!--    props: ['whatArtists'],-->
<!--    data() {-->
<!--        return {-->
<!--            artistsLoader: false,-->
<!--            artistNoImage: require('./../assets/image/privat-profile-ava.png'),-->
<!--        }-->
<!--    },-->
<!--    watch: {-->
<!--        ARTISTS_CURRENT_PAGE() {-->
<!--            this.getArtists();-->
<!--        },-->
<!--        SEARCH_STRING() {-->
<!--            this.getArtists();-->
<!--        }-->
<!--    },-->

<!--    computed: {-->
<!--        ...mapGetters([-->
<!--            'SEARCH_STRING',-->
<!--            'ARTISTS',-->
<!--            'SEARCH_ARTISTS_RESULT',-->
<!--            'SEARCH_COUNT_ARTISTS',-->
<!--            'ARTISTS_CURRENT_PAGE'-->
<!--        ]),-->
<!--    },-->
<!--    mounted() {-->
<!--        if (!this.ARTISTS.length || this.whatArtists !== undefined) {-->
<!--            this.CLEAN_ARTISTS();-->
<!--            this.getArtists();-->
<!--        }-->
<!--    },-->
<!--    methods: {-->
<!--        ...mapActions(['GET_ARTISTS', 'CLEAN_ARTISTS']),-->
<!--        getArtists() {-->
<!--            this.artistsLoader = true;-->
<!--            let artistsParams;-->
<!--            let name;-->
<!--            if (this.whatArtists === 'search') {-->
<!--                name = this.SEARCH_STRING ? {'name': this.SEARCH_STRING} : '';-->
<!--            }-->
<!--            const page = this.ARTISTS_CURRENT_PAGE ? {page: this.ARTISTS_CURRENT_PAGE} : null;-->

<!--            artistsParams = Object.assign(name, page);-->

<!--            this.GET_ARTISTS(artistsParams)-->
<!--            .then(() => {-->
<!--                this.artistsLoader = false;-->
<!--            })-->
<!--            .catch(err => {-->
<!--                this.artistsLoader = false;-->
<!--                console.log(`getArtists, ${err}`);-->
<!--            })-->
<!--        }-->
<!--    }-->
<!--}-->
<!--</script>-->
