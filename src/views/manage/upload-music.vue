<template>
    <div class="upload-music">

        <div class="container">
            <div class="page-title">
                <template v-if="!EDIT_ALBUM_ID">Add Music</template>
                <template v-if="EDIT_ALBUM_ID">Edit Album</template>
            </div>
            <section class="card">
                <h2 class="name_section">Files
                    <span>Drag to change order</span></h2>
                <div class="body">
                    <draggable v-if="uploadedTracks.length" v-model="uploadedTracks" class="uploaded-tracks"
                               v-bind="dragOptions" @start="isDragging = true" @end="isDragging = false">
                        <div v-for="(track, index) in uploadedTracks" :key="index" class="uploaded-tracks-item">
                            <div class="_name">
                                <span class="label">Track: {{ index + 1 }}</span>
                                <span class="value">{{ track.name }}</span>
                            </div>
                            <div class="_bpm">
                                <span class="label">BPM</span>
                                <span class="value">
                                    <input type="text" v-model="track.bpm">
                                </span>
                            </div>
                            <div class="_key">
                                <span class="label">Key</span>
                                <span class="value">
                                    <input type="text" v-model="track.key">
                                </span>
                            </div>
                        </div>
                    </draggable>

                    <div class="upload-controls">
                        <input
                            type="file"
                            hidden
                            multiple
                            ref="uploadForm"
                            accept=".mp3, .wav, .aif, .flac"
                            @change="handleFileUpload($event)">
                        <button type="button" v-ripple class="primary_btn large" @click="selectFile">Select</button>
                        <span class="description_">300 MB limit per track <br>MP3, WAV, AIF, FLAC</span>
                    </div>
                </div>
            </section>

            <section class="card">
                <h2 class="name_section">Cover</h2>
                <div class="body">
                    <div class="image-wrapper">

                        <v-dialog
                            v-model="clipperDialog"
                            width="500">
                            <div class="photo_clipper">
                                <clipper-fixed
                                    preview="avatarPreview"
                                    ref="clipper"
                                    :ratio="1"
                                    class="basic lg clipper-fixed"
                                    :src="imageUrl"
                                    bg-color="#10182B"
                                    :round="false"
                                    :grid="false"
                                    shadow="rgba(0,0,0,0.8)"
                                    :area="50"
                                    :handle-zoom-event="handleZoom"
                                    @load="imgAvaLoad"
                                    :rotate="0">
                                    <div slot="placeholder">No image</div>
                                </clipper-fixed>

                                <clipper-range v-model="scale" :min="0.1" :max="2"></clipper-range>

                                <div class="actions_clipper_photo">
                                    <button type="button" class="tetriatary_btn small" @click="clipperDialog = false" v-ripple>Close</button>

                                    <!-- Upload New Photo -->
                                    <input type="file" hidden ref="cover_image" accept="image/png, image/jpeg" @change="photoUpload">
                                    <button type="button" class="primary_btn small" @click="changeAva()" v-ripple>Upload New Photo</button>
                                    <button type="button" class="clip_photo primary_btn small" @click="clipImage" v-ripple>Save</button>
                                </div>
                            </div>
                        </v-dialog>


                        <div class="select_cover_album" @click="toogleClipperDialog">
                            <img class="cover_select_img" :src="imageUrl" alt="">
                            <span class="select_img">Select</span>
                        </div>

                        <span class="description_">10 MB limit<br> 1000 x 1000 pixels or larger<br> JPG, PNG </span>
                    </div>
                </div>
            </section>

            <section class="card">
                <h2 class="name_section">Details</h2>
                <div class="body">
                    <div class="details full_width">
                        <input type="text" placeholder="Title" class="input-style-2" v-model="details.title">
                        <textarea name="" cols="30" rows="4" placeholder="Description" class="textarea-style-2"
                                  v-model="details.description"></textarea>

                        <div class="input-style-2 tags">
                            <div>
                                <v-chip v-for="(item, index) in details.tags" :key="index" close class="mx-1 my-3"
                                        @click:close="details.tags.splice(index,1)">
                                    {{ item }}
                                </v-chip>
                                <input type="text" placeholder="Tags" @keypress="addTag($event)" v-model="newTag"
                                       @keyup.delete="removeTag($event)" :disabled="details.tags.length >=5">
                            </div>
                            <div class="count_tags">{{ details.tags.length }}/5</div>
                        </div>

                        <div class="row_fields">
                            <div class="dropdown_style" :class="{'disabled': !GENRES.length}">
                                <v-menu offset-y content-class="navy_blue">
                                    <template v-slot:activator="{ on, attrs }">
                                        <input type="text" placeholder="Genre" required v-bind="attrs" v-on="on"
                                               v-model="genre" :disabled="!GENRES.length">
                                    </template>

                                    <v-list>
                                        <v-list-item v-for="item of GENRES" :key="item.id"
                                                     @click="selectGenre(item.name)"
                                                     :class="{'active': item.name === genre}">
                                            <button type="button" v-ripple>{{ item.name }}
                                                <span>({{ item.subGenres.length }})</span></button>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </div>
                            <div class="dropdown_style" :class="{'disabled': !subgenres.length}">
                                <v-menu offset-y content-class="navy_blue">
                                    <template v-slot:activator="{ on, attrs }">
                                        <input type="text" placeholder="Sub Genre" required v-bind="attrs" v-on="on"
                                               v-model="subgenre" :disabled="!subgenres.length">
                                    </template>

                                    <v-list>
                                        <v-list>
                                            <v-list-item v-for="item in subgenres" :key="item.id"
                                                         @click="selectSubgenre(item)"
                                                         :class="{'active': item.subgenre === subgenre}">
                                                <button type="button" v-ripple>{{ item.name }}</button>
                                            </v-list-item>
                                        </v-list>
                                    </v-list>
                                </v-menu>
                            </div>
                            <div class="dropdown_style">
                                <v-menu
                                    ref="menu1"
                                    v-model="menu1"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="auto">
                                    <template v-slot:activator="{ on, attrs }" v-on="on">
                                        <input type="text" v-model="datePicker" v-bind="attrs" v-on="on"
                                               placeholder="Release Date">
                                    </template>
                                    <v-date-picker
                                        v-model="datePicker"
                                        no-title
                                        :weekday-format="getDay"
                                        @input="menu1 = false"
                                    ></v-date-picker>
                                </v-menu>

                            </div>
                        </div>


                        <div class="row_fields">
                            <div class="dropdown_style">
                                <v-menu offset-y content-class="navy_blue">
                                    <template v-slot:activator="{ on, attrs }">
                                        <input type="text" placeholder="Artist" required v-bind="attrs" v-on="on" v-model="details.artist.name">
                                    </template>

                                    <v-list>
                                        <v-list-item v-ripple>
                                            <button type="button" class="create_artist_page">+ Create new artist page</button>
                                        </v-list-item>
                                        <v-list-item v-ripple v-for="artist of YOUR_ARTISTS" :key="artist.id">
                                            <button type="button" @click="setArtist(artist)">
                                                {{ artist.name }}
                                            </button>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="card">
                <h2 class="name_section">Commerce</h2>
                <div class="body">
                    <div class="publish_album_free">
                        <div class="material_checkbox">
                            <input type="checkbox" id="publish-free" v-model="publishFree">
                            <label for="publish-free">Publish this album as free for all under <a
                                href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">Creative
                                Commons License</a></label>
                        </div>

                        <div class="alert_text" v-if="publishFree">
                            Your album will be published free of charge and supporters will not be able to pay for it.
                            To allow supporters to pay what they want, set the Album Price to $0
                        </div>
                    </div>
                    <div class="accept_payments" v-if="!stripe && !publishFree">
                        <span>To accept payments</span>
                        <button type="button" class="c2a_btn large" @click="getStripe">Get Stripe</button>
                    </div>
                    <div class="wrap_album_price" v-if="stripe && !publishFree">
                        <div class="row_price">
                            <input type="text" placeholder="Album Price" class="input-style-2"
                                   v-on:keypress="numbersOnly" v-model="albumPrice">
                            <label for="">Set the price $0 to let supporters pay what they want</label>
                        </div>
                        <div class="allow_tracks">
                            <div class="material_checkbox">
                                <input type="checkbox" id="allow_tracks" v-model="allowTracksChecked">
                                <label for="allow_tracks">Allow tracks to be sold individually</label>
                            </div>
                        </div>
                        <div class="tracks_list" v-if="allowTracksChecked">
                            <div v-for="(track, index) of uploadedTracks" :key="index" class="item_track">
                                <span class="track_name">{{ track.name }}</span>
                                <div class="track_price">
                                    <span>$</span>
                                    <input type="text" class="" v-on:keypress="numbersOnly">
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="attention" v-if="publishFree">
                <h2 class="name_section">Attention</h2>
                <div class="body">
                    <div class="descript_text">
                        Free releases must maintain an average of at least 4.2 rating after 20 or more votes. <br>Releases
                        that do not meet this criteria will be removed.
                    </div>
                    <div class="understand">
                        <div class="material_checkbox red_checkbox">
                            <input type="checkbox" id="understand" v-model="understandChecked">
                            <label for="understand">I understand</label>
                        </div>
                    </div>
                </div>
            </section>

            <div class="buttons_wrapper">
                <button type="button" v-ripple class="primary_btn x_large" @click="savaData">Continue</button>
                <button type="button" v-ripple class="tetriatary_btn x_large">Save & Exit</button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import draggable from 'vuedraggable';
import {baseUrlToBlob} from "@/utils/baseUrlToBlob";

export default {
    name: "musicUpload",
    components: {
        draggable,
    },
    data() {
        return {
            // upload tracks
            uploadedTracks: [],
            tracks: [],

            // upload image
            scale: 1,
            clipperDialog: false,
            coverImage: '',
            imageUrl: '',

            // albumDetails
            details: {
                title: '',
                description: '',
                tags: [],
                artist: {
                    id: '',
                    name: ''
                }
            },
            genre: '',
            subgenres: '',
            subgenre: '',
            newTag: '',
            datePicker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            menu1: false,
            menu2: false,
            daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            stripe: false,
            publishFree: false,
            allowTracksChecked: false,
            understandChecked: false,
            albumPrice: '',
            formValid: false,
        }
    },
    watch: {
        scale(val) {
            this.$refs.clipper.setWH$.next(+val);
        },
        genre() {
            this.subgenre = '';
            let subgenreList = this.GENRES.find(el => el.name === this.genre);
            this.subgenres = subgenreList.subGenres;
        },
    },
    computed: {
        ...mapGetters([
            'userID', 'GENRES', 'PROFILE_DATA', 'YOUR_ARTISTS', 'PREPARE_ADD_TRACKS', 'FILE_URL',
            'EDIT_ALBUM_ID', 'ALBUM', 'TEMP_CREATED_ALBUMS_ID'
        ]),
        dragOptions() {
            return {
                animation: 0,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            };
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        // 1. Files -> tracks
        // 2. Cover -> image
        // 3. Details -> albumDetails
        // 4. Commerce -> albumDetails (price)

        ...mapActions([
            'GET_GENRES', 'GET_PROFILE', 'GET_YOUR_ARTISTS',
            'ADD_SONGS', 'ADD_FILE', 'ADD_MUSIC_RELEASE', 'SEND_TRACK',
            'GET_ALBUM',
            'ADD_TO_PLAYLIST'
        ]),

        getData() {
            if (this.EDIT_ALBUM_ID) {
                this.GET_ALBUM(this.EDIT_ALBUM_ID).then(() => {
                    this.imageUrl.url = this.ALBUM.bigImage;
                    this.details.title = this.ALBUM.title;
                    this.details.description = this.ALBUM.description;
                    this.details.tags = this.ALBUM.tags;
                    this.details.artist.id = this.ALBUM.artist.id;
                    this.details.artist.name = this.ALBUM.artist.name;

                    this.uploadedTracks = this.ALBUM.playList;
                })
            }
            this.GET_YOUR_ARTISTS({owner: this.userID}).catch(err => console.log(`GET_YOUR_ARTISTS, ${err}`));
            this.GET_GENRES().catch(err => console.log(`GET_GENRES, ${err}`));
        },
        getDay(date) {
            let i = new Date(date).getDay(date);
            return this.daysOfWeek[i];
        },

        // upload tracks
        selectFile() {
            this.$refs.uploadForm.click();
        },
        handleFileUpload(event) {
            for (let track = 0; track < event.target.files.length; track++) {

                event.target.files[track].artist = {"name": "SWS"};
                event.target.files[track].title = event.target.files[track].name;

                this.uploadedTracks.push(event.target.files[track]);


                // let song = {
                //     title: event.target.files[track].name,
                //     duration: 0,
                //     description: 'test description',
                //     bpm: 0,
                //     key: null,
                //     artist: {
                //         "name": "SWS"
                //     },
                //     price: 0,
                // }
                // this.SEND_TRACK(event.target.files[track]).then((response) => {
                //     console.log('response', response);
                // })
            }

            console.log('uploadedTracks', this.uploadedTracks);
        },
        sendTracks() {
            // for (let track of this.uploadedTracks) {
            //     let song = {
            //         title: track.title,
            //         bpm: +track.bpm,
            //         artist: track.artist
            //     }
            //     this.ADD_SONGS(song)
            //         .then(() => {
            //             let formData = new FormData();
            //             formData.append('file', track);
            //             formData.append('song_id', this.PREPARE_ADD_TRACKS.id)
            //
            //             this.SEND_TRACK(formData)
            //                 .then(() => {
            //
            //                 })
            //                 .catch(err => console.log(`SEND_TRACK, ${err}`));
            //
            //         })
            //         .catch(err => {
            //             console.log(`sendTracks, ${err}`)
            //         })
            // }
        },
        filesUploaded(event) {
            let file = this.$refs.uploadForm.files[0];
            console.log('file', file);

            // if (event.target.files && event.target.files.length) {
            // this.uploadedTracks.push({song: event.target.files[0]});

            // let formData = new FormData();
            // formData.append('file', event.target.files[0]);
            //
            // let song = {
            //     title: event.target.files[0].name,
            //     duration: 0,
            //     description: 'test description',
            //     bpm: 0,
            //     key: null,
            //     artist: {
            //         "name": "SWS"
            //     },
            //     price: 0,
            // }

            // this.ADD_SONGS(song).then((response) => {
            //     console.log('response', response);
            //     // const params = {
            //     //     track: formData
            //     // }
            //     // this.SEND_TRACK(params).then(() => {
            //     //
            //     // }).catch(err => console.log(`SEND_TRACK, ${err}`));
            // }).catch((err) => {
            //     console.log(`ADD_SONGS, ${err}`)
            // });
            // }
        },


        // upload cover img album
        imgAvaLoad() {
            this.scale = 1;
            this.$refs.clipper.setWH$.next(1);
        },
        handleZoom(scale) {
            if (!isNaN(scale)) {
                const limitedScale = Math.max(Math.min(2, scale), 0.1);
                this.scale = limitedScale;
                return limitedScale;
            }
        },
        toogleClipperDialog() {
            this.clipperDialog = !this.clipperDialog;
        },
        changeAva() {
            this.$refs.cover_image.click();
        },
        photoUpload() {
            this.coverImage = this.$refs.cover_image.files[0];
            this.scale = 1;

            // // pre load image url
            const fileReader = new FileReader();
            fileReader.addEventListener('load', () => {
                this.imageUrl = fileReader.result;
            });
            fileReader.readAsDataURL(this.coverImage);
        },
        clipImage: function () {
            const canvas = this.$refs.clipper.clip();
            let dataURL = canvas.toDataURL("image/jpeg", 1); // canvas->image (base64)
            this.coverImage = baseUrlToBlob(dataURL);

            this.clipperDialog = false;


            // pre load image url
            const fileReader = new FileReader();
            fileReader.addEventListener('load', () => {
                this.imageUrl = fileReader.result;
            });
            fileReader.readAsDataURL(this.coverImage);

            // let formData = new FormData();
            // formData.append('file', this.coverImage);
            //
            // const userData = {
            //     id: this.PROFILE_DATA.id,
            // }
            // this.ADD_FILE(formData)
            //     .then(() => {
            //         userData.photo = this.FILE_URL;
            //     })
            //     .catch(err => console.log(`ADD_FILE (private profile), ${err}`))
            //     .finally(() => {
            //         this.CHANGE_USER_DATA(userData).catch(err => {
            //             console.log(`saveUserData, ${err}`);
            //         })
            //     })
        },


        // Album Details
        selectGenre(name) {
            this.genre = name;
        },
        selectSubgenre(subgenre) {
            this.subgenre = subgenre.name;
        },
        addTag(evt) {
            evt = (evt) ? evt : window.event;
            let charCode = (evt.which) ? evt.which : evt.keyCode;

            // Enter || Space || Comma
            if (charCode === 13 || charCode === 32 || charCode === 44) {
                evt.preventDefault();
                this.details.tags.push(this.newTag);
                this.newTag = '';
            }
        },
        removeTag(ev) {
            if (ev.key === 'Backspace') {
                this.details.tags.splice(-1, 1);
            }
        },
        getStripe() {
            this.stripe = true;
        },
        numbersOnly(evt) {
            evt = (evt) ? evt : window.event;
            const charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        setArtist(artist) {
            this.details.artist.id = artist.id;
            this.details.artist.name = artist.name;
        },


        async savaData() {
            // this.sendTracks();

            // prepare coverImage File
            let formData = new FormData();
            formData.append('file', this.coverImage);

            const albumDetails = {
                title: this.details.title,
                artist: `artists/${this.details.artist.id}`,
                description: this.details.description,
                // image:string
                // bigImage:string
                // smallImage:string // *** added after receiving the image link
                // preview
                // links
                type: 'album',
                tags: this.details.tags,
                price: this.publishFree ? 0 : +this.albumPrice,
                // downloadLink
                subgenres: [this.subgenre],
                createdAt: new Date(this.datePicker).toISOString(),
            };

            // :TODO this need verification data
            // if (this.coverImage && albumDetails.title && albumDetails.description && albumDetails.tags.length && albumDetails.subgenres.length) {
            // this.ADD_FILE(formData)
            //     .then(() => {
            //         albumDetails['smallImage'] = this.FILE_URL;
            //     })
            //     .catch(err => console.log(`ADD_FILE (artist), ${err}`))
            //     .finally(() => {
            //         console.log('albumDetails', albumDetails);
            //         this.ADD_MUSIC_RELEASE(albumDetails)
            //             .then(() => {
            //                 console.log('ADD_MUSIC_RELEASE', albumDetails);
            //             })
            //             .catch(err => console.log(`createMusicRelease, ${err}`));
            //     })


            this.ADD_MUSIC_RELEASE(albumDetails)
                .then(() => {
                    console.log('ADD_MUSIC_RELEASE', albumDetails);

                    if (this.TEMP_CREATED_ALBUMS_ID && this.uploadedTracks.length) {
                        for (let track of this.uploadedTracks) {
                            let song = {
                                title: track.title,
                                bpm: +track.bpm,
                                artist: track.artist,
                            }
                            this.ADD_SONGS(song)
                                .then(() => {
                                    let formData = new FormData();
                                    formData.append('file', track);
                                    formData.append('song_id', this.PREPARE_ADD_TRACKS.id)

                                    if (this.PREPARE_ADD_TRACKS.id) {
                                        let params = {
                                            'musicRelease': `/music_releases/${this.TEMP_CREATED_ALBUMS_ID}`,
                                            'song': `/songs/${this.PREPARE_ADD_TRACKS.id}`,
                                            'position': 0,
                                            'isPublic': true
                                        }
                                       this.ADD_TO_PLAYLIST(params)
                                            .then(() => {
                                                console.log('added to playlists', params);
                                            })
                                            .catch(err => {
                                                console.log(`ADD_TO_PLAYLIST, ${err}`);
                                            })

                                        this.SEND_TRACK(formData)
                                            .then(() => {

                                            })
                                            .catch(err => console.log(`SEND_TRACK, ${err}`));
                                    }


                                })
                                .catch(err => {
                                    console.log(`sendTracks, ${err}`)
                                })
                        }

                    }


                })
                .catch(err => console.log(`createMusicRelease, ${err}`));
            //
            // } else {
            //     alert('no data');
            // }
        },
    }
}
</script>
<style lang="scss">
@import "../../assets/styles/base/mixins";

@mixin addImageAlbum($fill) {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='157' height='97' viewBox='0 0 157 97' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M96 28C103.732 28 110 21.732 110 14C110 6.26801 103.732 0 96 0C88.268 0 82 6.26801 82 14C82 21.732 88.268 28 96 28ZM9 97C4.02944 97 0 92.9706 0 88V83.3199C0 81.4135 0.605399 79.5563 1.72892 78.016L34.4807 33.1169C37.8861 28.4484 44.7461 28.1531 48.5402 32.5117L76.8689 65.0557C80.1267 68.7984 85.7992 69.1981 89.5498 65.9494L113.34 45.3421C116.786 42.3576 121.919 42.4205 125.29 45.4885L154.057 71.667C155.932 73.3726 157 75.7893 157 78.3234V88C157 92.9706 152.971 97 148 97H9Z' fill='%23#{$fill}'/%3e%3c/svg%3e ");
    background-repeat: no-repeat;
}

@mixin dropdown($fill) {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='11' height='7' viewBox='0 0 11 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0.444716 2.565L4.32972 6.45C4.91472 7.035 5.85972 7.035 6.44472 6.45L10.3297 2.565C11.2747 1.62 10.5997 0 9.26472 0H1.49472C0.159716 0 -0.500284 1.62 0.444716 2.565Z' fill='%23#{$fill}'/%3e%3c/svg%3e ");
    background-repeat: no-repeat;
}

.dropdown_style {
    > input {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #040A18;
        border: 1px solid #282C47;
        border-radius: 5px;
        height: 63px;
        padding: 0 16px;
        font-size: 16px;
        color: rgba(#7481A6, .8);
        @include dropdown('5F6986');
        background-position: 95% center;
    }

    &.disabled {
        > input {
            border: 1px solid #282C47;

            &:hover {
                border: 1px solid #282C47;
            }
        }
    }

    &:hover {
        > input {
            border-color: rgba(#282C47, .8)
        }
    }
}


.buttons_wrapper {
    display: flex;
    margin-top: 24px;
    margin-bottom: 150px;

    > button {
        width: 225px;

        &:first-child {
            margin-right: 32px;
        }
    }
}

.select_tracks {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 48px;
    background-color: #5F6986;
    border-radius: 50px;
    color: #fff;
    letter-spacing: 0.03em;
    font-size: 18px;
}

.page-title {
    font-size: 64px;
    line-height: 150%;
    color: #DCDCDC;
    font-weight: 500;
    margin-top: 32px;
}

.form-margin-top {
    margin-top: 10px;
}

.card {
    display: flex;
    padding: 32px 30px 32px 64px;
    background-color: #10182B !important;
    border-radius: 5px;
    margin-bottom: 8px;


    .upload-btn {
        background-color: #5F6986;
    }

    .select_cover_album {
        width: 158px;
        height: 158px;
        display: flex;
        cursor: pointer;
        flex-direction: column;
        justify-content: flex-end;
        border: 1px solid #414366;
        border-radius: 5px;
        overflow: hidden;
        transition: 0.25s;
        position: relative;
        @include addImageAlbum('2E3548');
        background-position: center 37px;

        .cover_select_img {

        }

        .select_img {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 30px;
            min-height: 30px;
            background-color: #5F6986;
            color: #fff;
            letter-spacing: 0.03em;
            font-weight: 500;
            font-size: 14px;
            z-index: 1;
            transition: 0.25s;
            position: absolute;
            bottom: 0;
            width: 100%;
        }

        &:hover {
            @include addImageAlbum('3e4556');
            border-color: #484a6c;

            .select_img {
                background-color: #6F7A99;
            }
        }

        &:active {
            @include addImageAlbum('474e5e');

            .select_img {
                background-color: #818BA6;
            }
        }

    }

    .image-wrapper {
        display: flex;
        align-items: center;
    }

    .plan-wrapper {
        margin: 20px 0;
        display: flex;
        align-items: center;

        span {
            margin: 0 25px;
        }
    }

    .upload-form {
        input, textarea {
            background-color: #031020;

            &::placeholder {
                color: #fff;
            }
        }

        .control-label:hover {
            color: white;
        }

        .taginput-container {
            background-color: #031020;
        }

        select {
            background-color: #031020;
            color: #fff;

            option {
                color: #fff;
            }
        }
    }

    .checkbox {
        color: white;
    }

    .details {
        &.full_width {
            width: 100%;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
        }

        > input, textarea, .row_fields, .tags {
            margin-bottom: 16px;
        }

        .tags {
            > div {
                > input {
                    height: 100%;
                }

                &.count_tags {
                    display: flex;
                    align-items: center;
                }
            }
        }

        .row_fields {
            display: flex;
            justify-content: space-between;
            width: 100%;

            > div {
                flex-basis: 32%;

                > input {
                    width: 100%;
                }

                &:not(:last-child) {
                    margin-right: 20px;
                }

            }
        }
    }

    .price-wrapper {
        display: flex;
        align-items: center;
        margin: 22px 0;

        span {
            margin-left: 23px;
        }
    }

    .name_section {
        color: #f1f1f1;
        line-height: 150%;
        font-size: 20px;
        flex-basis: 18%;

        > span {
            display: flex;
            font-size: 14px;
            color: rgba(#5F6986, .8);
            margin-top: -5px;
        }
    }

    .body {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .publish_album_free {
        color: rgba(#fff, .8);
        font-size: 16px;
        padding-bottom: 30px;
        border-bottom: 1px solid #2E3548;

        .alert_text {
            color: #E94E4E;
            margin-top: 15px;
            font-style: italic;
            line-height: 150%;
        }

        label {
            font-size: 16px;
            color: rgba(#fff, .8);
            font-weight: 400;

            > a {
                font-style: italic;
                padding-left: 7px;
                color: #20C4F5;
            }
        }
    }

    .accept_payments {
        display: flex;
        align-items: center;
        height: 100px;
        padding-top: 20px;

        > span {
            font-size: 16px;
            color: rgba(#dcdcdc, .8);
            margin-right: 16px;
        }

        > button {

        }
    }

    .wrap_album_price {
        margin-top: 32px;

        .row_price {
            display: flex;
            align-items: center;

            input {
                max-width: 210px;
                margin-right: 32px;
            }

            > label {
                color: rgba(#5F6986, .8);
                font-size: 16px;
                font-weight: 400;
            }
        }

        .allow_tracks {
            margin-top: 16px;

            label {
                font-size: 16px;
                font-weight: 400;
                color: rgba(#dcdcdc, .8);
            }
        }

        .tracks_list {
            display: flex;
            flex-wrap: wrap;
            //justify-content: space-between;
            margin-top: 16px;

            .item_track {
                background-color: #040A18;
                border: 1px solid #2E3548;
                border-radius: 5px;
                padding: 12px 16px 6px 16px;
                margin-right: 8px;
                margin-bottom: 8px;
                flex-basis: 24%;

                .track_name {
                    display: flex;
                    font-weight: 500;
                    font-size: 12px;
                    color: #5F6986;
                }

                .track_price {
                    height: 25px;
                    font-size: 16px;
                    color: rgba(#dcdcdc, .8);

                    > input {
                        font-size: 16px;
                        color: rgba(#dcdcdc, .8);
                    }
                }
            }
        }
    }

    .upload-controls {
        display: flex;
        align-items: center;

        > button {
            max-width: 160px;
        }
    }

    .description_ {
        font-size: 15px;
        color: rgba(#5F6986, .8);
        margin-left: 30px;
    }
}

section.attention {
    border: 1px solid #E94E4E;
    background-color: transparent;
    display: flex;
    padding: 20px 30px 20px 64px;
    border-radius: 5px;
    margin-bottom: 8px;

    .name_section {
        font-size: 20px;
        color: #E94E4E;
        line-height: 150%;
        flex-basis: 18%;
    }

    .body {
        display: flex;
        flex-direction: column;
        width: 100%;

        .descript_text {
            font-size: 16px;
            color: rgba(#fff, .8);
            padding: 10px 0 20px 0;
            line-height: 150%;
        }

        .understand {
            .material_checkbox {
                > label {
                    font-size: 17px;
                }
            }
        }
    }
}

.uploaded-tracks {
    &-item {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        cursor: move;
        margin-bottom: 8px;

        &:last-child {
            margin-bottom: 35px;
        }

        > div {
            background-color: #040A18;
            border-radius: 5px;
            padding: 10px;
            width: 250px;
            height: 63px;
            border-bottom: 1px solid #2E3548;
            display: flex;
            flex-direction: column;
            flex-basis: 35%;

            &:not(:last-child) {
                margin-right: 10px;
            }

            > .label {
                font-size: 12px;
                font-weight: 500;
                line-height: 14px;
                color: #5F6986;
            }

            > .value {
                font-size: 16px;
                color: rgba(#dcdcdc, .8);
                margin-top: 5px;

                > input {
                    font-size: 16px;
                    color: rgba(#dcdcdc, .8);
                }
            }
        }
    }

    .track_name {
        color: rgba(#dcdcdc, .8);
    }
}
</style>
