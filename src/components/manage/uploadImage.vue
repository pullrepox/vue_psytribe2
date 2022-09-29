<template>
    <div class="upload-img">
        <div class="select-img" @click="selectPhoto">
            <v-img
                v-if="selectedPhotoPreviewUrl"
                :src="selectedPhotoPreviewUrl"
                min-width="100%"
                min-height="100%"
            ></v-img>
            <div class="select-change">
                {{ this.selectedPhotoPreviewUrl ? 'change' : 'select' }}
            </div>
        </div>
        <div class="description">
            <slot></slot>
        </div>
        <input
            type="file"
            hidden
            ref="fileInput"
            accept="image/png, image/jpeg"
            @change="photoSelected">
    </div>
</template>

<script>
export default {
    name: 'uploadImage',
    props: {},
    data () {
        return {
            selectedPhotoPreviewUrl: null
        }
    },
    methods: {
        selectPhoto() {
            this.$refs.fileInput.click();
        },
        photoSelected(event) {
            this.$emit('selected_photo', event.target.files[0]);

            const fileReader = new FileReader();
            fileReader.addEventListener('load', () => {
                this.selectedPhotoPreviewUrl = fileReader.result;
            });
            fileReader.readAsDataURL(event.target.files[0]);
        },
    }
}
</script>

<style lang="scss">
@import 'src/assets/styles/components/uploadImage';
</style>
