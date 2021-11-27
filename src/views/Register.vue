<template>
    <div class="form-wrap">
        <form class="register">
            <p class="login-register">
                Already have an account?
                <router-link class="router-link" :to="{ name: 'Login' }">
                    Login
                </router-link>
            </p>
            <h2>Create Your FireBlogs Account</h2>
            <div class="inputs">
                <div class="input">
                    <input type="text" placeholder="First Name" v-model="firstName" />
                    <UserIcon class="icon" />
                </div>
                <div class="input">
                    <input type="text" placeholder="Last Name" v-model="lastName" />
                    <UserIcon class="icon" />
                </div>
                <div class="input">
                    <input type="text" placeholder="Username" v-model="username" />
                    <UserIcon class="icon" />
                </div>
                <div class="input">
                    <input type="text" placeholder="Email" v-model="email" />
                    <EmailIcon class="icon" />
                </div>
                <div class="input">
                    <input type="password" placeholder="Password" v-model="password" />
                    <PasswordIcon class="icon" />
                </div>
            </div>
            <button>Register</button>
            <div class="angle"></div>
        </form>
        <div class="background"></div>
    </div>
</template>

<script>
import EmailIcon from '../assets/icons/envelope-regular.svg'
import PasswordIcon from '../assets/icons/lock-alt-solid.svg'
import UserIcon from '../assets/icons/user-alt-light.svg'

export default {
    name: 'Register',
    components: {
        EmailIcon,
        PasswordIcon,
        UserIcon,
    },
    data() {
        return {
            firstName: null,
            lastName: null,
            username: null,
            email: null,
            password: null,
        }
    },
}
</script>

<style lang="scss" scoped>
.register {
    h2 {
        max-width: 350px;
    }
}
</style>
