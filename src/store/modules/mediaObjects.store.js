import axios from 'axios';

export default {
    state: {
        fileURL: '',
    },
    mutations: {
        SET_URL_FILE: (state, data) => {
            state.fileURL = data;
        }
    },
    actions: {
        ADD_FILE({commit}, data) {
            return axios.post(`media_objects`, data, {headers: {'Content-Type': 'multipart/form-data'}})
                .then((response) => {
                    commit('SET_URL_FILE', response.data['@id']);
                })
                .catch(err => {
                    console.log(`ADD_FILE ${err}`);
                })
        }
    },
    getters: {
        FILE_URL: state => state.fileURL
    }
}
