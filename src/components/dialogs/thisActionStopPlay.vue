<template>
    <v-dialog
        :value="showAttentionStopPlay"
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
                <span>This action will stop play</span>
            </div>
            <div class="wrap_actions">
                <button type="button" class="is-nope" @click="ok()" v-ripple>OK</button>
                <button type="button" class="is-nope" @click="cancel()" v-ripple>Cancel</button>
            </div>
        </div>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
    name: "thisActionStopPlay",
    props: ['value'],
    computed: {
        showAttentionStopPlay: {
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
            this.$store.dispatch('STOP_PLAY');
            this.$store.dispatch('SET_PLAYED_ONLY_FAV_TRACKS', true);
            this.showAttentionStopPlay = false;
        },
        cancel() {
            this.showAttentionStopPlay = false;
        }
    }
}
</script>

<style scoped>

</style>