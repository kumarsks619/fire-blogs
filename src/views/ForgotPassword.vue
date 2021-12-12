<template>
    <div class="reset-password">
        <Modal
            v-show="modalActive"
            :modalMessage="modalMessage"
            v-on:close-modal="closeModal"
        />

        <div class="form-wrap">
            <form class="reset">
                <p class="login-register">
                    Back to
                    <router-link class="router-link" :to="{ name: 'Login' }">
                        Login
                    </router-link>
                </p>
                <h2>Reset Password</h2>
                <p>Forgot your password? Enter your email to reset it</p>
                <div class="inputs">
                    <div class="input">
                        <input type="text" placeholder="Email" v-model="email" />
                        <EmailIcon class="icon" />
                    </div>
                </div>
                <button @click.prevent="resetPassword">Reset</button>
                <div class="angle"></div>
            </form>
            <div class="background"></div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

import EmailIcon from '../assets/icons/envelope-regular.svg'
import Modal from '../components/Modal'

export default {
    name: 'ForgotPassword',
    components: {
        EmailIcon,
        Modal,
    },
    data() {
        return {
            email: '',
            modalActive: null,
            modalMessage: '',
        }
    },
    methods: {
        closeModal() {
            this.modalActive = !this.modalActive
            this.email = ''
        },
        resetPassword() {
            this.$store.commit('toggleLoading')
            firebase
                .auth()
                .sendPasswordResetEmail(this.email)
                .then(() => {
                    this.modalMessage =
                        'If your account exists, you will receive an email'
                    this.$store.commit('toggleLoading')
                    this.modalActive = true
                })
                .catch((err) => {
                    this.modalMessage = err.message
                    this.$store.commit('toggleLoading')
                    this.modalActive = true
                })
        },
    },
}
</script>

<style lang="scss" scoped>
.reset-password {
    position: relative;

    .form-wrap {
        .reset {
            h2 {
                margin-bottom: 8px;
            }

            p {
                text-align: center;
                margin-bottom: 32px;
            }
        }
    }
}
</style>
