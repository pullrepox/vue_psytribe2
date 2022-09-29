<template>
    <div class="page_form_layout full_page">
        <v-container>
            <form action="#" @submit.prevent="goForgotPassword">
                <div class="wrap_form_layout account_recovery">
                    <h2 class="account_recovery">
                        Account recovery
                        <span class="hint">Request a password reset below</span>
                    </h2>
                    <template v-if="!submitted">
                        <div class="form">
                            <div class="email">
                                <input autofocus type="text" v-model="resetPasswordRequest.email" autocomplete="off" placeholder="Enter your email">
                            </div>
                        </div>
                        <div v-if="message" class="message_error">
                            {{ message }}
                        </div>
                        <button v-if="!$v.resetPasswordRequest.email.$invalid" type="submit" class="primary_btn reset" v-ripple :class="{'loading': loader}">
                            Reset
                            <v-progress-circular :width="2" indeterminate></v-progress-circular>
                        </button>
                        <button v-if="$v.resetPasswordRequest.email.$invalid" type="button" class="primary_btn reset" disabled v-ripple>Reset</button>
                        <router-link :to="{name: 'explore'}" class="cancel_account_recovery">Cancel</router-link>
                    </template>
                    <template v-if="submitted">
                        <div class="response_account_recovery">
                            <div class="account_recovery_message">Check your email (including spam) for reset instructions.</div>
                            <span>No email?</span>
                            <button type="button" class="primary_btn small try_again" @click="tryAgain()" :disabled="timer > 0">
                                Try again
                                <template v-if="timer > 0">
                                    in {{timer}} seconds
                                </template>
                            </button>
<!--                            <div v-if="timer > 0" class="primary_btn small try_again">Try Again in {{timer}} seconds</div>-->
                            <router-link :to="{name: 'login'}" class="login">Log In</router-link>
                        </div>
                    </template>
                </div>
            </form>

        </v-container>
    </div>


    <!--  <div class="p-join full_page">-->

    <!--      <form action="#" class="forgot_password" @submit.prevent="goForgotPassword">-->
    <!--        <div class="head">-->
    <!--          <h2>Account recovery</h2>-->
    <!--          <h4>Request a password reset</h4>-->
    <!--        </div>-->

    <!--        <template v-if="submitted === false">-->

    <!--          <input type="text" autofocus placeholder="Enter your email" v-model="resetPasswordRequest.email">-->
    <!--          <div class="message error" v-if="message">{{ message }}</div>-->
    <!--          <div class="reset invalid_email" v-if="$v.resetPasswordRequest.email.$invalid">Email exitst</div>-->
    <!--          <button type="submit" v-if="$v.resetPasswordRequest.email.$invalid === false" class="reset">Reset</button>-->
    <!--          <router-link to="/" class="cancel">Cancel</router-link>-->
    <!--        </template>-->

    <!--        <template v-if="submitted === true">-->
    <!--          <div class="message">Check your email for reset instructions.</div>-->
    <!--          <span>No email?</span>-->
    <!--          <div class="try_again" @click="tryAgain()">Try again</div>-->
    <!--          <router-link to="login" class="log_in">Log In</router-link>-->
    <!--        </template>-->
    <!--      </form>-->
    <!--  </div>-->
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {email, required} from 'vuelidate/lib/validators';

export default {
    name: 'forgot-password',
    components: {},
    data() {
        return {
            resetPasswordRequest: {
                email: ''
            },
            submitted: false,
            message: '',
            loader: false,
            timer: 60
        }
    },
    watch: {

    },
    validations: {
        resetPasswordRequest: {
            email: {
                required,
                email
            }
        }
    },
    computed: {
        ...mapGetters(['FORGOT_PASSWORD_STATUS']),
    },
    methods: {
        ...mapActions(['FORGOT_PASSWORD']),

        countDownTimer() {
            if(this.timer > 0) {
                setTimeout(() => {
                    this.timer -= 1;
                    this.countDownTimer();
                }, 1000);
            }
        },
        goForgotPassword() {
            if (this.resetPasswordRequest.email) {
                this.loader = true;
                this.FORGOT_PASSWORD(this.resetPasswordRequest)
                    .then(() => {
                        if (this.FORGOT_PASSWORD_STATUS === 'success') {
                            this.submitted = true;
                            this.countDownTimer();
                        } else {
                            this.message = 'Failed to account recovery';
                            this.submitted = false;
                        }
                    })
                    .catch(err => {
                        console.log(`goForgotPassword ${err}`);
                        this.message = 'Failed to account recovery';
                        this.submitted = false;
                    })
                    .finally(() => {
                        this.loader = false;
                    })
            }
        },
        tryAgain() {
            this.timer = 60;
            this.submitted = false;
            this.loader = false;
        }
    }
}


</script>

<style lang="scss">
.response_account_recovery {
    .account_recovery_message {
        font-size: 16px;
        color: #E94E4E;
        text-align: center;
        white-space: nowrap;
    }
}
</style>
