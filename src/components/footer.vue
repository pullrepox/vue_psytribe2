<template>
  <footer>
      <v-container>
          <div class="left_box">
            <div class="footer_logo"></div>
            <span>Copyright © 2021</span>
          </div>
          <div class="right_box">
              <div class="links">
                  <router-link :to="{name: 'faq'}">About</router-link>
                  <router-link :to="{name: 'changelog'}">Changelog</router-link>
                  <router-link :to="{name: 'feature-suggestions'}">Suggest a feature</router-link>
                  <router-link :to="{name: 'bug-reports'}">Report a bug</router-link>
                  <router-link :to="{name: 'donate'}">Terms of use</router-link>
                  <a href="mailto:info.psytrance.network@gmail.com" target="_blank">Contact us</a>
              </div>
              <div class="social_block">
                  <!--        <a href="mailto:info.psytrance.network@gmail.com" class="mail" target="_blank"></a>-->
                  <a href="https://facebook.com/psytrancemusicandevents" target="_blank" class="facebook"></a>
                  <!--        <a href="https://instagram.com" target="_blank" class="instagram"></a>-->
              </div>

          </div>
      </v-container>
  </footer>
</template>
<script>

export default {
    name: 'mainFooter',
    // data() {
    //     return {
    //         windowHeight: window.innerHeight,
    //     };
    // },
    // watch: {
    //     windowHeight(newHeight, oldHeight) {
    //         console.log(newHeight, oldHeight);
    //         // document.querySelector('footer').style.top = this.windowHeight - 108 + 'px';
    //     }
    // },
    // computed: {
    //
    // },
    // mounted() {
    //     this.$nextTick(() => {
    //         const myParagraph = document.querySelector('html').offsetHeight;
    //         console.log('myParagraph', myParagraph);
    //         // window.addEventListener('resize', this.onResize);
    //         // document.querySelector('footer').style.top = this.windowHeight - 108 + 'px';
    //     });
    // },
    // beforeDestroy() {
    //     window.removeEventListener('resize', this.onResize);
    // },
    // methods: {
    //     onResize() {
    //         this.windowHeight = window.innerHeight
    //
    //     }
    // }
}
</script>
