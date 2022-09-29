import axios from 'axios';

const initialState = () => ({
    playlists: [],
    playlist: {},
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
        SET_PLAYLISTS: (state, data) => {
            state.playlists = data;
        },
        SET_PLAYLIST: (state, data) => {
            state.playlist = data;
        },
        SET_DOWNLOAD_SONG_LINK: (state, data) => {
            state.downloadLink = data;
        },
        SET_DOWNLOAD_SONG_ERROR: (state, data) => {
            state.downloadLinkError = data;
        }
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        GET_PLAYLISTS({commit}, params) {
            return axios.get('favorite_music_release_list', {params: params})
                .then(data => {
                    commit('SET_PLAYLISTS', data.data.result);
                })
                .catch(error => console.log(`GET_PLAYLISTS ${error}`));
        },

        GET_PLAYLIST({commit}, params) {
            console.log(' userId, playlistId', params);
            return axios.get(`favorite_music_release_lists/${params.playlistId}`, params.id)
                .then(data => {
                    console.log('DTA-DTA-DATA', data);
                    // commit('SET_PLAYLIST', data.data['hydra:member']);
                })
                .catch(error => console.log(`GET_PLAYLIST ${error}`));
        },

        ADD_TRACK_TO_PLAYLISTS({commit}, params) {
            return axios.post('add_song_to_favorite_list', {
                'song_id': params.song_id,
                'favorite_list_id': params.favorite_list_id
            }).then(response => {
                console.log(`ADD_TRACK_TO_PLAYLISTS - ${params}, ${response}`);
            }).catch(err => {
                console.log(`ADD_TRACK_TO_PLAYLISTS - ${params}, ${err}`);
            });
        },

        CREATE_PLAYLIST({commit}, data, params) {
            return axios.post(`favorite_music_release_list`, data, {params: params})
                .catch(error => console.log(`CREATE_PLAYLIST ${error}, ${params}`));
        },
        DELETE_PLAYLIST({commit}, id) {
            return axios.delete(`favorite_music_release_list/${id}`)
                .catch(err => console.log(`DELETE_FAQ ${err}`));
        },
        GET_DOWNLOAD_SONG_LINK({commit}, params) {
            return axios.get(`/song/${params.songId}/download`)
                .then(response => {

                    if (response) {
                        console.log(response.data.link)
                        commit('SET_DOWNLOAD_SONG_ERROR', '');
                        commit('SET_DOWNLOAD_SONG_LINK', response.data.link);
                    }
                })
                .catch(err => {
                    console.log(`GET_DOWNLOAD_SONG_LINK ${err}`)
                    if (err.response) {
                        commit('SET_DOWNLOAD_SONG_ERROR', err.response.data.error);

                        console.log(err.response.data.error)

                    }
                    return Promise.reject(err);

                })
        }

    },
    getters: {
        PLAYLISTS: state => state.playlists,
        PLAYLIST: state => state.playlist,
        DOWNLOAD_SONG_LINK: state => state.downloadLink,
        DOWNLOAD_SONG_ERROR: state => state.downloadLinkError,
    }
}
