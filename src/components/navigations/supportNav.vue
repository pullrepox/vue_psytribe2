<template>
    <div class="top_row support_nav" :class="{'admin_style': authIsAdmin}">
        <div class="container">
            <v-tabs align-with-title>

                <v-tabs-slider color="#20C4F5"></v-tabs-slider>

                <v-tab :to="{name: 'faq'}">About/FAQ</v-tab>
                <v-tab :to="{name: 'changelog'}">Changelog</v-tab>


                <template v-if="!authIsAdmin">
                    <v-tab :to="{name: 'feature-suggestions'}">Suggest a feature</v-tab>
                    <v-tab :to="{name: 'bug-reports'}">Report a bug</v-tab>
                </template>

                <template v-if="authIsAdmin">
                    <v-tab :to="{name: 'suggestions'}">Suggestions</v-tab>
                    <v-tab :to="{name: 'reports'}">Reports</v-tab>
                    <v-tab to="/verifications">Verifications</v-tab>
                    <v-tab :to="{name: 'admin-settings'}">Settings</v-tab>
                </template>

            </v-tabs>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "supportNav",
    data() {
        return {
            authIsAdmin: false
        }
    },
    computed: {
        ...mapGetters(['AUTH_DATA']),
    },
    created() {
        this.authIsAdmin = this.AUTH_DATA.userRoles.includes('ROLE_ADMIN');
    }
};
</script>
