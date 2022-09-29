<!-- used only for mobile version  -->
<template>
    <div>
        <div class="head_subgenres">
            <span class="name">New</span>
        </div>
        <div class="wrapper_subgenres">

            <template v-if="loading === true">
                <v-skeleton-loader
                    v-for="index in 15"
                    :key="index"
                    type="card"
                    class="mobile_subgenres_grid">
                </v-skeleton-loader>
            </template>

            <template v-if="loading === false">
                <div @click="setSubgenre('all_new')" class="item_subgenre all_new">
                    <div v-ripple class="image">
                        <img :src="require(`@/assets/image/subgenres/all_new.webp`)" alt="">
                    </div>
                    <div class="name">All new</div>
                </div>
                <div @click="setSubgenre(subgenre)" class="item_subgenre" v-for="subgenre of SUBGENRES"
                     :class="subgenre.name"
                     :key="subgenre.id">
                    <div class="image" v-ripple>
                        <img :src="require(`@/assets/image/subgenres/${subgenre.name}.webp`)" alt="">
                    </div>
                    <div class="name">{{ subgenre.name }}</div>
                </div>
            </template>

        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";


export default {
    name: "mainSubgenres",

    data() {
        return {
            loading: false,
        }
    },
    computed: {
        ...mapGetters(['SUBGENRES', 'EXPLORE_GRID_ALBUMS'])
    },
    created() {
        if (!this.SUBGENRES.length) {
            this.getSubgenres();
        }
    },
    mounted() {

    },
    methods: {
        ...mapActions(['GET_SUBGENRES', 'GET_EXPLORE_GRID_ALBUMS']),
        getSubgenres() {
            this.loading = true;
            const subgenresParams = {
                genre: 2, // Psychedelic Trance
                'order[musicReleasesCount]': 'DESC'
            }
            this.GET_SUBGENRES(subgenresParams)
                .catch(err => console.log(`GET_SUBGENRES, ${err}`))
                .finally(() => this.loading = false);
        },
        setSubgenre(subGenre) {
            this.$store.dispatch('CLEAN_EXPLORE_GRID_ALBUMS');
            this.$store.dispatch('UPDATE_SUBGENRE', subGenre);
            this.$router.push({name: 'albumsList', params: {id: subGenre.id}});
        }
    },
}
</script>

<style lang="scss">
.v-skeleton-loader {
    width: 100%;
}
</style>
