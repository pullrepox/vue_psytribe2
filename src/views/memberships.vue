<template>
<div class="p-memberships">
    <v-container>
        <div class="memberships_heading">
            <h2>
                Memberships
            </h2>
            <h6>
                Your support means more features, better load times and continual development
            </h6>
        </div>
        <div class="wrap_memberships">

            <!-- Free -->
            <div class="item_membership free" :class="{'activePlan': currentPlan === 'Free'}">
                <div class="inside">
                    <div class="membership_title">
                        Free
                        <span>All the necessities</span>
                    </div>
                    <div class="price">
                        Free
                        <span>Forever availlable</span>
                    </div>
                    <div class="description">
                        <span>3  Free Downloads / Day</span>
                    </div>
                    <div class="membership_action"></div>
                </div>
            </div>

            <!-- Premium -->
            <div class="item_membership premium" :class="{'activePlan': currentPlan === 'Premium'}">
                <div class="inside">
                    <div class="membership_title">
                        Premium
                        <span>All the necessities and all the nicities</span>
                    </div>
                    <div class="price">
                        $3.99/month
                        <span>After a 14-day trial</span>
                    </div>
                    <div class="description">
                        <span>Unlimited Free Downloads</span>
                        <span>Discovery mode</span>
                        <span>No Ads</span>
                    </div>
                    <div class="membership_action">
                        <button type="button" v-ripple class="c2a_btn small">Start Free Trial</button>
                    </div>
                </div>
            </div>

            <!-- Pro -->
            <div class="item_membership pro" :class="{'activePlan': currentPlan === 'Pro'}">
                <div class="inside">
                    <div class="membership_title">
                        Pro
                        <span>All the nicities plus marketing tools</span>
                    </div>
                    <div class="price">
                        $5.99/month
                        <span>After a 14-day trial</span>
                    </div>
                    <div class="description">
                        <span>Unlimited Free Downloads</span>
                        <span>Discovery mode</span>
                        <span>No Ads</span>
                        <span>Marketing statistics</span>
                    </div>
                    <div class="membership_action">
                        <button type="button" class="primary_btn small" disabled>Coming soon</button>
                    </div>
                </div>
            </div>
        </div>
    </v-container>
</div>
</template>

<script>
export default {
    name: 'memberships',
    data() {
        return {
            currentPlan: 'Free'
        }
    }
}
</script>

<style scoped>

</style>