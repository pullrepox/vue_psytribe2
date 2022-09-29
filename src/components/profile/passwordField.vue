<template>
    <div class="password-field">
        <label>{{ label }}</label>
        <v-text-field
            autocomplete="off"
            v-bind="$attrs"
            :type="show ? 'text' : 'password'"
            :error-messages="errorMessages"
            v-on="$listeners"
            outlined
        >
            <template v-slot:append>
                <a class="toggle-visibility" @click="toggleVisibility">
                    {{ show ? 'Hide' : 'Show' }}
                </a>
            </template>
        </v-text-field>
    </div>
</template>

<script>

export default {
    name: 'passwordField',
    data () {
        return {
            show: false
        }
    },
    props: {
        errorMessages: {
            type: Array,
            default: null,
        },
        label: String,
    },
    methods: {
        toggleVisibility () {
            this.show = !this.show;
        }
    }
}
</script>

<style lang="scss">
.password-field {
    label {
        font-size: 16px;
        color: #aaa;
    }
    .v-input.v-text-field--outlined {
        .v-input__slot {
            min-height: inherit;
            margin-bottom: inherit;
        }

        .v-text-field__slot {
            width: 310px;
            height: 45px;
        }
        fieldset {
            border: 1px solid #282C47;
            border-radius: 5px;
            background-color: #040A18;
            width: 310px;
            height: 48px;
        }
        &.v-input--is-focused,
        &:hover {
            fieldset {
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
        }

        input {
            display: flex;
            width: 100%;
            height: 100%;
            align-items: center;
            font-size: 16px;
            line-height: 20px;
            color: #8591B1;
            caret-color: #fff;
        }

        &.error--text {
            .v-text-field__details {
                display: inline-block;
            }
        }

        .v-input__slot .toggle-visibility {
            position: absolute;
            bottom: 100%;
            right: 0;
            font-size: 14px;
            line-height: 150%;
            color: #20C4F5;
            &:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>
