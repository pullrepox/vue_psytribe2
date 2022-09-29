<template>
    <div class="p-settings">
        <v-container>
            <aside>
                <nav class="user_settings">
                    <div class="nav_title">Account Settings</div>
                    <ul>
                        <li>
                            <router-link :to="{name: 'security'}">Security</router-link>
                        </li>
                        <li>
                            <router-link :to="{name: 'privacy'}">Privacy</router-link>
                        </li>
                        <li>
                            <router-link :to="{name: 'notifications'}">Notifications</router-link>
                        </li>
                        <li>
                            <router-link :to="{name: 'wallet'}">Wallet</router-link>
                        </li>
                        <li>
                            <router-link :to="{name: 'membership'}">Membership</router-link>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main>
                <slot></slot>
            </main>
        </v-container>
    </div>

</template>

<script>

export default {
  name: 'settingLayout',
  components: {

  }
}
</script>

