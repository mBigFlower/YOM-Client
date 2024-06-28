import { defineStore } from 'pinia'
import { ref } from "vue";

export const useMediaStore = defineStore("mediaStore", () => {
  const mediaFiles = ref([]);
  const mediaSrc = ref();

  const setMediaSrc = (src) => {
    mediaSrc.value = src;
  }

  const clear = () => {
    mediaFiles.value = [];
    mediaSrc.value = '';
  }

  const getMediaTimeRange = () => {
    try {
      if (mediaFiles.value.length < 1) return [];
      console.log('getMediaTimeRange', mediaFiles.value);
      const nameSplits = mediaFiles.value[0]?.name?.replace('.mp4', '').replaceAll('_', ':').split(',');
      return [nameSplits[1], nameSplits[2]];
    } catch (error) {
      console.error(error, 'getMediaTimeRange');
    }
  }

  return {
    mediaFiles,
    mediaSrc,
    setMediaSrc,
    clear,
    getMediaTimeRange
  };
})