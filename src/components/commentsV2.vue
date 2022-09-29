<template>
    <div class="comments_container">
        <div class="head_comments">
            <h3>Comments <span class="count" v-if="countComments">{{ countComments }}</span></h3>
            <div class="comments_filter">

                <div class="sort_by">
                    <span>Sort by</span>

                    <v-menu
                        :close-on-content-click="true"
                        offset-y
                        nudge-left="0"
                        nudge-bottom="-3"
                        origin="top center"
                        content-class="yankees"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <button type="button" class="sort_by_btn" v-bind="attrs" v-on="on" aria-role="list">
                                {{ALBUM_COMMENTS_ORDER_BY}}
                                <span></span>
                            </button>
                        </template>
                        <v-list class="sort_by_list">
                            <v-list-item
                                v-for="(item, index) in sortByComments" :key="index">
                                <button type="button" v-ripple @click="selectSortBy(item)">{{ item }}</button>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                </div>


            </div>
        </div>

        <v-progress-circular v-if="loader"
                             class="loader_comments"
                             :size="100"
                             :width="3"
                             color="#20C4F5"
                             indeterminate
        ></v-progress-circular>

        <!-- Create Comment -->
        <div class="wrap_textarea" :class="{'disable': allowCreateComment === false}">
            <v-progress-linear
                :active="createLoader"
                indeterminate
                rounded
                color="#20c4f5"
            ></v-progress-linear>

            <TextareaAutosize
                class="add_comment"
                :min-height="100"
                :max-height="500"
                v-model="commentText"
                :readonly="allowCreateComment === false"
                @keyup.enter.exact.native="createComment"
                @keydown.enter.shift.exact.native="newline"
                placeholder="Add a comment"
                onmouseout="this.blur();"
            />
            <dialogNeedLogin v-model="dialogNeedLoginVisible"></dialogNeedLogin>
        </div>

        <!-- List Comment -->
        <div class="item_c" v-for="comment of commentsList" :key="comment.id">
            <router-link class="ava" :to="{name: 'user-profile', params: {id: comment.owner.id}}" target="_blank">
                <img :src="`${apiUrl.slice(0, -1)}/media/resolve/menu/${comment.owner.photo.contentName}`" alt="">
            </router-link>
            <div class="body_c">
                <router-link class="writer_name" :to="{name: 'user-profile', params: {id: comment.owner.id}}" target="_blank">
                    {{ comment.owner.firstName }} {{ comment.owner.lastName }} {{comment.id}}
                </router-link>
                <div class="comment_text" v-if="currentEditComment === comment.id">
                    <TextareaAutosize
                        v-model="comment.text"
                        :readonly="allowEditComment === false"
                        @keyup.enter.exact.native="editComment(comment.id, comment.text)"
                        @keydown.enter.shift.exact.native="newline"
                    />
                </div>
                <div v-else class="comment_text">
                    {{ comment.text }}
                </div>
                <button class="more">
                    <v-menu
                        transition="slide-y-transition"
                        :close-on-content-click="true"
                        offset-y
                        nudge-left="25"
                        nudge-bottom="10"
                        origin="top center"
                        content-class="menu-pointer charcoal">
                        <template v-slot:activator="{ on, attrs }">
                            <span class="material-icons" v-bind="attrs" v-on="on">more_horiz</span>
                        </template>
                        <v-list class="playlists">
                            <!-- comment owner -->
                            <template v-if="Object.entries(PROFILE_DATA).length !== 0">
                                <v-list-item v-if="PROFILE_DATA.id === comment.owner.id" class="edit-comment" @click="viewEditComment(comment.id)">
                                    Edit
                                </v-list-item>
                            </template>
                            <v-list-item disabled class="report" @click="reportComment()">
                                Report
                            </v-list-item>
                            <!-- ADMIN || comment owner -->
                            <template v-if="Object.entries(PROFILE_DATA).length !== 0">
                                <v-list-item v-if="PROFILE_DATA.id === comment.owner.id || isRoleAdmin === true" class="remove" @click="removeComment(comment)">
                                    Remove
                                </v-list-item>
                            </template>
                        </v-list>
                    </v-menu>
                </button>
                <button type="button" class="on_like" v-if="comment.isLiked === false" @click="addLike(comment)" v-ripple >
                    <span class="material-icons">thumb_up_off_alt</span>
                    <span class="count_likes" v-if="comment.likeCount">{{comment.likeCount}}</span>
                </button>
                <button type="button" class="on_like" v-if="comment.isLiked === true" @click="removeLike(comment)" v-ripple >
                    <span class="material-icons" v-if="comment.isLiked === true">thumb_up</span>
                    <span class="count_likes">{{comment.likeCount}}</span>
                </button>
            </div>
            <v-progress-circular v-if="editLoading === true && currentEditComment === comment.id"
                                 :width="3"
                                 :size="70"
                                 indeterminate
                                 color="#20c4f5"
            ></v-progress-circular>
        </div>

        <div class="wrap_show_more" v-if="commentsList.length < countComments">
            <span class="line"></span>
            <button class="show_more" @click="show_more_comments" v-ripple>Show More</button>
            <span class="line"></span>
        </div>


    </div>


</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {minLength, required} from 'vuelidate/lib/validators';
import dialogNeedLogin from '../components/dialogs/needLogin';

export default {
    name: 'CommentsV2',
    props: ['albumID'],
    components: {
        dialogNeedLogin,
    },
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            loader: false,

            commentText: '',
            currentEditComment: null,
            createLoader: false,
            editLoading: false,
            page: 1,
            allowCreateComment: true,
            allowEditComment: true,
            isRoleAdmin: false,
            dialogNeedLoginVisible: false,
            sortByComments: [
                'Newest',
                'Popular'
            ],

            commentsList: [],
            countComments: '',
            firstPage: true
        };
    },
    watch: {
        albumID() {
            this.getComments(this.albumID);
        },
        ALBUM_COMMENTS_ORDER_BY() {
            this.commentsList = [];
            this.page = 1;
            this.getComments(this.albumID);
        }
    },
    validations: {
        commentText: {
            required,
            minLength: minLength(8),
        }
    },
    computed: {
        ...mapGetters([
            'ALBUM_COMMENTS',
            'ALBUM_COUNT_COMMENTS',
            'ALBUM_COMMENTS_ORDER_BY',
            'COMMENT',
            'COMMENTS',
            'LOADED_COMMENTS',
            'COUNT_COMMENTS',
            'CREATE_COMMENT_DATA',
            'EDIT_COMMENT_STATUS',
            'DELETE_COMMENT_STATUS',
            'PROFILE_DATA',
            'AUTH_DATA']),
    },
    mounted() {
        if (this.AUTH_DATA.accessToken && this.AUTH_DATA.userRoles.includes('ROLE_ADMIN')) {
            if (!Object.entries(this.PROFILE_DATA).length) {
                this.GET_PROFILE().then(() => {
                    this.isRoleAdmin = true;
                })
            }
        }
        this.getComments(this.albumID);
    },
    methods: {
        ...mapActions([
            'GET_ALBUM_COMMENTS',
            'GET_COMMENT',
            'CREATE_COMMENT',
            'EDIT_COMMENT',
            'DELETE_COMMENT',
            'ADD_LIKE_COMMENT',
            'DELETE_LIKE_COMMENT',
            'GET_PROFILE']),

        getComment(id) {
            this.GET_COMMENT(id);
        },
        getComments(id) {
            this.loader = true;

            let orderBy;
            if (this.ALBUM_COMMENTS_ORDER_BY === 'Newest') {
                orderBy = {'order[createdAt]': 'DESC'};
            }
            if (this.ALBUM_COMMENTS_ORDER_BY === 'Popular') {
                orderBy = {'order[likeCount]': 'DESC'};
            }

            let musicRelease = {musicRelease: id};
            let page = {page: this.page};
            let itemsPerPage = { itemsPerPage: 10}

            let params = Object.assign(musicRelease, orderBy, page, itemsPerPage, orderBy);

            this.GET_ALBUM_COMMENTS(params)
                .then(() => {
                    if (!this.commentsList.length) {
                        this.firstPage = true;
                        // console.log('firstPage1', this.firstPage);
                        this.commentsList = [...this.commentsList, ...this.ALBUM_COMMENTS].slice(0, 3);
                    } else {
                        // console.log('firstPage2', this.firstPage);
                        if (this.firstPage === true) {
                            this.commentsList = [];
                        }
                        this.firstPage = false;
                        // if (this.commentsList.length === 3) {
                        //     this.commentsList = [];
                        // }
                        this.commentsList = [...this.commentsList, ...this.ALBUM_COMMENTS];
                        this.page += 1;
                    }
                    this.countComments = this.ALBUM_COUNT_COMMENTS;
                })
                .catch(err => console.error(`getComments, ${err}`))
                .finally(() => this.loader = false);
        },

        newline() {
            // this.commentText = `${this.commentText}\n`;
            // this.commentText += `\n`;
        },

        createComment() {
            if (!this.AUTH_DATA.accessToken) {
                this.dialogNeedLoginVisible = true;
                this.commentText = '';
            } else {
                if (this.commentText.length < 2) {
                    return;
                }
                if (this.allowCreateComment === true) {
                    this.allowCreateComment = false;
                    this.createLoader = true;
                    this.GET_PROFILE().then(() => {
                        const bodyComment = {
                            musicRelease: `/music_releases/${this.albumID}`,
                            owner: `users/${this.PROFILE_DATA.id}`,
                            text: this.commentText,
                        }
                        this.CREATE_COMMENT(bodyComment)
                            .then(() => {
                                this.GET_COMMENT(this.CREATE_COMMENT_DATA.id)
                                    .then(() => {
                                        this.commentsList.unshift(this.COMMENT);
                                        this.countComments += 1;
                                        this.commentText = '';
                                        this.createLoader = false;
                                        this.allowCreateComment = true;
                                    })
                                    .catch(err => {
                                        console.log(`CREATE_COMMENT-GET_COMMENT, ${err}`);
                                    })
                            })
                            .catch(err => {
                                this.allowCreateComment = true;
                                console.log(`create comment, ${err}`);
                            })
                    });
                }
            }
        },
        viewEditComment(id) {
            this.currentEditComment = id;
        },
        editComment(id, newTextComment) {
            if (this.allowEditComment === true) {
                this.allowEditComment = false;
                this.editLoading = true;

                this.EDIT_COMMENT({id: id, text: newTextComment})
                    .then(() => {
                        this.currentEditComment = null;
                        this.editLoading = false;
                        this.allowEditComment = true;
                    })
                    .catch(err => {
                        this.allowEditComment = true;
                        console.log('editComment', err);
                    });
            }

        },
        removeComment(comment) {
            this.DELETE_COMMENT(comment.id)
                .then(() => {
                    let index = this.commentsList.indexOf(comment);
                    if (index > -1) {
                        this.commentsList.splice(index, 1);
                        this.countComments -= 1;
                    }
                })
                .catch(err => {
                    console.log(`delete comment, ${err}`);
                })
        },
        reportComment() {

        },
        show_more_comments() {
            this.getComments(this.albumID);
        },
        selectSortBy(item) {
            this.$store.commit('SET_ALBUM_COMMENTS_ORDER_BY', item);
        },
        addLike(comment) {
            if (comment.likeCount === undefined) {
                comment.likeCount = 0;
            }
            comment.likeCount += 1;
            comment.isLiked = true;

            this.ADD_LIKE_COMMENT(comment.id).catch(err => console.error(`addLike, ${err}`));
        },
        removeLike(comment) {
            comment.likeCount -= 1;
            comment.isLiked = false;
            this.DELETE_LIKE_COMMENT(comment.id).catch(err => console.error(`removeLike, ${err}`));
        },
    },
};
</script>
