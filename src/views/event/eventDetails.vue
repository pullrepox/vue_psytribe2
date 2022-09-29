<template>
<div class="page_event_details">
    <div class="head_event"><!-- no_images -->
        <div class="background" v-bind:style="{'background-image': 'url('+(imageUrl)+')'}"></div>
        <v-container>
<!--            <div class="head_name_festival">Fortest Fairies Festival</div>-->
            <img :src="imageUrl" @click="showSingle">
<!--            <vue-picture-swipe :items="headEventImages"></vue-picture-swipe>-->
<!--            <div-->
<!--                v-for="(img, index) in imgs"-->
<!--                :key="index"-->
<!--                class="pic"-->
<!--                @click="() => showMultiple(index)"-->
<!--            >-->
<!--                <img :src="typeof img === 'string' ? img : img.src" />-->
<!--            </div>-->

            <vue-easy-lightbox
                :visible="visible"
                :imgs="imgs.contentUrl"
                :index="index"
                @hide="handleHide"
            ></vue-easy-lightbox>


            <button type="button" @click="showAllPhotos" class="show_all_photos" v-ripple>Show all photos</button>
        </v-container>

    </div>
    <div class="event_description">
        <v-container>
            <div class="info_box">
                <h1 class="event_name">{{event.title}}</h1>
                <h6 class="event_by">
                    <span>by</span>
                    <router-link :to="{name: 'user-profile', params:  {id: event.owner['@id'].split('/')[2]}}">{{event.owner.nickname}}</router-link>
                </h6>

                <div class="event_subgenres">
                    <template v-if="event.setting.length">
                        <span v-for="(setting, index) of event.setting" :key="index">{{setting}}</span>
                    </template>
                    <template v-if="event.genre.length">
                        <span v-for="(genre, index) of event.genre" :key="index">{{genre}}</span>
                    </template>
                </div>

                <div class="event_date">
<!--                    <div class="day_">Friday 11:00 am — Sunday 5:00 pm </div>-->
                    <div class="day_">{{event.dateStart | moment("dddd, hh:mm")}} - {{event.dateEnd | moment("dddd, hh:mm")}}</div>
<!--                    <div class="month_">September 25 - September 28</div>-->
                    <div class="month_">{{event.dateStart | moment("MMMM DD")}} - {{event.dateEnd | moment("MMMM DD")}}</div>
                </div>
                <div class="event_location">
                    <div class="location_label">Location</div>
                    <div class="location_value">{{event.location}}</div>
                </div>
                <div class="event_tickets" v-if="event.tickets.length">
                    <div class="tickets_label">Tickets</div>
                    <div class="item_ticket" v-for="ticket of event.tickets" :key="ticket.id">
                        <div class="ticket_name">{{ticket.title}}
                            <template v-if="ticket.price">-</template>
                            <span class="ticket_price" v-if="ticket.price"> ${{ticket.price}}</span>
                        </div>
                        <div class="ticket_description">
                            {{ticket.description}}
                        </div>
                    </div>
<!--                    <div class="item_ticket">-->
<!--                        <div class="ticket_name">Camping - <span class="ticket_price">$432</span></div>-->
<!--                        <div class="ticket_description">-->
<!--                            These days the epic five-day multifaceted eruption of dance, colourexpression and celebration attracts people from all...-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="item_ticket">-->
<!--                        <div class="ticket_name">VIP - <span class="ticket_price">$3,000</span></div>-->
<!--                        <div class="ticket_description">-->
<!--                            Rainbow Serpent Festival has been a fixture on Australia’s bush doof festival calendar for over 20 years. The psytrance festival...-->
<!--                        </div>-->
<!--                    </div>-->
                </div>
            </div>
            <div class="info_box">
                <div class="action_actions">
                    <div class="interested">
                        <div class="value">{{event.statistic.views}}</div>
                        <button type="button" v-ripple>Interested</button>
                    </div>
                    <div class="share">
                        <div class="value">{{event.statistic.shared}}</div>
                        <button type="button" v-ripple>Share</button>
                    </div>
                </div>
                <div class="description_text">
                    {{event.description}}
<!--                    <div class="see_more">See More</div>-->
                </div>
            </div>
        </v-container>
    </div>

    <div class="_tabs">
        <v-container>
            <v-tabs v-model="tab">
                <v-tab v-for="tab in tabs" :key="tab">
                    {{ tab }}
                </v-tab>
            </v-tabs>
        </v-container>
    </div>

    <div class="_tabs_content">
        <v-container>
            <v-tabs-items v-model="tab">
                <v-tab-item>
                    Announcements
                </v-tab-item>
                <v-tab-item>
                    Discussion
                </v-tab-item>
            </v-tabs-items>
        </v-container>
    </div>


    <div class="all_photos" v-if="allPhotos">

        <div class="container">
            <div class="heading">
                <h1>Atlantis</h1>
                <button type="button" @click="hideAllPhotos">Close</button>
            </div>

            <div v-for="(img, index) in imgs"
                 :key="index"
                 class="pic"
                 @click="() => showMultiple(index)">
                <img :src="typeof img === 'string' ? img : img.src" />
            </div>

            <vue-easy-lightbox
                :visible="visible"
                :imgs="imgs"
                :index="index"
                @hide="handleHide"
            ></vue-easy-lightbox>
        </div>
    </div>
</div>
</template>

<script>
// import VuePictureSwipe from 'vue-picture-swipe';
import {mapGetters, mapActions} from 'vuex';

export default {
    name: 'eventDetails',
    components: {
        // VuePictureSwipe
    },
    props: ['id'],
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            allPhotos: false,
            imgs: [],
            // imgs: [
            //     'https://via.placeholder.com/450.png/',
            //     'https://via.placeholder.com/300.png/',
            //     'https://via.placeholder.com/150.png/',
            //     { src: 'https://via.placeholder.com/450.png/', title: 'this is title' }
            // ],
            visible: false,
            index: 0,   // default: 0
            ///////////////////////////////////////////////////////

            imageUrl: '',
            tab: null,
            tabs: [
                'Announcements', 'Discussion'
            ],
        }
    },
    computed: {
        ...mapGetters({
            event: 'events/EVENT'
        })
    },
    mounted() {
        this.getEventDetails();
    },
    methods: {
        ...mapActions({
            getEvent: 'events/GET_EVENT',
        }),
        getEventDetails() {
            this.getEvent(this.id)
                .then(() => {
                    this.imageUrl = `${this.apiUrl + this.event.images[0].contentUrl}`;
                    this.imgs = this.event.images;
                })
                .catch(err => console.log(`getEventDetails, ${err}`))
        },


        /////////////////////
        showAllPhotos() {
          this.allPhotos = true;
        },
        hideAllPhotos() {
            this.allPhotos = false;
        },
        showSingle () {
            this.imgs = 'http://via.placeholder.com/350x150';
            // this.index = index;
            // this.visible = true;
            this.show();
        },
        showMultiple() {
            // this.imgs = ['http://via.placeholder.com/350x150', 'http://via.placeholder.com/350x150'];
            this.index = 1;
            this.show();
        },
        show() {
            this.visible = true
        },
        handleHide() {
            this.visible = false
        }
        ///////////////////////////
    }
}
</script>

<style scoped>

</style>
