import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

import {
    auth,
    adminPages,
    privatePages,
    publicPages,
    events,
    settings,
    support,
    management,
    profile,
    search,
    manage,
    other
} from "../assets/rules/router";

Vue.use(VueRouter);

const routes = [
    ...auth,
    ...adminPages,
    ...privatePages,
    ...publicPages,
    ...events,
    ...settings,
    ...support,
    ...management,
    ...profile,
    ...search,
    ...manage,
    ...other,
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    publicPath: '/',
    routes,
    linkExactActiveClass: 'active',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return {x: 0, y: 0}
        }
    }
});

router.beforeEach(async (to, from, next) => {
    store.commit('CHANGE_ROUTE', {from: from, to: to});
    if (!store.getters['AUTH_DATA'].accessToken) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken) {
            const tokens = {
                token: accessToken,
                refresh_token: refreshToken,
            };
            store.commit('SAVE_TOKENS', tokens);
        } else {
            await store.dispatch('LOGOUT');
        }
    }

    await store.dispatch('CHECK_TOKEN_ALIVE');
    let isAccessTokenActive = store.getters['IS_TOKEN_ACTIVE'];

    if (isAccessTokenActive === false) {
        const refreshToken = store.getters['AUTH_DATA'].refreshToken || localStorage.getItem('refreshToken');
        const accessToken = store.getters['AUTH_DATA'].accessToken || localStorage.getItem('accessToken');

        if (accessToken) {
            await store.dispatch('REFRESH_TOKEN', refreshToken).then(() => {
                isAccessTokenActive = true;
            })
        }
    }

    if (to.matched.some(record => record.meta.requiresAuth)) {

        if (isAccessTokenActive) {
            if (to.meta?.roles && !isGranted(to.meta.roles)) {
                return next({name: '404'});
            }

            let userVerify = store.getters['AUTH_DATA'].verify;
            if (to.matched.some(record => record.meta.requiresVerify)) {
                if (userVerify === true) {
                    return next();
                } else {
                    return next({name: 'email-verification'});
                }
            }

            return next();
        }
        return next({
            path: '/login',
            query: {redirect: to.fullPath}
        });
    }
    next();
});
router.afterEach((to, from) => {
    store.commit('CHANGE_ROUTE', {from: from, to: to});
});

function isGranted(grantedRoles = []) {
    let roles = store.getters['AUTH_DATA']['userRoles'];
    roles = roles.filter(role => grantedRoles.includes(role));

    return roles.length > 0;
}

export default router;
