import axios from 'axios';

const initialState = () => ({
    tracks: [],
    countTracks: '',

    favoriteTracks: [],
    countFavoriteTracks: '',

    tracksCurrentPage: 1,
    tracksOrderBy: {
        'order[releasedAt]': 'DESC'
    },
    // other
    showColumnsTrack: [
        'title',
        'artist',
        'released',
        'bpm',
        'rating',
        'key'
    ],
    prepareAddTracks: [],
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
        SET_TRACKS: (state, data) => {
            state.tracks = data['hydra:member'];
            state.countTracks = data['hydra:totalItems'];
        },

        // SET_LOADED_TRACKS_TO_STATE: (state, tracks) => {
        //     Array.prototype.push.apply(state.loadedTracks, tracks['hydra:member']);
        //     state.countTracks = tracks['hydra:totalItems'];
        // },
        SET_TRACKS_ORDER_BY: (state, orderBy) => {
            state.tracksOrderBy = orderBy;
        },
        SET_SHOW_COLUMNS_TRACK: (state, columns) => {
            state.showColumnsTrack = columns;
        },
        SET_TRACKS_CURRENT_PAGE: (state, data) => {
            state.tracksCurrentPage = data;
        },
        SET_FAVORITE_TRACKS: (state, data) => {
            state.favoriteTracks = data['hydra:member'];
            state.countFavoriteTracks = data['hydra:totalItems'];
        },
        SET_PREPARE_ADD_TRACKS: (state, data) => {
            // state.prepareAddTracks.push(data);
            state.prepareAddTracks = data;
        },
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        CLEAN_TRACKS({commit}) {
            let empty = {
                'hydra:member': [],
                'hydra:totalItems': ''
            }
            commit('SET_TRACKS', empty);
        },
        ADD_TRACK_TO_FAVORITES({commit}, params) {
            return axios.post('add_favorite_song', {'song_id': params.song_id, 'music_release_id':params.album_id})
                .catch(err => console.log(`ADD_TRACK_TO_FAVORITES, ${err}`));

        },
        REMOVE_TRACK_FROM_FAVORITES({commit}, params) {
            return axios.delete('remove_favorite_music_release',{data:{'song_id': params.song_id, 'music_release_id': params.album_id}})
                .catch(err => console.log(`REMOVE_ALBUM_FROM_FAVORITES ${err}`));
        },
        GET_TRACKS({commit}, params) {
            return axios.get('songs', {params: params})
                .then((response) => {
                    commit('SET_TRACKS', response.data);
                })
                .catch(err => {
                    console.log(`GET_TRACKS ${err}`);
                })
        },
        ADD_SONGS({commit}, data) {
            commit('SET_PREPARE_ADD_TRACKS', []);
            return axios.post(`songs`, data)
                .then(response => {
                    commit('SET_PREPARE_ADD_TRACKS', response.data);
                })
                .catch(err => console.log(`ADD_SONGS ${err}`))
        },
        SEND_TRACK({commit}, data) {
            console.log('SEND_TRACK data', data);
            return axios.post(`track_file_upload`, data, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(() => {
                    console.log(`SEND_TRACK - ok`, data);
                }).catch(err => {
                    console.log(`SEND_TRACK ${err}`);
                })
        },
        UPDATE_TRACKS_ORDER_BY: ({commit}, orderBy) => {
            commit('SET_TRACKS_ORDER_BY', orderBy);
        },

        GET_FAVORITE_TRACKS({commit}, params) {
            return axios.get('favorite_tracks', {params: params})
                .then(response => {
                    commit('SET_FAVORITE_TRACKS', response.data);
                })
                .catch(err => {
                    console.log(`SET_FAVORITE_TRACKS ${err}`);
                });
        }
    },
    getters: {
        TRACKS: state => state.tracks,
        COUNT_TRACKS: state => state.countTracks,

        FAVOURITE_TRACKS: state => state.favoriteTracks,
        COUNT_FAVOURITE_TRACKS: state => state.countFavoriteTracks,

        TRACKS_CURRENT_PAGE: state => state.tracksCurrentPage,
        TRACKS_ORDER_BY: state => state.tracksOrderBy,
        SHOW_COLUMNS_TRACK: state => state.showColumnsTrack,
        PREPARE_ADD_TRACKS: state => state.prepareAddTracks,
    }
}
