<template>
    <div class="p_email_verification">
        <v-container>
            <div class="verify_your_email">
                <div class="_heading email_verification">
                    <h1>Verify your email</h1>
                    <h6 v-html="`We’ve sent a verification code to ${tempUserEmail} <br>
                        Enter the verification code below`"></h6>
                </div>
                <div class="code">
                    <div class="box_code_inputs">
                        <input type="text" pattern="[0-9]*" inputmode="numeric" maxlength="1" v-model="code.digit_1" ref="digit_1"
                               @keypress="keypress($event)" @keydown="keydown($event)" @keyup="keyup($event);" @paste="onPaste" @focus="codeFocus(1)">
                        <input type="text" pattern="[0-9]*" inputmode="numeric" maxlength="1" v-model="code.digit_2" ref="digit_2"
                               @keypress="keypress($event)" @keydown="keydown($event)" @keyup="keyup($event);" @paste="onPaste" @focus="codeFocus(2)">
                        <input type="text" pattern="[0-9]*" inputmode="numeric" maxlength="1" v-model="code.digit_3" ref="digit_3"
                               @keypress="keypress($event)" @keydown="keydown($event)" @keyup="keyup($event);" @paste="onPaste" @focus="codeFocus(3)">
                    </div>
                    <div class="separation">-</div>
                    <div class="box_code_inputs">
                        <input type="text" pattern="[0-9]*" inputmode="numeric" maxlength="1" v-model="code.digit_4" ref="digit_4"
                               @keypress="keypress($event)" @keydown="keydown($event)" @keyup="keyup($event);" @paste="onPaste" @focus="codeFocus(4)">
                        <input type="text" pattern="[0-9]*" inputmode="numeric" maxlength="1" v-model="code.digit_5" ref="digit_5"
                               @keypress="keypress($event)" @keydown="keydown($event)" @keyup="keyup($event);" @paste="onPaste" @focus="codeFocus(5)">
                        <input type="text" pattern="[0-9]*" inputmode="numeric" maxlength="1" v-model="code.digit_6" ref="digit_6"
                               @keypress="keypress($event)" @keydown="keydown($event)" @keyup="keyup($event);" @paste="onPaste" @focus="codeFocus(6)">
                    </div>
                </div>

                <div class="code_submit">
                    <template v-if="code.digit_1 && code.digit_2 && code.digit_3 && code.digit_4 && code.digit_5 && code.digit_6">
                        <button type="button" class="primary_btn small send_code" v-ripple @click="sendCode" :class="{'loading': loader}">
                            Submit
                            <v-progress-circular :width="2" indeterminate></v-progress-circular>
                        </button>
                    </template>
                    <template v-else>
                        <div class="primary_btn small send_code disabled">Submit</div>
                    </template>
                </div>

                <div class="message_error">
                    <template v-if="SEND_VERIFY_CODE_STATUS.success === false">
                        {{ SEND_VERIFY_CODE_STATUS.message }}
                    </template>
                </div>

                <div class="resend_code">
                    Can’t find the code?
                    <template v-if="timer > 1">Send a new code</template>
                    <template v-else>
                        <button type="button" v-ripple @click="resendCode">Send a new code</button>
                    </template>
                    <template v-if="timer > 1">
                        <span class="in_seconds">(in {{ timer }} seconds).</span>
                    </template>
                    <div class="or">
                        Or, <a target="_blank" href="mailto:info.psytrance.network@gmail.com">contact support.</a>
                    </div>
                </div>

            </div>
            <dialogChangeEmail v-model="dialogChangeEmailVisible"></dialogChangeEmail>
        </v-container>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

const dialogChangeEmail = () => import ('../../components/dialogs/changeEmail');
import {maxLength, required} from "vuelidate/lib/validators";

export default {
    name: 'email-verification',
    components: {
        dialogChangeEmail
    },
    data() {
        return {
            loader: false,
            dialogChangeEmailVisible: false,

            code: {
                digit_1: '',
                digit_2: '',
                digit_3: '',
                digit_4: '',
                digit_5: '',
                digit_6: '',
            },

            timer: 60,
            pastedText: '',
            arrayCode: [],
            codeValid: true,
            codeFocusEl: '',

            tempUserEmail: '',
            tempUserPassword: ''
        }
    },
    watch: {},
    // Validations
    validations: {
        code: {
            first: {
                required,
                maxLength: 1
            },
            two: {
                required,
                maxLength: 1
            },
            three: {
                required,
                maxLength: 1
            },
            four: {
                required,
                maxLength: 1
            },
            five: {
                required,
                maxLength: 1
            },
            six: {
                required,
                maxLength: 1
            }
        }
    },
    computed: {
        ...mapGetters(['AUTH_DATA', 'LOGIN_STATUS', 'SEND_VERIFY_CODE_STATUS'])
    },
    mounted() {
        this.tempUserEmail = localStorage.getItem('TEMP_USER_EMAIL');
        this.tempUserPassword = localStorage.getItem('TEMP_USER_PASSWORD');

        this.$nextTick(() => {
            this.$refs.digit_1.focus();
            this.countDownTimer();
        });
    },
    methods: {
        ...mapActions({
            sendVerifyCode: 'SEND_VERIFY_CODE',
            resendVerifyCode: 'RESEND_VERIFY_CODE',
            autoLogin: 'LOGIN'
        }),
        onPaste(event) {
            event.preventDefault();
            this.codeValid = true;
            this.arrayCode = [];
            this.pastedText = event.clipboardData.getData('text');
            this.arrayCode = Array.from(this.pastedText.trim());

            if (this.arrayCode && this.arrayCode.length === 6) {
                // this.arrayCode = this.arrayCode.map(function (x) {
                // return parseInt(x, 10);
                // });
                let _self = this;
                this.arrayCode.map(function (x) {
                    if (typeof x !== 'string' || !isNaN(+x)) {
                        _self.codeValid = true;
                        _self.codePaste();
                    } else {
                        _self.codeValid = false;
                        return false;
                    }
                });
            } else {
                this.codeValid = false;
            }
        },

        keyup(event) {
            let activeFocus;
            if ((event.keyCode !== 17 && event.keyCode !== 88) && event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 96 && event.keyCode <= 105) {
                activeFocus = this.$refs[`digit_${this.codeFocusEl + 1}`];
            }
            if (activeFocus) {
                this.$nextTick(() => {
                    activeFocus.focus();
                })
            }
        },
        codeFocus(el) {
            this.codeFocusEl = el;
        },
        keypress(event) {
            if ((event.key < 48 || event.key > 57) && (event.key !== 46)) { // 46 is dot
                this.code[`digit_${this.codeFocusEl}`] = event.key;
                // only allow numbers and one dot
                // ...
            } else {
                event.preventDefault();
            }
        },
        keydown(event) {
            let activeFocus;

            switch (event.key) {
                case 'ArrowLeft':
                    activeFocus = this.$refs[`digit_${this.codeFocusEl - 1}`];
                    break;
                case 'ArrowRight':
                    activeFocus = this.$refs[`digit_${this.codeFocusEl + 1}`];
                    break;
                case 'Backspace':
                    event.preventDefault();
                    this.code[`digit_${+this.codeFocusEl}`] = '';
                    activeFocus = this.$refs[`digit_${this.codeFocusEl - 1}`];
                    break;
                case 'Delete':
                    event.preventDefault();
                    this.code[`digit_${+this.codeFocusEl}`] = '';
                    activeFocus = this.$refs[`digit_${this.codeFocusEl + 1}`];
                    break;
            }
            if (activeFocus) {
                this.$nextTick(() => {
                    activeFocus.focus();
                })
            }
        },
        codePaste() {
            // if code valid
            this.code.digit_1 = this.arrayCode[0];
            this.code.digit_2 = this.arrayCode[1];
            this.code.digit_3 = this.arrayCode[2];
            this.code.digit_4 = this.arrayCode[3];
            this.code.digit_5 = this.arrayCode[4];
            this.code.digit_6 = this.arrayCode[5];
        },
        changeEmail() {
            this.dialogChangeEmailVisible = true;
        },

        sendCode() {
            let finalCode = `${this.code.digit_1}${this.code.digit_2}${this.code.digit_3}${this.code.digit_4}${this.code.digit_5}${this.code.digit_6}`;
            console.log('send verify code -', finalCode);

            if (this.tempUserEmail) {
                this.loader = true;
                const params = {
                    email: this.tempUserEmail,
                    code: finalCode
                }
                this.sendVerifyCode(params)
                    .then(() => {
                        if (this.SEND_VERIFY_CODE_STATUS.success === true) {
                            localStorage.removeItem('TEMP_USER_EMAIL');
                            localStorage.removeItem('TEMP_USER_PASSWORD');
                            this.autoLogin({email: this.tempUserEmail, password: this.tempUserPassword})
                                .then(() => {
                                    if (this.LOGIN_STATUS.success === true) {
                                        if (this.AUTH_DATA.firstLogin === true && this.AUTH_DATA.verify === true) {
                                            this.$router.push({name: 'profile-basics'});
                                        }
                                    }
                                });
                        }
                    })
                    .catch(err => {
                        console.log(`sendCode ${err}`);
                    })
                    .finally(() => {
                        this.loader = false;
                    })
            } else {
                this.$router.push({name: 'login'});
            }
        },
        resendCode() {
            this.timer = 60;
            if (this.tempUserEmail) {
                this.resendVerifyCode({email: this.tempUserEmail}).then(() => {
                    this.$store.commit('SET_SEND_VERIFY_CODE_STATUS', {});
                    this.countDownTimer();
                });
            } else {
                this.$router.push({name: 'login'});
            }
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

<style scoped>

</style>
