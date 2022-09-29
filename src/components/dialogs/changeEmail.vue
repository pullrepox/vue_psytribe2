<template>
    <v-dialog
        :value="value" @input="$emit('input')"
        persistent
        max-width="574">

        <div class="change_email_dialog">
            <h2 class="header">
                Change Email
            </h2>
            <div class="input_email">
                <input type="text" placeholder="Email" v-model="email">
            </div>
            <div class="wrap_actions">
                <button type="button" class="tetriatary_btn small" v-ripple @click="dialog = false">Cancel</button>
                <button type="button" class="primary_btn small" v-ripple @click="changeEmail">Verify</button>
            </div>
        </div>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
    name: 'changeEmail',
    props: ['value'],
    data() {
        return {
            email: ''
        }
    },
    computed: {
        ...mapGetters(['PROFILE_DATA']),
        dialog: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value)
            }
        }
    },
    mounted() {
        this.getProfile()
            .then(() => {
                this.email = this.PROFILE_DATA.email;
            })
            .catch(err => console.log(`change email - getProfile, ${err}`));
    },
    methods: {
        ...mapActions({
            changeUserEmail: 'CHANGE_EMAIL',
            getProfile: 'GET_PROFILE'
        }),


        changeEmail() {
            this.changeUserEmail(this.email);
        }
    }
}
</script>

<style lang="scss">
.change_email_dialog {
    background-color: #282C47;
    box-shadow: 0 2.38509px 4.77019px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    padding: 16px 32px 32px;

    .header {
        display: flex;
        justify-content: center;
        color: #dbdbdb;
        font-size: 18px;
        height: 35px;
        background-image: url('../../assets/image/line.svg');
        background-repeat: no-repeat;
        background-position: center bottom;
        margin-bottom: 15px;
    }

    .input_email {
        margin-bottom: 32px;

        > input {
            width: 100%;
            height: 52px;
            padding: 0 16px;
            background: #050C1E;
            border: 1px solid #282C47;
            border-radius: 5px;
            color: #f1f1f1;
            font-size: 16px;
        }
    }

    .wrap_actions {
        display: flex;
        justify-content: center;

        > button {
            width: 210px;

            &:first-child {
                margin-right: 16px;
            }
        }
    }
}
</style>
