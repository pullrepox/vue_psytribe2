import axios from 'axios';

const initialState = () => ({
    statusFilter: '', // open-close (explore page)
    upperFilter: '',
    viewFilter: '',

    subgenre: {},
    bpm: [],
    songKeys: [],
    keys: [],
    applyKeys: false,
    tags: [],

    activeSavedFilter: '',
    savedFilters: [],
    discovery: true,

    orderBy: {'order[releasedAt]': `DESC`}
});
const state = initialState();

const mutations = {
    RESET(state) {
        const newState = initialState();
        Object.keys(newState).forEach(key => {
            state[key] = newState[key]
        });
    },
    SET_STATUS_FILTER: (state, status) => {
        state.statusFilter = status;
    },
    SET_UPPER_FILTER: (state, upperFilter) => {
        state.upperFilter = upperFilter;
    },
    SET_VIEW_FILTER: (state, viewFilter) => {
        state.viewFilter = viewFilter;
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
    SET_SONG_KEYS: (state, data) => {
        state.songKeys = data;
    },
    SET_TAGS: (state, tags) => {
        state.tags = tags;
    },

    SET_ACTIVE_SAVED_FILTER: (state, filterName) => {
        state.activeSavedFilter = filterName;
    },
    SET_SAVED_FILTERS: (state, savedFilters) => {
        state.savedFilters = savedFilters;
    },
    SET_DISCOVERY: (state, status) => {
        state.discovery = status;
    },

    SET_ORDER_BY: (state, orderBy) => {
        state.orderBy = orderBy;
    },
};
const actions = {
    reset({ commit }) {
        commit('RESET');
    },
    UPDATE_UPPER_FILTER: ({commit}, upperFiler) => {
        commit('SET_UPPER_FILTER', upperFiler);
    },
    UPDATE_VIEW_FILTER: ({commit}, viewFilter) => {
        commit('SET_VIEW_FILTER', viewFilter);
    },
    UPDATE_SUBGENRE: ({commit}, subgenre) => {
        commit('SET_SUBGENRE', subgenre);
    },
    UPDATE_BPM: ({commit}, bpm) => {
        commit('SET_BPM', bpm);
    },

    GET_SONG_KEYS({commit}, params) {
        return axios.get('song_keys', {params: params})
            .then((response) => {
                console.log('response', response);
                commit('SET_SONG_KEYS', response.data['hydra:member']);
            })
            .catch(err => {
                console.log(`GET_SONG_KEYS ${err}`);
            })
    },
    UPDATE_KEYS: ({commit}, keys) => {
        commit('SET_KEYS', keys);
    },
    UPDATE_TAGS: ({commit}, tags) => {
        commit('SET_TAGS', tags);
    },
    UPDATE_ACTIVE_SAVED_FILTER: ({commit}, filterName) => {
        commit('SET_ACTIVE_SAVED_FILTER', filterName);
    },
    GET_SAVED_FILTERS: ({commit}) => {
        let filters = JSON.parse(localStorage.getItem('filtersSubGenre') || '[]');
        commit('SET_SAVED_FILTERS', filters);
    },
    UPDATE_DISCOVERY: ({commit}, status) => {
        commit('SET_DISCOVERY', status);
    },

    UPDATE_ORDER_BY: ({commit}, orderBy) => {
        commit('SET_ORDER_BY', orderBy);
    },
    CLEAN_FILTERS: ({commit}) => {
        // commit('SET_SUBGENRE', {});
        commit('SET_BPM', []);
        commit('SET_KEYS', []);
        if (state.tags.length) {
            commit('SET_TAGS', []);
        }

        commit('SET_ACTIVE_SAVED_FILTER', '');
    }
};
const getters = {
    STATUS_FILTER: state => state.statusFilter,
    UPPER_FILTER: state => state.upperFilter,
    VIEW_FILTER: state => state.viewFilter,

    SUBGENRE: state => state.subgenre,
    BPM: state => state.bpm,
    SONG_KEYS: state => state.songKeys,
    KEYS: state => state.keys,
    APPLY_KEYS: state => state.applyKeys,
    TAGS: state => state.tags,

    ACTIVE_SAVED_FILTER: state => state.activeSavedFilter,
    SAVED_FILTERS: state => state.savedFilters,
    DISCOVERY: state => state.discovery,

    ORDER_BY: state => state.orderBy,
}

export default {
    state,
    mutations,
    actions,
    getters
}
