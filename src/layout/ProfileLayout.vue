<template>
    <div class="layout-container">
        <div class="head_nav">
            <Header></Header>
        </div>
        <div class="layout_content">
            <div class="profile-banner">
                <ProfileBanner />
            </div>
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import ProfileBanner from '@/layout/components/ProfileBanner.vue';
import Header from '@/layout/components/Header.vue';
</script>

<style scoped>
.head_nav {
    height: 68px;
    width: 100%;
    flex-shrink: 0;
}

.layout-container {
    width: 100%;
    height: 100vh; 
    overflow: hidden; 
    display: flex;
    flex-direction: column;
}

.profile-banner {
    width: 100%;
    height: 282px;
    margin: 0 auto;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content {
    width: 100%;
    height: calc(100% - 282px);
    padding: 0 188px;
    box-sizing: border-box;
}
.layout_content{
    width: 100%;
    height: calc(100% - 68px);
    overflow-y: auto;
    flex: 1;
}
</style>