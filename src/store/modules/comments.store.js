import axios from 'axios';

const initialState = () => ({
        comment: {},
        comments: [],
        loadedComments: [],
        countComments: '',

        albumComments: [],
        albumCountComments: '',
        albumCommentsOrderBy: 'Newest',

        createCommentData: '',
        editCommentStatus: '',
        deleteCommentStatus: '',
});

export default {
    state: initialState(),

    mutations: {
        RESET(state) {
            const newState = initialState();
            Object.keys(newState).forEach(key => {
                state[key] = newState[key]
            });
        },
        SET_COMMENT: (state, data) => {
            state.comment = data;
        },
        SET_ALBUM_COMMENTS: (state, data) => {
            state.albumComments = data['hydra:member'];
        },
        SET_ALBUM_COUNT_COMMENTS: (state, data) => {
            state.albumCountComments = data['hydra:totalItems'];
        },


        SET_CREATE_COMMENT_DATA: (state, data) => {
            state.createCommentData = data;
        },
        SET_EDIT_COMMENT_STATUS: (state, data) => {
            state.editCommentStatus = data;
        },
        SET_DELETE_COMMENT_STATUS: (state, data) => {
            state.deleteCommentStatus = data;
        },

        SET_ALBUM_COMMENTS_ORDER_BY: (state, orderBy) => {
            state.albumCommentsOrderBy = orderBy;
        }

        // SET_COMMENTS: (state, data) => {
        //     state.comments = data;
        // },
        // SET_COUNT_COMMENTS: (state, data) => {
        //   state.countComments = data;
        // },
        // SET_LOAD_COMMENTS_TO_STATE: (state, comments) => { // one page
        //     state.loadedComments = comments['hydra:member'];
        //     state.countComments = comments['hydra:totalItems'];
        // },
        // SET_LOADED_COMMENTS_TO_STATE: (state, comments) => { // more one page
        //     Array.prototype.push.apply(state.loadedComments, comments['hydra:member']);
        //     state.countComments = comments['hydra:totalItems'];
        // },
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        GET_COMMENT({commit}, id) {
            return axios.get(`comments/${id}`,)
                .then((response) => {
                    commit('SET_COMMENT', response.data);
                })
                .catch(err => {
                    console.log(`GET_COMMENT ${err}`);
                })
        },
        GET_ALBUM_COMMENTS({commit}, params) {
            return axios.get(`comments`, {params: params})
                .then((response) => {
                    commit('SET_ALBUM_COMMENTS', response.data);
                    commit('SET_ALBUM_COUNT_COMMENTS', response.data);
                })
                .catch(err => console.log(`GET_ALBUM_COMMENTS ${err}`));
        },
        // GET_COMMENTS({commit}, params) {
        //     return axios.get('comments', {params: params})
        //         .then((response) => {
        //             commit('SET_COMMENTS', response.data['hydra:member']);
        //             commit('SET_COUNT_COMMENTS', response.data['hydra:totalItems']);
        //         })
        //         .catch(err => {
        //             console.log(`GET_COMMENTS ${err}`);
        //         })
        // },
        // GET_LOADED_COMMENTS({commit}, params) {
        //     if (params.page === 1) {
        //         commit('SET_LOAD_COMMENTS_TO_STATE', []);
        //         return axios.get('comments', {params: params})
        //             .then((response) => {
        //                 commit('SET_LOAD_COMMENTS_TO_STATE', response.data);
        //             })
        //             .catch(err => {
        //                 console.log(`GET_LOADED_COMMENTS ${err}`);
        //             })
        //     } else {
        //         return axios.get('comments', {params: params})
        //             .then((response) => {
        //                 commit('SET_LOADED_COMMENTS_TO_STATE', response.data);
        //             })
        //             .catch(err => {
        //                 console.log(`GET_LOADED_COMMENTS ${err}`);
        //             })
        //     }
        // },
        CREATE_COMMENT({commit}, comment) {
            return axios.post(`comments`, comment)
                .then((response) => {
                    commit('SET_CREATE_COMMENT_DATA', response.data);
                })
                .catch(err => {
                    console.log(`CREATE_COMMENT ${err}`);
                });
        },
        EDIT_COMMENT({commit}, comment) {
            return axios.patch(`comments/${comment.id}`, {'text': comment.text}, {headers: {'Content-Type': 'application/merge-patch+json'}})
                .then(() => {
                    commit('SET_EDIT_COMMENT_STATUS', 'success');
                })
                .catch((err) => {
                    console.log(`EDIT_COMMENT ${err}`);
                    commit('SET_EDIT_COMMENT_STATUS', 'failed');
                })
        },
        DELETE_COMMENT({commit}, id) {
            return axios.delete(`comments/${id}`)
                .then(() => {
                    // console.log(response);
                    // commit('SET_DELETE_COMMENT_STATUS', 'success');
                })
                .catch(err => {
                    commit('SET_DELETE_COMMENT_STATUS', 'failed');
                    console.log(`DELETE_COMMENT ${err}`);
                })
        },
        ADD_LIKE_COMMENT(commentID) {
            return axios.post(`comments/${commentID}/like`).catch(err => console.log(`ADD_LIKE_COMMENT ${err}`));
        },
        DELETE_LIKE_COMMENT(commentID) {
            return axios.delete(`comments/${commentID}/like`).catch(err => console.log(`DELETE_COMMENT ${err}`));
        }
    },
    getters: {
        ALBUM_COMMENTS: state => state.albumComments,
        ALBUM_COUNT_COMMENTS: state => state.albumCountComments,
        ALBUM_COMMENTS_ORDER_BY: state => state.albumCommentsOrderBy,
        COMMENT: state => state.comment,
        COMMENTS: state => state.comments,
        LOADED_COMMENTS: state => state.loadedComments,
        COUNT_COMMENTS: state => state.countComments,

        CREATE_COMMENT_DATA: state => state.createCommentData,
        EDIT_COMMENT_STATUS: state => state.editCommentStatus,
        DELETE_COMMENT_STATUS: state => state.deleteCommentStatus,
    }
}
