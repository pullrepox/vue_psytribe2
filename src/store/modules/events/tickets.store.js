import axios from 'axios';

export default {
    state: {
        tickets: [],
        ticket: '',
        eventTickets: [],
    },
    mutations: {
        SET_TICKETS: (state, tickets) => {
            state.tickets = tickets;
        },
        SET_TICKET: (state, ticket) => {
            state.ticket = ticket;
        },
        SET_EVENT_TICKETS: (state, eventTickets) => {
            state.eventTickets = eventTickets;
        }
    },
    actions: {
        GET_TICKETS({commit}, params) {
            return axios.get(`event_tickets`, {params: params})
                .then(response => {
                    commit('SET_TICKETS', response.data['hydra:member'])
                })
                .catch(err => console.log(`GET_TICKETS ${err}`));
        },
        GET_TICKET({commit}, params) {
            return axios.get(`event_tickets/${params.id}`, {params: params})
                .then(response => {
                    commit('SET_TICKET', response.data['hydra:member'])
                })
                .catch(err => console.log(`GET_TICKET ${err}`));
        },
        GET_EVENT_TICKETS({commit}, params) {
            return axios.get(`events/${params.id}/tickets}`, {params: params})
                .then(response => {
                    commit('SET_EVENT_TICKETS', response.data['hydra:member'])
                })
                .catch(err => console.log(`GET_EVENT_TICKETS ${err}`));
        },
        ADD_TICKET({commit}, ticket) {
            return axios.post(`event_tickets`, ticket).catch(err => console.log(`ADD_TICKET ${err}`));
        },
        CHANGE_TICKET({commit}, ticket) {
            return axios.patch(`event_tickets/${ticket.id}`).catch(err => console.log(`CHANGE_TICKET ${err}`));
        },
        PUT_TICKET({commit}, ticket) {
            return axios.put(`event_tickets/${ticket.id}`).catch(err => console.log(`PUT_TICKET ${err}`));
        },
        DELETE_TICKET({commit}, ticket) {
            return axios.delete(`event_tickets/${ticket.id}`).catch(err => console.log(`DELETE_TICKET ${err}`));
        }
    },
    getters: {
        TICKETS: state => state.tickets,
        TICKET: state => state.ticket,
        EVENT_TICKETS: state => state.eventTickets,
    }
}
