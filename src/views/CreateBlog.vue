<template>
    <div class="create-blog">
        <BlogCoverPreview v-show="$store.state.blogPhotoPreview" />

        <div class="container">
            <div :class="{ invisible: !error }" class="err-message">
                <p><span>Error: </span>{{ errorMessage }}</p>
            </div>

            <div class="blog-info">
                <input type="text" placeholder="Enter Blog Title" v-model="blogTitle" />
                <div class="upload-file">
                    <label for="blog-photo">Upload Cover Photo</label>
                    <input
                        type="file"
                        ref="blogPhoto"
                        id="blog-photo"
                        @change="fileChange"
                        accept=".png, .jpg, ,jpeg"
                    />
                    <button
                        @click="openPreview"
                        class="preview"
                        :class="{
                            'button-inactive': !$store.state.blogPhotoFileURL,
                        }"
                    >
                        Preview Photo
                    </button>
                    <span>File Chosen: {{ $store.state.blogCoverPhotoName }}</span>
                </div>
            </div>

            <div class="editor">
                <vue-editor
                    :editorOptions="editorSettings"
                    v-model="blogHTML"
                    useCustomImageHandler
                    @image-added="imageHandler"
                />
            </div>

            <div class="blog-actions">
                <button @click="uploadBlog">Publish Blog</button>
                <router-link class="router-button" :to="{ name: 'BlogPreview' }">
                    Blog Preview
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/storage'
import Quill from 'quill'
window.Quill = Quill
const ImageResize = require('quill-image-resize-module').default
Quill.register('modules/imageResize', ImageResize)

import db from '../firebase/firebaseInit'
import BlogCoverPreview from '../components/BlogCoverPreview'

export default {
    name: 'CreateBlog',
    components: {
        BlogCoverPreview,
    },
    data() {
        return {
            file: null,
            error: null,
            errorMessage: '',
            editorSettings: {
                modules: {
                    imageResize: {},
                },
            },
        }
    },
    computed: {
        profileID() {
            return this.$store.state.profileID
        },
        blogCoverPhotoName() {
            return this.$store.state.blogCoverPhotoName
        },
        blogTitle: {
            get() {
                return this.$store.state.blogTitle
            },
            set(payload) {
                this.$store.commit('updateBlogTitle', payload)
            },
        },
        blogHTML: {
            get() {
                return this.$store.state.blogHTML
            },
            set(payload) {
                this.$store.commit('updateBlogHTML', payload)
            },
        },
    },
    methods: {
        fileChange() {
            this.file = this.$refs.blogPhoto.files[0]
            const fileName = this.file.name
            this.$store.commit('fileNameChange', fileName)
            this.$store.commit('createFileURL', URL.createObjectURL(this.file))
        },
        imageHandler(file, Editor, cursorLocation, resetUploader) {
            const storageRef = firebase.storage().ref()
            const locationRef = storageRef.child(`assets/blogContentPhotos/${file.name}`)
            locationRef.put(file).on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    )
                    this.$store.commit('setLinearLoaderProgress', progress)
                },
                (err) => {
                    console.log(err)
                    this.error = true
                    this.errorMessage = err.message
                    this.clearError()
                },
                async () => {
                    this.$store.commit('setLinearLoaderProgress', 0)
                    const downloadURL = await locationRef.getDownloadURL()
                    Editor.insertEmbed(cursorLocation, 'image', downloadURL)
                    resetUploader()
                }
            )
        },
        openPreview() {
            this.$store.commit('togglePhotoPreviewModal')
        },
        uploadBlog() {
            if (this.blogTitle.length !== 0 && this.blogHTML.length !== 0) {
                if (this.file) {
                    this.$store.commit('toggleLoading')
                    const storageRef = firebase.storage().ref()
                    const locationRef = storageRef.child(
                        `assets/blogCoverPhotos/${this.$store.state.blogCoverPhotoName}`
                    )
                    locationRef.put(this.file).on(
                        'state_changed',
                        (snapshot) => {
                            const progress = Math.round(
                                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                            )
                            this.$store.commit('setLinearLoaderProgress', progress)
                        },
                        (err) => {
                            console.log(err)
                            this.$store.commit('toggleLoading')
                            this.error = true
                            this.errorMessage = err.message
                            this.clearError()
                        },
                        async () => {
                            this.$store.commit('setLinearLoaderProgress', 0)
                            const downloadURL = await locationRef.getDownloadURL()
                            const timestamp = await Date.now()
                            const docRef = await db.collection('blogs').doc()

                            await docRef.set({
                                blogID: docRef.id,
                                blogHTML: this.blogHTML,
                                blogCoverPhoto: downloadURL,
                                blogCoverPhotoName: this.blogCoverPhotoName,
                                blogTitle: this.blogTitle,
                                profileID: this.profileID,
                                timestamp,
                                createdByName: this.$store.getters.userFullName,
                                createdByEmail: this.$store.state.profileEmail,
                            })

                            await this.$store.dispatch('getBlogs')
                            this.$store.commit('toggleLoading')
                            this.clearCreateBlogForm()
                            this.$router.push({
                                name: 'ViewBlog',
                                params: { blogID: docRef.id },
                            })
                        }
                    )
                } else {
                    this.error = true
                    this.errorMessage = 'Please ensure you have uploaded a cover photo!'
                    this.clearError()
                }
            } else {
                this.error = true
                this.errorMessage =
                    'Please ensure Blog Title & Blog Post has been filled!'
                this.clearError()
            }
        },
        clearError() {
            setTimeout(() => {
                this.error = false
                this.errorMessage = ''
            }, 5000)
        },
        clearCreateBlogForm() {
            this.$store.commit('updateBlogTitle', '')
            this.$store.commit('updateBlogHTML', 'Start writing your blog from here...')
            this.$store.commit('fileNameChange', '')
            this.$store.commit('createFileURL', '')
        },
    },
}
</script>

<style lang="scss">
.create-blog {
    position: relative;
    height: 100%;

    button {
        margin-top: 0;
    }

    .router-button {
        text-decoration: none;
        color: #fff;
    }

    label,
    button,
    .router-button {
        transition: 0.5s ease-in-out all;
        align-self: center;
        font-size: 14px;
        cursor: pointer;
        border-radius: 20px;
        padding: 12px 24px;
        color: #fff;
        background-color: #303030;
        text-decoration: none;

        &:hover {
            background-color: rgba(48, 48, 48, 0.7);
        }
    }

    .container {
        position: relative;
        height: 100%;
        padding: 10px 25px 60px;
    }

    // error styling
    .invisible {
        opacity: 0 !important;
    }

    .err-message {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        color: #fff;
        margin-bottom: 10px;
        background-color: #303030;
        opacity: 1;
        transition: 0.5s ease all;

        p {
            font-size: 14px;
        }

        span {
            font-weight: 600;
        }
    }

    .blog-info {
        display: flex;
        margin-bottom: 32px;

        input:nth-child(1) {
            min-width: 300px;
        }

        input {
            transition: 0.5s ease-in-out all;
            padding: 10px 4px;
            border: none;
            border-bottom: 1px solid #303030;

            &:focus {
                outline: none;
                box-shadow: 0 1px 0 0 #303030;
            }
        }

        .upload-file {
            flex: 1;
            margin-left: 16px;
            position: relative;
            display: flex;

            input {
                display: none;
            }

            .preview {
                margin-left: 16px;
                text-transform: initial;
            }

            span {
                font-size: 12px;
                margin-left: 16px;
                align-self: center;
            }
        }
    }

    .editor {
        height: 60vh;
        display: flex;
        flex-direction: column;

        .quillWrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .ql-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
        }

        .ql-editor {
            padding: 20px 16px 30px;
        }
    }

    .blog-actions {
        margin-top: 32px;

        button {
            margin-right: 16px;
        }
    }
}
</style>
