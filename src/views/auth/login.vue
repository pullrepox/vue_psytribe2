<template>
    <div class="page_form_layout full_page">
        <v-container>
            <div class="wrap_form_layout">
                <h2 class="login">Log in!</h2>
                <!--            <a href="#facebook" class="facebook_connect" target="_blank" @click="showComingSoonDialog = true">-->
                <!--                <span class="facebook_icon"></span>-->
                <!--                Connect with facebook-->
                <!--            </a>-->
                <div class="facebook_connect" v-ripple @click="showComingSoonDialog = true">
                    <span class="facebook_icon"></span>
                    Connect with facebook
                </div>
                <div class="or">
                    <span>Or</span>
                </div>
                <form action="#" class="form">
                    <div class="email">
                        <label>Email</label>
                        <input autofocus type="email" v-model="email" tabindex="1" v-on:keyup.enter="logIn">
                    </div>
                    <div class="password">
                        <div>
                            <label>Password</label>
                            <button type="button" class="show_password" @click="switchVisibility('password')"
                                    v-html="passwordType === 'password'? 'Show' : 'Hide'"></button>
                        </div>
                        <input :type="passwordType" v-model="password" tabindex="2" v-on:keyup.enter="logIn">
                    </div>
                </form>
                <div class="message_error">
                    <template v-if="LOGIN_STATUS.success === false">
                        {{LOGIN_STATUS.message}}
                    </template>
                </div>

                <button tabindex="3" v-if="email && password" type="button" class="log_in c2a_btn" v-ripple @click="logIn" :class="{'loading': loader}">
                    <v-progress-circular :width="2" indeterminate></v-progress-circular>
                    Log in
                </button>
                <button v-else type="button" class="log_in c2a_btn" v-ripple disabled>Log in</button>
                <div class="recovery_password">
                    <router-link :to="{name: 'forgot-password'}" tabindex="4">Recover password</router-link>
                </div>
                <router-link :to="{name: 'registration'}" class="new_account" tabindex="5">New Account</router-link>
            </div>
            <ComingSoonDialog v-model="showComingSoonDialog"></ComingSoonDialog>
        </v-container>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

const ComingSoonDialog = () => import('@/components/dialogs/comingSoonDialog');

export default {
    name: 'login',
    components: {ComingSoonDialog},
    data() {
        return {
            loader: false,
            showComingSoonDialog: false,
            email: '',
            password: '',
            passwordType: 'password',
        }
    },
    computed: {
        ...mapGetters(['AUTH_DATA', 'LOGIN_STATUS', 'PROFILE_DATA']),
    },
    watch: {
        email() {
            this.message = '';
        },
        password() {
            this.message = '';
        }
    },
    methods: {
        ...mapActions(['LOGIN', 'GET_PROFILE', 'CLEAN_EXPLORE_GRID_ALBUMS']),
        switchVisibility() {
            this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
        },
        logIn() {
            if (this.email && this.password) {
                this.loader = true;
                this.$store.dispatch('reset');
                const userData = {
                    email: this.email,
                    password: this.password
                };
                this.LOGIN(userData)
                    .then(() => {
                        if (this.LOGIN_STATUS.success === true) {
                                this.CLEAN_EXPLORE_GRID_ALBUMS();
                                if (this.AUTH_DATA.verify === true && this.AUTH_DATA.firstLogin === false) {
                                    this.$router.push(this.$route.query.redirect || '/');
                                }
                                if (this.AUTH_DATA.verify === false) {
                                    this.$router.push({name: 'email-verification'});
                                }
                                if (this.AUTH_DATA.firstLogin === true && this.AUTH_DATA.verify === true) {
                                    this.$router.push({name: 'profile-basics'});
                                }
                            // this.visibleCaptcha = true;
                        }
                        if (this.LOGIN_STATUS.message === 'Account is disabled.') { // TODO: change to account in ~pending~
                            this.$router.push({name: 'email-verification'});
                        }
                    })
                    .finally(() => this.loader = false);
            }
        }
    }
}
</script>

<style scoped>

</style>
