<template>
<div class="p-changelog full_page">
    <supportNav></supportNav>

    <div class="container">
        <div class="coming_soon">
            <h3>Coming soon</h3>
            <div class="process">
                <div class="pending">
                    <span class="name">Design</span>
                    <span class="val">Pending</span>
                </div>
                <div class="active">
                    <span class="name">Programming</span>
                    <span class="val">80%</span>
                </div>
                <div class="pending">
                    <span class="name">Layout</span>
                    <span class="val">Pending</span>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import supportNav from "@/components/navigations/supportNav";

export default {
    name: 'changelog',
    components: {
        supportNav
    }
}
</script>
