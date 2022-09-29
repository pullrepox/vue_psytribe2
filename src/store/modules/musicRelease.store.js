import axios from 'axios';


const initialState = () => ({
    musicRelease: [],
    recentlyPlayed: [],
    appearsOn: [],
    musicReleaseRating: '',
    countMusicRelease: '',
    albumsCurrentPage: 1,
    artistMusicReleases: [],
    albumsDynamicKey: 0,
    playedMusicRelease: [],
    downloadLink: '',
    SET_DOWNLOAD_ERROR: '',
    SET_CHECK_MUSIC_RELEASE_DOWNLOAD: '',
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
        // GET_MUSIC_RELEASE
        SET_MUSIC_RELEASE: (state, data) => {
            state.countMusicRelease = data['hydra:totalItems'];
            state.musicRelease = data['hydra:member'];
        },
        SET_RECENTLY_PLAYED: (state, data) => {
            state.recentlyPlayed = data;
        },
        SET_APPEARS_ON: (state, data) => {
            state.appearsOn = data;
        },
        SET_MUSIC_RELEASED_RATING: (state, data) => {
            state.musicReleaseRating = data;
        },
        SET_ALBUMS_CURRENT_PAGE: (state, data) => {
            state.albumsCurrentPage = data;
        },
        UPDATE_ALBUMS_DYNAMIC_KEY: (state, key) => {
            state.albumsDynamicKey = key;
        },
        SET_PLAYED_MUSIC_RELEASE: (state, data) => {
            state.playedMusicRelease = data;
        },
        SET_DOWNLOAD_LINK: (state, data) => {
            state.downloadLink = data;
        },
        SET_DOWNLOAD_ERROR: (state, data) => {
            state.downloadLinkError = data;
        },
        SET_CHECK_MUSIC_RELEASE_DOWNLOAD: (state, data) => {
            state.checkMusicReleaseDownload = data;
        }
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        CLEAN_MUSIC_RELEASE({commit}) {
            let empty = {
                'hydra:member': [],
                'hydra:totalItems': ''
            }
            commit('SET_MUSIC_RELEASE', empty);
        },
        GET_MUSIC_RELEASE({commit}, params) {
            return axios.get('music_releases', {params: params})
                .then(response => {
                    commit('SET_MUSIC_RELEASE', response.data);
                })
                .catch(error => console.log(`GET_MUSIC_RELEASE ${error}`));
        },
        GET_RECENTLY_PLAYED({commit}, params) {
            return axios.get(`music_releases`, {params: params})
            // return axios.get(`played_music_releases`, {params: params})
                .then(response => {
                    commit('SET_RECENTLY_PLAYED', response.data['hydra:member']);
                })
                .catch(err => console.log(`GET_RECENTLY_PLAYED ${err}`));
        },
        GET_APPEARS_ON({commit}, params) {
            return axios.get(`music_releases`, {params: params})
                .then(response => {
                    commit('SET_APPEARS_ON', response.data['hydra:member']);
                })
                .catch(err => console.log(`GET_APPEARS_ON ${err}`));
        },
        GET_MUSIC_RELEASED_RATING({commit}, musicReleaseID) {
            return axios.get(`music_release_rating/${musicReleaseID}`,)
                .then(response => {
                    commit('SET_MUSIC_RELEASED_RATING', response)
                    // commit('SET_APPEARS_ON', response.data['hydra:member']);
                })
                .catch(err => console.log(`GET_MUSIC_RELEASED_RATING ${err}`));
        },
        ADD_MUSIC_RELEASED_RATING({commit}, params) {
            return axios.post(`music_release_rating/${params.albumID}`, {'value': params.rating})
                .then(response => {
                    console.log(`ADD_MUSIC_RELEASED_RATING - ${params}, ${response}`);
                })
                .catch(err => {
                    console.log(`ADD_MUSIC_RELEASED_RATING - ${params}, ${err}`);
                })
        },
        ADD_MUSIC_RELEASED_STATISTIC({commit}, params) {
            // Available values : downloaded, purchased, listened_to
            return axios.post(`add_music_release_statistic/${params.value}`, {'music_release_id': params.id})
                .then(response => {

                })
                .catch(err => {
                    console.log(`ADD_MUSIC_RELEASED_STATISTIC, ${err}`);
                })
        },
        // GET_ARTIST_MUSIC_RELEASES({commit}, params) {
        //     commit('SET_ARTIST_MUSIC_RELEASES', []);
        //     return axios.get(`music_releases`, {params: params})
        //         .then(response => {
        //             commit('SET_ARTIST_MUSIC_RELEASES', response.data['hydra:member']);
        //         })
        //         .catch(error => console.log(`GET_ARTIST_MUSIC_RELEASES ${error}`));
        // },
        INCREASE_PLAYED_MUSIC_RELEASE({commit}, params) {
            return axios.post(`increase_played_music_release`, {'musicReleaseID': params.musicReleaseID}).catch(err => {
                console.log(`INCREASE_PLAYED_MUSIC_RELEASE ${err}`);
            })
        },
        GET_PLAYED_MUSIC_RELEASE({commit}, params) {
            return axios.get(`played_music_releases`, {params: params})
                .then(response => {
                    commit('SET_PLAYED_MUSIC_RELEASE', response.data['hydra:member']);
                })
                .catch(err => {
                    console.log(`GET_PLAYED_MUSIC_RELEASE ${err}`)
                })
        },
        GET_DOWNLOAD_LINK({commit}, params) {
            return axios.get(`/music_releases/${params.musicReleaseID}/download`)
                .then(response => {

                    if (response) {
                        console.log(response.data.link)
                        commit('SET_DOWNLOAD_ERROR', '');
                        commit('SET_DOWNLOAD_LINK', '');
                        commit('SET_DOWNLOAD_LINK', response.data.link);


                    }
                })
                .catch(err => {
                    console.log(`GET_DOWNLOAD_LINK ${err}`)
                    if (err.response) {
                        commit('SET_DOWNLOAD_ERROR', null);
                        commit('SET_DOWNLOAD_ERROR', err.response.data.error);

                        console.log(err.response.data.error)

                    }
                    return Promise.reject(err);

                })
        },
        GET_CHECK_MUSIC_RELEASE_DOWNLOAD({commit}) {
            return axios.get(`/music_releases/download-check`)
                .then(response => {

                    if (response) {
                        console.log(response.data)
                        commit('SET_CHECK_MUSIC_RELEASE_DOWNLOAD', response.data);


                    }
                })
                .catch(err => {
                    if (err.response) {
                                              console.log(err.response)
                    }
                    return Promise.reject(err);

                })
        }
    },
    getters: {
        MUSIC_RELEASE: state => state.musicRelease,
        RECENTLY_PLAYED: state => state.recentlyPlayed,
        APPEARS_ON: state => state.appearsOn,
        MUSIC_RELEASE_RATING: state => state.musicReleaseRating,
        COUNT_MUSIC_RELEASE: state => state.countMusicRelease,
        ALBUMS_CURRENT_PAGE: state => state.albumsCurrentPage,
        ARTIST_MUSIC_RELEASES: state => state.artistMusicReleases,
        ALBUMS_DYNAMIC_KEY: state => state.albumsDynamicKey,

        PLAYED_MUSIC_RELEASE: state => state.playedMusicRelease,
        DOWNLOAD_LINK: state => state.downloadLink,
        DOWNLOAD_ERROR: state => state.downloadLinkError,
        CHECK_MUSIC_RELEASE_DOWNLOAD: state => state.checkMusicReleaseDownload,
    }
}
