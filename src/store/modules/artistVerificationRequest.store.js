import axios from 'axios';

export default {
    state: {
        request: [],
        requests: [],
        countRequests: 0,
        stats: 0,
    },
    mutations: {
        SET_ARTIST_VERIFICATION_REQUEST: (state, data) => {
            state.request = data;
        },
        SET_ARTIST_VERIFICATION_REQUESTS: (state, data) => {
            state.requests = data['hydra:member'];
            state.countRequests = data['hydra:totalItems'];
        },
        SET_ARTIST_VERIFICATION_STATS: (state, data) => {
            state.stats = data['result'];
        },
    },
    actions: {
        GET_ARTIST_VERIFICATION_REQUEST({commit}, id) {
            commit('SET_ARTIST_VERIFICATION_REQUEST', {});
            return axios.get(`artist_verification_requests/${id}`)
                .then(response => {
                    commit('SET_ARTIST_VERIFICATION_REQUEST', response.data);
                })
                .catch(error => console.log(`GET_ARTIST_VERIFICATION_REQUEST ${error}`));
        },
        GET_ARTIST_VERIFICATION_REQUESTS({commit}, params) {
            return axios.get(`artist_verification_requests`, {params: params})
                .then(response => {
                    commit('SET_ARTIST_VERIFICATION_REQUESTS', response.data);
                })
                .catch(err => {
                    console.log(`GET_ARTIST_VERIFICATION_REQUESTS ${err}`);
                })
        },
        ADD_ARTIST_VERIFICATION_REQUEST({commit}, data) {
            return axios.post(`artist_verification_requests`, data)
                .catch(err => {
                    console.log(`ADD_ARTIST_VERIFICATION_REQUEST ${err}`);
                })
        },
        PATCH_ARTIST_VERIFICATION_REQUEST({commit}, data) {
            return axios.patch(`artist_verification_requests/${data.id}`, data, {headers: {'Content-Type': 'application/merge-patch+json'}})
                .catch(err => {
                    console.log(`PATCH_ARTIST_VERIFICATION_REQUEST ${err}`);
                })
        },
        GET_ARTIST_VERIFICATION_STATS({commit}, params) {
            return axios.get(`artist_verification_statistic`, {params: params})
                .then(response => {
                    commit('SET_ARTIST_VERIFICATION_STATS', response.data);
                })
                .catch(err => {
                    console.log(`GET_ARTIST_VERIFICATION_STATS ${err}`);
                })
        },
    },
    getters: {
        ARTIST_VERIFICATION_REQUEST: state => state.request,
        ARTIST_VERIFICATION_REQUESTS: state => state.requests,
        COUNT_ARTIST_VERIFICATION_REQUESTS: state => state.countRequests,
        ARTIST_VERIFICATION_STATS: state => state.stats,
    }
}
