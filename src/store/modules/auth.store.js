import {jwtDecrypt} from '@/utils/jwtHelper';
import axios from 'axios';

const initialState = () => ({
    authData: {
        accessToken: '',
        refreshToken: '',
        tokenExp: '',
        userRoles: [],
        userName: '',
        userId: '',
        verify: '',
        firstLogin: ''
    },
    tokenAlive: '',
    loginStatus: {},
    registerStatus: '',
    forgotPasswordStatus: '',
    resetPasswordStatus: {},
    sendVerifyCodeStatus: {},
    changeEmailStatus: false,
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
        SAVE_TOKENS(state, tokens) {
            const accessToken = tokens.token;
            const refreshToken = tokens.refresh_token;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            const jwtDecodedValue = jwtDecrypt(accessToken);

            state.authData.accessToken = accessToken;
            state.authData.refreshToken = refreshToken;
            state.authData.tokenExp = jwtDecodedValue.exp;
            state.authData.userRoles = jwtDecodedValue.roles;
            state.authData.userName = jwtDecodedValue.username;
            state.authData.userId = jwtDecodedValue.userId;
            state.authData.verify = jwtDecodedValue.is_verified;
            state.authData.firstLogin = jwtDecodedValue.first_login;
        },
        SET_LOGIN_STATUS(state, data) {
            console.log('data', data);
            state.loginStatus = data;
        },
        SET_REGISTER_STATUS: (state, value) => {
            state.registerStatus = value;
        },
        SET_FORGOT_PASSWORD_STATUS(state, value) {
            state.forgotPasswordStatus = value;
        },
        SET_RESET_PASSWORD_STATUS(state, data) {
            state.resetPasswordStatus = data;
        },
        SET_SEND_VERIFY_CODE_STATUS: (state, data) => {
            state.sendVerifyCodeStatus = data;
        },
        SET_LOGOUT(state) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            state.authData.accessToken = '';
            state.authData.refreshToken = '';
            state.authData.tokenExp = '';
            state.authData.userRoles = '';
            state.authData.userName = '';
            state.authData.userId = '';
            state.authData.verify = '';
            state.authData.firstLogin = '';
        },
        SET_CHANGE_EMAIL_STATUS: (state, status) => {
            state.changeEmailStatus = status;
        },
        SET_TOKEN_ALIVE: (state, status) => {
            state.tokenAlive = status;
        },
    },
    actions: {
        reset({ commit }) {
            commit('RESET');
        },
        async LOGIN({commit}, userData) {
            localStorage.setItem('TEMP_USER_EMAIL', userData.email);
            localStorage.setItem('TEMP_USER_PASSWORD', userData.password);
            await axios.post('authentication_token', userData)
                .then(response => {
                    if (response && response.data) {
                        commit('SAVE_TOKENS', response.data);
                        commit('SET_LOGIN_STATUS', {
                            success: true,
                            message: response
                        });
                    } else {
                        commit('SET_LOGIN_STATUS', {
                            success: false,
                            message: response
                        });
                    }
                })
                .catch((error) => {
                    commit('SET_LOGIN_STATUS', {
                        success: false,
                        message: error.response.data.message
                    });
                    console.error(`LOGIN ${error}`);
                });
        },
        async LOGOUT({commit}) {
            await commit('SET_LOGOUT');
        },
        async REGISTER({commit}, userData) {
            localStorage.setItem('TEMP_USER_EMAIL', userData.email);
            localStorage.setItem('TEMP_USER_PASSWORD', userData.password);
            await axios.post('users', userData)
                .then((response) => {
                    if (response.data) {
                        commit('SET_REGISTER_STATUS', 'success');
                    } else {
                        commit('SET_REGISTER_STATUS', 'failed');
                    }
                })
                .catch((err) => {
                    commit('SET_REGISTER_STATUS', 'failed');
                    console.error(`REGISTER ${err}`);
                })
        },
        async FORGOT_PASSWORD({commit}, email) {
            await axios.post(`reset_password_request`, email)
                .then(response => {
                    if (response && response.data.result) {
                        commit('SET_FORGOT_PASSWORD_STATUS', 'success');
                    } else {
                        commit('SET_FORGOT_PASSWORD_STATUS', 'failed');
                    }
                })
                .catch(err => {
                    commit('SET_FORGOT_PASSWORD_STATUS', 'failed');
                    console.log(`FORGOT_PASSWORD ${err}`);
                });
        },
        RESET_PASSWORD({commit}, params) {
            return axios.post(`reset_password`, params)
                .then(response => {
                    commit('SET_RESET_PASSWORD_STATUS', {
                        success: true,
                        message: response
                    });
                })
                .catch(err => {
                    commit('SET_RESET_PASSWORD_STATUS', {
                        success: false,
                        message: err.response.data.error
                    });
                    console.log(`RESET_PASSWORD ${err}`);
                })
        },
        async REFRESH_TOKEN({commit}, refreshToken) {
            return await axios.post(`token/refresh`, {'refresh_token': refreshToken})
                .then(response => {
                    console.log('REFRESH_TOKEN', response);
                    if (response) {
                        commit('SAVE_TOKENS', response.data);
                    } else {
                        console.log('REFRESH_TOKEN !response LOGOUT', response);
                        commit('SET_LOGOUT');
                    }
                })
                .catch(err => {
                    console.log(`REFRESH_TOKEN ${err}`);
                });
        },
        CHECK_TOKEN_ALIVE({commit}) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const accessToken = jwtDecrypt(token);
                const accessTokenExp = accessToken.exp;
                commit('SET_TOKEN_ALIVE', !(!accessTokenExp || Date.now() >= accessTokenExp * 1000));
            }
        },
        CHANGE_EMAIL({commit}, email) {
            return axios.patch(`change_email`, {'email': email})
                .then(response => {
                    console.log(`CHANGE_EMAIL, response ${response}`);
                    commit('SET_CHANGE_EMAIL_STATUS', true);
                })
                .catch(err => {
                    commit('SET_CHANGE_EMAIL_STATUS', false);
                    console.error(`CHANGE_EMAIL, ${err}`);
                })
        },
        SEND_EMAIL_VERIFICATION({commit}) {
            return axios.post(`send_email_verification`)
                .then(response => {
                    console.log('SEND_EMAIL_VERIFICATION response', response);
                })
                .catch(err => {
                    console.log(`SEND_EMAIL_VERIFICATION, ${err}`);
                })
        },
        SEND_VERIFY_CODE({commit}, params) { // {email: string; code: string}
            return axios.post(`verify/code`, params)
                .then(response => {
                    commit('SET_SEND_VERIFY_CODE_STATUS', {
                        success: true,
                        message: response
                    });
                })
                .catch(err => {
                    commit('SET_SEND_VERIFY_CODE_STATUS', {
                        success: false,
                        message: err.response.data.error
                    });
                    console.log(`SEND_VERIFY_CODE, ${err}`)
                });
        },
        RESEND_VERIFY_CODE({commit}, params) { // {email: string}
            return axios.post(`resend/code`, params)
                .then(response => {
                    console.log('RESEND_VERIFY_CODE', response);
                })
                .catch(err => console.log(`RESEND_VERIFY_CODE, ${err}`))
        },
    },

    getters: {
        AUTH_DATA: state => state.authData,
        userID: state => state.authData.userId,

        LOGIN_STATUS: state => state.loginStatus,
        REGISTER_STATUS: state => state.registerStatus,
        FORGOT_PASSWORD_STATUS: state => state.forgotPasswordStatus,
        RESET_PASSWORD_STATUS: state => state.resetPasswordStatus,
        SEND_VERIFY_CODE_STATUS: state => state.sendVerifyCodeStatus,

        CHANGE_EMAIL_STATUS: state => state.changeEmailStatus,
        IS_TOKEN_ACTIVE: state => state.tokenAlive,
    }
};
