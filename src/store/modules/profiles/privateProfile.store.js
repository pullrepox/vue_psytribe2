import axios from 'axios';

const initialState = () => ({
    privateProfileUploadedAlbums: [],
    privateProfileRecentlyPlayedAlbums: [],
    privateProfileRecentlyLikedAlbums: []
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
        SET_PRIVATE_PROFILE_UPLOADED_ALBUMS: (state, data) => {
            state.privateProfileUploadedAlbums = data;
        },
        SET_PRIVATE_PROFILE_RECENTLY_PLAYED_ALBUMS: (state, data) => {
            state.privateProfileRecentlyPlayedAlbums = data;
        },
        SET_PRIVATE_PROFILE_RECENTLY_LIKED_ALBUMS: (state, data) => {
            state.privateProfileRecentlyLikedAlbums = data;
        }
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },

        GET_PRIVATE_PROFILE_UPLOADED_ALBUMS({commit}, params) {
            return axios.get(`music_releases`, {params: params})
                .then(response => {
                    commit('SET_PRIVATE_PROFILE_UPLOADED_ALBUMS', response.data['hydra:member']);
                })
                .catch(err => console.log(`GET_PRIVATE_PROFILE_UPLOADED_ALBUMS, ${err}`))
        },
        GET_PRIVATE_PROFILE_RECENTLY_PLAYED_ALBUMS({commit}, params) {
            commit('SET_PRIVATE_PROFILE_RECENTLY_PLAYED_ALBUMS', []);
            return axios.get(`get_played_music_releases`, {params: params})
                .then(response => {
                    commit('SET_PRIVATE_PROFILE_RECENTLY_PLAYED_ALBUMS', response.data['hydra:member']);
                })
                .catch(err => console.log(`GET_PRIVATE_PROFILE_RECENTLY_PLAYED_ALBUMS ${err}`));
        },
        GET_PRIVATE_PROFILE_RECENTLY_LIKED_ALBUMS({commit}, params) {
            // return axios.get(`favorite_releases`, {params: params})
            return axios.get(`favorite_tracks`, {params: params})
                .then(response => {
                    commit('SET_PRIVATE_PROFILE_RECENTLY_LIKED_ALBUMS', response.data);
                })
                .catch(err => console.log(`GET_PRIVATE_PROFILE_RECENTLY_LIKED_ALBUMS ${err}`))
        },

    },

    getters: {
        PRIVATE_PROFILE_UPLOADED_ALBUMS: state => state.privateProfileUploadedAlbums,
        PRIVATE_PROFILE_RECENTLY_PLAYED_ALBUMS: state => state.privateProfileRecentlyPlayedAlbums,
        PRIVATE_PROFILE_RECENTLY_LIKED_ALBUMS: state => state.privateProfileRecentlyLikedAlbums
    }
}
