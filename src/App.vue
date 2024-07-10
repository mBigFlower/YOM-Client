<template>
  <div class="app">
    <div class="header">
      <a-image width="30" src="./favicon.ico"></a-image>
      <span class="title">Yesterday Once More <span class="version">{{ version }}</span></span>
      <MusicPlayer></MusicPlayer>
      <span class="empty"></span>
      <a href="https://github.com/mBigFlower/YOM-Client" target="_blank" class="github-link">
        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" width="28"
          height="28">
      </a>
    </div>

    <a-config-provider :locale="enUS">
      <a-layout style="overflow: hidden">
        <a-layout-sider hide-trigger collapsible>
          <div class="logo" />
          <a-menu :defaultSelectedKeys="['file-select']" :style="{ width: '100%' }" :selected-keys="[currentRoute.name]"
            @menuItemClick="onClickMenuItem">
            <a-menu-item key="file-select">
              Select File
            </a-menu-item>
            <a-menu-item key="console">
              Console
            </a-menu-item>
            <a-menu-item key="network">
              Network
            </a-menu-item>
            <a-menu-item key="media">
              Media
            </a-menu-item>
            <a-menu-item key="all-in-one">
              All In One
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <router-view v-slot="{ Component, route }">
          <keep-alive>
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </router-view>
      </a-layout>
    </a-config-provider>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from "vue-router";
import MusicPlayer from '@/components/music-player.vue';
import { version } from '../package.json'
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';

const router = useRouter();

const currentRoute = computed(() => {
  console.log('currentRoute', router.currentRoute.value);
  return router.currentRoute.value;
});
function onClickMenuItem(key) {
  router.push('/' + key)
}
</script>

<style scoped lang="less">
.app {
  height: 99%;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 4px;

  .title {
    font-size: 26px;
    font-weight: 600;
    margin-left: 10px;
    background: linear-gradient(to left, #6ea6bf, #000080);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .empty {
    flex: 1;
  }

  .version {
    font-size: 14px;
  }
}
</style>