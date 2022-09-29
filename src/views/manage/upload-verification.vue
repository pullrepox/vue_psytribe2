<template>
    <div class="identity-verification">
            <v-container>
                <div class="page_title">
                    <span>Identity Verification</span>
                </div>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                    v-on:submit.prevent
                >
                    <div class="wrap_steps">
                        <div :class="stepsCompleted[1] ? 'step one completed' : 'step one'">
                            <div class="step_title">
                                <span class="step-number">1</span> Upload a photo of your Drivers license or Passport.
                            </div>
                            <div class="step_body">
                                <upload-image @selected_photo="photoDocselected">
                                    10 MB limit 1000 x 1000 pixels | JPG, PNG
                                </upload-image>
                            </div>
                        </div>
                        <div :class="stepsCompleted[2] ? 'step two completed' : 'step two'">
                            <div class="step_title">
                                <span class="step-number">2</span> Upload a photo of yourself, holding your ID and the
                                artist name of a profile which you’d
                                like to claim.
                            </div>
                            <div class="step_body">
                                <div class="example_photo">
                                    <preview-image :src="require('@/assets/img/upload-verification/sample.png')"></preview-image>
                                </div>
                                <upload-image @selected_photo="photoSelfSelected">
                                    10 MB limit 1000 x 1000 pixels | JPG, PNG
                                </upload-image>
                            </div>
                        </div>
                        <div :class="stepsCompleted[3] ? 'step three completed' : 'step three'">
                            <div class="step_title">
                                <span class="step-number">3</span> Link(s) to a webpage showing a connection between
                                your real name and your artist name.
                            </div>
                            <div class="step_body">
                                <v-textarea
                                    v-model="links"
                                    rows="5"
                                    :outlined="true"
                                    class="links-text-area"
                                ></v-textarea>
                            </div>
                        </div>
                        <div :class="stepsCompleted[4] ? 'step four completed' : 'step four'">
                            <div class="step_title">
                                <span class="step-number">4</span> Contact information & comments
                            </div>
                            <div class="step_body">
                                <div class="wrap_fields">
                                    <label>Email - Required</label>
                                    <v-text-field
                                        v-model="email"
                                        :rules="emailRules"
                                        :outlined="true"
                                        required
                                    ></v-text-field>
                                    <label>Comments - Optional</label>
                                    <v-textarea
                                        v-model="comments"
                                        rows="5"
                                        :outlined="true"
                                        class="comments-text-area"
                                    ></v-textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <v-btn
                        :disabled="!allStepsCompleted || !valid"
                        class="submit"
                        x-large
                        :loading="loading"
                        @click="submitRequest"
                    >
                        Submit
                    </v-btn>
                </v-form>
            </v-container>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import uploadImage from '../../components/manage/uploadImage'
import previewImage from '../../components/manage/previewImage'

export default {
    name: 'uploadVerification',
    props: ['artistId'],
    components: {
        uploadImage,
        previewImage
    },
    data() {
        return {
            valid: true,
            loading: false,
            uploadedDocPhoto: null,
            uploadedSelfPhoto: null,
            stepOneCompleted: true,
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            comments: '',
            links: '',
        }
    },
    methods: {
        ...mapActions(['ADD_ARTIST_VERIFICATION_REQUEST', 'ADD_FILE']),
        photoDocselected(file) {
            this.uploadedDocPhoto = file;
        },
        photoSelfSelected(file) {
            this.uploadedSelfPhoto = file;
        },
        async submitRequest() {
            if (this.$refs.form.validate() && this.uploadedDocPhoto && this.uploadedSelfPhoto) {
                this.loading = true;
                let data = {
                    artist: `artists/${this.artistId}`,
                    email: this.email,
                    comments: this.comments,
                    links: this.links,
                };
                let formData = new FormData();
                // upload id photo
                formData.append('file', this.uploadedDocPhoto);
                await this.ADD_FILE(formData);
                data['idCardPhoto'] = this.FILE_URL;
                // upload self photo
                formData.set('file', this.uploadedSelfPhoto);
                await this.ADD_FILE(formData);
                data['selfPhoto'] = this.FILE_URL;
                // send all data
                await this.ADD_ARTIST_VERIFICATION_REQUEST(data)
                    .then(() => {
                        this.loading = false;
                        this.$router.push({name: 'verification-request-submitted'});
                    }).catch(err => {
                        this.loading = false;
                        console.log(err);
                    });
            } else {
                this.valid = false;
            }
        }
    },
    computed: {
        ...mapGetters(['FILE_URL']),
        stepsCompleted() {
            let steps = {
                1: false,
                2: false,
                3: false,
                4: false,
            };

            if (this.uploadedDocPhoto) {
                steps[1] = true;
            }

            if (this.uploadedSelfPhoto) {
                steps[2] = true;
            }

            if (this.links) {
                steps[3] = true;
            }

            if (this.email) {
                steps[4] = true;
            }

            return steps;
        },
        allStepsCompleted() {
            return this.uploadedDocPhoto && this.uploadedSelfPhoto && this.links && this.email;
        }
    }
}
</script>

<style lang="scss">
.identity-verification {
    background: #031020;
    padding-top: 72px;

    .page_title {
        font-size: 30px;
        line-height: 35px;
        font-weight: normal;
        color: #DCDCDC;
        padding: 32px 0 16px 60px;
    }

    .wrap_steps {
        padding: 16px 30px 16px 30px ;
        background-color: #10182B;
        border-radius: 5px;

        .step {
            padding-bottom: 64px;
            padding-left: 32px;
            position: relative;
            border-left: 3px solid #DCDCDC;

            &.four {
                border-left-color: transparent;
                padding-bottom: 0;
            }

            .step_title {
                font-size: 18px;
                color: #DCDCDC;
                line-height: 150%;
                margin-bottom: 20px;
                font-weight: 300;

                .step-number {
                    position: absolute;
                    left: -17px;
                    width: 32px;
                    height: 32px;
                    line-height: 200%;
                    background: #DCDCDC;
                    border-radius: 50%;
                    font-weight: 900;
                    font-size: 16px;
                    color: #282C47;
                    text-align: center;
                }
            }

            &.completed {
                border-left-color: #728DED;

                &.four {
                    border-left-color: transparent;
                }

                .step_title .step-number {
                    background-color: #728DED;
                    color: white;
                }
            }

            .step_body {
                display: flex;

                .example_photo,
                .upload-img {
                    margin-left: 32px;
                }

                .wrap_fields {
                    width: 100%;

                    > label {
                        font-size: 16px;
                        line-height: 20px;
                        color: #7481A6;
                        margin-bottom: 6px;
                    }
                }
            }
        }
    }
    button.v-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 326px;
        height: 64px !important;
        background: #5F6986;
        border-radius: 68px;
        color: white;
        margin: 32px 64px;
        padding: 22px !important;
        text-transform:none !important;

        .v-btn__content {
            font-family: "Roboto", sans-serif;
            font-style: normal;
            font-size: 18px;
            font-weight: 500;
        }
    }

    .theme--dark.v-btn.v-btn--has-bg {
        background-color: #5F6986;
    }
    .v-input {
        fieldset {
            width: 100%;
            border: 1px solid #282C47;
            background-color: #040A18;
            border-radius: 5px;
        }

        &:focus,
        &:hover {
            fieldset {
                border-color: #5F6986;
            }
        }

        &.error--text {
            fieldset {
                border: 1px solid #ff5252;
            }
        }

        input,
        textarea{
            font-size: 16px;
            color: white;
            caret-color: white;
        }

        textarea {
            outline: none;
            height: 104px;
            padding: 4px 16px 4px 4px;
            line-height: 20px;
        }
    }
}
</style>
