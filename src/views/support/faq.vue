<template>
    <div class="p-faq">
        <supportNav></supportNav>
        <div class="container">
            <section class="about">
                <h3 class="title">About</h3>
                <div class="description">
                    Home to psytrance music and events. We are aware of the many bugs and are working on fixing them while developing new features.
                    Design of events has been completed, it will begin its development once we get the music side stable.
                    We have many more ideas and would love to implement them if theres enough interest and support from the community.<br>
                    <p></p>
                    For updates follow us on facebook <a href="https://www.facebook.com/DanceMusicandEvents" target="_blank">https://www.facebook.com/DanceMusicandEvents</a>
                    <p></p>
                    <p>
                        To be a part of the project donate and follow exclusive updates at
                        <a href="https://www.patreon.com/PsytranceNetwork" target="_blank">https://www.patreon.com/PsytranceNetwork</a>
                    </p>
                </div>
            </section>
        </div>

        <!-- ADMIN CONTENT -->
        <template v-if="userRole === 'ADMIN'">
            <section class="faq admin-content">
                <div class="container">
                    <div class="create_faq">
                        <h3 class="title">Add to FAQ</h3>

                        <v-progress-circular v-if="createLoader"
                                             :size="100"
                                             :width="3"
                                             color="#20C4F5"
                                             indeterminate
                        ></v-progress-circular>

                        <input type="text" autofocus
                               :class="[{invalid: $v.question.$invalid && submitted}, 'input_style']"
                               v-model="question"
                               placeholder="Add a question"/>

                        <textarea-autosize :class="{'invalid': $v.answer.$invalid && submitted}"
                                           placeholder="Add an answer"
                                           v-model="answer"
                                           :min-height="110"
                                           :max-height="510"/>

                        <button type="button" @click="createFaq()" :disabled="$v.question.$invalid || $v.answer.$invalid">Post</button>
                    </div>


                    <h3 class="title" v-if="FAQS.length">FAQ</h3>
                    <v-progress-circular v-if="loader"
                                         :size="100"
                                         :width="3"
                                         color="#20C4F5"
                                         indeterminate
                    ></v-progress-circular>

                    <draggable :list="FAQS" class="questions" handle=".handle" v-bind="dragOptions" @change="update(FAQS, $event)">
                        <div class="item_question" v-for="faq of FAQS" :key="faq.id" :class="{active: faq.id === itemFaqOpen}">

                            <div class="question">
                                <div class="handle"></div>
                                <div class="visible" :class="{'show': itemFaqOpen === faq.id}" @click="toggleAccordion(faq.id)"></div>
                                <input type="text" v-model="faq.question" :disabled="userRole !== 'ADMIN'"/>

                                <span class="saved" v-if="itemSaveFaq.status && itemSaveFaq.id === faq.id">Saved!</span>

                                <button v-if="!itemSaveFaq.status || itemSaveFaq.id !== faq.id && userRole === 'ADMIN'" class="check" @click="saveFaq(faq)"></button>
                                <button v-if="!itemSaveFaq.status || itemSaveFaq.id !== faq.id && userRole === 'ADMIN'" class="faq_delete" @click="deleteFaq(faq.id)">
                                    <span class="material-icons">delete</span>
                                </button>

                            </div>

                            <textarea-autosize
                                v-show="itemFaqOpen === faq.id"
                                class="answer"
                                :disabled="userRole !== 'ADMIN'"
                                v-model="faq.answer"
                                ref="contentTextArea"
                                :min-height="30"/>
                        </div>
                    </draggable>
                </div>


                <v-dialog
                    v-model="deleteFaqDialog"
                    persistent
                    max-width="490">
                    <div class="delete_head_promt">
                        You are about to remove a question <br>Confirm to proceed
                    </div>
                    <div class="action_delete_faq">
                        <button class="cancel" @click="deleteFaqDialog = false" v-ripple>Cancel</button>
                        <button class="delete_faq" @click="confirmDeleteFaq(deleteItemFaq)" v-ripple>Delete</button>
                    </div>
                </v-dialog>


            </section>

        </template>

        <!-- USER CONTENT -->
        <template v-if="userRole !== 'ADMIN'">
            <section class="faq user_content">
                <div class="container">
                    <h3 class="title">Frequently Asked Questions
                        <a href="mailto:info.psytrance.network@gmail.com?subject=FAQ Question!">Ask yours</a>
                    </h3>

                    <v-progress-circular v-if="loader"
                                         :size="100"
                                         :width="3"
                                         color="#20C4F5"
                                         indeterminate
                    ></v-progress-circular>


                    <div class="questions">
                        <div class="item_question" v-for="faq of FAQS" :key="faq.id">
                            <div class="question" @click="toggleAccordion(faq.id)">
                                <div class="visible" :class="{'show': itemFaqOpen === faq.id}"></div>
                                {{ faq.question }}
                            </div>
                            <transition name="fade">
                                <div class="answer" :class="{'show': itemFaqOpen === faq.id}">{{ faq.answer }}</div>
                            </transition>
                        </div>
                    </div>
                </div>
            </section>
        </template>


    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {required, minLength} from 'vuelidate/lib/validators';
import draggable from 'vuedraggable';

import supportNav from "@/components/navigations/supportNav";

export default {
    name: 'faq',
    components: {
        supportNav,
        draggable
    },
    data() {
        return {
            createLoader: false,
            loader: true,

            // create faq
            question: '',
            answer: '',
            status: 'active',

            itemFaqOpen: Number,
            dragging: false,

            submitted: false,
            itemSaveFaq: {
                id: null,
                status: false,
            },
            userRole: '',
            deleteFaqDialog: false,
            deleteItemFaq: Object,
        };
    },
    validations: {
        question: {
            required,
            minLength: minLength(2)
        },
        answer: {
            required,
            minLength: minLength(2)
        }
    },

    computed: {
        ...mapGetters(['FAQS', 'AUTH_DATA']),

        dragOptions() {
            return {
                animation: 0,
                disabled: false,
            };
        }
    },

    mounted() {
        this.initFaqs();
        if (this.AUTH_DATA.userRoles) {
            if (this.AUTH_DATA.userRoles.find(user => user === 'ROLE_ADMIN')) {
                this.userRole = 'ADMIN';
            }
        }
    },

    methods: {
        ...mapActions(['GET_FAQS', 'ADD_FAQ', 'UPDATE_FAQ', 'DELETE_FAQ']),
        toggleAccordion(id) {
            if (this.itemFaqOpen === id) {
                this.itemFaqOpen = -1;
            } else {
                this.itemFaqOpen = Number(id);
            }
        },

        update: function (faqList, $event) {
            const newPosition = $event.moved.newIndex;
            const updateFaq = faqList[newPosition];

            const update = {
                id: updateFaq.id,
                question: updateFaq.question,
                answer: updateFaq.answer,
                position: newPosition
            };
            this.loader = true;
            this.UPDATE_FAQ(update).then(() => {
                this.loader = false;
            });
        },

        initFaqs() {
            this.GET_FAQS().then(() => {
                this.FAQS.sort((a, b) => a.position - b.position);
                this.loader = false;
            });
        },

        createFaq() {
            this.createLoader = true;
            this.submitted = true;

            if (this.userRole !== 'ADMIN') {
                this.status = 'inactive';
            }
            let createFaq = {
                question: String(this.question),
                answer: String(this.answer),
                status: String(this.status),
                position: Number(this.FAQS.length + 1),
            };
            this.ADD_FAQ(createFaq)
                .then(() => {
                    this.submitted = false;
                    this.question = '';
                    this.answer = '';
                    this.initFaqs();
                })
                .catch((err) => {
                    console.log(`createFaq ${err}`);
                })
                .finally(() => {
                    this.createLoader = false;
                })
        },

        saveFaq(faq) {
            this.loader = true;
            this.UPDATE_FAQ(faq).then(() => {
                this.loader = false;
                this.itemSaveFaq.status = true;
                this.itemSaveFaq.id = faq.id;
                setTimeout(() => this.itemSaveFaq.status = false, 1800);
            });
        },

        deleteFaq(id) {
            this.deleteFaqDialog = true;
            this.deleteItemFaq = id;
        },
        confirmDeleteFaq() {
            if(this.deleteItemFaq) {
                this.DELETE_FAQ(this.deleteItemFaq).then(() => {
                    this.loader = false;
                    this.initFaqs();
                })
                this.deleteFaqDialog = false;
            }
        }
    }
};
</script>

<style lang="scss">
.v-dialog {
    background: #282C47;
    padding: 32px 27px;
    .delete_head_promt {
        font-family: "Montserrat", sans-serif;
        font-size: 16px;
        color: #fff;
        text-align: center;
        margin-bottom: 32px;
    }
    .action_delete_faq {
        display: flex;
        justify-content: space-between;
        > button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 210px;
            height: 48px;
            border-radius: 120px;
            font-size: 18px;
            font-weight: 500;
            color: #fff;
            &.cancel {
                border: 1px solid #5F6986;
            }
            &.delete_faq {
                background: #D21B1B;
            }
        }
    }
}
</style>

