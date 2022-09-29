<template>
    <div class="page_form_layout">
        <div class="wrap_form_layout recovery_password">
            <h2 class="create_new_password">Create new password</h2>
            <div class="form">
                <div class="password">
                    <div>
                        <label for="">New Password</label>
                        <button type="button" class="show_password" @click="switchVisibilityNewPasswordType('password')"
                                v-html="newPasswordType === 'password'? 'Show' : 'Hide'"></button>
                    </div>
                    <input :type="newPasswordType" v-model="newPassword" @keyup="passwordOnKeyDown" tabindex="1">
                </div>
                <div class="password">
                    <div>
                        <label for="">Confirm Password</label>
                        <button type="button" class="show_password" @click="switchVisibilityConfirmPassword('password')"
                                v-html="confirmPasswordType === 'password'? 'Show' : 'Hide'"></button>
                    </div>
                    <input :type="confirmPasswordType" v-model="confirmPassword" @keyup="passwordOnKeyDown" tabindex="1">
                </div>
                <div class="password_complexity">
                    <span class="label">Password must include:</span>
                    <div class="wrap_must_symbols">
                        <div :class="[ {active: this.passComplexity.upperCase}, 'item_' ]">ABC</div>
                        <div :class="[ {active: this.passComplexity.lowerCase}, 'item_']">abc</div>
                        <div :class="[ {active: this.passComplexity.nonWordChars}, 'item_']">@.#&</div>
                        <div :class="[ {active: newPassword.length && $v.newPassword.minLength && $v.newPassword.maxLength}, 'item_']">
                            8-16 Characters
                        </div>
                    </div>
                </div>
                <div class="message_error">
                    <template v-if="RESET_PASSWORD_STATUS.success === false">
                        {{RESET_PASSWORD_STATUS.message}}
                    </template>
                </div>
                <button v-if="passwordValid === true && $v.confirmPassword.$invalid === false"
                        @click="saveNewPassword"
                        type="button"
                        class="sign_up c2a_btn"
                        v-ripple
                        :class="{'loading': loader}">
                    Save
                    <v-progress-circular :width="2" indeterminate></v-progress-circular>
                </button>
                <button v-else type="button" class="sign_up c2a_btn" disabled>Save</button>
            </div>
        </div>
    </div>
</template>

<script>
import {minLength, maxLength, required, sameAs} from "vuelidate/lib/validators";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "password-recovery",
    data() {
        return {
            loader: false,
            newPassword: '',
            confirmPassword: '',
            newPasswordType: 'password',
            confirmPasswordType: 'password',
            passComplexity: {
                lowerCase: false,
                upperCase: false,
                nonWordChars: false
            },
            passwordValid: false,
        }
    },
    props: ['token'],

    // Validations
    validations: {
        newPassword: {
            required,
            minLength: minLength(8),
            maxLength: maxLength(16)
        },
        confirmPassword: {
            required,
            sameAsPassword: sameAs('newPassword')
        }
    },
    computed: {
        ...mapGetters(['RESET_PASSWORD_STATUS']),
    },
    methods: {
        ...mapActions(['RESET_PASSWORD']),
        passwordOnKeyDown() {
            this.passComplexity.nonWordChars = !!this.newPassword.match(".*[!@#$%^&*.]");
            this.passComplexity.upperCase = !!this.newPassword.match(".*[A-Z]");
            this.passComplexity.lowerCase = !!this.newPassword.match(".*[a-z]");

            this.passwordValid = this.passComplexity.lowerCase === true && this.passComplexity.upperCase === true && this.passComplexity.nonWordChars === true
        },
        switchVisibilityNewPasswordType() {
            this.newPasswordType = this.newPasswordType === 'password' ? 'text' : 'password';
        },
        switchVisibilityConfirmPassword() {
            this.confirmPasswordType = this.confirmPasswordType === 'password' ? 'text' : 'password';
        },
        saveNewPassword() {
            if (this.token && (this.newPassword === this.confirmPassword)) {
                const params = {
                    token: this.token,
                    password: this.newPassword,
                }
                this.RESET_PASSWORD(params)
                    .then(() => {
                        if (this.RESET_PASSWORD_STATUS.success === true) {
                            this.$router.push({name: 'login'});
                        }
                    })
                    .catch(err => console.log(`saveNewPassword, ${err}`));
            }
        }
    }
}
</script>

<style scoped>

</style>
