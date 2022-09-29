<template>
    <div class="verification-request-submitted">
        <div class="content-page">
            <v-container>
                <div class="block_is_this_you">
                    <h1>
                        Success!
                    </h1>
                    <div class="description">
                        Your claim has been submitted. <br>Please allow a few days for processing.
                    </div>
                    <div class="spaceship"></div>
                    <div class="action_buttons">
                        <router-link :to="{name: 'donate'}">Donate</router-link>
                        <router-link :to="{name: 'explore'}">Home</router-link>
                    </div>
                </div>
            </v-container>
        </div>
    </div>
</template>

<script>

export default {
    name: 'is-this-you',
    components: {},
    data() {
        return {}
    },
    computed: {},
    mounted() {

    },
    methods: {}
}
</script>
