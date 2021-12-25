import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'
import 'firebase/auth'

import Home from '../views/Home.vue'
import Blogs from '../views/Blogs.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import Profile from '../views/Profile.vue'
import Admin from '../views/Admin.vue'
import CreateBlog from '../views/CreateBlog.vue'
import BlogPreview from '../views/BlogPreview.vue'
import ViewBlog from '../views/ViewBlog.vue'
import EditBlog from '../views/EditBlog.vue'
import db from '../firebase/firebaseInit'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'Home',
            requiresAuth: false,
        },
    },
    {
        path: '/blogs',
        name: 'Blogs',
        component: Blogs,
        meta: {
            title: 'Blogs',
            requiresAuth: false,
        },
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: 'Login',
            requiresAuth: false,
        },
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            title: 'Register',
            requiresAuth: false,
        },
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
        meta: {
            title: 'Forgot Password',
            requiresAuth: false,
        },
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: {
            title: 'Profile',
            requiresAuth: true,
        },
    },
    {
        path: '/admin',
        name: 'Admin',
        component: Admin,
        meta: {
            title: 'Admin',
            requiresAuth: true,
            requiresAdmin: true,
        },
    },
    {
        path: '/create-blog',
        name: 'CreateBlog',
        component: CreateBlog,
        meta: {
            title: 'Create New Blog',
            requiresAuth: true,
        },
    },
    {
        path: '/blog-preview',
        name: 'BlogPreview',
        component: BlogPreview,
        meta: {
            title: 'Blog Preview',
            requiresAuth: true,
            requiresAdmin: true,
        },
    },
    {
        path: '/view-blog/:blogID',
        name: 'ViewBlog',
        component: ViewBlog,
        meta: {
            title: 'View Blog',
            requiresAuth: false,
        },
    },
    {
        path: '/edit-blog/:blogID',
        name: 'EditBlog',
        component: EditBlog,
        meta: {
            title: 'Edit A Blog',
            requiresAuth: true,
            requiresAdmin: true,
        },
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

router.beforeEach((to, _, next) => {
    document.title = `${to.meta.title} | FireBlogs`
    next()
})

router.beforeEach(async (to, _, next) => {
    let auth = firebase.auth().currentUser
    let user = null,
        admin = null

    if (auth) {
        const dbRef = await db.collection('users').doc(auth.uid)
        const response = await dbRef.get()
        user = response.data()

        // checking if the logged in user is and admin or not
        if (user.isAdmin) {
            admin = true
        }
    }

    if (to.matched.some((res) => res.meta.requiresAuth)) {
        if (user) {
            if (to.matched.some((res) => res.meta.requiresAdmin)) {
                if (admin) {
                    return next()
                }
                return next({ name: 'Home' })
            }
            return next()
        }
        return next({ name: 'Home' })
    }
    next()
})

export default router
