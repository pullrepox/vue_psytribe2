import axios from 'axios';

const initialState = () => ({
    profileData: {},
    user: {},
    changePasswordStatus: '',
    changeFilterStatus: '',
    changeUserAva: false,
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
        SET_PROFILE: (state, data) => {
            state.profileData = data;
        },
        SET_USER: (state, data) => {
            state.user = data;
        },
        SET_CHANGE_PASSWORD_STATUS(state, status) {
            state.changePasswordStatus = status;
        },
        SET_CHANGE_FILTERS_STATUS(state, data) {
            state.changeFilterStatus = data;
        },
        SET_CHANGE_USER_AVA: (state, data) => {
            state.changeUserAva = data;
        }
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        GET_PROFILE({commit}) {
            return axios.get('get_profile')
                .then(response => {
                    commit('SET_PROFILE', response.data.result);
                })
                .catch(err => console.log(`GET_PROFILE ${err}`));
        },
        GET_USER({commit}, userID) {
            commit('SET_USER', []);
            return axios.get(`users/${userID}`)
                .then(user => {
                    commit('SET_USER', user.data)
                })
                .catch(err => console.log(`GET_USER ${err}`));
        },
        CHANGE_USER_DATA({commit}, userData) {
            return axios.patch(`users/${userData.id}`, userData, {headers: {'Content-Type': 'application/merge-patch+json'}})
                .then(() => {

                })
                .catch((err) => {
                    console.log(`CHANGE_USER_DATA ${err}`);
                });
        },
        CHANGE_USER_AVA({commit}, data) {
            return axios.patch(`users/5`, data, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(() => {
                    console.log('CHANGE_USER_AVA success');
                })
                .catch(err => {
                    console.log(`CHANGE_USER_AVA ${err}`);
                })
        },
        CHANGE_PASSWORD({commit}, data) {
            return axios.patch(`change_password`, data, {headers: {'Content-Type': 'application/merge-patch+json'}})
                .then((response) => {
                    console.log('CHANGE_PASSWORD', response);

                    if (response && response.status === 204) {
                        commit('SET_CHANGE_PASSWORD_STATUS', 'success');
                    } else {
                        commit('SET_CHANGE_PASSWORD_STATUS', 'failed');
                    }
                })
                .catch((err) => {
                    console.log(`CHANGE_PASSWORD ${err}`);
                    commit('SET_CHANGE_PASSWORD_STATUS', 'failed');
                });
        },
        CHANGE_FILTERS({commit}, data) {
            return axios.patch(`users/${data.userID}`, {'searchFilters': data.filters}, {headers: {'Content-Type': 'application/merge-patch+json'}})
                .then((response) => {
                    commit('SET_CHANGE_FILTERS_STATUS', 'success');
                })
                .catch((err) => {
                    commit('SET_CHANGE_FILTERS_STATUS', 'failed');
                    console.log(`CHANGE_FILTERS ${err}`);
                })
        },

    },

    getters: {
        PROFILE_DATA: state => state.profileData,
        USER: state => state.user,
        CHANGE_PASSWORD_STATUS: state => state.changePasswordStatus,
        CHANGE_FILTERS_STATUS: state => state.changeFilterStatus,
        CHANGE_USER_AVA: state => state.changeUserAva,
    }
}
