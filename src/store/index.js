import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'

import db from '../firebase/firebaseInit'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        sampleBlogCards: [
            {
                blogTitle: 'Blog Card #1',
                blogCoverPhoto: 'stock-1',
                blogDate: 'May 1, 2021',
            },
            {
                blogTitle: 'Blog Card #2',
                blogCoverPhoto: 'stock-2',
                blogDate: 'May 1, 2021',
            },
            {
                blogTitle: 'Blog Card #3',
                blogCoverPhoto: 'stock-3',
                blogDate: 'May 1, 2021',
            },
            {
                blogTitle: 'Blog Card #4',
                blogCoverPhoto: 'stock-4',
                blogDate: 'May 1, 2021',
            },
        ],
        blogHTML: 'Start writing your blog from here...',
        blogTitle: '',
        blogPhotoName: '',
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
            state.blogPhotoName = payload
        },
        createFileURL(state, payload) {
            state.blogPhotoFileURL = payload
        },
        togglePhotoPreviewModal(state) {
            state.blogPhotoPreview = !state.blogPhotoPreview
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
            const dbRef = await db.collection('users').doc(state.profileID)
            await dbRef.update({
                firstName: state.profileFirstName,
                lastName: state.profileLastName,
                username: state.profileUsername,
            })
            commit('setProfileInitials')
        },
    },
    modules: {},
})
