import axios from 'axios';

const initialState = () => ({
    artist: [],
    artists: [],
    countArtists: '',
    artistsCurrentPage: 1,
    artistAlbums: [],
    userArtists: [],
    yourArtists: [],
    changeArtistDataStatus: '',
    artistOwner: '',
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
        SET_ARTIST: (state, data) => {
            state.artist = data;
        },
        SET_ARTISTS: (state, data) => {
            state.artists = data['hydra:member'];
            state.countArtists = data['hydra:totalItems'];
        },
        SET_ARTISTS_CURRENT_PAGE: (state, data) => {
            state.artistsCurrentPage = data;
        },
        SET_ARTIST_ALBUMS: (state, data) => {
            state.artistAlbums = data;
        },
        SET_USER_ARTISTS: (state, data) => {
          state.userArtists = data;
        },
        SET_YOUR_ARTISTS: (state, data) => {
            state.yourArtists = data;
        },

        SET_CHANGE_ARTIST_DATA: (state, data) => {
            state.changeArtistDataStatus = data;
        },
        SET_ARTIST_OWNER: (state, data) => {
            state.artistOwner = data;
        }
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        CLEAN_ARTISTS({commit}) {
            let empty = {
                'hydra:member': [],
                'hydra:totalItems': ''
            }
            commit('SET_ARTISTS', empty);
        },
        GET_ARTIST({commit}, id) {
            commit('SET_ARTIST', []);
            return axios.get(`artists/${id}`)
                .then(artist => {
                    commit('SET_ARTIST', artist.data);
                })
                .catch(error => console.log(`GET_ARTIST ${error}`));
        },
        GET_ARTISTS({commit}, params) {
            return axios.get(`artists`, {params: params})
                .then(response => {
                    commit('SET_ARTISTS', response.data);
                })
                .catch(err => {
                    console.log(`GET_ARTISTS ${err}`);
                })
        },
        CHANGE_ARTIST_DATA({commit}, artist) {
            return axios.patch(`artists/${artist.id}`, artist, {headers: {'Content-Type': 'application/merge-patch+json'}})
                .then(() => {
                    commit('SET_CHANGE_ARTIST_DATA', 'success');
                })
                .catch(err => {
                    commit('SET_CHANGE_ARTIST_DATA', 'error');
                    console.log(`CHANGE_ARTIST_DATA ${err}`);
                })
        },
        GET_ARTIST_ALBUMS({commit}, params) {
            commit('SET_ARTIST_ALBUMS', []);
            return axios.get(`music_releases`, {params: params})
                .then(artistAlbums => {
                    commit('SET_ARTIST_ALBUMS', artistAlbums.data['hydra:member'])
                })
                .catch(error => console.log(`GET_ARTIST_ALBUMS ${error}`));
        },
        GET_ARTIST_OWNER({commit}, userID) {
            commit('SET_ARTIST_OWNER', '');
            return axios.get(`users/${userID}`)
                .then(user => {
                    commit('SET_ARTIST_OWNER', user.data)
                })
                .catch(err => console.log(`GET_USER ${err}`));
        },


        ///
        GET_USER_ARTISTS({commit}, params) {
            commit('SET_USER_ARTISTS', []);
            return axios.get(`artists`, {params: params})
                .then(artists => {
                    commit('SET_USER_ARTISTS', artists.data['hydra:member']);
                })
                .catch(err => console.log(`GET_USER_ARTISTS, ${err}`))
        },
        GET_YOUR_ARTISTS({commit}, params) {
            return axios.get(`artists`, {params: params})
                .then(artists => {
                    console.log('artists.data[\'hydra:member\']', artists.data['hydra:member']);
                    commit('SET_YOUR_ARTISTS', artists.data['hydra:member']);
                })
                .catch(err => console.log(`GET_YOUR_ARTISTS, ${err}`))
        }
    },
    getters: {
        ARTIST: state => state.artist,
        ARTISTS: state => state.artists,
        COUNT_ARTISTS: state => state.countArtists,
        ARTISTS_CURRENT_PAGE: state => state.artistsCurrentPage,
        ARTIST_ALBUMS: state => state.artistAlbums,
        USER_ARTISTS: state => state.userArtists,
        YOUR_ARTISTS: state => state.yourArtists,
        CHANGE_ARTIST_DATA_STATUS: state => state.changeArtistDataStatus,
        ARTIST_OWNER: state => state.artistOwner,
    }
}
