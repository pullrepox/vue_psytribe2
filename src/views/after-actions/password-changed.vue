<template>
    <div class="page-password-changed">
        <div class="content-page">
            <div class="block_password_changed">
                <h2>
                    Congratulations!
                </h2>
                <div class="description">
                    You’ve successfully changed your old password! Please log in using your new password.
                </div>
                <router-link :to="{name: 'login'}" class="right">Log in</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'password-changed'
}
</script>
