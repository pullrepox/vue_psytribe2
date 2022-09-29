import axios from 'axios';

const initialState = () => ({
    supporters: [],
    supporter: ''
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
        SET_SUPPORTERS: (state, data) => {
            state.supporters = data;
        },
        SET_SUPPORTER: (state, data) => {
            state.supporter = data;
        }
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        GET_SUPPORTERS({commit}, params) {
            return axios.get(`supporters`, {params: params})
                .then(response => {
                    commit('SET_SUPPORTERS', response.data['hydra:member']);
                })
                .catch(err => console.log(`GET_SUPPORTERS ${err}`));
        },
        GET_SUPPORTER({commit}, params) {
            return axios.get(`supporters/${params.id}`, {params: params})
                .then(response => {
                    commit('SET_SUPPORTER', response.data['hydra:member']);
                })
                .catch(err => console.log(`GET_SUPPORTER ${err}`));
        },
        ADD_SUPPORTER({commit}, supporter) {
            return axios.post(`supporters`, supporter).catch(err => console.log(`ADD_SUPPORTER ${err}`));
        },
        DELETE_SUPPORTER({commit}, params) {
            return axios.delete(`supporters/${params.id}`).catch(err => {console.log(`DELETE_SUPPORTER ${err}`)})
        }
    },
    getters: {
        SUPPORTERS: state => state.supporters,
        SUPPORTER: state => state.supporter,
    }
}
