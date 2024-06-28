<template>
  <icon-music class="play-btn" :spin="isPlaying" @click="onPlayClick"></icon-music>
  <audio ref="audioRef" :src="musicResource"></audio>
</template>

<script setup>
import { IconMusic } from '@arco-design/web-vue/es/icon';
import musicResource from '../../public/Yesterday Once More.mp3'
import { ref } from 'vue';

const audioRef = ref(null);
const isPlaying = ref(false);

function onPlayClick() {
  if (isPlaying.value) {
    audioRef.value.pause();
  } else {
    audioRef.value.play();
  }
  isPlaying.value = !isPlaying.value;
}
</script>

<style lang="less">
.play-btn {
  margin: 1px 10px 0 10px;
  color: #5080a9 !important;
}

.arco-icon-spin {
  animation: arco-loading-circle 1.5s infinite cubic-bezier(0, 0, 1, 1) !important;
}
</style>