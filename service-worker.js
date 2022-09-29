/* eslint-disable no-undef, no-restricted-globals */

// This is the code piece that GenerateSW mode can't provide for us.
// This code listens for the user's confirmation to update the app.
import {clientsClaim} from 'workbox-core';
clientsClaim();
self.addEventListener('message', event => {
    console.log(event);
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// workbox.clientsClaim();

// The precaching code provided by Workbox.

self.__precacheManifest = [].concat(self.__precacheManifest || []);
// workbox.precaching.suppressWarnings();
// workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
workbox.core.setCacheNameDetails({prefix: "vue-pwa"});

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
