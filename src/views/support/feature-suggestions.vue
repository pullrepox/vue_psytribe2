<template>
    <div class="p-feature-suggestions full_page">
        <supportNav></supportNav>

        <v-container>
            <main>
                <h2 class="suggest_heading">
                    Suggest a feature
                    <!-- Thank you! Have another idea? -->
                </h2>
                <div class="input_box">
                    <label>What would make Psychurch better?</label>
                    <input type="text" placeholder="What would make Psychurch better?" v-model="suggestName">
                    <v-textarea
                        filled
                        counter
                        auto-grow
                        placeholder="Describe your idea"
                        :rules="textareaRules"
                        v-model="suggestDescription"
                    ></v-textarea>
                    <button type="button" class="save_suggest" @click="createSuggest">Submit</button>
                </div>

                <div class="wrap_suggestions">
                    <v-tabs
                        background-color="transparent"
                        color="#fff"
                        v-model="tabsSuggest">
                        <v-tab v-for="tab in tabsSectionsSuggest" :key="tab.index">
                            {{ tab.name }}
                        </v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tabsSuggest">
                        <v-tab-item>
                            <div class="item_suggest" v-for="suggest of SUGGESTIONS" :key="suggest.id">
<!--                                <code><pre>{{suggest}}</pre></code>-->
                                <div class="main_suggest_info">
                                    <div class="label_votes">
                                        <div class="votes">
                                            <span class="val">{{suggest.voteScore}}</span>
                                            votes
                                        </div>
                                        <button type="button" class="add_votes" v-if="suggest.status === 'open'" @click="addVotes('suggestID')">+1</button>
<!--                                        <div class="planned_label">Planned</div>-->
                                    </div>
                                    <div class="suggest_info">
                                        <div class="name_suggest">{{suggest.title}}</div>
                                        <div class="description_suggest">{{suggest.description}}</div>

                                        <v-tabs
                                            background-color="transparent"
                                            color="#7481A6"
                                            v-model="tabs">
                                            <v-tab v-for="tab in tabsSections" :key="tab.index">
                                                {{ tab.name }}
                                            </v-tab>
                                        </v-tabs>
                                        <v-tabs-items v-model="tabs">
                                            <v-tab-item>
                                                <commentsV2></commentsV2>
                                            </v-tab-item>
                                            <v-tab-item>Report</v-tab-item>
                                        </v-tabs-items>
                                    </div>
                                </div>
                            </div>
                        </v-tab-item>
                        <v-tab-item>
                            <div class="item_suggest survey">
                                <div class="main_suggest_info">
                                    <div class="label_votes">
                                        <div class="votes">
                                            <span class="val">430</span>
                                            votes
                                        </div>
                                        <button type="button" class="add_votes" @click="addVotes('suggestID')">+1</button>
                                        <div class="planned_label"></div>
                                    </div>
                                    <div class="suggest_info">
                                        <div class="name_suggest">Rating system for albums</div>
                                        <div class="description_suggest">
                                            Would like to see ability to rate albums and automatically remove albums that dont meet quality standard criteria.
                                            That way we dont have to keep low quality music on the servers and. This would also provide feedback to producers
                                            whether their music needs more work. But how would we handle unrated albums? And what about fraudulent ratings?
                                        </div>
                                        <v-tabs
                                            background-color="transparent"
                                            color="#7481A6"
                                            v-model="tabs">
                                            <v-tab v-for="tab in tabsSections" :key="tab.index">
                                                {{ tab.name }}
                                            </v-tab>
                                        </v-tabs>
                                        <v-tabs-items v-model="tabs">
                                            <v-tab-item>
                                                <commentsV2></commentsV2>
                                            </v-tab-item>
                                            <v-tab-item>Report</v-tab-item>
                                        </v-tabs-items>
                                    </div>
                                </div>
                            </div>
                        </v-tab-item>
                        <v-tab-item>
                            <div class="item_suggest planned">
                                <div class="main_suggest_info">
                                    <div class="label_votes">
                                        <div class="votes">
                                            <span class="val">430</span>
                                            votes
                                        </div>
                                    </div>
                                    <div class="suggest_info">
                                        <div class="name_suggest">Rating system for albums</div>
                                        <div class="description_suggest">
                                            Would like to see ability to rate albums and automatically remove albums that dont meet quality standard criteria.
                                            That way we dont have to keep low quality music on the servers and. This would also provide feedback to producers
                                            whether their music needs more work. But how would we handle unrated albums? And what about fraudulent ratings?
                                        </div>
                                        <v-tabs
                                            background-color="transparent"
                                            color="#7481A6"
                                            v-model="tabs">
                                            <v-tab v-for="tab in tabsSections" :key="tab.index">
                                                {{ tab.name }}
                                            </v-tab>
                                        </v-tabs>
                                        <v-tabs-items v-model="tabs">
                                            <v-tab-item>
                                                <commentsV2></commentsV2>
                                            </v-tab-item>
                                            <v-tab-item>Report</v-tab-item>
                                        </v-tabs-items>
                                    </div>
                                </div>
                            </div>
                        </v-tab-item>
                        <v-tab-item>
                            <div class="item_suggest">
                                <div class="main_suggest_info">
                                    <div class="label_votes">
                                        <div class="votes">
                                            <span class="val">430</span>
                                            votes
                                        </div>
                                    </div>
                                    <div class="suggest_info">
                                        <div class="name_suggest">Rating system for albums</div>
                                        <div class="description_suggest">
                                            Would like to see ability to rate albums and automatically remove albums that dont meet quality standard criteria.
                                            That way we dont have to keep low quality music on the servers and. This would also provide feedback to producers
                                            whether their music needs more work. But how would we handle unrated albums? And what about fraudulent ratings?
                                        </div>
                                        <v-tabs
                                            background-color="transparent"
                                            color="#7481A6"
                                            v-model="tabs">
                                            <v-tab v-for="tab in tabsSections" :key="tab.index">
                                                {{ tab.name }}
                                            </v-tab>
                                        </v-tabs>
                                        <v-tabs-items v-model="tabs">
                                            <v-tab-item>
                                                <commentsV2></commentsV2>
                                            </v-tab-item>
                                            <v-tab-item>Report</v-tab-item>
                                        </v-tabs-items>
                                    </div>
                                </div>
                            </div>
                        </v-tab-item>
                    </v-tabs-items>
                </div>


            </main>
            <aside>
                <div class="global_stats">
                    <div class="heading">Global Stats</div>
                    <div class="stats_list">
                        <div class="item_stats">
                            <div class="name">Total Suggested</div>
                            <div class="value">540</div>
                        </div>
                        <div class="item_stats">
                            <div class="name">Planned</div>
                            <div class="value">110</div>
                        </div>
                        <div class="item_stats">
                            <div class="name">In Progress</div>
                            <div class="value">20</div>
                        </div>
                    </div>
                    <div class="item_stats completed">
                        <div class="name">In Progress</div>
                        <div class="value">20</div>
                    </div>
                </div>
            </aside>
        </v-container>
    </div>
</template>

<script>
import supportNav from "@/components/navigations/supportNav";
import commentsV2 from "@/components/commentsV2";
import {mapActions, mapGetters} from "vuex";

export default {
    name: 'feature-suggestions',
    components: {
        supportNav,
        commentsV2
    },
    data() {
        return {
            tabsSuggest: null,
            tabsSectionsSuggest: [
                {index: 0, name: 'Top ideas'},
                {index: 1, name: 'New ideas'},
                {index: 2, name: 'Planned'},
                {index: 2, name: 'Completed'}
            ],
            tabs: 1,
            tabsSections: [
                {index: 0, name: 'Comments'},
                {index: 1, name: 'Report'},
            ],

            ///
            suggestName: '',
            suggestDescription: '',
            textareaRules: [v => v.length <= 25 || 'Max 25 characters'],
        }
    },
    watch: {
        suggestName() {
            // search suggestions
        }
    },
    computed: {
        ...mapGetters(['SUGGESTIONS'])
    },
    mounted() {
        this.getSuggestions();
    },
    methods: {
        ...mapActions([
            'CREATE_SUGGEST',
            'GET_SUGGESTIONS'
        ]),
        createSuggest() {
            if (this.suggestName.length && this.suggestDescription) {
                let params = {
                    title: this.suggestName,
                    description: this.suggestDescription,
                }
                this.CREATE_SUGGEST(params)
                    .then(() => {
                        this.suggestName = '';
                        this.suggestDescription = '';
                    })
                    .catch(err => console.error(`createSuggest ${err}`))

            }
        },
        getSuggestions() {
            let params = {
                page: 1,
                perPage: 20,
            }
            this.GET_SUGGESTIONS(params)
                .then(() => {})
                .catch(err => console.error(`getSuggestions ${err}`))
        },
        addVotes() {

        }




    }
}
</script>
