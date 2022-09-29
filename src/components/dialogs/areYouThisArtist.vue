<template>
  <v-dialog
      :value="value" @input="$emit('input')"
      persistent
      max-width="677">

    <div class="style_dialog are-you-this-artist-dialog">
      <h2 class="header">
        Are you {{ artist.name }}?
      </h2>
      <div class="cnt">
        You can claim this profile<br>Doing so requires identity verification
      </div>
      <div class="wrap_actions">
        <router-link :to="{name: 'upload-verification', params: {artistId: artist.id}}" v-ripple>Verify Me</router-link>
        <button type="button" class="cancel" @click="dialog = false" v-ripple>Cancel</button>
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
    name: "areYouThisArtist",
    props: ['value', 'artist'],
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
.are-you-this-artist-dialog {
    width: 677px;

    .header {
        text-transform: inherit;
    }
    .cnt {
        text-align: center;
     }
    .wrap_actions {
        max-width: 450px;
        margin: 0 auto;

        .cancel {
            background-color: transparent;
            border: 1px solid #5F6986;
        }
    }
}
</style>
