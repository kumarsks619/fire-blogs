<template>
    <div class="admin">
        <div class="container">
            <h2>Administration</h2>
            <div class="admin-info">
                <h2>Add Admin</h2>
                <div class="input">
                    <input
                        placeholder="Enter user email to make them an admin"
                        type="text"
                        id="addAdmins"
                        v-model="adminEmail"
                    />
                </div>
                <span>{{ this.responseMessage }}</span>
                <button @click="toggleAdmin" class="button">Submit</button>
            </div>
        </div>
    </div>
</template>

<script>
import db from '../firebase/firebaseInit'

export default {
    name: 'Admin',
    data() {
        return {
            adminEmail: '',
            responseMessage: '',
        }
    },
    methods: {
        toggleAdmin() {
            if (this.adminEmail.length === 0) {
                this.responseMessage = 'Please enter a valid email address.'
                return
            }
            this.$store.commit('toggleLoading')

            db.collection('users')
                .where('email', '==', this.adminEmail)
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.docs.length === 0) {
                        this.$store.commit('toggleLoading')
                        this.responseMessage = 'No user found with this email address!'
                        return
                    }

                    querySnapshot.forEach((doc) => {
                        const isAlreadyAdmin = doc.data().isAdmin
                        doc.ref.update({ isAdmin: !isAlreadyAdmin }, { merge: true })
                        this.responseMessage = isAlreadyAdmin
                            ? `Success! ${this.adminEmail} is now NOT an admin.`
                            : `Success! ${this.adminEmail} is now an admin.`
                        this.adminEmail = ''

                        this.$store.commit('setProfileAdmin', !isAlreadyAdmin)
                        this.$store.commit('toggleLoading')
                    })
                })
                .catch((err) => {
                    this.responseMessage = err.message
                    this.$store.commit('toggleLoading')
                })
        },
    },
}
</script>

<style lang="scss" scoped>
.admin {
    .container {
        max-width: 1000px;
        padding: 60px 25px;

        h2 {
            text-align: center;
            margin-bottom: 16px;
            font-weight: 300;
            font-size: 32px;
        }

        .admin-info {
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                0 2px 4px -1px rgba(0, 0, 0, 0.06);
            padding: 32px;
            background-color: #f1f1f1;
            display: flex;
            flex-direction: column;
            max-width: 600px;
            margin: 32px auto;

            span {
                font-size: 14px;
            }

            .input {
                margin: 16px 0;

                label {
                    font-size: 14px;
                    display: block;
                    padding-bottom: 6px;
                }

                input {
                    width: 100%;
                    border: none;
                    background-color: #fff;
                    padding: 8px;
                    height: 50px;

                    @media (min-width: 900px) {
                    }

                    &:focus {
                        outline: none;
                    }
                }
            }

            button {
                align-self: center;
            }
        }
    }
}
</style>
