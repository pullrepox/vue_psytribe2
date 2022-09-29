export default {
    data() {
        return {
            mobile: false,
        }
    },
    created() {
        this.mobile = screen.width <= 760;
    },
    methods: {
        // isMobile() {
        //     return screen.width <= 760;
        // },
    }
}