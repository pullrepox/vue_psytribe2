<template>
    <section class="verifications-filter">
        <h3>Verifications</h3>
        <ul class="filterByStatus">
            <li
                v-for="item in stats"
                v-bind:key="item.status"
                :class="item.status.toLowerCase() === activeStatus ? 'active' : ''">
                <router-link class="category-label" :to="{ name: 'verifications', params: {'status': item.status}}">
                    {{ item.status }}
                </router-link>
                <span class="count">{{ item.count }}</span>
            </li>
        </ul>
    </section>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: 'verificationsFilter',
    props: ['activeStatus', 'refresh'],
    data () {
        return {
            stats: {},
        }
    },
    methods: {
        ...mapActions(['GET_ARTIST_VERIFICATION_STATS']),
    },
    computed: {
        ...mapGetters(['ARTIST_VERIFICATION_STATS']),
    },
    watch: {
        activeStatus: {
            handler () {
                this.GET_ARTIST_VERIFICATION_STATS().then(() => {
                    this.stats = this.ARTIST_VERIFICATION_STATS;
                });
            },
        },
        refresh: function () {
            this.GET_ARTIST_VERIFICATION_STATS().then(() => {
                this.stats = this.ARTIST_VERIFICATION_STATS;
            });
        }
    },
    async created() {
        this.GET_ARTIST_VERIFICATION_STATS().then(() => {
            this.stats = this.ARTIST_VERIFICATION_STATS;
        });
    },
}
</script>

<style lang="scss">
.verifications-filter {
    padding: 20px 10px;

    h3 {
        color: #DCDCDC;
        font-size: 20px;
        margin-bottom: 8px;
        padding-left: 20px;
        font-weight: 500;
    }

    ul.filterByStatus {
        li {
            display: flex;
            padding: 8px 30px 8px 20px;

            .category-label {
                flex: 1;
                color: #20C4F5;
                text-transform: capitalize;
            }

            .count {
                color: #7481A6;
            }

            &.active {
                background: #41384B;
                border-radius: 6px;

                .count,
                .category-label {
                    color: #DCDCDC;
                }
            }

        }
    }
}
</style>
