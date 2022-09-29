import axios from 'axios';

export default {
    state: {
        faqs: [],
    },
    mutations: {
        SET_FAQS: (state, faqs) => {
            state.faqs = faqs;
        },
    },
    actions: {
        GET_FAQS({commit}, params) {
            return axios.get(`faqs`, {params: params})
                .then(faqs => {
                    commit('SET_FAQS', faqs.data['hydra:member'])
                })
                .catch(err => console.log(`GET_FAQS ${err}`));
        },
        ADD_FAQ({commit}, newFaq) {
            return axios.post(`faqs`, newFaq)
                .then((response) => {
                    console.log('ADD_FAQ response', response);
                })
                .catch(err => console.log(`ADD_FAQ ${err}`));
        },
        UPDATE_FAQ(params) {
            return axios.put(`faqs/${params.id}`, params).catch(err => console.log(`UPDATE_FAQ ${err}`));
        },
        DELETE_FAQ({commit}, id) {
            console.log('params', id);
            return axios.delete(`faqs/${id}`).catch(err => console.log(`DELETE_FAQ ${err}`));
        }
    },
    getters: {
        FAQS: state => state.faqs,
    }
}
