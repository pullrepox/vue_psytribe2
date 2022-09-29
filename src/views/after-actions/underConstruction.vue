<template>
    <div class="page-under-construction">
        <div class="content-page">
            <v-container>
                <div class="box_under_construction">
                    <h1>Under construction</h1>
                    <div class="description">
                        We are currently working on a way to find and get in touch with local edm communities. Check back for updates or follow us on patreon!
                        <span class="material-icons" style="color:#E94E4E; position: relative; top: 5px;">favorite</span>
                    </div>
                    <div class="spaceship"></div>
                    <div class="action_buttons">
                        <router-link :to="{name: 'explore'}">Go back</router-link>
                        <a class="support_ptn" href="https://www.patreon.com/PsytranceNetwork" target="_blank">Patreon</a>
                    </div>
                </div>
            </v-container>
        </div>
    </div>
</template>

<script>
export default {
    name: 'underConstruction',
}
</script>
