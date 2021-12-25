<template>
    <div class="post-view" v-if="currentBlog.length !== 0">
        <div class="container quillWrapper">
            <h2>{{ currentBlog[0].blogTitle }}</h2>
            <h4>
                Posted by: {{ currentBlog[0].createdByName }}
                <span>({{ currentBlog[0].createdByEmail }})</span>
            </h4>
            <h4>
                Posted on:
                {{
                    new Date(currentBlog[0].timestamp).toLocaleString('en-us', {
                        dateStyle: 'long',
                    })
                }}
            </h4>
            <img :src="currentBlog[0].blogCoverPhoto" alt="" />
            <div class="post-content ql-editor" v-html="currentBlog[0].blogHTML"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ViewBlog',
    data() {
        return {
            currentBlog: [],
        }
    },
    async mounted() {
        this.currentBlog = await this.$store.state.blogs.filter(
            (blog) => blog.blogID === this.$route.params.blogID
        )
    },
}
</script>

<style lang="scss">
.post-view {
    h4 {
        font-weight: 400;
        font-size: 14px;
        margin-bottom: 8px;

        span {
        }
    }

    h4:nth-child(3) {
        margin-bottom: 24px;
    }
}
</style>
