<template>
  <v-dialog
      :value="showComingSoonDialog"
      max-width="570"
      @input="$emit('input')"
  >
    <div class="coming_soon_dialog style_dialog">
      <h2 class="header">
        <div class="border_head">
          <span class="big-letter">C</span>OMING SOON<span class="big-letter">!</span>
        </div>
      </h2>
      <div class="cnt">
        <i>Want it faster?</i>
      </div>
      <div class="wrap_actions">
        <button type="button" class="is-nope" @click="showComingSoonDialog = false" v-ripple>Nope</button>
        <button type="button" class="is-primary" @click="donate" v-ripple>Donate</button>
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: "comingSoonDialog",

  props: ['value'],

  computed: {
    showComingSoonDialog: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },

  methods: {
    donate() {
      this.showComingSoonDialog = false;
      window.open('https://www.patreon.com/PsytranceNetwork', '_blank')
    }
  }
}
</script>
