<template>
    <v-dialog
        :value="value" @input="$emit('input')"
        persistent
        max-width="574">

        <div class="need_login_dialog style_dialog">
            <h2 class="header">
                Oops!
            </h2>
            <div class="cnt">
                You have to be logged in to do that!
            </div>
            <div class="wrap_actions">
                <button type="button" class="cancel" @click="dialog = false" v-ripple>Cancel</button>
                <router-link :to="{name: 'login'}" class="go_to_login" v-ripple>Log-in</router-link>
<!--                @click.native="$emit('input', false)"-->
            </div>
        </div>
    </v-dialog>
</template>

<script>
export default {
    name: "needLogin",
    props: ['value'],
    data() {
        return {}
    },
    computed: {
        dialog: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value)
            }
        }
    }
}
</script>

<style lang="scss">

</style>
