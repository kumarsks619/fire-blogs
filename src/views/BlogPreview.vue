<template>
    <div class="post-view">
        <div class="container quillWrapper">
            <div class="router-button" @click="$router.go(-1)">
                Go Back
            </div>
            <h2>{{ blogTitle }}</h2>
            <img :src="blogCoverPhoto" alt="" />
            <div class="post-content ql-editor" v-html="blogHTML"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BlogPreview',
    computed: {
        blogTitle() {
            return this.$store.state.blogTitle
        },
        blogHTML() {
            return this.$store.state.blogHTML
        },
        blogCoverPhoto() {
            return this.$store.state.blogPhotoFileURL
        },
    },
}
</script>

<style lang="scss">
.post-view {
    min-height: 100%;

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
        display: block;
        margin-left: auto;
        width: fit-content;

        &:hover {
            background-color: rgba(48, 48, 48, 0.7);
        }
    }

    .container {
        max-width: 1000px;
        padding: 20px 25px 60px;
    }

    .ql-editor {
        padding: 0;
    }

    h2 {
        margin-top: 2rem;
        margin-bottom: 16px;
        font-weight: 300;
        font-size: 32px;
    }

    img {
        width: 100%;
        margin-bottom: 32px;
    }
}
</style>
