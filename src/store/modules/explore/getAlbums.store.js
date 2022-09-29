import axios from 'axios';


const initialState = () => ({
    // explore albums (grid, list)
    exploreGridAlbums: [],
    countExploreGridAlbums: '',
    updateExploreAlbums: false,
    loading: false,
    requests: [],
    activeReq: null
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
        SET_UPDATE_EXPLORE_ALBUMS: (state, data) => {
            state.updateExploreAlbums = data;
        },
        SET_EXPLORE_GRID_ALBUMS: (state, data) => {
            state.countExploreGridAlbums = data['hydra:totalItems'];
            state.exploreGridAlbums = data['hydra:member'];
        },
        // SET_ABORT: (state, data) => {
        //     controller.abort();
        // }
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        CLEAN_EXPLORE_GRID_ALBUMS({commit}) {
            let empty = {
                'hydra:member': [],
                'hydra:totalItems': ''
            }
            commit('SET_EXPLORE_GRID_ALBUMS', empty);
        },
        GET_EXPLORE_GRID_ALBUMS({commit, state}, params) {
            const controller = new AbortController();
            const signal = controller.signal;

            // controller.abort();
            // console.log('signal', signal);

            let source = JSON.parse(localStorage.getItem('DataSource'));
            let elasticPath = `search/`;
            if (!source || !source.db || source.db === 'api') {
                elasticPath = ``;
            }

            // setTimeout(() => controller.abort(), 5000);
            return axios.get(`${elasticPath}music_releases`, {signal, params: params})
                .then(response => {
                    if (!response.data && source.auto === true) {
                        // get data from api
                        return axios.get(`music_releases`, {params: params})
                            .then(response => {
                                commit('SET_EXPLORE_GRID_ALBUMS', response.data);
                            })
                            .catch(err => {
                                console.log(`GET_EXPLORE_GRID_ALBUMS ${err}`);
                            })
                            // .finally(() => state.loading = false);
                    } else {
                        commit('SET_EXPLORE_GRID_ALBUMS', response.data);
                    }
                })
                .catch(err => {
                    console.log(`GET_EXPLORE_GRID_ALBUMS ${err}`);
                })
                .finally(() => {
                    state.loading = false;
                });
        },
    },


    getters: {
        EXPLORE_GRID_ALBUMS: state => state.exploreGridAlbums,
        COUNT_EXPLORE_GRID_ALBUMS: state => state.countExploreGridAlbums,
        UPDATE_EXPLORE_ALBUMS: state => state.updateExploreAlbums,
    },
}
