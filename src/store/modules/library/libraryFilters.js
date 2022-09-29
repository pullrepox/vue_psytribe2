const initialState = () => ({
    libraryFilter: '',
    subgenre: {},
    bpm: [],
    keys: [],
    applyKeys: false,
    tags: [],

    viewAlbums: 'grid'
});

export default {
    namespaced: true,
    state: initialState(),
    mutations: {
        RESET(state) {
            const newState = initialState();
            Object.keys(newState).forEach(key => {
                state[key] = newState[key]
            });
        },
        SET_LIBRARY_FILTER: (state, status) => {
          state.libraryFilter = status;
        },
        SET_SUBGENRE: (state, subgenre) => {
            state.subgenre = subgenre;
        },
        SET_BPM: (state, bpm) => {
            state.bpm = bpm;
        },
        SET_KEYS: (state, keys) => {
            state.keys = keys;
        },
        SET_APPLY_KEYS: (state, data) => {
            state.applyKeys = data;
        },
        SET_TAGS: (state, tags) => {
            state.tags = tags;
        },

        SET_VIEW_ALBUMS: (state, data) => {
            state.viewAlbums = data;
        }
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        CLEAR_FILTERS: ({commit}) => {
            commit('SET_SUBGENRE', {});
            commit('SET_BPM', []);
            commit('SET_KEYS', []);
            commit('SET_TAGS', []);
        }
    },
    getters: {
        LIBRARY_FILTER: state => state.libraryFilter,
        SUBGENRE: state => state.subgenre,
        BPM: state => state.bpm,
        KEYS: state => state.keys,
        APPLY_KEYS: state => state.applyKeys,
        TAGS: state => state.tags,

        VIEW_ALBUMS: state => state.viewAlbums,
    }
}
