<template>
    <div class="layout-container">
        <div class="head_nav">
            <Header></Header>
        </div>
        <div class="side_content">
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import Header from '@/layout/components/Header.vue';

</script>

<style scoped>
.layout-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.head_nav{
    height: 68px;
    width: 100%;
    margin-bottom: 12px;
}
.side_content{
    width: 100%;
    height: calc(100% - 68px);
    display: flex;
    gap: 22px;
}

.content{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>