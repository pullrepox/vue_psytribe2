import axios from 'axios';

const initialState = () => ({
    tempCreatedAlbumID: ''
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
        SET_TEMP_CREATED_ALBUMS_ID: (state, data) => {
            state.tempCreatedAlbumID = data;
        },
    },
    actions: {
        ADD_TO_PLAYLIST({commit}, data) {
            return axios.post(`play_lists`, data)
                .then((response) => {
                    console.log('ADD_TO_PLAYLIST response', response);
                })
                .catch(err => console.log(`ADD_TO_PLAYLIST ${err}`))
        },
        ADD_MUSIC_RELEASE({commit}, data) {
            return axios.post(`music_releases`, data)
                .then((response) => {
                    commit('SET_TEMP_CREATED_ALBUMS_ID', response.data.id);
                })
                .catch(err => console.log(`ADD_MUSIC_RELEASE ${err}`));
        },
    },
    getters: {
        TEMP_CREATED_ALBUMS_ID: state => state.tempCreatedAlbumID,
    }
}
