<template>
    <div class="grid_like_button">
        <div :class="{active: isActive}">
            <i @click="toogleAnimation" :class="{active: isActive}"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: "gridAlbumLikeButton",
    data: () => ({
        isActive: false,
    }),
    methods: {
        toogleAnimation() {
            this.isActive = !this.isActive;
        }
    }
}
</script>

<style lang="scss">
@mixin likeEmpty1($fill, $fill-opacity, $border) {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle opacity='#{$fill-opacity}' cx='15' cy='15' r='15' fill='%23#{$fill}'/%3e%3cpath d='M6.5 12.7996V12.7995C6.4999 12.229 6.61494 11.664 6.83857 11.1375C7.0622 10.611 7.39002 10.1334 7.8032 9.7328C8.21638 9.33216 8.70663 9.01654 9.24545 8.80471C9.78428 8.59287 10.3607 8.48915 10.9409 8.49976L10.9409 8.4999L10.9526 8.49984C11.6468 8.4962 12.3336 8.63831 12.9675 8.91657C13.6014 9.19481 14.1678 9.60273 14.6292 10.1129L15 10.523L15.3708 10.1129C15.8322 9.60273 16.3986 9.19481 17.0325 8.91657C17.6664 8.63831 18.3532 8.4962 19.0474 8.49984V8.49998L19.0591 8.49976C19.6393 8.48915 20.2157 8.59287 20.7545 8.80471C21.2934 9.01654 21.7836 9.33216 22.1968 9.7328C22.61 10.1334 22.9378 10.611 23.1614 11.1375C23.3851 11.664 23.5001 12.229 23.5 12.7995V12.7996C23.5 14.9743 22.1864 16.94 20.3679 18.765C19.4655 19.6707 18.4587 20.5222 17.4654 21.3309C17.1815 21.562 16.8975 21.7906 16.6174 22.0161C16.0525 22.4708 15.5032 22.9129 15.0016 23.3383C14.4772 22.8895 13.9006 22.4239 13.3082 21.9455C13.0534 21.7398 12.7957 21.5317 12.5379 21.3215C11.5445 20.5116 10.5374 19.6611 9.63438 18.7569C7.8148 16.9351 6.5 14.9755 6.5 12.7996Z' stroke='%23#{$border}'/%3e%3c/svg%3e ");
    background-repeat: no-repeat;
}
.grid_like_button {
    div {
        //height:100px;
        //margin:0 auto;
        position: relative;
    }

    i {
        cursor:pointer;
        padding:10px 12px 8px;
        background:#fff;
        border-radius:50%;
        display:inline-block;
        margin:0 0 15px;
        color:#aaa;
        transition:.2s;
    }

    i:hover {
        color:#666;
    }

    i:before {
        @include likeEmpty1('5F6986', '0.8', 'dcdcdc');
    }

    span {
        position: absolute;
        bottom:70px;
        left:0;
        right:0;
        visibility: hidden;
        transition:.6s;
        z-index:-2;
        font-size:2px;
        color:transparent;
        font-weight:400;
    }

    i.press {
        animation: size .4s;
        color:#e23b3b;
    }

    span.press {
        bottom:120px;
        font-size:14px;
        visibility:visible;
        animation: fade 1s;
    }

    @keyframes fade {
        0% {color:#transparent;}
        50% {color:#e23b3b;}
        100% {color:#transparent;}
    }

    @keyframes size {
        0% {padding:10px 12px 8px;}
        50% {padding:14px 16px 12px;margin-top:-4px;}
        100% {padding:10px 12px 8px;}
    }
}

</style>
