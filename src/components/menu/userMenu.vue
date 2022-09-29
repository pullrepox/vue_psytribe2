<template>
    <v-menu
        transition="slide-y-transition"
        :close-on-content-click="true"
        :nudge-width="230"
        offset-y
        nudge-left="135"
        nudge-bottom="10"
        origin="top center"
        content-class="menu-pointer menu_user yankees">

        <template v-slot:activator="{ on, attrs }">
            <div class="user" v-bind="attrs" v-on="on" v-ripple>
                <img v-if="!userAvatarDefault && PROFILE_DATA.photo" :src="apiUrl.slice(0, -1) + `/media/resolve/menu/${PROFILE_DATA.photo.contentName}`" alt="user avatar">

                <div class="default_user_avatar" v-if="userAvatarDefault || !PROFILE_DATA.photo"></div>
            </div>
        </template>

        <v-list class="user_menu">
            <v-list-item-content v-ripple>

                <div class="head_user_menu">
                    <router-link :to="{name: 'profile-private'}" class="my_profile_link">
                        <img v-if="PROFILE_DATA.photo" class="user_ava" :src="apiUrl.slice(0, -1) + `/media/resolve/menu/${PROFILE_DATA.photo.contentName}`" alt="user avatar"/>
                        <div v-if="!PROFILE_DATA.photo" class="user_ava default"></div>
                        <div class="row_user_name">
                            <span class="user_name">{{ AUTH_DATA.userName.split('@')[0] }}</span>
                            <span class="my_private_profile">My Profile</span>
                        </div>
                    </router-link>

                    <template v-if="YOUR_ARTISTS.length">
                        <router-link v-for="artist of YOUR_ARTISTS" :key="artist.id" :to="{ name: 'artist-profile', params: {id: artist.id} }" class="my_artist_link">
                            <img v-if="artist.avatar" class="artist_ava" :src="apiUrl.slice(0, -1) + `${artist.avatar}`" alt="artist avatar"/>
                            <div v-if="!artist.avatar" class="artist_ava default"></div>
                            <div class="row_artist_name">
                                <span class="artist_name">{{ artist.name }}</span>
                                <span class="my_artist_profile">Artist Profile</span>
                            </div>
                        </router-link>
                    </template>

                </div>
            </v-list-item-content>
            <div class="separation"></div>

            <v-list-item v-ripple>
                <router-link :to="{name: 'library'}">Music Library</router-link>
            </v-list-item>
            <v-list-item v-ripple>
                <router-link :to="{name: 'manageUploaded'}">Uploaded</router-link>
            </v-list-item>
            <div class="separation"></div>

            <v-list-item v-ripple :disabled="true">
                <router-link :to="{name: 'events'}">Events Calendar</router-link>
            </v-list-item>
            <v-list-item v-ripple :disabled="true">
                <router-link :to="{name: 'hosting'}">Hosting</router-link>
            </v-list-item>
            <div class="separation"></div>

            <v-list-item v-ripple>
                <router-link :to="{name: 'followings'}">Following</router-link>
            </v-list-item>
            <v-list-item v-ripple>
                <router-link :to="{name: 'followers'}">Followers</router-link>
            </v-list-item>
            <div class="separation"></div>

            <v-list-item v-ripple :disabled="true">
                <router-link :to="{name: 'wallet'}">Wallet</router-link>
            </v-list-item>
            <v-list-item v-ripple :disabled="true">
                <router-link :to="{name: 'earnings'}">Earnings</router-link>
            </v-list-item>
            <div class="separation"></div>

            <v-list-item v-ripple>
                <router-link :to="{name: 'security'}">Account Settings</router-link>
            </v-list-item>
            <v-list-item v-ripple>
                <router-link :to="{name: 'faq'}">Help & Support</router-link>
            </v-list-item>
            <v-list-item v-ripple>
                <button type="button" @click="logout">Log out</button>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
    name: 'userMenu',
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            userAva: '',
            userAvatarDefault: false,
        };
    },
    watch: {
        CHANGE_USER_AVA() {
            this.GET_PROFILE().then(() => {
                this.$store.commit('SET_CHANGE_USER_AVA', false);
            })
        }
    },
    computed: {
        ...mapGetters(['userID', 'AUTH_DATA', 'PROFILE_DATA', 'YOUR_ARTISTS', 'CHANGE_USER_AVA']),
    },
    mounted() {
        if (!this.PROFILE_DATA.id) {
            this.GET_PROFILE()
                .then(() => {
                    if (!this.PROFILE_DATA.photo.contentUrl) {
                        this.userAvatarDefault = true;
                    }
                });
        }

        if (!this.YOUR_ARTISTS.length) {
            this.GET_YOUR_ARTISTS({owner: this.userID})
                .catch(err => {
                    console.log(`getUserArtists, ${err}`)
                });
        }
    },
    updated() {
    },

    methods: {
        ...mapActions(['GET_PROFILE', 'GET_YOUR_ARTISTS']),
        logout() {
            this.$store.dispatch('LOGOUT').then(() => {
                this.$router.push({name: 'logged-out'});
                this.$store.dispatch('reset');
            });
        },
    }
}
</script>

<style scoped>

</style>
