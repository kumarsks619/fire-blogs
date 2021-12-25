<template>
    <header>
        <nav class="container">
            <div class="branding">
                <router-link class="header" :to="{ name: 'Home' }">FireBlogs</router-link>
            </div>
            <div class="nav-links">
                <ul v-show="!mobile">
                    <router-link class="link" :to="{ name: 'Home' }">Home</router-link>
                    <router-link class="link" :to="{ name: 'Blogs' }">Blogs</router-link>
                    <router-link v-if="admin" class="link" :to="{ name: 'CreateBlog' }">
                        Create Blog
                    </router-link>
                    <router-link v-if="!user" class="link" :to="{ name: 'Login' }">
                        Login/Register
                    </router-link>
                </ul>

                <!-- Profile Menu -->
                <div
                    v-if="user"
                    @click="toggleProfileMenu"
                    class="profile"
                    :class="{ 'profile-menu-shift': mobile }"
                    ref="profile"
                >
                    <span>{{ $store.state.profileInitials }}</span>
                    <div
                        v-show="profileMenu"
                        class="profile-menu"
                        v-click-outside="closeProfileMenu"
                    >
                        <div class="info">
                            <p class="initials">
                                {{ $store.state.profileInitials }}
                            </p>
                            <div class="right">
                                <p>
                                    {{ $store.state.profileFirstName }}
                                    {{ $store.state.profileLastName }}
                                </p>
                                <p>{{ $store.state.profileUsername }}</p>
                                <p>{{ $store.state.profileEmail }}</p>
                            </div>
                        </div>
                        <div class="options">
                            <div class="option">
                                <router-link
                                    :to="{ name: 'Profile' }"
                                    class="option-link"
                                >
                                    <UserIcon class="icon" />
                                    <p>Profile</p>
                                </router-link>
                            </div>
                            <div v-if="admin" class="option">
                                <router-link :to="{ name: 'Admin' }" class="option-link">
                                    <AdminIcon class="icon" />
                                    <p>Admin</p>
                                </router-link>
                            </div>
                            <div class="option">
                                <div @click="signOut" class="option-link">
                                    <SignOutIcon class="icon" />
                                    <p>Sign Out</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <MenuIcon
            @click="toggleMobileNav"
            class="menu-icon"
            v-show="mobile"
            ref="hamburgerIcon"
        />
        <transition name="mobile-nav">
            <ul class="mobile-nav" v-show="mobileNav" v-click-outside="closeMobileNav">
                <router-link class="link" :to="{ name: 'Home' }">Home</router-link>
                <router-link class="link" :to="{ name: 'Blogs' }">Blogs</router-link>
                <router-link v-if="admin" class="link" :to="{ name: 'CreateBlog' }">
                    Create Blog
                </router-link>
                <router-link v-if="!user" class="link" :to="{ name: 'Login' }">
                    Login/Register
                </router-link>
            </ul>
        </transition>
    </header>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

import MenuIcon from '../assets/icons/bars-regular.svg'
import UserIcon from '../assets/icons/user-alt-light.svg'
import AdminIcon from '../assets/icons/user-crown-light.svg'
import SignOutIcon from '../assets/icons/sign-out-alt-regular.svg'

export default {
    name: 'Navigation',
    components: {
        MenuIcon,
        UserIcon,
        AdminIcon,
        SignOutIcon,
    },
    data() {
        return {
            mobile: false,
            mobileNav: false,
            windowWidth: null,
            profileMenu: false,
        }
    },
    created() {
        window.addEventListener('resize', this.checkScreen)
    },
    methods: {
        checkScreen() {
            this.windowWidth = window.innerWidth

            if (this.windowWidth <= 750) {
                this.mobile = true
                return
            }

            this.mobile = false
            this.mobileNav = false
            return
        },
        toggleMobileNav() {
            this.mobileNav = !this.mobileNav
        },
        closeMobileNav(e) {
            if (e.target !== this.$refs.hamburgerIcon) {
                this.mobileNav = false
            }
        },
        toggleProfileMenu(e) {
            if (e.target === this.$refs.profile) {
                this.profileMenu = !this.profileMenu
            }
        },
        closeProfileMenu(e) {
            if (e.target !== this.$refs.profile) {
                this.profileMenu = false
            }
        },
        signOut() {
            firebase.auth().signOut()
            window.location.reload()
        },
    },
    computed: {
        user() {
            return this.$store.state.user
        },
        admin() {
            return this.$store.state.profileAdmin
        },
    },
}
</script>

<style lang="scss" scoped>
header {
    position: sticky;
    top: 0;
    background-color: #fff;
    padding: 0 25px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 100;

    .link {
        font-weight: 500;
        padding: 0 8px;
        transition: 0.3s color ease;

        &:hover {
            color: #1eb8b8;
        }
    }

    nav {
        display: flex;
        padding: 25px 0;

        .branding {
            display: flex;
            align-items: center;

            .header {
                font-weight: 600;
                font-size: 24px;
                color: #000000;
                text-decoration: none;
            }
        }

        .nav-links {
            position: relative;
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: flex-end;

            ul {
                margin-right: 32px;

                .link {
                    margin-right: 32px;
                }

                .link:last-child {
                    margin-right: 0;
                }
            }

            .profile {
                position: relative;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                color: #fff;
                background-color: #303030;

                span {
                    pointer-events: none;
                }

                .profile-menu {
                    position: absolute;
                    top: 60px;
                    right: 0;
                    width: 250px;
                    background-color: #303030;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                        0 2px 4px -1px rgba(0, 0, 0, 0.06);

                    .info {
                        display: flex;
                        align-items: center;
                        padding: 15px;
                        border-bottom: 1px solid #fff;

                        .initials {
                            position: initial;
                            width: 40px;
                            height: 40px;
                            background-color: #fff;
                            color: #303030;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 50%;
                        }

                        .right {
                            flex: 1;
                            margin-left: 24px;

                            p:nth-child(1) {
                                font-size: 14px;
                            }

                            p:nth-child(2),
                            p:nth-child(3) {
                                font-size: 12px;
                            }
                        }
                    }

                    .options {
                        padding: 0;

                        .option {
                            padding: 8px 12px;

                            .option-link {
                                text-decoration: none;
                                display: flex;
                                align-items: center;
                                color: #fff;
                            }

                            .icon {
                                width: 18px;
                                height: auto;
                            }

                            p {
                                font-size: 14px;
                                margin-left: 12px;
                            }

                            &:hover {
                                background-color: #fff;

                                .option-link {
                                    color: #303030;
                                }
                            }
                        }
                    }
                }
            }

            .profile-menu-shift {
                margin-right: 40px;
            }

            .mobile-user-menu {
                margin-right: 40px;
            }
        }
    }

    .menu-icon {
        cursor: pointer;
        position: absolute;
        top: 32px;
        right: 25px;
        height: 25px;
        width: auto;
    }

    .mobile-nav {
        padding: 20px;
        width: 70%;
        max-width: 250px;
        display: flex;
        flex-direction: column;
        position: fixed;
        height: 100%;
        background-color: #303030;
        top: 0;
        left: 0;

        .link {
            padding: 15px 0;
            color: #fff;
        }
    }

    // mobile nav transition
    .mobile-nav-enter-active,
    .mobile-nav-leave-active {
        transition: all 1s ease;
    }

    .mobile-nav-enter {
        transform: translateX(-250px);
    }

    .mobile-nav-enter-to {
        transform: translateX(0);
    }

    .mobile-nav-leave-to {
        transform: translateX(-250px);
    }
}
</style>
