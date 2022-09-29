import axios from 'axios';

const initialState = () => ({
    notifications: {},
    lastCallTimestamp: 0,
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
        SET_ADMIN_NOTIFICATIONS: (state, data) => {
            state.lastCallTimestamp = Date.now();
            state.notifications = {
                'verification': false,
                'message': false,
            }

            data['hydra:member'].forEach(item => {
                state.notifications[item.type] = item.count > 0;
            });
        },
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        GET_ADMIN_NOTIFICATIONS({commit}) {
            return axios.get(`admin_notifications`)
                .then(response => {
                    commit('SET_ADMIN_NOTIFICATIONS', response.data);
                })
                .catch(error => console.log(`GET_ADMIN_NOTIFICATIONS ${error}`));
        },
    },
    getters: {
        ADMIN_NOTIFICATIONS: state => state.notifications,
        ADMIN_NOTIFICATIONS_LAST_REFRESH: state => state.lastCallTimestamp,
    }
}
