import axios from 'axios';

const initialState = () => ({
    favoriteMusicRelease: [],
    countFavoriteMusicRelease: '',
    updateFavoriteMusicRelease: false,

    recentlyLiked: [],
    recentlyUserLiked: [],
    favoriteMusicReleaseList: {},
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

        SET_FAVOURITE_MUSIC_RELEASE: (state, data) => {
            if (data.length) {
                state.countFavoriteMusicRelease = data.length;
            } else {
                state.countFavoriteMusicRelease = data['hydra:totalItems'];
            }
            state.favoriteMusicRelease = data;
        },
        SET_UPDATE_FAVOURITE_MUSIC_RELEASE: (state, data) => {
            state.updateFavoriteMusicRelease = data;
        },

        SET_RECENTLY_LIKED: (state, data) => {
            state.recentlyLiked = data;
        },
        SET_RECENTLY_USER_LIKED: (state, data) => {
            state.recentlyUserLiked = data;
        },
        UPDATE_FAVOURITE_MUSIC_RELEASE_LIST: (state, data) => {
            state.favoriteMusicReleaseList = data;
        },
    },

    actions: {
        reset({commit}) {
            commit('RESET');
        },
        CLEAN_FAVOURITE_MUSIC_RELEASE({commit}) {
            let empty = {
                'hydra:member': [],
                'hydra:totalItems': ''
            }
            commit('SET_FAVOURITE_MUSIC_RELEASE', empty);
        },

        ADD_ALBUM_TO_FAVORITES({commit}, params) {
            return axios.post('add_favorite_song', {'song_id': "", 'music_release_id': params.music_release_id})
                .then(response => {
                    console.log(`ADD_ALBUM_TO_FAVORITES - ${params.music_release_id}, ${response}`);
                }).catch(err => {
                    console.log(`ADD_ALBUM_TO_FAVORITES - ${params.music_release_id}, ${err}`);
                });
        },

        REMOVE_ALBUM_FROM_FAVORITES({commit}, params) {
            //return axios.delete(`remove_favorite_music_release,/${music_release_id}`)
            return axios.delete('remove_favorite_music_release', {data: {'song_id': "", 'music_release_id': params.music_release_id}})
                .then(response => {
                    console.log(response);
                    //console.log(`REMOVE_ALBUM_FROM_FAVORITES, ${music_release_id}`);
                }).catch(err => console.log(`REMOVE_ALBUM_FROM_FAVORITES ${err}`));
        },

        // ADD_FAVOURITE_MUSIC_RELEASE_TO_LIST(params) {
        //     return axios.post('add_favorite_music_release_to_list', {
        //         'favorite_music_release_id': params.favorite_music_release_id,
        //         'favorite_list_id': params.favorite_list_id
        //     }).then(response => {
        //         console.log(`ADD_FAVOURITE_MUSIC_RELEASE_TO_LIST - ${params}, ${response}`);
        //     }).catch(err => {
        //         console.log(`ADD_FAVOURITE_MUSIC_RELEASE_TO_LIST - ${params}, ${err}`);
        //     });
        // },

        GET_FAVOURITE_MUSIC_RELEASE({commit}, params) {
            return axios.get('favorite_releases', {params: params})
                .then(response => {
                    commit('SET_FAVOURITE_MUSIC_RELEASE', response.data);
                })
                .catch(error => console.log(`GET_FAVOURITE_MUSIC_RELEASE ${error}`));
        },



        // GET_RECENTLY_LIKED({commit}, params) {
        //     return axios.get(`favorite_music_release`, {params: params})
        //         .then(response => {
        //             commit('SET_RECENTLY_LIKED', response.data);
        //         })
        //         .catch(err => console.log(`GET_RECENTLY_LIKED ${err}`))
        // },
        // GET_RECENTLY_USER_LIKED({commit}, params) {
        //     return axios.get(`users/${params.id}/favorite_music_releases`)
        //         .then(response => {
        //             console.log('favorite_music_releases', response);
        //             commit('SET_RECENTLY_USER_LIKED', response.data['hydra:member']);
        //         })
        //         .catch(err => console.log(`GET_RECENTLY_USER_LIKED ${err}`))
        // },

        // GET_FAVOURITE_MUSIC_RELEASE_LIST({commit}) {
        //     return axios.get('favorite_music_release_list')
        //         .then(response => {
        //             commit('UPDATE_FAVOURITE_MUSIC_RELEASE_LIST', response.data.result);
        //         })
        //         .catch(err => {
        //             console.log(`GET_FAVOURITE_MUSIC_RELEASE_LIST ${err}`);
        //         });
        // },
    },

    getters: {
        FAVOURITE_MUSIC_RELEASE: state => state.favoriteMusicRelease,
        UPDATE_FAVOURITE_MUSIC_RELEASE: state => state.updateFavoriteMusicRelease,
        RECENTLY_LIKED: state => state.recentlyLiked,
        RECENTLY_USER_LIKED: state => state.recentlyUserLiked,
        COUNT_FAVOURITE_MUSIC_RELEASE: state => state.countFavoriteMusicRelease,
        FAVOURITE_MUSIC_RELEASE_LIST: state => state.favoriteMusicReleaseList,
    },

}
