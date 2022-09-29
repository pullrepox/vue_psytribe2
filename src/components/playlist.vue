<template>
  <div class="playlist" v-if="showPlayList">

    <div class="tracks-wrapper" v-if="playList && playList.length">
      <transition-group name="fade-in-down"
                        tag="div"
                        leave="fade-in-down"
      >
        <div class="track" v-for="(track, index) of playList" :key="track.id">
          <div class="controls-wrapper">
            <button
                class="track_pause bounceIn"
                v-if="currentTrackPlaying(track.id) && playing"
                @click="pause"
            ></button>
            <button
                v-else
                class="track_play bounceIn"
                @click="play({track, album: currentTrackAlbum(track.id), index})"
            ></button>
            <!--          todo temporary solution for album cover-->
            <img :src="currentTrackAlbum(track.id).image" :alt="track.song.title">
          </div>
          <div class="title">
            {{track.song.title}}
          </div>
          <span class="time_end" v-if="duration && currentTrackPlaying(track.id)">{{ duration | minutes }}</span>
          <div class="expand">
            <i class="material-icons" v-if="!playListActions[track.id]" @click="showActionInPlaylist(track.id)">more_horiz</i>
            <i class="material-icons" v-else @click="closeAction(track.id)">close</i>
            <transition name="fade-in-down">
              <div class="actions-list" v-if="playListActions[track.id]">
                <div class="actions-list-item">Play Next</div>
                <div class="actions-list-item">Loop</div>
                <div class="actions-list-item" @click="removeTrack(track.id, index)">Remove</div>
                <div class="actions-list-item danger">Report</div>
              </div>
            </transition>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="empty-list">
      <p>Queue list is empty</p>
      <p>You can queue albums and tracks via... menu</p>
    </div>
    
    <div class="playlist_footer">
      <div class="left-conrols">
        <span>Continuous</span>
<!--          <input type="checkbox" checked>-->
        <b-switch v-model="isContinuous">
          {{ isContinuous }}
        </b-switch>
      </div>
      <div class="right-controls">
        <button class="clear" @click="clear">Clear</button>
        <span class="material-icons hide_playlist" @click="changePlaylistStatus(false)">arrow_drop_down</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "playlist",
  data() {
    return {
      duration: 0,
      currentAction: null,
      isContinuous: true
    }
  },
  computed: {
    ...mapGetters({
      showPlayList: 'SHOW_PLAY_LIST',
      playList: 'PLAY_LIST',
      playing: 'PLAYING',
      currentTrack: 'CURRENT_TRACK',
      sound: 'SOUND',
      albums: 'PLAY_LIST_ALBUMS',
      playListActions: 'PLAY_LIST_ACTIONS',
    }),
  },
  methods: {
    ...mapActions({
      changePlaylistStatus: 'CHANGE_PLAY_LIST_STATUS',
      clearPlaylist: 'CLEAR_PLAYLIST',
      clearAlbums: 'CLEAR_ALBUMS',
      play: 'SET_PLAY',
      pause: 'SET_PAUSE',
      removeTrackFromStore: 'REMOVE_TRACK',
      showActions: 'REMOVE_TRACK',
      showActionInPlaylist: 'SHOW_ACTION_IN_PLAYLIST',
      clearPlayListActions: 'CLEAR_PLAY_LIST_ACTIONS',
      closeAction: 'SET_PLAY_LIST_ACTIONS_STATUS',
    }),
    removeTrack(id, index) {
      this.closeAction(id);
      this.removeTrackFromStore(index)
    },
    currentTrackPlaying(id) {
      return this.currentTrack.id === id;
    },
    currentTrackAlbum(id) {
      return this.albums.find(album => (album.playList.find((track) => (track.id === id))));
    },
    clear() {
      this.clearPlaylist();
      this.clearAlbums();
      this.clearPlayListActions()
    }
  },
  watch: {
    playing: {
      handler: function (value) {
        let updateSeek;
        if (value) {
          updateSeek = setInterval(() => {
            this.duration = this.sound.duration();
          }, 250);
        } else {
          clearInterval(updateSeek);
        }
      },
      immediate: true
    },
  },
}
</script>
