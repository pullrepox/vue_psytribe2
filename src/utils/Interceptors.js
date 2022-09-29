import axios from 'axios';
import store from '../store';

export function Interceptors() {

    axios.interceptors.request.use(request => {
        const accessToken = store.getters['AUTH_DATA'].accessToken || localStorage.getItem('accessToken');

        if (accessToken) {
            request.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
        return request;
    });

    axios.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            const originalRequest = error.config;

            if (error.response.status === 401 && !originalRequest._retry) {
                if (originalRequest.url !== "authentication_token") {
                    originalRequest._retry = true;
                    const authData = store.getters['AUTH_DATA'];

                    if (authData.accessToken && authData.refreshToken) {
                        store.dispatch('REFRESH_TOKEN', authData.refreshToken)
                            .then(() => {
                                const accessToken = store.getters['AUTH_DATA'].accessToken;
                                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                                // return axios(originalRequest);
                                location.reload(true);
                                return axios.request(originalRequest).then(data => {
                                    return data;
                                });
                            })
                            .catch(err => {
                                // logout
                                store.dispatch('reset');
                                console.log(`interceptors.response refresh token, ${err}`);
                            });
                    } else {
                        this.$store.dispatch('LOGOUT')
                            .then(() => {
                                this.$router.push({name: 'logged-out'});
                                store.dispatch('reset');
                            });
                    }
                }

            }
            return Promise.reject(error);
        })
}
