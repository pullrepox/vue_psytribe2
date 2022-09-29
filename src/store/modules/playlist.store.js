import Vue from 'vue';

const initialState = () => ({
    playList: [],
    albums: [],
    showPlayList: false,
    playListActions: {}
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
        SET_PLAYLIST_STATUS(state, status = true) {
            state.showPlayList = status;
        },
        SET_TRACK_TO_PLAYLIST(state, track) {
            state.playList.push(track);
        },
        SET_PlAY_LIST_TO_STORAGE(state) {
            localStorage.setItem('playList', JSON.stringify(state.playList));
        },
        SET_ALBUM_TO_STORAGE(state) {
            localStorage.setItem('albums', JSON.stringify(state.albums));
        },
        SET_PLAY_LiST(state, data) {
            state.playList = data;
        },
        SET_ALBUM(state, data) {
            state.albums.push(data);
        },
        SET_ALBUMS(state, data) {
            state.albums = data;
        },
        CLEAR_ALBUMS(state) {
            state.albums = [];
        },
        REMOVE_TRACK(state, index) {
            state.playList.splice(index, 1);
        },
        SET_PLAY_LIST_ACTIONS(state) {
            state.playList.forEach(track => Vue.set(state.playListActions, track.id, false));
        },
        SHOW_ACTION_IN_PLAYLIST(state, id) {
            Object.keys(state.playListActions).forEach(action => {
                if (id !== action && state.playListActions[action]) {
                    state.playListActions[action] = false;
                }
            });
            state.playListActions[id] = true;
        },
        CLEAR_PLAY_LIST_ACTIONS(state) {
            state.playListActions = {};
        },
        SET_PLAY_LIST_ACTIONS_STATUS(state, id, status = false) {
            state.playListActions[id] = status;
        }
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        CHANGE_PLAY_LIST_STATUS({commit}, status) {
            commit('SET_PLAYLIST_STATUS', status);
        },
        ADD_ALBUM_TO_PLAYLIST({commit, state}, album) {
            album.playList.forEach(track => {
                if (!state.playList.some(({id}) => id === track.id)) {
                    commit('SET_TRACK_TO_PLAYLIST', track);
                }
            });
            commit('SET_ALBUM', album);
            commit('SET_PlAY_LIST_TO_STORAGE');
            commit('SET_ALBUM_TO_STORAGE');
            commit('SET_PLAY_LIST_ACTIONS');
        },
        GET_DATA_FROM_STORE({commit}) {
            const playList = JSON.parse(localStorage.getItem('playList'));
            const albums = JSON.parse(localStorage.getItem('albums'));
            if (playList && playList.length) {
                commit('SET_PLAY_LiST', playList);
                commit('SET_PLAY_LIST_ACTIONS');
            }
            if (albums && albums.length) {
                commit('SET_ALBUMS', albums);
            }
        },
        CLEAR_PLAYLIST({commit}) {
            commit('SET_PLAY_LiST', []);
            commit('SET_PlAY_LIST_TO_STORAGE');
        },
        CLEAR_ALBUMS({commit}) {
            commit('CLEAR_ALBUMS');
            commit('SET_ALBUM_TO_STORAGE');
        },
        REMOVE_TRACK({commit}, index) {
            commit('REMOVE_TRACK', index);
            commit('SET_PlAY_LIST_TO_STORAGE');
        },
        SHOW_ACTION_IN_PLAYLIST({commit}, id) {
            commit('SHOW_ACTION_IN_PLAYLIST', id);
        },
        CLEAR_PLAY_LIST_ACTIONS({commit}) {
            commit('CLEAR_PLAY_LIST_ACTIONS');
        },
        SET_PLAY_LIST_ACTIONS_STATUS({commit}, id, status) {
            commit('SET_PLAY_LIST_ACTIONS_STATUS', id, status)
        },
        ADD_TRACK_TO_PLAYLIST({commit, state}, {album, track}) {
            commit('SET_TRACK_TO_PLAYLIST', track);
            commit('SET_PlAY_LIST_TO_STORAGE');
            commit('SET_PLAY_LIST_ACTIONS');
            if (!state.albums.some(({id}) => id === album.id)) {
                console.log(state.albums);
                console.log(album);
                commit('SET_ALBUM', album);
                commit('SET_ALBUM_TO_STORAGE');
            }
        }
    },
    getters: {
        SHOW_PLAY_LIST: (state) => state.showPlayList,
        PLAY_LIST: (state) => state.playList,
        PLAY_LIST_ALBUMS: (state) => state.albums,
        PLAY_LIST_ACTIONS: (state) => state.playListActions,
    }
}
