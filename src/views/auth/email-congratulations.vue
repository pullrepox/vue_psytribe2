<template>
    <div class="p_email_congratulations">
        <v-container>
            <div class="congratulations">
                <div class="_heading">
                    <h1>Congratulations!</h1>
                    <h6>Your email has been verified</h6>
                </div>
                <div class="illustration congratul"></div>
                <div class="action_buttons">
                    <router-link :to="{name: 'login'}" class="small c2a_btn" v-ripple>Log in</router-link>
                    <router-link :to="{name: 'explore'}" class="small tetriatary_btn" v-ripple>Home</router-link>
                </div>
            </div>
        </v-container>
    </div>
</template>

<script>
export default {
    name: "email-congratulations",
    data() {
        return {

        }
    },
    created() {
        this.$store.dispatch('reset');
    }
}
</script>

<style scoped>

</style>
