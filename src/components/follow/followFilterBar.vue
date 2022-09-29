<template>
    <div v-if="FOLLOWS_FILTER" class="filter_bar_ follow">
        <div class="filters_">
            <div class="role">
                <div class="material_input">
                    <input type="text" required v-model="role">
                    <label>Role</label>
                </div>
            </div>
            <div class="location">
                <div class="material_input">
                    <input type="text" required v-model="location">
                    <label>Location</label>
                </div>
            </div>
            <div class="distance">
                <div class="material_input">
                    <input type="text" required v-model="distance">
                    <label>Distance</label>
                </div>
            </div>
            <div class="supporter">
                <div class="material_input">
                    <input type="text" required v-model="supporter">
                    <label>Supporter</label>
                </div>
            </div>
        </div>
        <div class="search">
            <div class="material_input">
                <input type="text" required v-model="search">
                <label>Search</label>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "followFilterBar",
    data() {
        return {
            // filter
            role: '',
            location: '',
            distance: '',
            supporter: '',
            search: '',
        }
    },
    computed: {
        ...mapGetters(['FOLLOWS_FILTER', 'FOLLOWERS']),
    },
}
</script>

<style scoped>

</style>