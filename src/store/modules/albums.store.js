import axios from 'axios';

const initialState = () => ({
    // album
    album: {},
    editAlbumID: '',

    // albums
    albums: [],
    loadedAlbums: [],

    // favorite albums
    favoriteAlbums: [],
    loadedFavoriteAlbums: [],
    favoriteAlbumList: [],

    // other
    showColumns: [
        'title',
        'artist',
        'rating',
        'released'
    ],
    viewAlbums: 'grid',

    countAlbums: '',
    albumExpanded: '',

    // rating
    albumRating: ''
});

export default {
    state: initialState(),
    mutations: {  // sync
        RESET(state) {
            const newState = initialState();
            Object.keys(newState).forEach(key => {
                state[key] = newState[key]
            });
        },
        // ALBUM
        SET_ALBUM_TO_STATE: (state, album) => {
            state.album = album;
        },
        SET_EDIT_ALBUM_ID: (state, id) => {
            state.editAlbumID = id;
        },

        // ALBUMS
        SET_ALBUMS_TO_STATE: (state, albums) => {
            state.albums = albums;
        },

        SET_SHOW_COLUMNS: (state, columns) => {
            state.showColumns = columns;
        },
        SET_VIEW_ALBUMS: (state, view) => {
          state.viewAlbums = view;
        },
        SET_ALBUM_EXPANDED: (state, albumID) => {
            state.albumExpanded = albumID;
        },

        // rating
        SET_ALBUM_RATING: (state, albumRating) => {
            state.albumRating = albumRating;
        }
    },
    actions: { // async
        reset({ commit }) {
            commit('RESET');
        },
        // ALBUM
        GET_ALBUM({commit}, id) {
            return axios.get(`music_releases/${id}`)
                .then((album) => {
                    commit('SET_ALBUM_TO_STATE', album.data);
                })
                .catch((error) => {
                    console.log(`GET_ALBUM ${error}`);
                });
        },
        CHANGE_ALBUM_TAGS({commit}, params) {
            return axios.patch(`music_releases/${params.id}`,  params, {headers: {'Content-Type': 'application/merge-patch+json'}})
                .then(() => {
                    console.log('CHANGE_ALBUM_TAGS - success');
                })
                .catch(err => console.log(`CHANGE_ALBUM_TAGS ${err}`))
        },

        // ALBUMS
        GET_ALBUMS({commit}, params) {
            commit('SET_ALBUMS_TO_STATE', []);
            return axios.get('music_releases', {params: params})
                .then(albums => {
                    commit('SET_ALBUMS_TO_STATE', albums.data['hydra:member']);
                    // albums.data[hydra:totalItems]
                })
                .catch(error => console.log(`GET_ALBUMS ${error}`));
        },

        // RATING
        ADD_ALBUM_RATING({commit}, params) {
            return axios.post(`album_rating/${params.albumID}`, {'value': params.rating})
                .then(() => {
                    console.log('ADD_ALBUM_RATING', params);
                })
                .catch(error => console.log(`ADD_ALBUM_RATING ${error}, ${params}`));
        },
        GET_ALBUM_RATING({commit}, albumID) {
            return axios.get(`album_rating/${albumID}`)
                .then(() => {
                    commit('SET_ALBUM_RATING');
                })
                .catch(err => {
                    console.log(`GET_ALBUM_RATING ${err}`)
                })
        }
    },
    getters: {
        // ALBUM
        ALBUM: state => state.album,
        EDIT_ALBUM_ID: state => state.editAlbumID,

        // ALBUMS
        ALBUMS: state => state.albums,

        // other
        SHOW_COLUMNS: state => state.showColumns,
        VIEW_ALBUMS: state => state.viewAlbums,
        ALBUM_EXPANDED: state => state.albumExpanded,

        // rating
        ALBUM_RATING: state => state.albumRating,
    }
}
