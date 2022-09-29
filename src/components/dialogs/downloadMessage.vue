<template>
    <v-dialog
        :value="downloadMessageDialogVisible"
        max-width="570"
        @input="$emit('input')"
    >
        <div class="coming_soon_dialog style_dialog">
            <h2 class="header">
                <div class="border_head">
                    <span class="big-letter">Download</span>
                </div>
            </h2>
            <div class="cnt">
                <span>You downloaded {{ downloaded }} of {{ limit }}</span>
            </div>
            <div class="wrap_actions center">
                <button type="button" class="is-nope" @click="cancel()" v-ripple>Cancel</button>
                <button type="button" :disabled="downloadDisabled" class="is-nope" @click="download()" v-ripple>Download</button>
            </div>
        </div>
    </v-dialog>
</template>

<script>
export default {
    name: "downloadMessageDialog",
    props: ['value', 'downloaded', 'limit', 'downloadDisable'],
    computed: {
        downloadMessageDialogVisible: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value)
            }
        },
        downloadDisabled: {
            get() {
                return this.downloadDisable;
            },
        }
    },
    methods: {
        cancel() {
            this.downloadMessageDialogVisible = false;
        },
        download() {
            this.$emit("callDownloadMethod");
            this.downloadMessageDialogVisible = false;
        }
    }
}
</script>

<style scoped>

</style>