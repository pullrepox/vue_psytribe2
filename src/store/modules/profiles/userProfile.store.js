import axios from 'axios';

const initialState = () => ({
    profileUser: {},
    userUploadedAlbums: [],
    userRecentlyLikedAlbums: [],
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
        SET_PROFILE_USER: (state, data) => {
            state.profileUser = data;
        },
        SET_USER_UPLOADED_ALBUMS: (state, data) => {
            state.userUploadedAlbums = data;
        },
        SET_USER_RECENTLY_LIKED_ALBUMS: (state, data) => {
            state.userRecentlyLikedAlbums = data;
        },
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },

        GET_PROFILE_USER({commit}, userID) {
            commit('SET_PROFILE_USER', {});
            return axios.get(`users/${userID}`)
                .then(user => {
                    commit('SET_PROFILE_USER', user.data)
                })
                .catch(err => console.log(`GET_PROFILE_USER ${err}`));
        },
        GET_USER_UPLOADED_ALBUMS({commit}, params) {
            commit('SET_USER_UPLOADED_ALBUMS', []);
            return axios.get('music_releases', {params: params})
                .then(response => {
                    commit('SET_USER_UPLOADED_ALBUMS', response.data['hydra:member']);
                })
                .catch(err => console.log(`GET_USER_UPLOADED_ALBUMS ${err}`));
        },
        GET_USER_RECENTLY_LIKED_ALBUMS({commit}, params) {
            commit('SET_USER_RECENTLY_LIKED_ALBUMS', []);
            return axios.get(`public_favorite_song/${params.user}`)
                .then(response => {
                    console.log('response', response);
                    commit('SET_USER_RECENTLY_LIKED_ALBUMS', response.data);
                })
                .catch(err => console.log(`GET_USER_RECENTLY_LIKED_ALBUMS ${err}`))
        },
    },

    getters: {
        PROFILE_USER: state => state.profileUser,
        USER_UPLOADED_ALBUMS: state => state.userUploadedAlbums,
        USER_RECENTLY_LIKED_ALBUMS: state => state.userRecentlyLikedAlbums,
    }
}
