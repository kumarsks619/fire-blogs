import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'

import db from '../firebase/firebaseInit'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        blogs: [],
        loading: false,
        linearLoading: 0,
        blogHTML: 'Start writing your blog from here...',
        blogTitle: '',
        blogCoverPhotoName: '',
        blogPhotoFileURL: '',
        blogPhotoPreview: false,
        editBlog: false,
        user: false,
        profileAdmin: false,
        profileEmail: '',
        profileFirstName: '',
        profileLastName: '',
        profileUsername: '',
        profileID: '',
        profileInitials: '',
    },
    getters: {
        feedBlogs(state) {
            return state.blogs.slice(0, 2)
        },
        recentBlogs(state) {
            return state.blogs.slice(2, 6)
        },
        loading(state) {
            return state.loading
        },
        linearLoading(state) {
            return state.linearLoading
        },
    },
    mutations: {
        toggleEditBlog(state, payload) {
            state.editBlog = payload
        },
        setProfileInfo(state, payload) {
            const doc = payload
            state.profileID = doc.id
            state.profileAdmin = doc.data().isAdmin
            state.profileEmail = doc.data().email
            state.profileFirstName = doc.data().firstName
            state.profileLastName = doc.data().lastName
            state.profileUsername = doc.data().username
        },
        setProfileInitials(state) {
            state.profileInitials =
                state.profileFirstName.match(/(\b\S)?/g).join('') +
                state.profileLastName.match(/(\b\S)?/g).join('')
        },
        updateUser(state, payload) {
            state.user = payload
        },
        changeFirstName(state, payload) {
            state.profileFirstName = payload
        },
        changeLastName(state, payload) {
            state.profileLastName = payload
        },
        changeUsername(state, payload) {
            state.profileUsername = payload
        },
        setProfileAdmin(state, payload) {
            state.profileAdmin = payload
        },
        updateBlogHTML(state, payload) {
            state.blogHTML = payload
        },
        updateBlogTitle(state, payload) {
            state.blogTitle = payload
        },
        fileNameChange(state, payload) {
            state.blogCoverPhotoName = payload
        },
        createFileURL(state, payload) {
            state.blogPhotoFileURL = payload
        },
        togglePhotoPreviewModal(state) {
            state.blogPhotoPreview = !state.blogPhotoPreview
        },
        pushBlogs(state, payload) {
            state.blogs.push(payload)
        },
        toggleLoading(state) {
            state.loading = !state.loading
        },
        filterBlogs(state, payload) {
            state.blogs = state.blogs.filter((blog) => blog.blogID !== payload)
        },
        setBlogState(state, payload) {
            state.blogTitle = payload.blogTitle
            state.blogHTML = payload.blogHTML
            state.blogPhotoFileURL = payload.blogPhotoFileURL
            state.blogCoverPhotoName = payload.blogCoverPhotoName
        },
        setLinearLoaderProgress(state, payload) {
            state.linearLoading = payload
        },
    },
    actions: {
        async getCurrentUser({ commit }) {
            const dbRef = await db
                .collection('users')
                .doc(firebase.auth().currentUser.uid)
            const response = await dbRef.get()
            commit('setProfileInfo', response)
            commit('setProfileInitials')
        },
        async updateUserProfile({ commit, state }) {
            commit('toggleLoading')

            const dbRef = await db.collection('users').doc(state.profileID)
            await dbRef.update({
                firstName: state.profileFirstName,
                lastName: state.profileLastName,
                username: state.profileUsername,
            })
            commit('setProfileInitials')
            commit('toggleLoading')
        },
        async getBlogs({ state, commit }) {
            commit('toggleLoading')
            const dbRef = await db.collection('blogs').orderBy('timestamp', 'desc')
            const foundDocs = await dbRef.get()

            foundDocs.forEach((doc) => {
                if (!state.blogs.some((blog) => blog.blogID === doc.id)) {
                    const blogData = doc.data()
                    const data = {
                        blogID: blogData.blogID,
                        blogHTML: blogData.blogHTML,
                        blogCoverPhoto: blogData.blogCoverPhoto,
                        blogCoverPhotoName: blogData.blogCoverPhotoName,
                        blogTitle: blogData.blogTitle,
                        timestamp: blogData.timestamp,
                    }
                    commit('pushBlogs', data)
                }
            })
            commit('toggleLoading')
        },
        async deleteBlog({ commit }, payload) {
            commit('toggleLoading')
            const blogToDelete = await db.collection('blogs').doc(payload)
            await blogToDelete.delete()

            commit('filterBlogs', payload)
            commit('toggleLoading')
        },
        async updateBlog({ commit, dispatch }, payload) {
            commit('filterBlogs', payload)
            await dispatch('getBlogs')
        },
    },
    modules: {},
})
