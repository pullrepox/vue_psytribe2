import axios from 'axios';

export default {
    state: {
        comments: [],
        countComments: 0,
        countRemainingComments: 0,
        lastFetchedId: null,
    },
    mutations: {
        SET_ARTIST_VERIFICATION_COMMENTS: (state, data) => {
            state.comments = data['hydra:member'];
            state.countRemainingComments = data['hydra:totalItems'] > 5 ? data['hydra:totalItems'] - 5 : 0;

            if (!state.countComments) {
                state.countComments = data['hydra:totalItems'];
            }

            state.lastFetchedId = state.comments.length > 0 ? state.comments[state.comments.length - 1]['id'] : null;
        },
        RESET_STATE: (state) => {
            state.comments = [];
            state.countRemainingComments = 0;
            state.countComments = 0;
            state.lastFetchedId = null;
        },
    },
    actions: {
        CLEAN_COMMENTS({commit}) {
            commit('RESET_STATE');
        },
        GET_ARTIST_VERIFICATION_COMMENTS({commit}, params) {
            return axios.get(`artist_verification_request_comments`, {params: params})
                .then(response => {
                    commit('SET_ARTIST_VERIFICATION_COMMENTS', response.data);
                })
                .catch(err => {
                    console.log(`GET_ARTIST_VERIFICATION_COMMENTS ${err}`);
                })
        },
        ADD_ARTIST_VERIFICATION_COMMENT({commit}, data) {
            return axios.post(`artist_verification_request_comments`, data)
                .catch(err => {
                    console.log(`ADD_ARTIST_VERIFICATION_COMMENT ${err}`);
                })
        },
        DELETE_ARTIST_VERIFICATION_COMMENT({commit}, id) {
            return axios.delete(`artist_verification_request_comments/${id}`)
                .catch(err => {
                    console.log(`DELETE_ARTIST_VERIFICATION_COMMENT ${err}`);
                })
        },
    },
    getters: {
        ARTIST_VERIFICATION_COMMENTS: state => state.comments,
        COUNT_ARTIST_VERIFICATION_COMMENTS: state => state.countComments,
        COUNT_REMAINING_ARTIST_VERIFICATION_COMMENTS: state => state.countRemainingComments,
        LAST_ARTIST_VERIFICATION_COMMENT_ID: state => state.lastFetchedId,
    }
}
