<template>
    <settingLayout>
        <section class="wrap_s_block">
            <h2 class="name_section">Current Plan</h2>
            <div class="body_ membership">
                <div class="box_current_plan free">
                    <div class="current_plan">
                        <div class="name">
                            Free plan
                            <span>No credit card required</span>
                        </div>
<!--                        <div class="price">- $3.99 per month</div>-->
                    </div>
<!--                    <div class="next_bill">-->
<!--                        Next billing date: <span class="date">May 10th , 2022</span>-->
<!--                    </div>-->
                    <button type="button" v-ripple class="change_plan tetriatary_btn small" @click="changePlan">Change plan</button>
                    <button type="button" v-ripple class="level_up c2a_btn small" @click="changePlan">Level Up</button>
                </div>
                <div class="box_payment_method">
                    <h2 class="name_section">Payment Method</h2>
                    <div class="credit_cards">
                        <div class="item_card">

                        </div>
                        <div class="add_credit_card" v-ripple>
                            <span class="_icon" >
                                <span class="material-icons-outlined">add_circle</span>
                            </span>
                            Add Credit Card
                        </div>
                    </div>

                </div>

            </div>
        </section>
    </settingLayout>
</template>

<script>
import settingLayout from "@/layouts/settingLayout";

export default {
    name: 'membership',
    components: {
        settingLayout
    },
    methods: {
        changePlan() {
            this.$router.push({name: 'memberships'});
        }
    }
}
</script>

<style scoped>

</style>
