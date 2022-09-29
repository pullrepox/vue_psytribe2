import Vue from 'vue';
import Vuex from 'vuex';

import main from './modules/main.store';
import auth from './modules/auth.store';

// explore
import exploreGetAlbums from './modules/explore/getAlbums.store';
import exploreFilters from './modules/explore/exploreFilters.store';

// library
import libraryFilters from './modules/library/libraryFilters';

// profiles
import privateProfile from './modules/profiles/privateProfile.store';
import userProfile from './modules/profiles/userProfile.store';
import artistProfile from './modules/profiles/artistProfile.store';

import users from './modules/users.store';

import mediaObjects from './modules/mediaObjects.store';

import albums from './modules/albums.store';
import musicRelease from './modules/musicRelease.store';

import favoriteMusicRelease from './modules/favoriteMusicRelease.store';

import track from './modules/track.store';
import playLists from './modules/playLists.store';
import player from './modules/player.store';
import artist from './modules/artist.store';
import artistVerificationRequest from './modules/artistVerificationRequest.store';
import artistVerificationRequestComment from './modules/artistVerificationRequestComment.store';
import adminNotifications from './modules/adminNotifications.store';
import playlist from './modules/playlist.store';
import faqs from './modules/faqs.store';
import route from "@/store/modules/route.store";
import comments from './modules/comments.store';
import search from './modules/search.store';
import supporters from './modules/supporters.store';
import suggestions from './modules/suggestions';
import manageUploaded from './modules/manageUploaded.store';

//events
import events from './modules/events/events.store';
import tickets from './modules/events/tickets.store';

//mobile
import mobileExplore from './modules/mobile/explore.store';

import modules from './modules';

import follow from './modules/follow';

Vue.use(Vuex);

export default new Vuex.Store({
  actions: {
    reset({commit}) {
      // resets state of all the modules
      Object.keys(modules).forEach(moduleName => {
        commit(`${moduleName}/RESET`);
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  modules: {
    main,
    auth,

    // explore
    exploreGetAlbums,
    exploreFilters,

    // library
    libraryFilters,

    // profiles
    privateProfile,
    userProfile,
    artistProfile,

    users,
    mediaObjects,
    albums,
    musicRelease,
    manageUploaded,
    favoriteMusicRelease,
    track,
    playLists,
    player,
    artist,
    artistVerificationRequest,
    artistVerificationRequestComment,
    adminNotifications,
    playlist,
    faqs,
    route,
    comments,
    search,
    events,
    tickets,
    supporters,
    follow,
    suggestions,

    // mobile
    mobileExplore,

  },
});
