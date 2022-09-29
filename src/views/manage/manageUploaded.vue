<template>
    <div>
        <div class="head_uploaded">
            <v-container>
                <h2>Manage Uploaded</h2>
                <div class="_tabs">
                    <v-tabs v-model="tab">
                        <v-tab v-for="tab in tabs" :key="tab">
                            {{ tab }}
                        </v-tab>
                    </v-tabs>
                </div>
            </v-container>
        </div>

        <div class="uploaded_content">
            <v-container>
                <div class="_tabs_content">
                    <v-tabs-items v-model="tab">

                        <!-- ********** Uploaded Tab Content ********** -->
                        <v-tab-item>
                            <headListAlbums></headListAlbums>

                            <template v-if="!loader && ARTIST_ALBUMS.length">
                                <albumList
                                    v-for="album in ARTIST_ALBUMS"
                                    :key="album.id"
                                    :albumDetails="album"
                                    :view="albumExpanded[album.id] ? '' : 'short'"
                                    @changeVisibilityStatus="changeVisibilityStatus">
                                </albumList>
                            </template>

                            <template v-if="loader">
                                <v-skeleton-loader
                                    type="image"
                                    class="item_list_albums"
                                    v-for="index in 10"
                                    :key="index"
                                ></v-skeleton-loader>
                            </template>

                            <template v-if="!loader && !ARTIST_ALBUMS.length">
                                <nothingHereYet style="padding-top: 30px;"></nothingHereYet>
                            </template>

                        </v-tab-item>
                        <!-- ********** END Uploaded Tab Content ********** -->


                        <!-- ********** Draft Tab Content ********** -->
                        <v-tab-item>

                        </v-tab-item>
                        <!-- ********** END Tab Content ********** -->


                    </v-tabs-items>
                </div>


                <!--                <div class="nothing_here">-->
                <!--                    Nothing here yet-->
                <!--                    <v-btn rounded color="primary" large dark class="upload text-capitalize" @click="redirectTo()">-->
                <!--                        <span class="material-icons">file_upload</span>-->
                <!--                        Upload-->
                <!--                    </v-btn>-->
                <!--                </div>-->
            </v-container>
        </div>
    </div>


</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import headListAlbums from '@/components/headListAlbums';
import albumList from "@/components/album";
import nothingHereYet from "@/components/small/nothingHereYet";

export default {
    name: 'manageUploaded',
    components: {
        headListAlbums,
        albumList,
        nothingHereYet
    },
    data() {
        return {
            tab: null,
            tabs: [
                'Uploaded', 'Draft'
            ],
            loader: false,
            albumExpanded: {},
        }
    },
    computed: {
        ...mapGetters(['userID', 'PROFILE_DATA', 'ARTIST_ALBUMS',
            'YOUR_ARTISTS']),
    },
    mounted() {
        this.getUserData();
    },
    methods: {
        ...mapActions(['GET_PROFILE', 'GET_ARTIST_ALBUMS',
            'GET_YOUR_ARTISTS']),

        getUserData() {
            this.loader = true;

            // check user ARTISTS
            this.GET_YOUR_ARTISTS({owner: this.userID})
                .then(() => {
                    if (this.YOUR_ARTISTS.length) {
                        let userArtistsID = [];
                        for (let i = 0; i < this.YOUR_ARTISTS.length; i++) {
                            userArtistsID.push(this.YOUR_ARTISTS[i].id);
                        }

                        this.GET_ARTIST_ALBUMS({'artist': userArtistsID})
                            .then(() => {
                                console.log('ARTIST_ALBUMS', this.ARTIST_ALBUMS);
                            })
                            .catch(err => console.log(`GET_ARTIST_ALBUMS, ${err}`))
                            .finally(() => this.loader = false);
                    } else {
                        this.loader = false;
                    }

                })
                .catch(err => console.log(`GET_YOUR_ARTISTS, ${err}`))
        },
        changeVisibilityStatus(id) {
            let [album] = Object.keys(this.albumExpanded).filter(expanded => this.albumExpanded[expanded]);
            if (+id !== +album) {
                this.albumExpanded[album] = false;
            }
            this.albumExpanded[id] = !this.albumExpanded[id];
        },
    }
}
</script>

<style lang="scss">
.item_list_albums {
    height: 55px;
    margin-top: 5px;
}
</style>
