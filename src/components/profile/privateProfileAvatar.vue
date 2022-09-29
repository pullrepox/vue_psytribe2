<template>
    <div class="artist_photo" :class="{'default': !PROFILE_DATA.photo}">

        <v-progress-circular v-if="changeAvatarLoader" :size="100" :width="3" style="z-index: 1;" color="#20C4F5" indeterminate></v-progress-circular>

        <img :src="avatar.small"
             loading="lazy"
             @load="avatarLoaded"
             :class="{'default-image': isImageDefault, 'show': avatar.loaded}"
             @click="$refs['modal-image'].show()"
             alt="My profile avatar"
        >

        <!--  <button type="button" class="change_ava" @click="toogleClipperDialog">-->
        <!-- <span class="material-icons">photo_camera</span>-->
        <!--  </button>-->
        <button type="button" class="change_ava" @click="changeAva">
            <span class="material-icons">photo_camera</span>
        </button>
        <!--                        <input type="file" hidden ref="ava" accept="image/png, image/jpeg" @change="photoUpload">-->
        <input type="file" hidden ref="uploadedFile" accept="image/png, image/jpeg" @change="photoUpload">

        <v-dialog v-model="clipperDialog" width="500">
            <div class="photo_clipper">
                <clipper-fixed
                    preview="avatarPreview"
                    ref="clipper"
                    :ratio="240/269"
                    class="basic lg clipper-fixed"
                    :src="clipperAvatar"
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
                    <button type="button" class="tetriatary_btn small" @click="closeClipperDialog" v-ripple>Close</button>

                    <!-- Upload New Photo -->
                    <!--                    <input type="file" hidden ref="uploadedFile" accept="image/png, image/jpeg" @change="photoUpload">-->
                    <button type="button" class="primary_btn small" @click="changeAva()" v-ripple>Upload New Photo</button>
                    <button type="button" class="clip_photo primary_btn small" @click="clipImage" v-ripple>Save</button>
                </div>
            </div>
        </v-dialog>

        <modalImage ref="modal-image" :image="avatar.original"/>
    </div><!-- END artist photo-->

</template>

<script>
import {mapGetters, mapActions} from "vuex";
import {baseUrlToBlob} from "@/utils/baseUrlToBlob";
const ModalImage = () => import("@/components/public/modalImage");

export default {
    name: "privateProfileAvatar",
    components: {
        ModalImage
    },
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,

            isImageDefault: false,
            avatar: {
                original: '',
                small: '',
                loaded: false
            },
            uploadedFile: '',
            clipperAvatar: '',
            changeAvatarLoader: false,

            clipperDialog: false,
            scale: 1,

        }
    },
    watch: {
        scale(val) {
            this.$refs.clipper.setWH$.next(+val);
        },
        PROFILE_DATA: {
            handler() {
                this.getAvatar();
            },
            deep: true
        }
    },
    computed: {
        ...mapGetters(['PROFILE_DATA', 'CHANGE_USER_AVA', 'FILE_URL'])
    },
    created() {
        this.getAvatar();
    },

    mounted() {

    },
    methods: {
        ...mapActions(['GET_PROFILE', 'ADD_FILE', 'CHANGE_USER_DATA']),

        getAvatar() {
            this.avatar.small = this.PROFILE_DATA.photo ? `${this.apiUrl}media/resolve/user/${this.PROFILE_DATA.photo.contentName}` : require('@/assets/image/privat-profile-ava.png');
            if (this.PROFILE_DATA.photo) {
                this.avatar.original = `${this.apiUrl + this.PROFILE_DATA.photo.contentUrl}`;
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

        async photoUpload() {
            this.uploadedFile = this.$refs.uploadedFile.files[0];
            this.clipperDialog = true;
            this.scale = 1;

            // pre load image url
            const fileReader = new FileReader();
            await fileReader.addEventListener('load', () => {
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
            //     this.avatar.small = fileReader.result;
            // });
            // fileReader.readAsDataURL(this.uploadedFile);

            let formData = new FormData();
            formData.append('file', this.uploadedFile);

            const userData = {
                id: this.PROFILE_DATA.id,
            }
            this.ADD_FILE(formData)
                .then(() => {
                    userData.photo = this.FILE_URL;
                })
                .catch(err => console.log(`ADD_FILE (private profile), ${err}`))
                .finally(() => {
                    if (userData.photo) {
                        this.CHANGE_USER_DATA(userData)
                            .then(() => {
                                this.$store.commit('SET_CHANGE_USER_AVA', true);
                                // this.changeAvatarLoader = false;
                            })
                            .catch(err => {
                                console.log(`saveUserData, ${err}`);
                            })
                    }
                })
        },
        closeClipperDialog() {
            this.clipperDialog = false;
        }
    }
}
</script>

<style lang="scss">
.v-image {
    opacity: 0;
    transition: 0.3s;

    &.show {
        opacity: 1;
    }
}
</style>