<template>
    <div class="container">
        <div class="filled" :style="{ width: `${progress}%` }"></div>
    </div>
</template>

<script>
export default {
    name: 'LinearLoader',
    props: {
        progress: {
            type: Number,
            default: 0,
        },
    },
}
</script>

<style lang="scss" scoped>
.container {
    min-width: 100vw;
    height: 6px;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #f1f1f1;
    z-index: 101;

    .filled {
        background-color: #303030;
        height: 100%;
    }
}
</style>
