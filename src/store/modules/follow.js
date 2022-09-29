import axios from 'axios';

const initialState = () => ({
    followsLoader: false,
    followsFilter: false,
    followers: '',
    followings: '',
    customFollows: ''
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
        SET_FOLLOW_LOADER: (state, data) => {
          state.followsLoader = data;
        },
        SET_FOLLOWS_FILTER: (state, data) => {
          state.followsFilter = data;
        },
        SET_FOLLOWERS: (state, followers) => {
            state.followers = followers;
        },
        SET_FOLLOWINGS: (state, followings) => {
            state.followings = followings;
        },
        SET_CUSTOM_FOLLOWS: (state, data) => {
            state.customFollows = data;
        }
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        GET_FOLLOWERS({commit}, params) {
            commit('SET_FOLLOWERS', []);
            return axios.get(`social/followers`, {params: params})
                .then(faqs => {
                    commit('SET_FOLLOWERS', faqs.data['hydra:member'])
                })
                .catch(err => console.log(`GET_FOLLOWERS ${err}`));
        },
        GET_FOLLOWINGS({commit}, params) {
            commit('SET_FOLLOWINGS', []);
            return axios.get(`social/following`, {params: params})
                .then(faqs => {
                    commit('SET_FOLLOWINGS', faqs.data['hydra:member'])
                })
                .catch(err => console.log(`GET_FOLLOWINGS ${err}`));
        },
        GET_CUSTOM_FOLLOWS({commit}, params) {
            return axios.get(`social/following`, {params: params}) // :TODO - change patch
                .then(faqs => {
                    commit('SET_CUSTOM_FOLLOWS', faqs.data['hydra:member'])
                })
                .catch(err => console.log(`GET_CUSTOM_FOLLOWS ${err}`));
        },
        FOLLOW({commit}, id) {
            return axios.post(`social/${id}/follow`)
                .catch(err => console.log(`FOLLOW ${err}`))
        },
        UNFOLLOW({commit}, id) {
            return axios.post(`social/${id}/unfollow`)
                .catch(err => console.log(`FOLLOW ${err}`))
        }
    },
    getters: {
        FOLLOW_LOADER: state => state.followsLoader,
        FOLLOWS_FILTER: state => state.followsFilter,
        FOLLOWERS: state => state.followers,
        FOLLOWINGS: state => state.followings,
        CUSTOM_FOLLOWS: state => state.customFollows,
    }
}
