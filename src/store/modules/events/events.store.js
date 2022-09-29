import axios from 'axios';

const initialState = () => ({
    events: [],
    event: '',

    // filters
    location: '',
    date: '',
    duration: ''
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

        // filters
        SET_EVENT_LOCATION: (state, data) => {
          state.location = data;
        },
        SET_EVENT_DATE: (state, data) => {
            state.date = data;
        },
        SET_EVENT_DURATION: (state, data) => {
            state.duration = data;
        },


        SET_EVENTS: (state, events) => {
            state.events = events;
        },
        SET_EVENT: (state, event) => {
            state.event = event;
        }
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        GET_EVENTS({commit}, params) {
            return axios.get(`events`, {params: params})
                .then(response => {
                    commit('SET_EVENTS', response.data['hydra:member'])
                })
                .catch(err => console.log(`GET_EVENTS ${err}`));
        },
        GET_EVENT({commit}, id) {
            return axios.get(`events/${id}`)
                .then(response => {
                    commit('SET_EVENT', response.data)
                })
                .catch(err => console.log(`GET_EVENT ${err}`));
        },
        ADD_EVENT({commit}, event) {
            return axios.post(`events`, event).catch(err => console.log(`ADD_EVENT ${err}`));
        },
        CHANGE_EVENT({commit}, event) {
            return axios.patch(`events/${event.id}`).catch(err => console.log(`CHANGE_EVENT ${err}`));
        },
        DELETE_EVENT({commit}, event) {
            return axios.delete(`events/${event.id}`).catch(err => console.log(`DELETE_EVENT ${err}`));
        }
    },
    getters: {
        EVENTS: state => state.events,
        EVENT: state => state.event,

        // filters
        LOCATION: state => state.location,
        DATE: state => state.date,
        DURATION: state => state.duration,

    }
}
