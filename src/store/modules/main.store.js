import axios from 'axios';

const initialState = () => ({
    playerAlbumsList: [],
    genres: [],
    subgenre: '',
    subgenres: [],
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
        SET_PLAYED_ALBUMS_LIST: (state, data) => {
          state.playerAlbumsList = data;
        },
        SET_GENRES: (state, data) => {
            state.genres = data;
        },
        SET_SUBGENRE: (state, data) => {
            state.subgenre = data;
        },
        SET_SUBGENRES: (state, data) => {
            state.subgenres = data;
        },
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        GET_GENRES({commit}, params) {
            return axios.get(`genres`, {params: params})
                .then(response => {
                    // response.data['hydra:member'][1].subGenres.pop()
                    commit('SET_GENRES', response.data['hydra:member']);
                })
                .catch(err => console.log(`GET_GENRES ${err}`));
        },
        GET_SUBGENRE({commit}, params) {
          return axios.get(`sub_genres/${params.id}`)
              .then(response => {
                    commit('SET_SUBGENRE', response.data);
              })
              .catch(err => console.log(`GET_SUBGENRE ${err}`));
        },
        GET_SUBGENRES({commit}, params) {
            return axios.get(`sub_genres`, {params: params})
                .then(response => {
                    commit('SET_SUBGENRES', response.data['hydra:member'])
                })
                .catch(err => console.log(`SET_SUBGENRES ${err}`));
        },
    },
    getters: {
        PLAYER_ALBUMS_LIST: state => state.playerAlbumsList,
        GENRES: state => state.genres,
        SUBGENRE_INFO: state => state.subgenre,
        SUBGENRES: state => state.subgenres,
    }
}
