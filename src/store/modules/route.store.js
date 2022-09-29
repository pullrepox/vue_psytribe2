export default {
    state: {
        current: '',
        from: '',
    },
    mutations: {
        CHANGE_ROUTE: (state, data) => {
            state.from = data.from;
            state.current = data.to;
        },
    },
    actions: {

    },
    getters: {
        FROM_PAGE: state => state.from,
        CURRENT_PAGE: state => state.current
    }
}
