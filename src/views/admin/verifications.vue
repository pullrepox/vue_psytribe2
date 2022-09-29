<template>
    <div class="p-verifications full_page">
        <supportNav></supportNav>
        <div class="container">
            <aside>
                <verifications-filter :refresh="refreshFilter" :active-status="status"></verifications-filter>
            </aside>
            <main>
                <template>
                    <v-data-table
                        :headers="headers"
                        :items="requests"
                        :options.sync="options"
                        :server-items-length="COUNT_ARTIST_VERIFICATION_REQUESTS"
                        :loading="loading"
                        :expanded.sync="expanded"
                        @click:row="rowClicked"
                        class="admin-table"
                    >
                        <template v-slot:item.photo="{ item }">
                            <v-img
                                lazy-src="https://via.placeholder.com/80"
                                max-width="80"
                                min-height="80"
                                :src="getImageUrl(item.owner.photo)"
                            ></v-img>
                        </template>

                        <template v-slot:item.status="{ item }">
                            <v-chip
                                :color="getColor(item.status)"
                                dark
                            >
                                {{ item.status }}
                            </v-chip>
                        </template>

                        <template v-slot:item.createdAt="{ item }">
                            {{ item.createdAt | moment("HH:mm DD MMM YYYY") }}
                        </template>

                        <template v-slot:expanded-item="{ headers, item }">
                            <td :colspan="headers.length" class="item-details">
                                <verification @verification_status_updated="verificationUpdated"
                                              :id="item.id"></verification>
                            </td>
                        </template>
                    </v-data-table>
                </template>
            </main>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

import supportNav from "@/components/navigations/supportNav";
import VerificationsFilter from "../../components/manage/verificationsFilter";
import Verification from "../../components/manage/verification";

export default {
    name: "verifications",
    props: ['status'],
    components: {
        Verification,
        VerificationsFilter,
        supportNav
    },
    data: () => ({
        apiUrl: process.env.VUE_APP_API_URL,
        requests: [],
        totalRequests: 0,
        loading: true,
        refreshFilter: 0,
        options: {
            itemsPerPage: 5,
            sortDesc: [true],
            sortBy: ['createdAt']
        },
        expanded: [],
        headers: [
            {text: 'Photo', value: 'photo'},
            {
                text: 'User nickname',
                align: 'start',
                sortable: false,
                value: 'owner.nickname',
            },
            {text: 'Email', value: 'email'},
            {text: 'Artist Requested', value: 'artist.name'},
            {text: 'Status', value: 'status'},
            {text: 'Created At', value: 'createdAt'},
        ],
    }),
    computed: {
        ...mapGetters([
            'ARTIST_VERIFICATION_REQUEST',
            'ARTIST_VERIFICATION_REQUESTS',
            'COUNT_ARTIST_VERIFICATION_REQUESTS',
        ]),
    },
    watch: {
        status: {
            handler() {
                this.getDataFromApi();
                this.expanded = [];
            },
        },
        options: {
            handler() {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    methods: {
        ...mapActions(['GET_ARTIST_VERIFICATION_REQUESTS', 'GET_ARTIST_VERIFICATION_REQUEST']),
        getDataFromApi() {
            this.loading = true

            this.GET_ARTIST_VERIFICATION_REQUESTS(this.getApiParams())
                .then(() => {
                    this.loading = false;
                    this.requests = this.ARTIST_VERIFICATION_REQUESTS;
                })
                .catch(err => {
                    this.loading = false;
                    console.log(`GET_ARTIST_VERIFICATION_REQUESTS, ${err}`);
                })
        },
        getApiParams() {
            // this.options = { sortBy, sortDesc, page, itemsPerPage }
            const params = {
                page: this.options.page,
                itemsPerPage: this.options.itemsPerPage < 0 ? 99999 : this.options.itemsPerPage,
            }

            for (let i = 0; i < this.options.sortBy.length; i++) {
                params[`order[${this.options.sortBy[i]}]`] = this.options.sortDesc[i] === true ? 'desc' : 'asc';
            }

            if (this.status) {
                if (this.status.toLowerCase() === 'completed') {
                    params['status'] = ['approved', 'denied', 'banned'];
                } else {
                    params['status'] = this.status.toLowerCase();
                }
            }

            return params;
        },
        getColor(status) {
            switch (status) {
                case 'banned':
                case 'denied':
                    return 'red';
                case 'pending':
                    return 'orange';
                case 'approved':
                case 'completed':
                    return 'green';
                default:
                    return 'grey';
            }
        },
        getImageUrl(mediaObject) {
            if (!mediaObject) {
                return '';
            }

            return this.apiUrl + mediaObject.contentUrl
        },
        rowClicked(item, row) {
            row.expand(!row.isExpanded);
        },
        verificationUpdated(verificationRequest) {
            this.refreshFilter++;

            this.requests.forEach(item => {
                if (item.id === verificationRequest.id) {
                    item.status = verificationRequest.status;
                }
            });

            // refresh admin notification on header
            this.$store.dispatch('GET_ADMIN_NOTIFICATIONS');
        }
    },
}
</script>

<style lang="scss">
.p-verifications {
    .container {
        display: flex;

        aside {
            border-radius: 8px;
            width: 300px;
            margin-right: 30px;
        }

        main {
            flex: 1;
        }
    }

    .theme--dark.v-data-table.admin-table {
        background-color: transparent;

        thead th {
            &:first-child {
                border-radius: 8px 0 0;
            }

            &:last-child {
                border-radius: 0 8px 0 0;
            }
        }

        th.sortable, th.sort_by {
            display: table-cell;
        }

        tr:hover {
            background: inherit;
        }

        tr:hover:not(.v-data-table__expanded) {
            td:not(.item-details), th {
                background-color: #282C47;
                border-radius: inherit;
            }
        }

        tr.v-data-table__expanded td {
            border-bottom: none !important;

            &:first-child {
                border-radius: 0 0 0 8px;
            }

            &:last-child {
                border-radius: 0 0 8px 0;
            }
        }

        tr.v-data-table__expanded + tr td {
            border-top: none !important;

            &:first-child {
                border-radius: 8px 0 0 0;
            }

            &:last-child {
                border-radius: 0 8px 0 0;
            }
        }

        td, th {
            vertical-align: middle;
            background-color: #1B1F34;
            cursor: pointer;

            &.item-details {
                padding: 8px 0;
                background-color: transparent;
                cursor: inherit;
            }
        }

        .v-data-footer {
            background-color: #1B1F34;
            border-radius: 0 0 8px 8px;
        }
    }
}
</style>
