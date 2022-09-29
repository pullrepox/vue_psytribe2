import axios from 'axios';

const initialState = () => ({
    artistProfileReleasesAlbums: [],
    artistProfileAppearsOnAlbums: [],
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
        SET_ARTIST_PROFILE_RELEASES_ALBUMS: (state, data) => {
            state.artistProfileReleasesAlbums = data;
        },
        SET_ARTIST_PROFILE_APPEARS_ON_ALBUMS:  (state, data) => {
            state.artistProfileAppearsOnAlbums = data;
        }
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },

        GET_ARTIST_PROFILE_RELEASES_ALBUMS({commit}, params) {
           commit('SET_ARTIST_PROFILE_RELEASES_ALBUMS', []);
           return axios.get(`music_releases`, {params: params})
               .then(response => {
                   commit('SET_ARTIST_PROFILE_RELEASES_ALBUMS', response.data['hydra:member'])
               })
               .catch(error => console.log(`GET_ARTIST_PROFILE_RELEASES_ALBUMS ${error}`));
       },
        GET_ARTIST_PROFILE_APPEARS_ON_ALBUMS({commit}, params) {
            commit('SET_ARTIST_PROFILE_APPEARS_ON_ALBUMS', []);
            return axios.get(`music_releases`, {params: params})
                .then(response => {
                    commit('SET_ARTIST_PROFILE_APPEARS_ON_ALBUMS', response.data['hydra:member']);
                })
                .catch(err => console.log(`GET_ARTIST_PROFILE_APPEARS_ON_ALBUMS ${err}`));
        },
    },
    getters: {
        ARTIST_PROFILE_RELEASES_ALBUMS: state => state.artistProfileReleasesAlbums,
        ARTIST_PROFILE_APPEARS_ON_ALBUMS: state => state.artistProfileAppearsOnAlbums
    }
}
