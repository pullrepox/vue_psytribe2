<template>
    <v-dialog
        :value="showAttentionMobileVersionDialog"
        max-width="570"
        @input="$emit('input')"
    >
        <div class="coming_soon_dialog style_dialog">
            <h2 class="header">
                <div class="border_head">
                    <span class="big-letter">Attention</span>
                </div>
            </h2>
            <div class="cnt">
                <span>Mobile version currently for testing purposes only</span>
            </div>
            <div class="wrap_actions center">
                <button type="button" class="is-nope" @click="ok()" v-ripple>OK</button>
            </div>
        </div>
    </v-dialog>
</template>

<script>
export default {
    name: "attentionMobileVersion",
    props: ['value'],
    computed: {
        showAttentionMobileVersionDialog: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value)
            }
        }
    },
    methods: {
        ok() {
            this.showAttentionMobileVersionDialog = false;
            localStorage.setItem('psytranc_understand', 'isSet');
        }
    }
}
</script>

<style scoped>

</style>
