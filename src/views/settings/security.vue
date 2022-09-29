<template>
    <settingLayout>

            <section class="wrap_s_block">
                <div class="password_box">
                    <h2 class="name_section">
                        Password
                    </h2>
                    <form action="#" @submit.prevent="goChangePassword" autocomplete="off">
                        <div class="body_ change_password">
                            <div class="wrap_input password">
                                <password-field
                                    id="old-password"
                                    autocomplete="old-password'"
                                    v-model="oldPassword"
                                    label="Current Password"
                                    :error-messages="oldPasswordErrorMessages"
                                ></password-field>
                            </div>

                            <div class="wrap_input password">
                                <password-field
                                    id="new-password"
                                    autocomplete="new-password'"
                                    v-model="newPassword"
                                    label="New Password"
                                ></password-field>
                            </div>

                            <div class="password_complexity">
                                <span class="label">Must include:</span>
                                <div class="wrap_must_symbols">
                                    <div :class="[ {active: this.passwordComplexity.upperCase}, 'item_' ]">ABC</div>
                                    <div :class="[ {active: this.passwordComplexity.lowerCase}, 'item_']">abc</div>
                                    <div :class="[ {active: this.passwordComplexity.nonWordChars}, 'item_']">@#&</div>
                                    <div :class="[ {active: newPassword.length > 8}, 'item_']">
                                        8+ Characters
                                    </div>
                                </div>
                            </div>

                            <v-btn
                                class="btn_change_pass"
                                :loading="passwordFormLoader"
                                :disabled="!isValidChangePasswordForm"
                                @click.stop="goChangePassword"
                            >
                                Save
                            </v-btn>
                        </div>
                    </form>
                </div>
                <div class="email_box">
                    <h2 class="name_section">
                        Email
                    </h2>
                    <div class="body_ change_email">
                        <div class="this_email">{{ PROFILE_DATA.email }}
                            <span>(Unconfirmed)</span>
                            <button type="button" @click="changeEmail">Edit</button>
                        </div>
                        <button class="resend_confirm_email" @click="resendEmailConfirmation" :disabled="timer > 0">
                            Resend confirmation
                            <template v-if="timer > 0">
                                in {{ timer }} seconds
                            </template>
                        </button>
                    </div>
                </div>
            </section>
        <dialogChangeEmail v-model="dialogChangeEmailVisible"></dialogChangeEmail>
    </settingLayout>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import settingLayout from "@/layouts/settingLayout";
import PasswordField from "../../components/profile/passwordField";
const dialogChangeEmail = () => import('../../components/dialogs/changeEmail');

export default {
    name: 'security',
    components: {
        settingLayout,
        PasswordField,
        dialogChangeEmail
    },
    data() {
        return {
            passwordFormLoader: false,
            oldPasswordErrorMessages: [],
            oldPassword: '',
            newPassword: '',
            passwordComplexity: {
                lowerCase: false,
                upperCase: false,
                nonWordChars: false,
                minLength: false
            },
            dialogChangeEmailVisible: false,
            timer: 0
        }
    },
    watch: {
        newPassword() {
            this.passwordComplexity.nonWordChars = !!this.newPassword.match(".*[!@#$%^&*.]");
            this.passwordComplexity.upperCase = !!this.newPassword.match(".*[A-Z]");
            this.passwordComplexity.lowerCase = !!this.newPassword.match(".*[a-z]");
            this.passwordComplexity.minLength = this.newPassword.length > 8;
        }
    },
    computed: {
        ...mapGetters(['PROFILE_DATA', 'CHANGE_PASSWORD_STATUS']),
        isValidChangePasswordForm() {
            return this.passwordComplexity.lowerCase === true &&
                this.passwordComplexity.upperCase === true &&
                this.passwordComplexity.nonWordChars === true &&
                this.passwordComplexity.minLength &&
                this.oldPassword.length > 0;
        }
    },
    created() {

    },
    mounted() {
        this.GET_PROFILE().then(() => {
        })
    },
    methods: {
        ...mapActions(['GET_PROFILE', 'SEND_EMAIL_VERIFICATION']),
        goChangePassword() {
            this.passwordFormLoader = true;

            const data = {
                oldPassword: this.oldPassword,
                newPassword: this.newPassword
            }

            if (this.oldPassword && this.newPassword) {
                this.$store.dispatch('CHANGE_PASSWORD', data)
                    .then(() => {
                        this.passwordFormLoader = false;

                        if (this.CHANGE_PASSWORD_STATUS === 'success') {
                            this.$store.dispatch('LOGOUT').then(() => {
                                this.$router.push('/password-changed');
                            });
                        } else {
                            this.oldPasswordErrorMessages = ['The current password that you entered is incorrect'];
                        }
                    });
            }
        },
        changeEmail() {
            this.dialogChangeEmailVisible = true;
        },
        resendEmailConfirmation() {
            this.timer = 60;
            this.SEND_EMAIL_VERIFICATION().then(() => {
                this.countDownTimer();
            })
        },
        countDownTimer() {
            if (this.timer > 0) {
                setTimeout(() => {
                    this.timer -= 1;
                    this.countDownTimer();
                }, 1000);
            }
        },
    }
}
</script>
