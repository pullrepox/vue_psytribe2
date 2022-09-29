<template>
    <div class="page_form_layout">
        <div class="wrap_form_layout">
            <h2 class="profile_basics">Profile Basics</h2>
            <div class="form">
                <div class="full_name">
                    <label for="">Full name</label>
                    <input autofocus type="text" v-model="fullName" autocomplete="off">
                    <div class="hint_message_error">
                        <span v-if="!$v.fullName.isNameValid">Only alphanumeric characters, hyphen and space</span>
                        <span v-if="!$v.fullName.maxLength">30 characters max</span>
                    </div>
                </div>
                <div class="location">
                    <label for="">Location</label>
                    <vue-google-autocomplete
                        id="location"
                        classname="form-control"
                        placeholder="City, state"
                        types="(cities)"
                        v-on:keyup="keypressLocation"
                        v-on:placechanged="getAddressData">
                    </vue-google-autocomplete>
                    <div class="hint_message_error">
                        <span v-if="!$v.location.isNameValid">Only alphanumeric characters, hyphen and space</span>
                        <span v-if="!$v.location.maxLength">200 characters max</span>
                    </div>
                </div>
            </div>
            <div class="i_am">
                <div class="i_am_title">
                    Members can find me as
                </div>
                <div class="wrap_checkbox">
                    <div class="material_checkbox">
                        <input type="checkbox" id="producer" v-model="role.isProducer">
                        <label for="producer">Producer</label>
                    </div>
                    <div class="material_checkbox">
                        <input type="checkbox" id="organizer" v-model="role.isOrganizer">
                        <label for="organizer">Organizer</label>
                    </div>
                    <div class="material_checkbox">
                        <input type="checkbox" id="dj" v-model="role.isDj">
                        <label for="dj">Dj</label>
                    </div>
                    <div class="material_checkbox">
                        <input type="checkbox" id="deco_artist" v-model="role.isDecoArtist">
                        <label for="deco_artist">Deco Artist</label>
                    </div>
                    <div class="material_checkbox">
                        <input type="checkbox" id="vendor" v-model="role.isVendor">
                        <label for="vendor">Vendor</label>
                    </div>
                </div>
            </div>
            <button v-if="!$v.fullName.$invalid" type="button" class="save_profile_basics primary_btn" v-ripple @click="updateProfile" :class="{'loading': loader}">
                Save
                <v-progress-circular :width="2" indeterminate></v-progress-circular>
            </button>
            <button v-else type="button" class="save_profile_basics primary_btn" disabled>Save</button>

        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {maxLength, alphaNum} from 'vuelidate/lib/validators';
import VueGoogleAutocomplete from 'vue-google-autocomplete';
import { helpers } from 'vuelidate/lib/validators';

export default {
    name: 'profile-basics',
    components: {
        VueGoogleAutocomplete
    },
    data() {
        return {
            loader: false,
            fullName: '',
            location: '',
            role: {
                isProducer: false,
                isOrganizer: false,
                isDj: false,
                isDecoArtist: false,
                isVendor: false
            },
        }
    },

    // Validations
    validations: {
        fullName: {
            // isNameValid: helpers.regex('isNameValid', /^[a-z0-9]+([-\s]{1}[a-z0-9]+)*$/i),
            isNameValid: helpers.regex('isNameValid', /^[A-Za-z0-9-.,\s]*$/i ),
            maxLength: maxLength(30)
        },
        location: {
            isNameValid: helpers.regex('isNameValid', /^[A-Za-z0-9-.,\s]*$/i ),
            maxLength: maxLength(200)
        }
    },
    computed: {
        ...mapGetters(['USER', 'PROFILE_DATA']),
    },
    mounted() {
        this.getProfile();
    },
    methods: {
        ...mapActions(['CHANGE_USER_DATA', 'GET_PROFILE']),
        keypressLocation(event) {
            this.location = event.target.value;
        },
        getAddressData: function (addressData, placeResultData) {
            if (addressData.country === 'United States') {
                this.location = `${addressData.locality},  ${addressData.administrative_area_level_1}, ${addressData.country}`;
            } else {
                this.location = `${addressData.locality}, ${addressData.country}`;
            }
        },
        getProfile() {
            this.GET_PROFILE();
        },
        updateProfile() {
            this.loader = true;
            if (!this.PROFILE_DATA.id) {
                this.getProfile();
            }
            if (!this.location) {
                this.location = 'Planet Earth';
            }
            if (!this.fullName) {
                this.fullName = this.PROFILE_DATA.email.split('@')[0];
            }
            const userData = {
                id: this.PROFILE_DATA.id,
                isProducer: this.role.isProducer,
                isPromoter: this.role.isOrganizer,
                isDj: this.role.isDj,
                isDecoArtist: this.role.isDecoArtist,
                isVendor: this.role.isVendor,
                address: this.location.trim(), // TODO: rename address to location ~backend~
                fullName: this.fullName.trim()
            }
            this.CHANGE_USER_DATA(userData)
                .then(() => {
                    this.$router.push({name: 'profile-private'});
                })
                .catch(err => {
                    console.log(`updateProfile, CHANGE_USER_DATA ${err}`);
                })
                .finally(() => this.loader = false);

        }
    }

}
</script>

<style scoped>

</style>
