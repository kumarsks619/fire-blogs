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

                <div class="error" v-show="error">{{ this.errorMessage }}</div>
            </div>
            <button @click.prevent="register">Register</button>
            <div class="angle"></div>
        </form>
        <div class="background"></div>
    </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

import db from '../firebase/firebaseInit'
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
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            error: null,
            errorMessage: '',
        }
    },
    methods: {
        async register() {
            if (
                this.email !== '' &&
                this.password !== '' &&
                this.firstName !== '' &&
                this.lastName !== '' &&
                this.username !== ''
            ) {
                this.error = false
                this.errorMessage = ''

                const firebaseAuth = await firebase.auth()
                const createdUser = await firebaseAuth.createUserWithEmailAndPassword(
                    this.email,
                    this.password
                )

                const dbRef = db.collection('users').doc(createdUser.user.uid)
                await dbRef.set({
                    firstName: this.firstName,
                    lastName: this.lastName,
                    username: this.username,
                    email: this.email,
                })

                this.$router.push({ name: 'Home' })
            } else {
                this.error = true
                this.errorMessage = 'Please fill out all the fields!'
            }
        },
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
