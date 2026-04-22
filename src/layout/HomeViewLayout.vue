<template>
    <div class="layout-container">
        <div class="head_nav">
            <Header></Header>
        </div>
        <div class="main_content">
            <div class="left_sidebar">
                <TopicTags/>
                <AIAssistantWidget/>
            </div>
            <div class="content">
                <slot></slot>
            </div>
            <div class="right_sidebar">
                <ExpertsToFollow/>
                <MiniFooter/>
            </div>
        </div>
    </div>
</template>

<script setup>
import Header from '@/layout/components/Header.vue';
import TopicTags from '@/layout/components/sidebarLeft/TopicTags.vue';
import AIAssistantWidget from '@/layout/components/sidebarLeft/AIAssistantWidget.vue';
import ExpertsToFollow from '@/layout/components/sidebarRight/ExpertsToFollow.vue';
import MiniFooter from '@/layout/components/sidebarRight/MiniFooter.vue';

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
.main_content{
    width: 100%;
    height: calc(100% - 68px);
    display: flex;
    gap: 12px;
    padding: 0 12px;
    box-sizing: border-box;
}
.left_sidebar , .right_sidebar{
    width: 320px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.content{
    width: calc(100% - 640px);
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none; 
    -ms-overflow-style: none;
}
</style>