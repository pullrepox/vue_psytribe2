<template>
    <div class="project_is_under_construction_warning" v-if="!isSetUnderstand">
        <div class="wrap">
            <div class="content">
                <i class="warning_triangle"></i>
                <span class="first-line">
                    <span>This project is in</span>
                    <router-link :to="{name: 'faq'}" target="_blank" class="faq-link">alpha development stage</router-link>
                </span>
                <span>
                    - all ratings, comments and artist owners will be reset. Profiles and
                    other aspects may or may not be cleared before official launch.
                </span>
                <a href="#" class="understand" @click.prevent="understand">I understand</a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "projectIsUnderConstructionWarning",

        data() {
            return {
                isSetUnderstand: true
            }
        },

        mounted() {
            // is user clicked on understand link
            if(localStorage.getItem('psytranc_understand') !== 'isSet') {
                this.isSetUnderstand = false;
            }
        },

        methods: {
            understand() {
                localStorage.setItem('psytranc_understand', 'isSet');
                this.isSetUnderstand = true;
            }
        }
    }
</script>
