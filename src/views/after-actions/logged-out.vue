<template>
    <div class="page-logged-out">
        <div class="content-page">
            <div class="block_logged_out">
                <div class="spaceship"></div>
                <div class="description">
                    You’ve successfully logged out!
                </div>
                <div class="action_buttons">
                    <router-link :to="{name: 'explore'}" class="right primary_btn small" v-ripple>Home</router-link>
                    <router-link :to="{name: 'login'}" class="right tetriatary_btn small" v-ripple>Log In</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'logged-out',
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
