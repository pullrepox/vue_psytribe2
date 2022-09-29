import axios from 'axios';

const initialState = () => ({
    eventStatistics: [],
    eventStatistic: ''
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
        EVENT_STATISTICS_ID: (state, data) => {
            state.eventStatistics = data;
        },
        EVENT_STATISTIC: (state, data) => {
            state.eventStatistic = data;
        }
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        GET_EVENT_STATISTICS({commit}, params) {
            return axios.get(`event_statistics/${params.id}`, {params: params})
                .then(response => {
                    commit('SET_TICKETS', response.data['hydra:member']);
                })
                .catch(err => console.log(`GET_TICKETS ${err}`));
        },
        CHANGE_EVENT_STATISTICS({commit}, params) {
            return axios.patch(`event_statistics/${params.id}`).catch(err => console.log(`CHANGE_EVENT_STATISTICS ${err}`));
        },
        GET_EVENT_STATISTIC({commit}, params) {
            return axios.get(`events/${params.id}/statistic`, {params: params})
                .then(response => {
                  commit('EVENT_STATISTIC', response.data['hydra:member'])  ;
                })
                .catch(err => console.log(`GET_EVENT_STATISTIC ${err}`));
        }
    },
    getters: {
        EVENT_STATISTICS: state => state.eventStatistics,
        EVENT_STATISTIC: state => state.eventStatistic
    }
}
