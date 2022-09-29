import axios from 'axios';

const initialState = () => ({
    suggestions: [],
    suggest: ''
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
        SET_SUGGESTIONS: (state, data) => {
            state.suggestions = data;
        },
        SET_SUGGEST: (state, data) => {
            state.suggest = data;
        }
    },

    actions: {
        reset({commit}) {
            commit('RESET');
        },

        CREATE_SUGGEST({commit}, data) {
            return axios.post(`suggestions`, data)
                .catch(err => {
                    console.log(`CREATE_SUGGEST ${err}`);
                });
        },
        GET_SUGGESTIONS({commit}, params) {
            commit('SET_SUGGESTIONS', []);
            return axios.get(`search/suggestions`, {params: params})
                .then(response => {
                    console.log('response', response);
                    commit('SET_SUGGESTIONS', response.data.suggestions)
                })
                .catch(err => console.log(`GET_SUGGESTIONS ${err}`));
        },
        GET_SUGGEST({commit}, params) {
            return axios.get(`suggestions/${params.id}`, {params: params})
                .then(response => {
                    commit('SET_SUGGEST', response.data['hydra:member']);
                })
                .catch(err => console.log(`GET_SUGGEST ${err}`));
        },
        UPDATE_SUGGEST({commit}, params) {
            return axios.put(`suggestions/${params.id}`).catch(err => {
                console.log(`UPDATE_SUGGEST ${err}`)
            })
        },
        DELETE_SUGGEST({commit}, params) {
            return axios.delete(`suggestions/${params.id}`).catch(err => {
                console.log(`DELETE_SUGGEST ${err}`)
            })
        }
    },
    getters: {
        SUGGESTIONS: state => state.suggestions,
        SUGGEST: state => state.suggest,
    }
}
