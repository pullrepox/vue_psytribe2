<template>
    <div class="page-dev-svg-icons">
        <v-container>
            <!-- social -->
            <div class="youtube"></div>
            <div class="youtube2"></div>
            <div class="facebook"></div>
            <div class="instagram"></div>
            <div class="twitter"></div>
            <div class="twitch"></div>
            <div class="soundcloud"></div>
            <div class="mixcloud"></div>



            <!-- *1 -->
            <div class="comment"></div>
            <div class="alert"></div>
            <div class="arrowInLine"></div>
            <div class="loop"></div>
            <div class="thumbUp"></div>
            <div class="replyComment"></div>



            <!-- *2 -->
            <div class="share"></div>
            <div class="dollar"></div>
            <div class="selectArrow"></div>
            <div class="like"></div>
            <div class="likeTransparent"></div>
            <div class="menuAdd"></div>
            <div class="arrowBack"></div>



            <!-- Player -->
            <div class="playerPrev"></div>
            <div class="playerNext"></div>
            <div class="playerPlay"></div>
            <div class="playerPause"></div>
            <div class="playerShuffle"></div>
            <div class="playerLoop"></div>
            <div class="playerMute"></div>
            <div class="playerMuteOn"></div>
            <div class="playerButtonOn"></div>
            <div class="borderSelectedTrack"></div>
            <div class="nextAlbum"></div>
            <div class="addToPlaylist"></div>
            <div class="added_to_playlist"></div>
            <div class="openPlayList"></div>
            <div class="shareTrack"></div>
            <div class="prevTrack"></div>
            <div class="nextTrack"></div>



            <!-- Album -->
            <div class="addToAlbum"></div>
            <div class="addedToAlbum"></div>
            <div class="playList"></div>
            <div class="spiderWebUpperLeft"></div>
            <div class="spiderWebDownRight"></div>
            <div class="logoRelease"></div>



            <!-- *3 -->
            <div class="arrow"></div>
            <div class="hexagonSmoothOld"></div>
            <div class="hexagonSmooth"></div>
            <div class="buttonHexagon"></div>



            <!-- user rating -->
            <div class="diamondFull"></div>
            <div class="diamondHalf"></div>
            <div class="diamondEmpty"></div>
            <div class="diamondEmptyLight"></div>



            <!-- *4 -->
            <div class="close"></div>
            <div class="facebookSquare"></div>
            <div class="noVisibilityPassword"></div>
            <div class="visibilityPassword"></div>
            <div class="basket"></div>
            <div class="buttonHexagon2"></div>
            <div class="check"></div>
            <div class="drag"></div>
            <div class="titleGlance"></div>
            <div class="playerControlBar"></div>



            <!-- *5 -->
            <div class="oblique"></div>
            <div class="backButton"></div>
            <div class="arrowTwo"></div>
            <div class="sliderBmp"></div>
            <div class="roundCheckbox"></div>
            <div class="exclamationMark"></div>
            <div class="button"></div>
            <div class="loginButton"></div>
            <div class="menuHexagon"></div>




            <!-- *6 -->
            <div class="iconInstagram"></div>
            <div class="iconFacebook"></div>
            <div class="arrowRight"></div>
            <div class="arrowLeft"></div>
            <div class="basket"></div>
            <div class="diamond"></div>
            <div class="buyValue"></div>
            <div class="noneData"></div>
            <div class="userAdmin"></div>
            <div class="rectangle-crooked"></div>
            <div class="spaceship"></div>
            <div class="shadow1"></div>
            <div class="list"></div>
            <div class="grid"></div>
            <div class="gridAlbumPauseButton"></div>
            <div class="editProfile"></div>
            <div class="warningTriangle"></div>
            <!-- end file -->



            <!-- styles/base/icons/_albumIcon.scss -->
            <div class="downloadAlbum"></div>
            <div class="buttonMore"></div>
            <div class="btnDeleteTags"></div>
            <div class="btnAddTag"></div>
            <div class="tableSort"></div>



            <!-- styles/base/icons/_events.scss -->
            <div class="date"></div>
            <div class="time"></div>
            <div class="location"></div>
            <div class="tickets"></div>
            <div class="shareEvent"></div>
            <div class="whiteLike"></div>
            <div class="showAllPhotos"></div>
            <div class="basketRemove"></div>
            <div class="plusAdd"></div>




            <!-- styles/base/icons/_formComponents.scss -->
            <div class="verticalArrow"></div>
            <div class="additionalBtn"></div>
            <div class="clearBtn"></div>
            <div class="bookmarkBtn"></div>
            <div class="discoveryBtn"></div>
            <div class="closeX"></div>
            <div class="rightArrowLight"></div>
            <div class="dropdownArrow"></div>




            <!-- styles/base/icons/_mainIcons.scss -->
            <div class="likeEmpty"></div>
            <div class="like"></div>
            <div class="btnBackToTop"></div>
            <div class="delete"></div>
            <div class="close"></div>
            <div class="searchBackgroundDesign"></div>
            <div class="searchBackgroundColor"></div>
            <div class="spaceshipGroup"></div>
            <div class="Spaceship"></div>
            <div class="searchShadow"></div>
            <div class="searchSpaceshipName"></div>
            <div class="searchNotFound"></div>
            <div class="searchSpaceshipNameNotFound"></div>
            <div class="artistOwner"></div>
            <div class="rating"></div>
            <div class="projects"></div>
            <div class="listDots"></div>
            <div class="arrowDownDropdownBlue"></div>
            <div class="arrowDownDropdownWhite"></div>
            <div class="searchInputIcon"></div>
            <div class="clearFilter"></div>







            <!-- styles/base/icons/_mobile.scss -->
            <div class="playAllAlbums"></div>
            <div class="shuffleAlbums"></div>
            <div class="trackPlaying"></div>
            <div class="albumPlaying"></div>
            <div class="albumPause"></div>
            <div class="heartTransparent"></div>
            <div class="heartFilled"></div>
            <div class="addTrackToPlaylist"></div>
            <div class="addTrackToCart"></div>
            <div class="mobileNav"></div>
            <div class="mobileSearch"></div>
            <div class="mobileCloseSearch"></div>




            <!-- styles/base/icons/_playerIcons.scss -->
            <div class="volumeUnMute"></div>
            <div class="volumeMute"></div>
            <div class="playlists"></div>



        </v-container>
    </div>
</template>

<script>
export default {
    name: "dev-svg-icons"
}
</script>

<style lang="scss">
    .page-dev-svg-icons {
        padding-top: 70px;
        > .container {
            display: grid;
            grid-template-columns: repeat(15, 1fr);
            column-gap: 20px;
            row-gap: 20px;
            min-height: 100px;
            margin-bottom: 120px;
            > div {
                border: 1px dashed #8d8d8d;
                background-position: center center;
                height: 70px;
                //background-size: contain;
            }
        }
    }
</style>