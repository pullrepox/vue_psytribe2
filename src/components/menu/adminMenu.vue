<template>
    <v-menu
        transition="slide-y-transition"
        :close-on-content-click="true"
        :nudge-width="230"
        offset-y
        nudge-left="220"
        nudge-bottom="10"
        origin="top center"
        content-class="menu-pointer menu_admin"
    >
        <template v-slot:activator="{ on, attrs }">
            <div class="admin" v-bind="attrs" v-on="on"  v-ripple>
                <span v-if="globalNotification" class="global-notification"></span>
                <span class="material-icons">shield</span>
            </div>
        </template>
        <v-list class="admin_menu">
            <v-list-item-content>
                <div class="head_admin_menu">
                    Admin
                </div>
            </v-list-item-content>

            <v-list-item  v-ripple>
                <router-link :to="{name: 'notifications'}">
                    Messages <span v-if="ADMIN_NOTIFICATIONS.message" class="new-notification"></span>
                </router-link>
            </v-list-item>
            <v-list-item v-ripple>
                <router-link :to="{name: 'faq'}">About/FAQ</router-link>
            </v-list-item>
            <v-list-item v-ripple>
                <router-link :to="{name: 'feature-suggestions'}">Suggestions</router-link>
            </v-list-item>
            <v-list-item v-ripple>
                <router-link :to="{name: 'changelog'}">Changelog</router-link>
            </v-list-item>
            <v-list-item v-ripple>
                <router-link :to="{name: 'bug-reports'}">Reports</router-link>
            </v-list-item>
            <v-list-item v-ripple>
                <router-link :to="{name: 'verifications'}">
                    Verifications <span v-if="ADMIN_NOTIFICATIONS.verification" class="new-notification"></span>
                </router-link>
            </v-list-item>

            <div class="separation"></div>
            <v-list-item :disabled="true" v-ripple>
                <router-link :to="{name: 'user-management'}">User Management</router-link>
            </v-list-item>
            <v-list-item v-ripple>
                <router-link :to="{name: 'admin-settings'}">
                    Settings
                </router-link>
            </v-list-item>
            <v-list-item :disabled="true" v-ripple>
                <router-link :to="{name: 'resources'}">Resources</router-link>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
    name: 'adminMenu',
    data() {
        return {
        };
    },
    watch: {
        '$route'() {
            // update notifications after 30 seconds
            if (Date.now() - this.ADMIN_NOTIFICATIONS_LAST_REFRESH > 30000) {
                this.GET_ADMIN_NOTIFICATIONS();
            }
        },
    },
    computed: {
        ...mapGetters(['ADMIN_NOTIFICATIONS', 'ADMIN_NOTIFICATIONS_LAST_REFRESH']),
        globalNotification: function () {

          for (const [key, value] of Object.entries(this.ADMIN_NOTIFICATIONS)) {
                if (value === true) {
                    return true;
                }
            }
        }
    },
    mounted() {
        // load notifications
        this.GET_ADMIN_NOTIFICATIONS();
    },
    methods: {
        ...mapActions(['GET_ADMIN_NOTIFICATIONS']),
    },
};
</script>

<style lang="scss">
@import 'src/assets/styles/components/adminMenu';
</style>
