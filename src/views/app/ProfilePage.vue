<template>
    <div class="profile_page_container">
        <div class="sidebar-sticky">
            <UserAbout/>
        </div>
        <ProfileContent/>
    </div>
</template>

<script setup>
import UserAbout from '@/views/app/Profile/UserAbout.vue';
import ProfileContent from '@/views/app/Profile/ProfileContent.vue';

   
        
</script>

<style scoped>
.profile_page_container{
    display: flex;
    gap: 12px;
    margin-top: 12px;
    align-items: flex-start
}
.sidebar-sticky {
    position: sticky;
    top: 12px;
    flex-shrink: 0;
}
</style>