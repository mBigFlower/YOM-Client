
<template>
  <div class="media-root">
    <a-empty v-if="isEmpty">No Data</a-empty>
    <video v-else ref="videoRef" class="video" controls></video>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useMediaStore } from '@/store/media'

const mediaStore = useMediaStore();
const videoRef = ref()

const emit = defineEmits(['mediaInfoUpdate']);

const isEmpty = computed(() => {
  return !mediaStore.mediaSrc;
});

onMounted(() => {
  videoRef.value?.addEventListener('timeupdate', function () {
    const percent = videoRef.value.currentTime * 100 / videoRef.value.duration;
    console.log('duration', Math.floor(percent));
    emit('mediaInfoUpdate', Math.floor(percent));
  });
})

nextTick(() => {
  console.log('mediaStore.mediaSrc', mediaStore.mediaSrc);
  if (videoRef.value)
    videoRef.value.src = mediaStore.mediaSrc;
})

</script>
<style scoped lang="less">
@import url('./media.less');
</style>
