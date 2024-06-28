import { defineStore } from 'pinia'
import { ref } from "vue";
import { analyzeNetworkData } from '@/utils/network-utils';
import { readFile2Object } from '@/utils/file-utils'

export const useNetworkStore = defineStore("networkStore", () => {
  // 用于读取的 File 数据
  const originNetworkFiles = ref([]);
  // 真实的网络文件数据
  const realNetworks = ref([]);
  // 用于 Network 页面展示的数据
  const shownNetworks = ref([]);

  function addNetworkFile(file) {
    if(!file) return;
    const index = originNetworkFiles.value.findIndex(f => f.name === file.name);
    if(index < 0) {
      originNetworkFiles.value.push(file)
      originNetworkFiles.value.sort();
      return true;
    }
    return false;
  }
  function removeNetworkFile(file) {
    if(!file) return;
    originNetworkFiles.value = originNetworkFiles.value.filter(f => f.name !== file.name);
  }

  async function build() {
    shownNetworks.value = [];
    realNetworks.value = [];
    for (let index = 0; index < originNetworkFiles.value.length; index++) {
      const file = originNetworkFiles.value[index];
      const networkData = await readFile2Object(file);
      realNetworks.value = realNetworks.value.concat(networkData.flat());
    }
    initNetworkMaps();
  }

  function initNetworkMaps() {
    shownNetworks.value = analyzeNetworkData(realNetworks.value);
    console.log('networkMaps', shownNetworks.value);
  }

  function clear() {
    realNetworks.value = [];
    originNetworkFiles.value = [];
    shownNetworks.value = [];
  }

  return {
    originNetworkFiles,
    shownNetworks,
    addNetworkFile,
    removeNetworkFile,
    build,
    clear
  };
})