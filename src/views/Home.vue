<template>
    <div class="home">
        <Blog v-if="!user" :blog="welcomeScreen" />
        <Blog :blog="blog" v-for="(blog, index) in feedBlogs" :key="index" />

        <div class="blog-card-wrap">
            <div class="container">
                <h3>View More Recent Blogs</h3>
                <div class="blog-cards">
                    <BlogCard
                        v-for="(blog, index) in recentBlogs"
                        :blog="blog"
                        :key="index"
                    />
                </div>
            </div>
        </div>

        <div v-if="!user" class="updates">
            <div class="container">
                <h2>never miss a blog. Register for your free account today!</h2>
                <router-link class="router-button" to="#">
                    Register for FireBlogs <ArrowIcon class="arrow arrow-light" />
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import Blog from '../components/Blog.vue'
import BlogCard from '../components/BlogCard.vue'
import ArrowIcon from '../assets/icons/arrow-right-light.svg'

export default {
    name: 'Home',
    components: {
        Blog,
        BlogCard,
        ArrowIcon,
    },
    data() {
        return {
            welcomeScreen: {
                title: 'Welcome!',
                content:
                    'Weekly blog articles with all things programming including HTML, CSS, JavaScript and more. Register today to never miss a post!',
                welcomeScreen: true,
                photo: 'coding',
            },
        }
    },
    computed: {
        recentBlogs() {
            return this.$store.getters.recentBlogs
        },
        feedBlogs() {
            return this.$store.getters.feedBlogs
        },
        user() {
            return this.$store.state.user
        },
    },
}
</script>

<style lang="scss" scoped>
.blog-card-wrap {
    h3 {
        font-weight: 300;
        font-size: 28px;
        margin-bottom: 32px;
    }
}

.updates {
    .container {
        padding: 100px 25px;
        display: flex;
        flex-direction: column;
        align-items: center;

        @media (min-width: 800px) {
            padding: 125px 25px;
            flex-direction: row;
        }

        .router-button {
            display: flex;
            font-size: 14px;
            text-decoration: none;

            @media (min-width: 800px) {
                margin-left: auto;
            }
        }

        h2 {
            font-weight: 300;
            font-size: 32px;
            max-width: 425px;
            width: 100%;
            text-align: center;
            text-transform: uppercase;

            @media (min-width: 800px) {
                text-align: initial;
                font-size: 40px;
            }
        }
    }
}
</style>
