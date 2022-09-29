import {Howl, Howler} from "howler";
// import createMultiTabState from 'vuex-multi-tab-state';
import axios from "axios";

export default {
    state: {
        currentTrack: null,
        currentTrackIdx: null,
        currentAlbum: null,
        currentFromPlay: '',

        sound: null,
        playing: false,
        playerStatus: false,
        shuffle: false,
        loop: false,
        muted: false,
        soundVolume: 60,
        player: {},
        volume: 0.5,
        duration: 0,
        alertNextAlbum: '',

        playedZone: [],
        trackList: [],
        playedOnlyFavTracks: false,

        trackOnload: false
    },
    mutations: {
        SET_SOUND(state, track) {
            Howler.unload();
            state.trackOnload = false;

            state.sound = new Howl({
                src: [track.link],
                html5: true,
                usingWebAudio:true,
                loop: state.loop,
                autoUnlock: true, // Automatically attempts to enable audio on mobile (iOS, Android, etc) devices and desktop Chrome/Safari.
                onload: () => {
                    state.trackOnload = true;
                    if (!state.playing) {
                        this.commit('SET_PLAY');
                    }
                },
                onplay: () => {
                    console.log('sound onplay');
                    state.duration = state.sound.duration();
                },
                onseek: () => {
                  console.log('sound onseek');
                },
                onpause: () => {
                    console.log('sound onpause');
                    state.playing = false;
                },
                onunlock: () => {
                    console.log('sound unlocked!');
                },
                onend: () => {
                    if (this.getters.IS_TOKEN_ACTIVE === false) {
                        let refreshToken = this.getters['AUTH_DATA'].refreshToken || localStorage.getItem('refreshToken');
                        this.dispatch('REFRESH_TOKEN', refreshToken);
                    }

                    if (!state.loop) {

                        // ALBUM playList
                        if (state.currentAlbum.playList) {
                            let nextTrackIdx;

                            if (state.shuffle === true) {
                                nextTrackIdx = Math.floor(Math.random() * this.getters['CURRENT_ALBUM'].playList.length);
                            } else if (state.playedOnlyFavTracks === true) {
                                nextTrackIdx = this.getters.favIndexFinder('next');
                                if (!nextTrackIdx) {
                                    // this.dispatch('SET_NEXT_ALBUM');
                                    this.dispatch('SKIP_ALBUM', 'next');
                                    return;
                                }
                            } else {
                                nextTrackIdx = state.currentTrackIdx + 1;
                            }
                            if (state.currentAlbum.playList && state.currentTrackIdx + 1 !== state.currentAlbum.playList.length) {
                                const nextTrack = {
                                    track: state.currentAlbum.playList[nextTrackIdx].song,
                                    index: nextTrackIdx,
                                    album: state.currentAlbum,
                                }
                                this.dispatch('SET_PLAY', nextTrack);
                            }
                        } else {

                            // TRACK-LIST
                            let nextTrackIdx;
                            if (state.shuffle === true) {
                                nextTrackIdx = Math.floor(Math.random() * state.trackList.length);
                            } else {
                                nextTrackIdx = state.currentTrackIdx + 1;
                            }
                            if (nextTrackIdx >= state.trackList.length) {
                                nextTrackIdx = 0;
                            }
                            const nextTrack = {
                                track: state.trackList[nextTrackIdx],
                                index: nextTrackIdx,
                                album: state.trackList[nextTrackIdx].playLists[0].musicRelease
                            }

                            this.dispatch('SET_PLAY', nextTrack);
                            return;
                        }
                    }


                    const currentPlaylist = this.getters['CURRENT_ALBUM'].playList;
                    const lastIndexTrack = currentPlaylist.length - 1;

                    if (currentPlaylist[lastIndexTrack].song.id === track.id) {
                        this.dispatch('SET_NEXT_ALBUM');
                    }
                },
            })
        },

        SET_PLAYED_ZONE: (state, data) => {
            state.playedZone = data;
        },
        SET_TRACK_LIST: (state, data) => {
            state.trackList = data;
        },
        SET_PLAYED_ONLY_FAV_TRACKS: (state, data) => {
            state.playedOnlyFavTracks = data;
        },
        SET_CURRENT_FROM_PLAY(state, data) {
            state.currentFromPlay = data;
        },
        SET_CURRENT_TRACK(state, data) {
            state.currentTrack = data;
        },
        SET_CURRENT_TRACK_INDEX(state, data) {
            state.currentTrackIdx = data;
        },
        SET_CURRENT_ALBUM(state, data) {
            state.currentAlbum = data;
        },
        SET_CURRENT_PLAYING(state, status = true) {
            state.playing = status;
        },
        SET_PLAY(state) {
            state.sound.play();
            state.sound.on('end', function () {
                console.log('Finished!');
                state.playing = false;
            });
        },
        SET_STOP(state) {
            state.sound.stop();
        },
        SET_PAUSE(state) {
            state.sound.pause();
        },
        SET_PLAYER_STATUS(state, status) {
            state.playerStatus = status;
        },
        SET_SHUFFLE(state) {
            state.shuffle = !state.shuffle;
        },
        SET_LOOP(state) {
            state.loop = !state.loop;
            state.sound.loop(state.loop);
        },
        SET_MUTED(state) {
            state.muted = !state.muted;
            state.sound.mute(state.muted);
        },
        SET_SOUND_VOLUME(state, data) {
            state.player.volume(data);
        },
        SET_PLAYER(state) {
            state.player = Howler;
        },
        SET_IS_LISTENED_ALBUM(state, data) {
            data.isListened = true;
            console.log(data.title, data.isListened);
        },
        SET_ALERT_NEXT_ALBUM: (state, data) => {
            state.alertNextAlbum = data;
        },
    },
    actions: {
        SET_PLAY({commit, state}, {
            fromPlay,
            track = state.currentTrack,
            index = state.currentTrackIdx,
            album = state.currentAlbum,
            isDiscoveryStatus = false
        }) {

            // set album logic
            if (isDiscoveryStatus) {
                console.log('isDiscoveryStatus true - SET_IS_LISTENED_ALBUM');
                commit('SET_IS_LISTENED_ALBUM', album);
            }
            commit('SET_CURRENT_ALBUM', album);
            if (!state.playerStatus) {
                commit('SET_PLAYER_STATUS', true);
            }

            // set track logic
            commit('SET_CURRENT_TRACK_INDEX', index);

            if (state.currentTrack && state.currentTrack.id !== track.id) {
                commit('SET_STOP');
                commit('SET_CURRENT_TRACK', track);
                commit('SET_SOUND', track, index, album);
            } else {
                if (!state.currentTrack && !state.sound) {
                    commit('SET_CURRENT_TRACK', track);
                    commit('SET_SOUND', track, index, album);
                }
            }

            commit('SET_CURRENT_FROM_PLAY', fromPlay);
            if (fromPlay !== 'track_default') {
                this.dispatch('INCREASE_PLAYED_MUSIC_RELEASE', {'musicReleaseID': album.id});
            }

            commit('SET_PLAY');
            commit('SET_CURRENT_PLAYING');
            commit('SET_PLAYER');
        },

        SET_PLAYED_ONLY_FAV_TRACKS({commit}, data) {
            commit('SET_PLAYED_ONLY_FAV_TRACKS', data);
        },
        SET_PLAYED_ZONE({commit}, data) {
            commit('SET_PLAYED_ZONE', data);
        },
        SET_TRACK_LIST({commit}, data) {
            commit('SET_TRACK_LIST', data);
        },
        SET_PAUSE({commit}) {
            commit('SET_CURRENT_PLAYING', false);
            commit('SET_PAUSE');
        },

        // STOP
        STOP_PLAY({commit}) {
            commit('SET_STOP');
            commit('SET_CURRENT_TRACK', null);
            commit('SET_CURRENT_TRACK_INDEX', null);
            commit('SET_CURRENT_ALBUM', null);
            commit('SET_CURRENT_PLAYING', false);
            commit('SET_PLAYER_STATUS', false);
        },
        TOGGLE_SHUFFLE({commit}) {
            commit('SET_SHUFFLE');
        },
        TOGGLE_LOOP({commit}) {
            commit('SET_LOOP')
        },
        TOGGLE_MUTE({commit}) {
            commit('SET_MUTED')
        },


        SKIP_TRACK({state}, direction) {
            let index = 0;
            let lastIndex;

            if (state.currentAlbum.playList) {
                lastIndex = state.currentAlbum.playList.length - 1;
                if (this.shuffle) {
                    index = Math.round(Math.random() * lastIndex);
                    while (index === state.currentTrackIdx) {
                        index = Math.round(Math.random() * lastIndex);
                    }
                }
            }

            if (direction === 'prev') {

                // find index prev track
                index = state.currentTrackIdx - 1;

                // album playList
                if (state.currentAlbum.playList) {
                    if (state.playedOnlyFavTracks === true) {
                        index = this.getters.favIndexFinder(direction);
                        if (!index) {
                            this.dispatch('SKIP_ALBUM', 'prev');
                            return;
                        }
                    }
                    if (index < 0) {
                        this.dispatch('SKIP_ALBUM', 'prev');
                        return;
                    }
                } else {

                    // trackList
                    index = state.trackList.length - 1;
                }
            }
            if (direction === 'next') {

                // find index next track
                index = state.currentTrackIdx + 1;

                // album playList
                if (state.currentAlbum.playList) {
                    if (state.playedOnlyFavTracks === true) {
                        index = this.getters.favIndexFinder(direction);
                        if (!index) {
                            this.dispatch('SKIP_ALBUM', 'next');
                            return;
                        }
                    }
                    if (index >= state.currentAlbum.playList.length) {
                        // index = 0;
                        this.dispatch('SKIP_ALBUM', 'next');
                        return;
                    }
                }
            }

            let track;
            let album;

            // album playList
            if (state.currentAlbum.playList) {
                if (index < 0) {
                    index = 0;
                }
                track = state.currentAlbum.playList[index].song;
                album = state.currentAlbum;
                console.log('(albumPlaylist) skip tracks', index, track, album);
            } else {

                // trackList
                if (index >= state.trackList.length) {
                    index = 0;
                }
                track = state.trackList[index];
                album = track.playLists[0].musicRelease;
                console.log('(trackList) skip tracks', index, track, album);
            }


            let skipTrack = {track: track, index, album};
            this.dispatch('SET_PLAY', skipTrack);
        },

        // SET_NEXT_ALBUM
        SKIP_ALBUM({commit, state}, direction) {
            const albums = this.getters['PLAYED_ZONE'];

            if (albums.length) {
                const currAlbumIdx = albums.findIndex((({id}) => id === state.currentAlbum.id));

                let skipAlbum;
                let trackIndex = 0;

                if (direction === 'prev') {
                    skipAlbum = albums[currAlbumIdx - 1];

                    if (currAlbumIdx <= 0) {
                        skipAlbum = albums[albums.length - 1];
                    }

                } else {
                    if (currAlbumIdx + 1 === albums.length) {
                        skipAlbum = albums[0];
                    } else {
                        skipAlbum = albums[currAlbumIdx + 1];
                    }
                }


                if (state.playedOnlyFavTracks === true) {
                    let favPlaylist = [];
                    for (let i = 0; i < skipAlbum.playList.length; i++) {
                        if (skipAlbum.playList[i].song.isFavorite) {
                            favPlaylist.push(i);
                        }
                    }
                    trackIndex = favPlaylist[0];
                    console.log('skip album, tracks index', trackIndex);
                }
                const data = {
                    fromPlay: 'album_default',
                    track: skipAlbum.playList[trackIndex].song,
                    index: 0,
                    album: skipAlbum,
                    isDiscoveryStatus: this.getters['DISCOVERY']
                }
                commit('SET_ALERT_NEXT_ALBUM', data);
                this.dispatch('SET_PLAY', data);
            } else {
                console.log('none Played-Zone!');
            }
        },

        SET_NEXT_ALBUM({commit, state}) {
            const albums = this.getters['PLAYED_ZONE'];

            if (albums.length) {
                const currAlbumIdx = albums.findIndex((({id}) => id === state.currentAlbum.id));

                let nextAlbum;
                if (currAlbumIdx + 1 === albums.length) {
                    nextAlbum = albums[0];
                } else {
                    nextAlbum = albums[currAlbumIdx + 1];
                }
                const data = {
                    fromPlay: 'album_default',
                    track: nextAlbum.playList[0].song,
                    index: 0,
                    album: nextAlbum,
                    isDiscoveryStatus: this.getters['DISCOVERY']
                }
                commit('SET_ALERT_NEXT_ALBUM', data);
                this.dispatch('SET_PLAY', data);
            } else {
                console.log('none Played-Zone!');
            }
        },

        SET_SOUND_VOLUME({commit, state}, data) {
            commit('SET_SOUND_VOLUME', data);
            if (+data < 0.2) {
                commit('SET_MUTED');
            }
            if (+data > 0.1 && state.sound._muted) {
                commit('SET_MUTED', false);
            }
        },
        ADD_TRACK_RATING({commit}, params) {
            return axios.post(`song_rating/${params.trackID}`, {'value': params.rating})
                .then(() => {
                    console.log('ADD_TRACK_RATING', params);
                })
                .catch(error => console.log(`ADD_TRACK_RATING ${error}, ${params}`));
        },
        ADD_SONG_STATISTIC({commit}, params) {
            // Available values : downloaded, purchased, listened_to
            return axios.post(`add_song_statistic/${params.value}`, {'song_id': params.id})
                .then(response => {

                })
                .catch(err => {
                    console.log(`ADD_SONG_STATISTIC, ${err}`);
                })
        },
    },
    getters: {
        CURRENT_FROM_PLAY: (state) => state.currentFromPlay,
        CURRENT_TRACK: (state) => state.currentTrack,
        CURRENT_ALBUM: (state) => state.currentAlbum,
        PLAYING: (state) => state.playing,
        PLAYER_STATUS: (state) => state.playerStatus,
        SOUND: (state) => state.sound,
        SHUFFLE: (state) => state.shuffle,
        CURRENT_TRACK_IDX: (state) => state.currentTrackIdx,
        LOOP: (state) => state.loop,
        MUTED: (state) => state.muted,
        DURATION: (state) => state.duration,
        ALERT_NEXT_ALBUM: (state) => state.alertNextAlbum,
        PLAYED_ZONE: (state) => state.playedZone,
        TRACK_LIST: state => state.trackList,
        PLAYED_ONLY_FAV_TRACKS: (state) => state.playedOnlyFavTracks,
        TRACK_ONLOAD: state => state.trackOnload,

        favIndexFinder: (state) => (direction) => {
            let currentPlayingIndex = -1;
            let favPlaylist = [];

            for (let i = 0; i < state.currentAlbum.playList.length; i++) {
                if (state.currentAlbum.playList[i].song.isFavorite) {
                    favPlaylist.push(i);
                }
                if (state.currentTrack.id === state.currentAlbum.playList[i].song.id) {
                    currentPlayingIndex = i;
                }
            }
            const favIndex = favPlaylist.findIndex(x => x === currentPlayingIndex);

            let index = 0;
            if (direction === 'next') {
                index = favIndex + 1;
                if (index >= favPlaylist.length) {
                    // index = 0;
                    index = -1;
                }
            } else {
                index = favIndex - 1;
                if (index < 0) {
                    // index = favPlaylist.length - 1;
                    index = -1;
                }
            }

            return favPlaylist[index];
        }
    },
    // plugins: [createMultiTabState({
    //     statesPaths: ['currentTrack'],
    // })],
}
