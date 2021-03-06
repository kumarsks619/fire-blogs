<template>
    <div class="blog-wrapper" :class="{ 'no-user': !user }">
        <div class="blog-content">
            <div>
                <h2 v-if="blog.welcomeScreen">{{ blog.title }}</h2>
                <h2 v-else>{{ blog.blogTitle }}</h2>

                <p v-if="blog.welcomeScreen">{{ blog.content }}</p>
                <p v-else>Posted by: {{ blog.createdByName }}</p>

                <router-link
                    v-if="blog.welcomeScreen"
                    :to="{ name: 'Login' }"
                    class="link link-light"
                >
                    Login/Register <ArrowIcon class="arrow arrow-light" />
                </router-link>
                <router-link
                    v-else
                    :to="{ name: 'ViewBlog', params: { blogID: blog.blogID } }"
                    class="link"
                >
                    View The Blog <ArrowIcon class="arrow" />
                </router-link>
            </div>
        </div>

        <div class="blog-photo">
            <img
                v-if="blog.welcomeScreen"
                :src="require(`../assets/blogPhotos/${blog.photo}.jpg`)"
                alt="Welcome Cover"
            />
            <img v-else :src="blog.blogCoverPhoto" :alt="blog.blogTitle" />
        </div>
    </div>
</template>

<script>
import ArrowIcon from '../assets/icons/arrow-right-light.svg'

export default {
    name: 'Blog',
    props: ['blog'],
    components: {
        ArrowIcon,
    },
    computed: {
        user() {
            return this.$store.state.user
        },
    },
}
</script>

<style lang="scss" scoped>
.blog-wrapper {
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

    @media (min-width: 700px) {
        min-height: 650px;
        max-height: 650px;
        flex-direction: row;
    }

    .blog-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 4;
        order: 2;

        @media (min-width: 700px) {
            order: 1;
        }

        @media (min-width: 800px) {
            flex: 3;
        }

        div {
            max-width: 375px;
            padding: 72px 24px;

            @media (min-width: 700px) {
                padding: 0 24px;
            }

            h2 {
                font-size: 32px;
                font-weight: 300;
                text-transform: uppercase;
                margin-bottom: 24px;

                @media (min-width: 700px) {
                    font-size: 40px;
                }
            }

            p {
                font-size: 15px;
                font-weight: 300;
                line-height: 1.7;
            }

            .link {
                display: inline-flex;
                align-items: center;
                margin-top: 32px;
                padding-bottom: 4px;
                border-bottom: 1px solid transparent;
                transition: 0.5s ease-in all;

                &:hover {
                    border-bottom-color: #303030;
                }
            }

            .link-light {
                &:hover {
                    border-bottom-color: #ffff;
                }
            }
        }
    }

    .blog-photo {
        order: 1;
        flex: 3;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

        @media (min-width: 700px) {
            order: 2;
        }

        @media (min-width: 800px) {
            flex: 4;
        }

        img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    &:nth-child(even) {
        .blog-content {
            order: 2;
        }

        .blog-photo {
            order: 1;
        }
    }
}

.no-user:first-child {
    .blog-content {
        background-color: #303030;
        color: #fff;
    }
}
</style>
