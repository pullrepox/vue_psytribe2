<template>
<div class="page_front_event">
    <div class="wrap_carousel">
        <v-container>
            <v-carousel v-model="slide" :height="445" hide-delimiters :show-arrows="false">
                <v-carousel-item
                    v-for="(itemSlide, i) in slides" :key="i">
                    <v-sheet
                        color="#141E35"
                        height="100%"
                        tile>

                        <div class="slide_info">
                            <div class="event_info">
                                <div class="slide_name">{{itemSlide.title}}</div>
                                <div class="location">{{itemSlide.location}}</div>
                                <div class="dates">{{itemSlide.dates}}</div>
                                <div class="description">{{itemSlide.description}}</div>
                            </div>
                            <div class="slide_navigation">
<!--                                <template v-slot:prev="{ on, attrs }">-->
<!--                                    <v-btn-->
<!--                                        color="success"-->
<!--                                        v-bind="attrs"-->
<!--                                        v-on="on"-->
<!--                                    >Previous slide</v-btn>-->
<!--                                </template>-->
                                <button type="button" class="prev change_slide" @click="slide--"></button>
                                <div class="current_of_length">
<!--                                    <span class="current_slide">1</span>/-->
                                    {{slide + 1}}/{{slides.length}}

                                </div>
<!--                                <template v-slot:next="{ on, attrs }">-->
<!--                                    <v-btn-->
<!--                                        color="info"-->
<!--                                        v-bind="attrs"-->
<!--                                        v-on="on"-->
<!--                                    >Next slide</v-btn>-->
<!--                                </template>-->
                                <button type="button" class="next change_slide" @click="slide++"></button>
                            </div>

                        </div>
                    </v-sheet>
                </v-carousel-item>
            </v-carousel>
        </v-container>
    </div>


    <div class="main_container">

        <v-container class="wrap_filter_bar_events">
            <div class="filter_bar_">
            <div class="filters_">

                <!-- GENRE -->
                <div class="genre">
                    <div class="material_input">
                        <input type="text" readonly required v-model="genre">
                        <label>Genre</label>
                    </div>
                </div>

                <!-- LOCATION -->
                <div class="location">
                    <div class="material_input">
                        <input type="text" required v-model="location" @keydown.enter="setLocation()">
                        <label>Location</label>
                    </div>
                </div>

                <!-- DATE -->
                <div class="date">
                    <div class="material_input">
                        <input type="text" required v-model="dateFilter">
                        <label>Date</label>
                    </div>
                </div>

                <!-- DURATION -->
                <div class="duration">
                    <div class="material_input">
                        <input type="text" required v-model="durationFilter">
                        <label>Duration</label>
                    </div>
                </div>

            </div>
        </div>
        </v-container>

        <v-container>

            <!-- // maps -->
            <div class="wrap_events_result maps">
                <div class="maps_even_list">
                    <div class="maps_event" v-for="event of events" :key="event.id">
                        <div class="cover_image">
                            <img :src="apiUrl.slice(0, -1) + `${event.images[0].contentUrl}`" alt="photo">
                        </div>
                        <div class="small_info">
<!--                            <div class="name">{{event.title}}</div>-->
                            <router-link :to="{name: 'eventDetails', params: {id: event.id}}"  class="name">{{event.title}}</router-link>
                            <div class="location">{{event.location}}</div>
                            <div class="date">{{event.dateStart | moment("MMMM DD, YYYY")}}</div>
                            <div class="duration">
<!--                                {{event.dateEnd.diff(event.dateStart)}}-->
                                in 3 Weeks 2 Days
                            </div>
                        </div>
                    </div>
<!--                    <div class="maps_event">-->
<!--                        <div class="cover_image"></div>-->
<!--                        <div class="small_info">-->
<!--                            <div class="name">Rainbow Serpent Festival Celebra...</div>-->
<!--                            <div class="location">Chernivtsi, Ukraine</div>-->
<!--                            <div class="date">January 25, 2022</div>-->
<!--                            <div class="duration">in 3 Weeks 2 Days</div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="maps_event">-->
<!--                        <div class="cover_image"></div>-->
<!--                        <div class="small_info">-->
<!--                            <div class="name">Rainbow Serpent Festival Celebra...</div>-->
<!--                            <div class="location">Chernivtsi, Ukraine</div>-->
<!--                            <div class="date">January 25, 2022</div>-->
<!--                            <div class="duration">in 3 Weeks 2 Days</div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="maps_event">-->
<!--                        <div class="cover_image"></div>-->
<!--                        <div class="small_info">-->
<!--                            <div class="name">Rainbow Serpent Festival Celebra...</div>-->
<!--                            <div class="location">Chernivtsi, Ukraine</div>-->
<!--                            <div class="date">January 25, 2022</div>-->
<!--                            <div class="duration">in 3 Weeks 2 Days</div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="maps_event">-->
<!--                        <div class="cover_image"></div>-->
<!--                        <div class="small_info">-->
<!--                            <div class="name">Rainbow Serpent Festival Celebra...</div>-->
<!--                            <div class="location">Chernivtsi, Ukraine</div>-->
<!--                            <div class="date">January 25, 2022</div>-->
<!--                            <div class="duration">in 3 Weeks 2 Days</div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="maps_event">-->
<!--                        <div class="cover_image"></div>-->
<!--                        <div class="small_info">-->
<!--                            <div class="name">Rainbow Serpent Festival Celebra...</div>-->
<!--                            <div class="location">Chernivtsi, Ukraine</div>-->
<!--                            <div class="date">January 25, 2022</div>-->
<!--                            <div class="duration">in 3 Weeks 2 Days</div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="maps_event">-->
<!--                        <div class="cover_image"></div>-->
<!--                        <div class="small_info">-->
<!--                            <div class="name">Rainbow Serpent Festival Celebra...</div>-->
<!--                            <div class="location">Chernivtsi, Ukraine</div>-->
<!--                            <div class="date">January 25, 2022</div>-->
<!--                            <div class="duration">in 3 Weeks 2 Days</div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="maps_event">-->
<!--                        <div class="cover_image"></div>-->
<!--                        <div class="small_info">-->
<!--                            <div class="name">Rainbow Serpent Festival Celebra...</div>-->
<!--                            <div class="location">Chernivtsi, Ukraine</div>-->
<!--                            <div class="date">January 25, 2022</div>-->
<!--                            <div class="duration">in 3 Weeks 2 Days</div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="maps_event">-->
<!--                        <div class="cover_image"></div>-->
<!--                        <div class="small_info">-->
<!--                            <div class="name">Rainbow Serpent Festival Celebra...</div>-->
<!--                            <div class="location">Chernivtsi, Ukraine</div>-->
<!--                            <div class="date">January 25, 2022</div>-->
<!--                            <div class="duration">in 3 Weeks 2 Days</div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="maps_event">-->
<!--                        <div class="cover_image"></div>-->
<!--                        <div class="small_info">-->
<!--                            <div class="name">Rainbow Serpent Festival Celebra...</div>-->
<!--                            <div class="location">Chernivtsi, Ukraine</div>-->
<!--                            <div class="date">January 25, 2022</div>-->
<!--                            <div class="duration">in 3 Weeks 2 Days</div>-->
<!--                        </div>-->
<!--                    </div>-->
                </div>
                <div class="google_map" ref='googleMap'>

                </div>
            </div>


            <!-- // list -->
            <!--        <div class="wrap_events_result list">-->
            <!--        </div>-->


        </v-container>
    </div>



    <div class="wrap_difference_events">
        <v-container>
            <div class="recently_viewed">
                <div class="heading_events">
                    <h4>Recently Viewed</h4>
                    <button type="button" class="view_all">View all</button>
                </div>
                <div class="wrap_this_events">
                    <div class="event_box">
                        <div class="event_img"></div>
                        <div class="event_description">
                            <div class="name">Dance of Life</div>
                            <div class="location">Chernivtsi, Ukraine</div>
                            <div class="date">SAT, Sep 18 at 19:00 EDT</div>
                            <div class="genre">Downtempo, Hard Dance and more</div>
                        </div>
                    </div>
                    <div class="event_box">
                        <div class="event_img"></div>
                        <div class="event_description">
                            <div class="name">Dance of Life</div>
                            <div class="location">Chernivtsi, Ukraine</div>
                            <div class="date">SAT, Sep 18 at 19:00 EDT</div>
                            <div class="genre">Downtempo, Hard Dance and more</div>
                        </div>
                    </div>
                    <div class="event_box">
                        <div class="event_img"></div>
                        <div class="event_description">
                            <div class="name">Dance of Life</div>
                            <div class="location">Chernivtsi, Ukraine</div>
                            <div class="date">SAT, Sep 18 at 19:00 EDT</div>
                            <div class="genre">Downtempo, Hard Dance and more</div>
                        </div>
                    </div>
                    <div class="event_box">
                        <div class="event_img"></div>
                        <div class="event_description">
                            <div class="name">Dance of Life</div>
                            <div class="location">Chernivtsi, Ukraine</div>
                            <div class="date">SAT, Sep 18 at 19:00 EDT</div>
                            <div class="genre">Downtempo, Hard Dance and more</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="upcoming">
                <div class="heading_events">
                    <h4>Upcoming</h4>
                    <button type="button" class="view_all">View all</button>
                </div>
                <div class="wrap_this_events">
                    <div class="event_box">
                        <div class="event_img"></div>
                        <div class="event_description">
                            <div class="name">Dance of Life</div>
                            <div class="location">Chernivtsi, Ukraine</div>
                            <div class="date">SAT, Sep 18 at 19:00 EDT</div>
                            <div class="genre">Downtempo, Hard Dance and more</div>
                        </div>
                    </div>
                    <div class="event_box">
                        <div class="event_img"></div>
                        <div class="event_description">
                            <div class="name">Dance of Life</div>
                            <div class="location">Chernivtsi, Ukraine</div>
                            <div class="date">SAT, Sep 18 at 19:00 EDT</div>
                            <div class="genre">Downtempo, Hard Dance and more</div>
                        </div>
                    </div>
                    <div class="event_box">
                        <div class="event_img"></div>
                        <div class="event_description">
                            <div class="name">Dance of Life</div>
                            <div class="location">Chernivtsi, Ukraine</div>
                            <div class="date">SAT, Sep 18 at 19:00 EDT</div>
                            <div class="genre">Downtempo, Hard Dance and more</div>
                        </div>
                    </div>
                    <div class="event_box">
                        <div class="event_img"></div>
                        <div class="event_description">
                            <div class="name">Dance of Life</div>
                            <div class="location">Chernivtsi, Ukraine</div>
                            <div class="date">SAT, Sep 18 at 19:00 EDT</div>
                            <div class="genre">Downtempo, Hard Dance and more</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="popular"></div>
            <div class="new"></div>

        </v-container>
    </div>





</div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
    name: "front",
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            slide: 0,
            slides: [
                {
                    image: '',
                    title: 'Sacred Earth - 1',
                    location: 'Stephentown, NY',
                    dates: 'Sept 2 — Sept 6',
                    description: 'Confirmed Artists: Circuit Breakers, Guy J, Burn in Noise, Dickster, Mandala, Pete Bones, DJ Wegha, Joseine Wedekind, Headrom, Regan'
                },
                {
                    image: '',
                    title: 'Sacred Earth - 2',
                    location: 'Stephentown, NY',
                    dates: 'Sept 2 — Sept 6',
                    description: 'Confirmed Artists: Circuit Breakers, Guy J, Burn in Noise, Dickster, Mandala, Pete Bones, DJ Wegha, Joseine Wedekind, Headrom, Regan'
                },
                {
                    image: '',
                    title: 'Sacred Earth - 3',
                    location: 'Stephentown, NY',
                    dates: 'Sept 2 — Sept 6',
                    description: 'Confirmed Artists: Circuit Breakers, Guy J, Burn in Noise, Dickster, Mandala, Pete Bones, DJ Wegha, Joseine Wedekind, Headrom, Regan'
                }
            ],
            genre: 'Psytrance',
            location: this.locationFilter || '',
            // date: this.dateFilter,
            // duration: this.durationFilter,

            imgClusterUrl: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            locations: [
                // {id: 1, lat: -31.563944, lng: 147.154355, name_point: 'A', title: 'text on hover'},
                // {id: 2, lat: -33.718234, lng: 150.363181, name_point: 'B', title: 'text on hover'},
                // {id: 3, lat: -33.727111, lng: 150.371124, name_point: 'C', title: 'text on hover'},
                // {id: 4, lat: -33.848588, lng: 151.209834, name_point: 'D', title: 'text on hover'},
                // {id: 5, lat: -34.853202, lng: 150.55, name_point: 'E', title: 'text on hover'},
                // {id: 6, lat: -34.851702, lng: 150.216968, name_point: 'F', title: 'text on hover'}
            ],
            bounds: new google.maps.LatLngBounds(),
            mapOptions: {
                center: { lat: 35.88147, lng: -100.06102 },
                zoomControl: true,
                zoom: 4,
                gestureHandling: 'cooperative',
                styles: [
                    {
                        "featureType": "all",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#202c3e"
                            }
                        ]
                    },
                        {
                            "featureType": "all",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "gamma": 0.01
                                },
                                {
                                    "lightness": 20
                                },
                                {
                                    "weight": "1.39"
                                },
                                {
                                    "color": "#ffffff"
                                }
                            ]
                        },
                        {
                            "featureType": "all",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "weight": "0.96"
                                },
                                {
                                    "saturation": "9"
                                },
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#000000"
                                }
                            ]
                        },
                        {
                            "featureType": "all",
                            "elementType": "labels.icon",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "lightness": 30
                                },
                                {
                                    "saturation": "9"
                                },
                                {
                                    "color": "#29446b"
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "saturation": 20
                                }
                            ]
                        },
                        {
                            "featureType": "poi.park",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "lightness": 20
                                },
                                {
                                    "saturation": -20
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "lightness": 10
                                },
                                {
                                    "saturation": -30
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#193a55"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "saturation": 25
                                },
                                {
                                    "lightness": 25
                                },
                                {
                                    "weight": "0.01"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "lightness": -20
                                }
                            ]
                        }
                    ]
            }
        }
    },
    watch: {
        locationFilter() {
            this.getEventsList();
        }
    },
    computed: {
        ...mapGetters({
            events: 'events/EVENTS',

            // filters
            locationFilter: 'events/LOCATION',
            dateFilter: 'events/DATE',
            durationFilter: 'events/DURATION'
        }),
    },
    created() {
        this.getEventsList();
    },
    mounted() {
        this.initMap();
    },
    methods: {
        ...mapActions({
            getEvents: 'events/GET_EVENTS',
        }),
        setLocation() {
            this.$store.commit('events/SET_EVENT_LOCATION', this.location);
        },
        getEventsList() {
            let params = {};
            if (this.location) {
                params['location'] = this.location;
            }

            this.getEvents(params)
                .then(() => {
                    console.log('events', this.events);
                })
                .catch(err => console.log(`getEventsList ${err}`));
        },

        initMap() {
            const  { imgClusterUrl, locations } = this.locations;

            // create map
            const map = new google.maps.Map(this.$refs.googleMap, {
                ...this.mapOptions
            })

            // create Markers
            let markers = locations.map((location) => {
                // set locations for auto zoom map
                const setLocations = new google.maps.LatLng(location.lat, location.lng)
                this.bounds.extend(setLocations)

                // set Markers on Map
                return new google.maps.Marker({
                    position: location,
                    map: map,
                    label: location.name_point,
                    title: location.title  + ' ' + location.name_point,
                })
            })

            // create MarkerClusterer and add Image
            let markerCluster = new MarkerClusterer(map, markers,

                { imagePath: imgClusterUrl })

            // // auto scaling
            map.fitBounds(this.bounds)
        },
    }
}
</script>

<style scoped>

</style>