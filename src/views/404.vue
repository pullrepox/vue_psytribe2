<template>
    <div class="page-not-found">
        <div class="container" v-bind:class="[isActive ? 'active' : 'not-active']">
            <div class="wrap">
                <router-link to="/" class="home">Home</router-link>
                <router-link to="bug-reports" class="report">Report</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: '404',
    data() {
        return {
            isActive: true
        };
    },
    created() {
        setInterval(() => {
            this.isActive = !this.isActive;
        }, 1000);
    }
};
</script>
