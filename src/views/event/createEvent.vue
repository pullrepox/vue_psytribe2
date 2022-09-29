<template>
    <div class="page_create_event">
        <v-container>
            <h1>New Event</h1>
            <section>
                <!-- Event Name -->
                <div class="row_section">
                    <div class="_name">
                        Name
                    </div>
                    <div class="_data">
                        <input type="text" class="input-style-2" placeholder="Name of the event" v-model="name">
                    </div>
                </div>

                <!-- Genre -->
                <div class="row_section">
                    <div class="_name">
                        Genre
                    </div>
                    <div class="_data checkboxes border_bottom">
                        <div class="material_checkbox">
                            <input type="checkbox" id="Techno" value="Techno" v-model="genres">
                            <label for="Techno">Techno</label>
                        </div>
                        <div class="material_checkbox">
                            <input type="checkbox" id="House" value="House" v-model="genres">
                            <label for="House">House</label>
                        </div>
                        <div class="material_checkbox">
                            <input type="checkbox" id="Trance" value="Trance" v-model="genres">
                            <label for="Trance">Trance</label>
                        </div>
                        <div class="material_checkbox">
                            <input type="checkbox" id="Psytrance" value="Psytrance" v-model="genres">
                            <label for="Psytrance">Psytrance</label>
                        </div>
                        <div class="material_checkbox">
                            <input type="checkbox" id="DrumBass" value="DrumBass" v-model="genres">
                            <label for="DrumBass">Drum & Bass</label>
                        </div>
                        <div class="material_checkbox">
                            <input type="checkbox" id="Breakbeat" value="Breakbeat" v-model="genres">
                            <label for="Breakbeat">Breakbeat</label>
                        </div>
                        <div class="material_checkbox">
                            <input type="checkbox" id="HardDance" value="HardDance" v-model="genres">
                            <label for="HardDance">Hard Dance</label>
                        </div>
                        <div class="material_checkbox">
                            <input type="checkbox" id="Dubstep" value="Dubstep" v-model="genres">
                            <label for="Dubstep">Dubstep</label>
                        </div>
                        <div class="material_checkbox">
                            <input type="checkbox" id="Downtempo" value="Downtempo" v-model="genres">
                            <label for="Downtempo">Downtempo</label>
                        </div>
                    </div>
                </div>

                <!-- Setting -->
                <div class="row_section">
                    <div class="_name">
                        Setting
                    </div>
                    <div class="_data checkboxes">
                        <div class="material_checkbox">
                            <input type="checkbox" id="Indoor" value="Indoor" v-model="settings">
                            <label for="Indoor">Indoor</label>
                        </div>
                        <div class="material_checkbox">
                            <input type="checkbox" id="Outdoor" value="Outdoor" v-model="settings">
                            <label for="Outdoor">Outdoor</label>
                        </div>
                        <div class="material_checkbox">
                            <input type="checkbox" id="Online" value="Online" v-model="settings">
                            <label for="Online">Online</label>
                        </div>
                    </div>
                </div>

                <!-- Location -->
                <div class="row_section">
                    <div class="_name">
                        Location
                    </div>
                    <div class="_data">
                        <input type="text" class="input-style-2" placeholder="Address" v-model="location">
                    </div>
                </div>

                <!-- Date / Time -->
                <div class="row_section">
                    <div class="_name">
                        Date / Time
                    </div>
                    <div class="_data date_pickers">
                        <div class="date_time_begins">
                            <div class="date begins">
                                <v-menu
                                    ref="menuDateBegin"
                                    v-model="menuDateBegin"
                                    :close-on-content-click="false"
                                    :return-value.sync="date.beginDate"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <input type="text" class="input-style-2" v-model="date.beginDate" v-bind="attrs" v-on="on" placeholder="Begins">
                                    </template>
                                    <v-date-picker
                                        v-model="date.beginDate"
                                        no-title
                                        scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="menuDateBegin = false">
                                            Cancel
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="$refs.menuDateBegin.save(date.beginDate)">
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </div>
                            <div class="time begins">
                                <v-menu
                                    ref="menuTimeBegin"
                                    v-model="menuTimeBegin"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    :return-value.sync="date.beginTime"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <input type="text" class="input-style-2" v-model="date.beginTime" v-bind="attrs" v-on="on" placeholder="Time">
                                    </template>
                                    <v-time-picker
                                        v-if="menuTimeBegin"
                                        v-model="date.beginTime"
                                        full-width
                                        @click:minute="$refs.menuTimeBegin.save(date.beginTime)"
                                    ></v-time-picker>
                                </v-menu>
                            </div>
                        </div>
                        <div class="separation"></div>
                        <div class="date_time_ends">
                            <div class="date ends">
                                <v-menu
                                    ref="menuDateEnd"
                                    v-model="menuDateEnd"
                                    :close-on-content-click="false"
                                    :return-value.sync="date.endDate"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <input type="text" class="input-style-2" v-model="date.endDate" v-bind="attrs" v-on="on" placeholder="Ends">
                                    </template>
                                    <v-date-picker
                                        v-model="date.endDate"
                                        no-title
                                        scrollable
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="menuDateEnd = false"
                                        >
                                            Cancel
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="$refs.menuDateEnd.save(date.endDate)"
                                        >
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </div>
                            <div class="time ends">
                                <v-menu
                                    ref="menuTimeEnd"
                                    v-model="menuTimeEnd"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    :return-value.sync="date.endTime"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <input type="text" class="input-style-2" v-model="date.endTime" v-bind="attrs" v-on="on" placeholder="Time">
                                    </template>
                                    <v-time-picker
                                        v-if="menuTimeEnd"
                                        v-model="date.endTime"
                                        full-width
                                        @click:minute="$refs.menuTimeEnd.save(date.endTime)"
                                    ></v-time-picker>
                                </v-menu>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <div class="row_section">
                    <div class="_name">
                        Description
                    </div>
                    <div class="_data">
                        <textarea rows="4" class="textarea-style-2" placeholder="About" v-model="description"></textarea>
                    </div>
                </div>

                <!-- Photos -->
                <div class="row_section">
                    <div class="_name">
                        Photos
                        <div class="hint list">
                            <span>10 Photos limit</span>
                            <span>JPEG, PNG only</span>
                            <span>10MB or less per file</span>
                            <span>Drag to change order</span>
                        </div>
                    </div>
                    <div class="_data photos">
                        <draggable class="uploaded_photo" v-model="uploadedPhoto" v-bind="dragOptions" @start="isDragging = true" @end="isDragging = false">

                            <div v-for="(photo, index) in uploadedPhoto" :key="dynamicPhotoKey + index">
                                <img class="cover_select_img" :src="photo.url" :alt="photo.name" :ref="photo.lastModified">
                                <button type="button" class="remove_photo" @click="removePhoto(index)"></button>
                            </div>

                            <div class="upload_photo" @click="selectPhoto">
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    ref="select_photo"
                                    accept=".png, .jpeg"
                                    @change="handleFileUpload($event)">
                                <span class="select_img">Upload</span>
                            </div>

                        </draggable>
                    </div>
                </div>

                <!-- Tickets -->
                <div class="row_section">
                    <div class="_name">
                        Tickets
                        <div class="hint">
                            <span>This section is optional</span>
                        </div>
                    </div>
                    <div class="_data tickets">

                        <!-- Create New Ticket -->
                        <div class="item_ticket">
                            <input type="text" class="input-style-2" placeholder="Ticket 1" v-model="ticketTitle">
                            <div class="ticket_inputs_row">
                                <input type="text" class="input-style-2" placeholder="Price" v-model="ticketPrice">
                                <input type="text" class="input-style-2" placeholder="Link" v-model="ticketLink">
                            </div>
                            <textarea rows="4" class="textarea-style-2" placeholder="Description" v-model="ticketDescription"></textarea>
                            <button type="button" class="action_ticket add" @click="addTicket()">Add Ticket</button>
                        </div>


                        <!-- Tickets List -->
                        <div class="item_ticket" v-for="(itemTicket, index) of tickets" :key="index">
                            <input type="text" class="input-style-2" placeholder="Ticket 1" v-model="itemTicket.title" disabled>
                            <div class="ticket_inputs_row">
                                <input type="text" class="input-style-2" placeholder="Price" v-model="itemTicket.price" disabled>
                                <input type="text" class="input-style-2" placeholder="Link" v-model="itemTicket.link" disabled>
                            </div>
                            <textarea rows="4" class="textarea-style-2" placeholder="Description" v-model="itemTicket.description" disabled></textarea>
                            <button type="button" class="action_ticket remove" @click="removeTicket(index)">Remove Ticket</button>
                        </div>

                    </div>
                </div>

            </section>
            <div class="wrap_actions">
                <button type="button" class="tetriatary_btn x_large" v-ripple @click="saveNewEvent">Save & exit</button>
                <button type="button" class="secondary_btn x_large" v-ripple @click="review">Review</button>
            </div>
        </v-container>
    </div>
</template>


<script>
import draggable from 'vuedraggable';
import {mapActions, mapGetters} from "vuex";
import moment from 'moment';

export default {
    name: 'createEvent',
    components: {
        draggable
    },
    data: () => ({
        name: '',
        genres: [],
        settings: [],
        location: '',
        description: '',

        // dates
        date: {
            beginDate: '',
            beginTime: '',
            endDate: '',
            endTime: ''
        },

        menuDateBegin: false,
        menuTimeBegin: false,
        menuDateEnd: false,
        menuTimeEnd: false,


        // photos
        uploadedPhoto: [],
        uploadedPhotoLinks: [],
        dynamicPhotoKey: 1,

        // Tickets
        ticketTitle: '',
        ticketPrice: '',
        ticketLink: '',
        ticketDescription: '',

        tickets: []
    }),
    watch: {},
    updated() {
        this.moment = moment;
        // this.dynamicPhotoKey += 1;
    },
    computed: {
        ...mapGetters(['FILE_URL']),
        dragOptions() {
            return {
                animation: 0,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            };
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        ...mapActions(['ADD_FILE']),
        ...mapActions({
            ADD_EVENT: 'events/ADD_EVENT'
        }),

        // photos
        selectPhoto() {
            this.$refs.select_photo.click();
        },
        handleFileUpload(event) {
            let selectedFiles = event.target.files;
            if (selectedFiles) {
                let _self = this;
                for (let img = 0; img < selectedFiles.length; img++) {
                    let fileReader = new FileReader();
                    fileReader.onload = function (event) {
                        selectedFiles[img].url = event.target.result;
                        _self.uploadedPhoto.push(selectedFiles[img]);
                    }
                    fileReader.readAsDataURL(selectedFiles[img]);
                }
                this.dynamicPhotoKey += 1;
                console.log('this.uploadedPhoto after', this.uploadedPhoto);
            }
        },
        removePhoto(index) {
            this.uploadedPhoto.splice(index, 1);
        },

        // tickets
        addTicket() {
            if (this.ticketTitle !== '' && this.ticketPrice !== '' && this.ticketLink !== '' && this.ticketDescription !== '') {
                this.tickets.push({
                    title: this.ticketTitle,
                    price: this.ticketPrice,
                    link: this.ticketLink,
                    description: this.ticketDescription,
                });
                this.ticketTitle = '';
                this.ticketPrice = '';
                this.ticketLink = '';
                this.ticketDescription = '';
            }
        },

        removeTicket(index) {
            this.tickets.splice(index, 1);
        },

        async saveNewEvent() {
            const params = {
                title: this.name,
                location: this.location,
                dateStart: moment.utc(this.date.beginDate + " " + this.date.beginTime).format(),
                dateEnd: moment.utc(this.date.endDate + " " + this.date.endTime).format(),
                description: this.description,
                genre: this.genres,
                setting: this.settings,
            }

            if (this.tickets.length) {
                params['tickets'] = this.tickets;
            }

            if (this.uploadedPhoto.length) {
                for (let item of this.uploadedPhoto) {
                    let formData = new FormData();
                    formData.set('file', item);
                    await this.ADD_FILE(formData).then(() => {
                        this.uploadedPhotoLinks.push(this.FILE_URL);
                    });
                }
                params['images'] = this.uploadedPhotoLinks;
            }


            console.log('ADD_EVENT - params:', params);

            this.ADD_EVENT(params)
                .then(() => {

                })
                .catch(err => console.log(`saveNewEvent, ${err}`))
                .finally(() => {

                })
        },
        review() {

        },

    }
}
</script>

<style scoped>

</style>
