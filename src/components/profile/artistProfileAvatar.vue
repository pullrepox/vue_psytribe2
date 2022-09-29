<template>
    <div class="artist_photo">
        <v-progress-circular v-if="changeAvatarLoader" :size="160" :width="3" style="z-index: 1;" color="#20C4F5" indeterminate></v-progress-circular>

        <v-img :src="avatar.small"
             loading="lazy"
             @load="avatarLoaded"
             :class="{'default-image': isImageDefault, 'show': avatar.loaded}"
             @click="$refs['modal-image'].show()"
             alt="Artist profile avatar"
        ></v-img>
        <button v-ripple v-if="isAdmin" type="button" class="change_ava" @click="changeAva">
            <span class="material-icons">photo_camera</span>
        </button>

        <input type="file" hidden ref="uploadedFile" accept="image/png, image/jpeg" @change="photoUpload">
        <v-dialog
            v-model="clipperDialog"
            width="500">
            <div class="photo_clipper">
                <clipper-fixed
                    preview="avatarPreview"
                    ref="clipper"
                    :ratio="1"
                    class="basic lg clipper-fixed"
                    :src="clipperAvatar"
                    bg-color="#10182B"
                    :round="true"
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
                    <button type="button" class="tetriatary_btn small" @click="closeClipperDialog" v-ripple>Close</button>

                    <!-- Upload New Photo -->
<!--                    <input type="file" hidden ref="uploadedFile" accept="image/png, image/jpeg" @change="photoUpload">-->
                    <button type="button" class="primary_btn small" @click="changeAva()" v-ripple>Upload New Photo</button>

                    <button type="button" class="clip_photo primary_btn small" @click="clipImage" v-ripple>Save</button>
                </div>
            </div>
        </v-dialog>

        <modalImage ref="modal-image" :image="avatar.original"/>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {baseUrlToBlob} from "@/utils/baseUrlToBlob";

const ModalImage = () => import("@/components/public/modalImage");

export default {
    name: "artistProfileAvatar",
    components: {
        ModalImage
    },
    props: {
        isAdmin: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,

            isImageDefault: false,
            avatar: {
                original: '',
                small: '',
                loaded: false,
            },
            uploadFile: '',
            clipperAvatar: '',
            changeAvatarLoader: '',

            clipperDialog: false,
            scale: 1,


        }
    },
    watch: {
        scale(val) {
            this.$refs.clipper.setWH$.next(+val);
        },
        ARTIST: {
            handler() {
                this.getAvatar();
            },
            deep: true
        }
    },
    computed: {
        ...mapGetters(['FILE_URL', 'ARTIST'])
    },
    created() {
        this.getAvatar();
    },
    mounted() {

    },
    methods: {
        ...mapActions(['ADD_FILE', 'CHANGE_ARTIST_DATA', 'GET_ARTIST']),
        getAvatar() {
            this.changeAvatarLoader = true;
            // this.avatar.small = this.ARTIST.avatar ? `${this.apiUrl}media/resolve/artist/${this.ARTIST.avatar.contentName}` : require('@/assets/image/user-default.png');

            if (this.ARTIST.avatar) {
                this.avatar.small = `${this.apiUrl}media/resolve/artist/${this.ARTIST.avatar.contentName}`;
                this.avatar.original = `${this.apiUrl + this.ARTIST.avatar.contentUrl}`;
            } else {
                this.isImageDefault = true;
            }
            this.changeAvatarLoader = false;
        },
        avatarLoaded() {
            this.avatar.loaded = true;
        },
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

        photoUpload() {
            this.uploadedFile = this.$refs.uploadedFile.files[0];
            this.clipperDialog = true;
            this.scale = 1;

            // pre load image url
            const fileReader = new FileReader();
            fileReader.addEventListener('load', () => {
                this.clipperAvatar = fileReader.result;
            });
            fileReader.readAsDataURL(this.uploadedFile);
        },
        changeAva() {
            this.$refs.uploadedFile.click();
            if (this.uploadedFile) {
                this.clipperDialog = true;
            }
        },

        clipImage: function () {
            this.changeAvatarLoader = true;

            const canvas = this.$refs.clipper.clip();
            let dataURL = canvas.toDataURL("image/jpeg", 1); // canvas->image (base64)
            this.uploadedFile = baseUrlToBlob(dataURL);

            this.clipperDialog = false;

            // pre load image url
            // const fileReader = new FileReader();
            // fileReader.addEventListener('load', () => {
            //     this.imageUrl = fileReader.result;
            // });
            // fileReader.readAsDataURL(this.uploadedFile);

            let formData = new FormData();
            formData.append('file', this.uploadedFile);

            const artistData = {
                id: this.ARTIST.id,
            }
            this.ADD_FILE(formData)
                .then(() => {
                    artistData.avatar = this.FILE_URL;
                })
                .catch(err => console.log(`ADD_FILE (artist), ${err}`))
                .finally(() => {
                    console.log('this.artist before', this.ARTIST);
                    if (artistData.avatar) {
                        this.CHANGE_ARTIST_DATA(artistData)
                            .then(() => {
                                console.log('this.artist after', this.ARTIST);
                                this.GET_ARTIST(this.ARTIST.id).catch(err => console.log(`get artist, ${err}`))
                            })
                            .catch(err => console.log(`CHANGE_ARTIST_DATA, ${err}`));
                    }
                })
        },
        closeClipperDialog() {
            this.clipperDialog = false;
        },
    }
}
</script>

<style scoped>

</style>