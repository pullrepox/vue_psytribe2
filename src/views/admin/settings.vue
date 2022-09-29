<template>
    <div class="full_page admin-settings">
        <supportNav></supportNav>
        <div class="container">
            <aside>
                <h3>Settings</h3>
                <ul>
                    <li>Elastic Search</li>
                </ul>
            </aside>
            <main>
                <div class="item_setting">
                    <div class="head_item_setting">
                        <h2>Elastic Search</h2>
                        <h6>When ES is off application will work directly through MYSQL (music_releases) <br>
                            When ES is ON all cataloging and serving will be done through ES (search/music_releases)
                        </h6>
                    </div>

                    <div class="wrap_item_setting">
                        <div class="i_box">
                            <div class="i_head">
                                Automatic fallback
                                <span class="hint">
                                   Switch to MYSQL automatically if ES is not responding
                               </span>
                            </div>
                            <div class="i_wrap">
                                <span class="off">OFF</span>
                                <v-switch inset color="#20C4F5" @change="toggleAutomatic"
                                          v-model="automaticFallback"
                                ></v-switch>
                                <span class="on">ON</span>
                            </div>
                        </div>

                        <div class="i_box">
                            <div class="i_head">
                                ES Engine
                                <span class="hint">
                                  Music catalog, search results
                               </span>
                            </div>
                            <div class="i_wrap">
                                <span class="off">OFF</span>
                                <v-switch inset color="#20C4F5" v-model="elastic" @change="toggleElastic"></v-switch>
                                <span class="on">ON</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import supportNav from '../../components/navigations/supportNav';

export default {
    name: "admin-settings",
    components: {
        supportNav
    },
    data() {
        return {
            automaticFallback: false,
            elastic: '',
            source: {},
        }
    },
    created() {
        this.source = JSON.parse(localStorage.getItem('DataSource'));
        if (!this.source) {
            this.source = {db: 'api', auto: false};
            localStorage.setItem('DataSource', JSON.stringify(this.source));
        }
        this.elastic = this.source.db === 'elastic';
        this.automaticFallback = this.source.auto;
    },

    methods: {
        toggleAutomatic() {
            this.source.auto = this.automaticFallback;
            this.setLocalStorage();
        },
        toggleElastic() {
            this.source.db = this.elastic === true ? 'elastic' : 'api';
            if (this.elastic === false) {
                this.source.auto = false;
                this.automaticFallback = false;
            }
            this.setLocalStorage();
        },
        setLocalStorage() {
            localStorage.setItem('DataSource', JSON.stringify(this.source));
        },
    }
}
</script>

<style lang="scss">
.admin-settings {
    > .container {
        display: flex;

        > aside {
            width: 190px;
            background: #2D2339;
            border-radius: 8px;
            margin-right: 30px;
            padding: 20px 10px;
            min-height: 260px;
            align-self: flex-start;

            > h3 {
                font-size: 20px;
                font-weight: 500;
                color: #DCDCDC;
                margin-bottom: 7px;
                padding: 0 20px;
            }

            > ul {
                > li {
                    font-size: 16px;
                    font-weight: 400;
                    color: #F1F1F1;
                    background: #41384B;
                    border-radius: 6px;
                    padding: 5px 20px;
                    cursor: pointer;
                }
            }
        }

        > main {
            flex-basis: 90%;
            background: #2D2339;
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
            border-radius: 8px;
            padding: 20px 15px;
            align-self: flex-start;

            .item_setting {
                .head_item_setting {
                    margin-bottom: 20px;

                    > h2 {
                        font-size: 20px;
                        font-weight: 500;
                        color: #DCDCDC;
                    }

                    > h6 {
                        font-size: 12px;
                        font-weight: 400;
                        color: #8591B1;
                    }
                }

                .wrap_item_setting {
                    .i_box {
                        margin-bottom: 23px;

                        .i_head {
                            font-size: 16px;
                            font-weight: 500;
                            color: #DCDCDC;
                            margin-bottom: 11px;

                            > .hint {
                                display: flex;
                                color: #8591B1;
                                font-weight: 400;
                                font-size: 12px;
                            }
                        }

                        .i_wrap {
                            display: flex;
                            align-items: center;
                            height: 30px;

                            .v-input {
                                margin-top: 19px;
                            }

                            .off, .on {
                                color: #FF6523;
                                text-transform: uppercase;
                                font-size: 19px;
                            }

                            .off {
                                margin-right: 16px;
                            }

                            .on {
                                margin-left: 3px;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>