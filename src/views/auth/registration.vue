<template>
    <div class="page_form_layout full_page">
        <v-container>
            <div class="wrap_form_layout">
                <h2 class="join_the_network">Join the Network!</h2>
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
                <div class="form">
                    <form action="#" class="form">
                        <div class="email">
                            <label for="">Email</label>
                            <input autofocus type="email" v-model="email" tabindex="1" v-on:keyup.enter="signUp">
                        </div>
                        <div class="password">
                            <div>
                                <label for="">Create Password</label>
                                <button type="button" class="show_password" @click="switchVisibility('password')"
                                        v-html="passwordType === 'password'? 'Show' : 'Hide'"></button>
                            </div>
                            <input :type="passwordType" v-model="password" @keyup="passwordOnKeyDown" tabindex="1" v-on:keyup.enter="signUp">
                        </div>
                    </form>
                </div>
                <div class="password_complexity">
                    <span class="label">Password must include:</span>
                    <div class="wrap_must_symbols">
                        <div :class="[ {active: this.passComplexity.upperCase}, 'item_' ]">ABC</div>
                        <div :class="[ {active: this.passComplexity.lowerCase}, 'item_']">abc</div>
                        <div :class="[ {active: this.passComplexity.nonWordChars}, 'item_']">@.#&</div>
                        <div :class="[ {active: password.length && $v.password.minLength && $v.password.maxLength}, 'item_']">
                            8-16 Characters
                        </div>
                    </div>
                </div>
                <div class="message_error">
                    {{ message }}
                </div>
                <!--                <div class="message_error">-->
                <!--                    <span v-if="email.length && $v.email.$invalid">Email exitst</span>-->
                <!--                    {{ message }}-->
                <!--                </div>-->

                <button v-if="!$v.email.$invalid && passwordValid === true" type="button" class="sign_up c2a_btn" v-ripple @click="signUp"
                        :class="{'loading': loader}">
                    Sign Up
                    <v-progress-circular :width="2" indeterminate></v-progress-circular>
                </button>
                <button v-else type="button" class="sign_up c2a_btn" disabled>Sign Up</button>

                <div class="already_account">
                    Already have an account?
                    <router-link :to="{name: 'login'}">Log in!</router-link>
                </div>
            </div>
            <ComingSoonDialog v-model="showComingSoonDialog"></ComingSoonDialog>
        </v-container>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {email, maxLength, minLength, required} from "vuelidate/lib/validators";

const ComingSoonDialog = () => import("@/components/dialogs/comingSoonDialog");

export default {
    name: 'registration',
    components: {ComingSoonDialog},
    data() {
        return {
            loader: false,
            showComingSoonDialog: false,
            email: '',
            password: '',
            passwordType: 'password',
            passComplexity: {
                lowerCase: false,
                upperCase: false,
                nonWordChars: false
            },
            passwordValid: false,
            message: ''
        }
    },
    // Validations
    validations: {
        email: {
            required,
            email
        },
        password: {
            required,
            minLength: minLength(8),
            maxLength: maxLength(16)
        },
    },
    watch: {
        email() {
            this.message = '';
        },
        password() {
            this.message = '';
        }
    },
    computed: {
        ...mapGetters(['REGISTER_STATUS', 'LOGIN_STATUS', 'AUTH_DATA']),
    },
    methods: {
        ...mapActions(['REGISTER', 'LOGIN']),
        switchVisibility() {
            this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
        },
        passwordOnKeyDown() {
            this.passComplexity.nonWordChars = !!this.password.match(".*[!@#$%^&*.]");
            this.passComplexity.upperCase = !!this.password.match(".*[A-Z]");
            this.passComplexity.lowerCase = !!this.password.match(".*[a-z]");

            this.passwordValid = this.passComplexity.lowerCase === true && this.passComplexity.upperCase === true && this.passComplexity.nonWordChars === true
        },
        signUp() {
            if (this.email && this.password && this.passwordValid === true) {
                this.loader = true;
                this.$store.dispatch('reset');

                const userData = {
                    email: this.email,
                    password: this.password,
                    address: 'Planet Earth',
                    fullName: this.email.split('@')[0],
                }
                this.REGISTER(userData)
                    .then(() => {
                        if (this.REGISTER_STATUS === 'success') {
                            this.$router.push({name: 'email-verification'});
                        } else {
                            this.message = 'Error. Registration failed';
                        }
                    })
                    .catch(err => {
                        this.message = 'Error. Registration failed';
                        console.log(`signUp ${err}`);
                    })
                    .finally(() => this.loader = false);
            } else {
                this.message = 'Error. Registration failed';
            }
        }
    }
}
</script>

<style scoped>

</style>
