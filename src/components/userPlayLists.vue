<template>
    <div>
        <v-dialog
            :value="value"
            @input="$emit('input')"
            :content-class="'user_play_lists-modal'"
            persistent
            max-width="546">


            <div class="heading">
                <h2>Add To Playlist</h2>
                <button class="close_modal" @click="dialog = false"></button>
            </div>
            <div class="create_playlist">

                <div class="box_create_button">
                    <button type="button" @click="showCreatePlayList" :class="{'active': showBlockCreatePlaylist}"></button>
                    <div>
                        New playlist
                        <span>Click here to create playlist</span>
                    </div>
                </div>

                <transition name="height" v-if="showBlockCreatePlaylist">
                    <div class="box_create_info">
                        <div class="info_row">
                            <input type="text" placeholder="Enter playlist name" v-model="playListName">

                            <v-menu offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                    <button type="button" v-bind="attrs" v-on="on" class="select_genre">Psytrance</button>
                                </template>
                                <!--                            <v-list>-->
                                <!--                                <v-list-item-->
                                <!--                                    v-for="(item, index) in genres"-->
                                <!--                                    :key="index">-->
                                <!--                                    <v-list-item-title>{{ item }}</v-list-item-title>-->
                                <!--                                </v-list-item>-->
                                <!--                            </v-list>-->
                            </v-menu>

                        </div>
                        <div class="info_row settings">
                            <div class="label">Privacy:</div>
                            <v-radio-group v-model="row" row mandatory>
                                <v-radio label="Public" value="public" color="#20C4F5" :ripple="false"></v-radio>
                                <v-radio label="Private" value="private" color="#20C4F5" :ripple="false"></v-radio>
                            </v-radio-group>
                        </div>
                        <div class="info_row">
                            <button type="button" class="create c2a_btn x_small" @click="createPlaylist" >Create</button><!-- disabled="disabled" -->
                        </div>
                    </div>
                </transition>
            </div>

            <div class="list_saved_playlists">
                <div class="item_playlist" @click="addToThisPlayList">
                    <div class="data">
                        <img src="#" alt="">
                        <div class="playlist_info">
                            <div class="name">Dark Ambient for relaxation</div>
                            <div class="count_tracks">12 Tracks</div>
                        </div>
                    </div>
                    <div class="action">
                        <div class="check_round checked"></div>
                    </div>
                </div>
            </div>



        </v-dialog>
    </div>
</template>

<script>
export default {
    name: "userPlayLists",
    props: ['value'],
    data() {
        return {
            // data
            playListName: '',
            genres: [
                'Psytrance'
            ],
            row: null,

            // states
            showBlockCreatePlaylist: false,
        }
    },
    watch: {
        row() {
            console.log('row', this.row);
        }
    },
    computed: {
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
        showCreatePlayList() {
            this.showBlockCreatePlaylist = !this.showBlockCreatePlaylist;
        },
        createPlaylist() {
            this.showBlockCreatePlaylist = true;
        },
        addToThisPlayList() {

        }
    }
}
</script>

<style lang="scss">

</style>