<template>
    <section :class="folded ? 'verification-comments verification-comments--folded' : 'verification-comments'">
        <h3 class="title" @click="folded = !folded">
            <span class="label">Notes</span> <span class="count">{{ totalItems }}</span><span class="close">{{ folded ? 'Open' : 'Close' }}</span>
        </h3>

        <v-textarea
            v-model="newComment"
            rows="5"
            :outlined="true"
            class="comments-text-area"
            placeholder="Press enter to add a note"
            @keypress.enter="addNewComment"
        ></v-textarea>
        <ul v-if="ARTIST_VERIFICATION_COMMENTS" class="comments-list">
            <li v-for="comment in commentsList" v-bind:key="comment.id" class="single-comment">
                <v-avatar :width="70" :height="70" :min-width="70">
                    <v-img
                        lazy-src="https://via.placeholder.com/70"
                        :src="getImageUrl(comment.owner.photo)"
                        :alt="comment.owner.nickname"
                    ></v-img>
                </v-avatar>
                <div class="single-comment__content">
                    <div class="single-comment__header">
                        <span class="single-comment__user"><a>{{ comment.owner.firstName }} {{ comment.owner.lastName }}</a></span>
                        <span class="single-comment__since">{{ comment.createdAt | moment("from")}}</span>
                        <span v-if="comment.owner.id === AUTH_DATA.userId" class="single-comment__actions"><a title="delete" @click="deleteComment(comment.id)"><span class="material-icons-outlined">delete</span></a></span>
                    </div>
                    <div class="single-comment__text">
                        {{ comment.content }}
                    </div>
                </div>
            </li>
        </ul>
        <div v-if="COUNT_REMAINING_ARTIST_VERIFICATION_COMMENTS > 0" class="show-more">
            <v-btn
                :loading="loading"
                :rounded="true"
                @click="loadMore">
                Show more
            </v-btn>
        </div>
    </section>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: 'verificationComments',
    props: ['verificationRequest'],
    data () {
        return {
            loading: false,
            newComment: null,
            commentsList: [],
            totalItems: 0,
            folded: true,
            apiUrl: process.env.VUE_APP_API_URL
        }
    },
    methods: {
        ...mapActions([
            'GET_ARTIST_VERIFICATION_COMMENTS',
            'ADD_ARTIST_VERIFICATION_COMMENT',
            'DELETE_ARTIST_VERIFICATION_COMMENT',
            'CLEAN_COMMENTS',
        ]),
        async addNewComment () {
            if (this.newComment.length === 0) {
                return;
            }

            const params = {
                artistVerificationRequest: this.verificationRequest['@id'],
                content: this.newComment,
            };

            this.ADD_ARTIST_VERIFICATION_COMMENT(params).then((response) => {
                this.commentsList = [...[response.data], ...this.commentsList]
                this.newComment = '';
                this.totalItems++;
            });
        },
        getImageUrl (mediaObject) {
            if (!mediaObject) {
                return '';
            }

            return this.apiUrl + mediaObject.contentUrl
        },
        deleteComment (id) {
            return this.DELETE_ARTIST_VERIFICATION_COMMENT(id)
                .then(() => {
                    for( let i = 0; i < this.commentsList.length; i++){
                        if ( this.commentsList[i]['id'] === id) {
                            this.commentsList.splice(i, 1);
                            this.totalItems--;
                            return;
                        }
                    }
                })
                .catch(err => {
                    console.log(`DELETE_ARTIST_VERIFICATION_REQUEST_COMMENTS, ${err}`);
                }).finally(() => {
                    this.loading = false;
                });
        },
        async loadMore () {
            this.loading = true;

            const params = {
                artistVerificationRequest: this.verificationRequest['@id'],
                itemsPerPage: 5,
                'order[id]': 'desc'
            };

            if (this.LAST_ARTIST_VERIFICATION_COMMENT_ID) {
                params['id[lt]'] = this.LAST_ARTIST_VERIFICATION_COMMENT_ID;
            }

            return this.GET_ARTIST_VERIFICATION_COMMENTS(params)
                .then(() => {
                    this.commentsList = [...this.commentsList, ...this.ARTIST_VERIFICATION_COMMENTS];
                })
                .catch(err => {
                    console.log(`GET_ARTIST_VERIFICATION_REQUEST_COMMENTS, ${err}`);
                }).finally(() => {
                    this.loading = false;
                });
        },
    },
    computed: {
        ...mapGetters([
            'AUTH_DATA',
            'ARTIST_VERIFICATION_COMMENTS',
            'COUNT_ARTIST_VERIFICATION_COMMENTS',
            'LAST_ARTIST_VERIFICATION_COMMENT_ID',
            'COUNT_REMAINING_ARTIST_VERIFICATION_COMMENTS'
        ]),
    },
    async created() {
        this.CLEAN_COMMENTS();
        await this.loadMore();
        this.totalItems = this.COUNT_ARTIST_VERIFICATION_COMMENTS;
    },
}
</script>

<style lang="scss">
@import 'src/assets/styles/components/verificationComments';
</style>
