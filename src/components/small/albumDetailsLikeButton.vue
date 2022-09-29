<template>
    <div class="album_details_like_button" @click="addHeartAnimation" :class="{'active': isChecked}">
            <svg id="heart-svg" :class="{'heart_svg': heartAnimation}" width="21" height="18" viewBox="5 -2 10 16" fill="none">
                <path id="heart" class="heart_path" fill="#AAB8C2"
                      d="M10.2031 18L8.75313 16.7052C3.60313 12.1243 0.203125 9.103 0.203125 5.3951C0.203125 2.37384 2.62313 0 5.70312 0C7.44312 0 9.11312 0.794551 10.2031 2.05014C11.2931 0.794551 12.9631 0 14.7031 0C17.7831 0 20.2031 2.37384 20.2031 5.3951C20.2031 9.103 16.8031 12.1243 11.6531 16.715L10.2031 18Z"/>
            </svg>
        <dialogNeedLogin v-model="dialogNeedLoginVisible"></dialogNeedLogin>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

const dialogNeedLogin = () => import('@/components/dialogs/needLogin');

export default {
    name: 'albumDetailsLikeButton',
    components: {
        dialogNeedLogin
    },
    props: ['album', 'checked'],
    data: () => ({
        isChecked: false,
        dialogNeedLoginVisible: false,
        heartAnimation: false
    }),
    created() {
        this.isChecked = this.checked;
    },
    watch: {
        checked() {
            this.isChecked = this.checked;
        }
    },
    computed: {
        ...mapGetters(['AUTH_DATA']),
    },
    mounted() {

    },
    methods: {
        ...mapActions(['ADD_ALBUM_TO_FAVORITES', 'REMOVE_ALBUM_FROM_FAVORITES']),
        addHeartAnimation() {
            this.heartAnimation = true;
            if (this.album.isFavorite) {
                this.isChecked = false;
                this.removeLike();
            } else {
                this.isChecked = true;
                this.addLike();
            }
        },
        addLike() {
            if (this.AUTH_DATA.accessToken) {
                this.album.isFavorite = true;
                this.$store.commit('SET_UPDATE_FAVOURITE_MUSIC_RELEASE', true);
                for (let i = 0; i < this.album.playList.length; i++) {
                    this.album.playList[i].song.isFavorite = true;
                }
                this.$store.dispatch('SET_PLAYED_ONLY_FAV_TRACKS', false);

                this.ADD_ALBUM_TO_FAVORITES({'music_release_id': this.album.id})
                    .then(() => {
                    })
                    .catch(err => {
                        console.log(`albumDetails addLike, ${err}`);
                    })
            } else {
                this.dialogNeedLoginVisible = true;
            }
        },
        removeLike() {
            if (this.AUTH_DATA.accessToken) {
                this.album.isFavorite = false;
                this.$store.commit('SET_UPDATE_FAVOURITE_MUSIC_RELEASE', true);
                for (let i = 0; i < this.album.playList.length; i++) {
                    this.album.playList[i].song.isFavorite = false;
                }
                this.REMOVE_ALBUM_FROM_FAVORITES({'music_release_id': this.album.id})
                    .then(() => {
                    })
                    .catch(err => {
                        console.log(`albumDetails removeLike, ${err}`);
                    })
            } else {
                this.dialogNeedLoginVisible = true;
            }
        }
    }
}
</script>

<style lang="scss">

</style>
