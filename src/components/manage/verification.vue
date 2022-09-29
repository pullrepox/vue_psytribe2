<template>
    <div class="verification">
        <section class="request" v-if="artistVerificationRequest">
            <header class="request-header">
                <ul class="informations">
                    <li class="owner" v-if="artistVerificationRequest.owner">
                        <v-avatar :width="40" :height="40" :min-width="40">
                            <v-img
                                lazy-src="https://via.placeholder.com/40"
                                :src="ownerAvatar"
                                :alt="artistVerificationRequest.owner.nickname"
                            ></v-img>
                        </v-avatar>
                        <router-link target="_blank" :to="{name: 'user-profile', params: {id: artistVerificationRequest.owner.id}}">
                            {{ artistVerificationRequest.owner.nickname }}
                        </router-link>
                    </li>
                    <li class="email">
                        Email: <span>{{ artistVerificationRequest.email }}</span>
                    </li>
                    <li class="requests">
                        <!-- Requests: <span>2</span>-->
                    </li>
                    <li class="creation-date">
                        Received: {{ artistVerificationRequest.createdAt | moment("MMM DD, YYYY") }}
                    </li>
                </ul>
                <v-menu
                    transition="slide-y-transition"
                    :close-on-content-click="true"
                    :nudge-width="230"
                    offset-y
                    nudge-left="220"
                    nudge-bottom="10"
                    origin="top center"
                    content-class="menu-pointer menu_admin"
                >
                    <v-list class="admin_menu">
                        <v-list-item>
                            <a @click="mark('pending')">Mark Pending</a>
                        </v-list-item>
                        <v-list-item>
                            <a @click="mark('approved')">Approve</a>
                        </v-list-item>
                        <v-list-item>
                            <a @click="mark('denied')">Deny</a>
                        </v-list-item>
                        <v-list-item>
                            <a @click="mark('banned')">Ban user</a>
                        </v-list-item>
                    </v-list>
                    <template v-slot:activator="{ on, attrs }">
                        <div class="actions-menu" v-bind="attrs" v-on="on">

                        </div>
                    </template>
                </v-menu>
            </header>
            <div class="request-body">
                <h4>Artist Requested</h4>
                <div class="artist" v-if="artistVerificationRequest.artist">
                    <v-avatar :width="40" :height="40" :min-width="40">
                        <v-img
                            lazy-src="https://via.placeholder.com/40"
                            :src="artistAvatar"
                            :alt="artistVerificationRequest.artist.name"
                        ></v-img>
                    </v-avatar>
                    <router-link target="_blank" :to="{'name': 'artist-profile', params: {id: artistVerificationRequest.artist.id}}">
                        {{ artistVerificationRequest.artist.name }}
                    </router-link>
                </div>
                <h4>Uploaded Documents</h4>

                <ul class="documents-list">
                    <li>
                        <preview-image
                            :width="135"
                            :height="135"
                            :src="getImageUrl(artistVerificationRequest.idCardPhoto)"
                        ></preview-image>
                    </li>
                    <li>
                        <preview-image
                            :width="135"
                            :height="135"
                            :src="getImageUrl(artistVerificationRequest.selfPhoto)"
                        ></preview-image>
                    </li>
                </ul>

                <h4>Links</h4>
                <ul v-if="links.length > 0" class="links-list">
                    <li v-for="link in links" v-bind:key="link">
                        <a :href="link" target="_blank">{{ link }}</a>
                    </li>
                </ul>
                <h4>User Comments</h4>
                <p class="user-comments" v-html="nl2br(artistVerificationRequest.comments)">
                </p>
            </div>
        </section>
        <verification-comments v-if="artistVerificationRequest"
                               :verification-request="artistVerificationRequest"></verification-comments>
        <div class="page-loader">
            <v-progress-circular v-if="loader" :size="32" :width="3" color="#20C4F5"
                                 indeterminate></v-progress-circular>
        </div>
    </div>
</template>

<script>
import verificationComments from "@/components/manage/verificationComments";
import {mapActions, mapGetters} from "vuex";
import PreviewImage from "../../components/manage/previewImage";

export default {
    name: 'verification',
    props: ['id'],
    components: {
        PreviewImage,
        verificationComments,
    },
    data() {
        return {
            loader: true,
            artistVerificationRequest: null,
            status: null,
            stats: {},
            comments: '',
            apiUrl: process.env.VUE_APP_API_URL
        }
    },
    created() {
        this.GET_ARTIST_VERIFICATION_REQUEST(this.id)
            .then(() => {
                this.artistVerificationRequest = this.ARTIST_VERIFICATION_REQUEST;
            })
            .catch(err => {
                console.log(`GET_ARTIST_VERIFICATION_REQUEST, ${err}`);
            }).finally(() => {
                this.loader = false;
            });
    },
    methods: {
        ...mapActions([
            'GET_ARTIST_VERIFICATION_REQUEST',
            'PATCH_ARTIST_VERIFICATION_REQUEST',
        ]),
        getImageUrl (mediaObject) {
            if (!mediaObject) {
                return '';
            }

            return this.apiUrl + mediaObject.contentUrl
        },
        mark(status) {
            this.loader = true;
            this.PATCH_ARTIST_VERIFICATION_REQUEST({
                id: this.id,
                status: status
            })
            .then(() => {
                this.artistVerificationRequest.status = status;
                this.loader = false;
                // trigger event
                this.$emit('verification_status_updated', this.artistVerificationRequest);
            });
        },
        nl2br (str) {
            if (typeof str === 'undefined' || str === null) {
                return '';
            }

            return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
        }
    },
    computed: {
        ...mapGetters(['ARTIST_VERIFICATION_REQUEST']),
        artistAvatar() {
            if (!this.ARTIST_VERIFICATION_REQUEST.artist.avatar) {
                return require('@/assets/image/privat-profile-ava.png');
            }

            return this.getImageUrl(this.ARTIST_VERIFICATION_REQUEST.artist.avatar);
        },
        ownerAvatar() {
            if (!this.ARTIST_VERIFICATION_REQUEST.owner.photo) {
                return require('@/assets/image/privat-profile-ava.png');
            }

            return this.getImageUrl(this.ARTIST_VERIFICATION_REQUEST.owner.photo);
        },
        links () {
            return this.nl2br(this.artistVerificationRequest.links).split('<br>');
        },
    }
}
</script>

<style lang="scss">
.verification {
    position: relative;

    .page-loader .v-progress-circular {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%), translateY(-50%);
        width: 32px;
        height: 32px;
    }

    section.request {
        border-radius: 8px;
        padding: 8px;
        box-sizing: border-box;
        margin-bottom: 4px;

        header.request-header {
            display: flex;
            align-items: center;
            padding: 8px 8px 10px 8px;
            border-bottom: 1px solid #7481A6;
            background-color: #1B1F34;

            ul.informations {
                display: flex;
                align-items: center;
                flex: 1;
                color: #7481A6;
                font-size: 16px;

                li {
                    margin-right: 16px;

                    &.email {
                        span {
                            color: #20C4F5;
                        }
                    }

                    &.requests {
                        flex: 1;

                        span {
                            color: #E94E4E;
                        }
                    }

                    &.creation-date {
                        color: #DCDCDC;
                        font-size: 14px;
                    }
                }

            }

            .actions-menu {
                width: 34px;
                height: 34px;
                background: url(../../assets/img/more-menu-btn.svg) no-repeat center center;
            }
        }

        .request-body {
            padding: 16px 8px;

            h4 {
                font-size: 16px;
                font-weight: 500;
                color: #7481A6;
                margin-bottom: 8px;
            }

            h4:not(:first-child) {
                margin-top: 32px;
            }

            ul.documents-list {
                display: flex;
                list-style: none;
                margin-left: 0;
                margin-top: 0;

                li {
                    margin-right: 18px;
                }
            }

            .links-list {
                a {
                    color: #20C4F5;
                    font-family: "Montserrat", sans-serif;
                }
            }

            .user-comments {
                color: #F6F6F6;
                font-family: "Montserrat", sans-serif;
            }
        }
    }

    .v-avatar {
        margin-right: 8px;

        & + a {
            color: #20C4F5;
        }
    }

    .v-input {
        fieldset {
            width: 100%;
            background-color: #040A18;
            border-radius: 5px;
            border: 1px solid #282C47;
        }

        &:focus,
        &:hover {
            fieldset {
                border-color: #5F6986;
            }
        }

        input,
        textarea{
            font-size: 14px;
            line-height: 16px;
            color: white;
            caret-color: white;
        }

        textarea {
            outline: none;
            height: 104px;
        }
    }
}
</style>
