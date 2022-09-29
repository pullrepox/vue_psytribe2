import axios from 'axios';

const initialState = () => ({
    searchString: '',
    searchLoader: true,
    searchDetailsContent: '',

    // artists
    searchArtistsResult: [],
    searchCountArtists: '',
    searchArtistsCurrentPage: 1,

    // albums
    searchAlbumsResult: [],
    searchCountAlbums: '',
    searchAlbumsCurrentPage: 1,
    searchViewAlbums: 'grid',
    searchAlbumsOrderBy: {'order[releasedAt]': `DESC`},

    // tracks
    searchTracksResult: [],
    searchCountTracks: '',
    searchTracksCurrentPage: 1,
    searchTracksOrderBy: {'order[releasedAt]': `DESC`}
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
        UPDATE_SEARCH_STRING: (state, string) => {
            state.searchString = string;
        },
        UPDATE_SEARCH_DETAILS_CONTENT: (state, data) => {
          state.searchDetailsContent = data;
        },

        // artists
        SET_SEARCH_ARTISTS: (state, data) => {
            state.searchArtistsResult = data['hydra:member'];
            state.searchCountArtists = data['hydra:totalItems'];
        },
        SET_SEARCH_ARTISTS_CURRENT_PAGE: (state, data) => {
            state.searchArtistsCurrentPage = data;
        },


        // albums
        SET_SEARCH_ALBUMS: (state, data) => {
            state.searchAlbumsResult = data['hydra:member'];
            state.searchCountAlbums = data['hydra:totalItems'];
        },
        SET_SEARCH_VIEW_ALBUMS: (state, data) => {
            state.searchViewAlbums = data;
        },
        SET_SEARCH_ALBUMS_ORDER_BY: (state, orderBy) => {
            state.searchAlbumsOrderBy = orderBy;
        },
        SET_SEARCH_ALBUMS_CURRENT_PAGE: (state, data) => {
            state.searchAlbumsCurrentPage = data;
        },


        // tracks
        SET_SEARCH_TRACKS: (state, data) => {
            state.searchTracksResult = data['hydra:member'];
            state.searchCountTracks = data['hydra:totalItems'];
        },
        UPDATE_SEARCH_LOADER: (state, data) => {
            state.searchLoader = data;
        },
        SET_SEARCH_TRACKS_ORDER_BY: (state, orderBy) => {
          state.searchTracksOrderBy = orderBy;
        },
        SET_SEARCH_TRACKS_CURRENT_PAGE: (state, data) => {
            state.searchTracksCurrentPage = data;
        }
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        CLEAN_SEARCH_RESULT({commit}) {
            let empty = {
                'hydra:member': [],
                'hydra:totalItems': ''
            }
            commit('SET_SEARCH_ARTISTS', empty);
            commit('SET_SEARCH_ALBUMS', empty);
            commit('SET_SEARCH_TRACKS', empty);
        },
        SEARCH_ARTISTS({commit}, params) {
            let source = JSON.parse(localStorage.getItem('DataSource'));
            let elasticPath = `search/`;
            if (!source || !source.db || source.db === 'api') {
                elasticPath = ``;
            }
            return axios.get(`${elasticPath}artists`, {params: params})
                .then(response => {
                    if (!response.data && source.auto === true) {

                        // return data from api
                        return axios.get(`artists`, {params: params})
                            .then(response => {
                                commit('SET_SEARCH_ARTISTS', response.data);
                            })
                            .catch(err => {
                                console.log(`SEARCH_ARTISTS ${err}`);
                            })

                    } else {
                        commit('SET_SEARCH_ARTISTS', response.data);
                    }
                })
                .catch(err => {
                    console.log(`SEARCH_ARTISTS ${err}`);
                })
        },
        SEARCH_ALBUMS({commit}, params) {
            let source = JSON.parse(localStorage.getItem('DataSource'));
            let elasticPath = `search/`;
            if (!source || !source.db || source.db === 'api') {
                elasticPath = ``;
            }
            return axios.get(`${elasticPath}music_releases`, {params: params})
                .then(response => {
                        if (!response.data && source.auto === true) {

                            // return data from api
                            return axios.get(`music_releases`, {params: params})
                                .then(response => {
                                    commit('SET_SEARCH_ALBUMS', response.data);
                                })
                                .catch(err => {
                                    console.log(`SEARCH_ALBUMS ${err}`);
                                })

                        } else {
                            commit('SET_SEARCH_ALBUMS', response.data);
                        }
                })
                .catch(err => {
                    console.log(`SEARCH_ALBUMS ${err}`);
                })
        },
        SEARCH_TRACKS({commit}, params) {
            let source = JSON.parse(localStorage.getItem('DataSource'));
            let elasticPath = `search/`;
            if (!source || !source.db || source.db === 'api') {
                elasticPath = ``;
            }
            console.log('elasticPath', elasticPath);
            return axios.get(`${elasticPath}songs`, {params: params})
                .then(response => {
                    if (!response.data && source.auto === true) {
                        // return data from api
                        return axios.get(`songs`, {params: params})
                            .then(response => {
                                commit('SET_SEARCH_TRACKS', response.data);
                            })
                            .catch(err => {
                                console.log(`SEARCH_TRACKS ${err}`);
                            })

                    } else {
                        commit('SET_SEARCH_TRACKS', response.data);
                    }
                })
                .catch(err => {
                    console.log(`SEARCH_TRACKS ${err}`);
                })
        },
        UPDATE_SEARCH_ALBUMS_ORDER_BY: ({commit}, orderBy) => {
            commit('SET_SEARCH_ALBUMS_ORDER_BY', orderBy);
        },
    },
    getters: {
        SEARCH_STRING: state => state.searchString,
        SEARCH_LOADER: state => state.searchLoader,
        SEARCH_DETAILS_CONTENT: state => state.searchDetailsContent,

        // Artists
        SEARCH_ARTISTS_RESULT: state => state.searchArtistsResult,
        SEARCH_COUNT_ARTISTS: state => state.searchCountArtists,
        SEARCH_ARTISTS_CURRENT_PAGE: state => state.searchArtistsCurrentPage,

        // Albums
        SEARCH_ALBUMS_RESULT: state => state.searchAlbumsResult,
        SEARCH_COUNT_ALBUMS: state => state.searchCountAlbums,
        SEARCH_VIEW_ALBUMS: state => state.searchViewAlbums,
        SEARCH_ALBUMS_ORDER_BY: state => state.searchAlbumsOrderBy,
        SEARCH_ALBUMS_CURRENT_PAGE: state => state.searchAlbumsCurrentPage,

        // Tracks
        SEARCH_TRACKS_RESULT: state => state.searchTracksResult,
        SEARCH_COUNT_TRACKS: state => state.searchCountTracks,
        SEARCH_TRACKS_ORDER_BY: state => state.searchTracksOrderBy,
        SEARCH_TRACKS_CURRENT_PAGE: state => state.searchTracksCurrentPage,
    }

}
