<template>
  <div class="file-select-root">
    <a-spin class="file-select-spin" :loading="loading" tip="This may take a while...">
      <div class="upload-part">
        <a-upload id="consoleUpload" action="/" :auto-upload="false" :limit="5" multiple accept=".json"
          @before-upload="beforeLogUpload" @before-remove="onBeforeRemoveConsole" :custom-icon="getCustomIcon()">
          <template #upload-button>
            <a-button>
              Select Console Files (limit: 5 files)
            </a-button>
          </template>
        </a-upload>
      </div>
      <div class="upload-part">
        <a-upload id="networkUpload" action="/" :auto-upload="false" :limit="5" multiple accept=".json"
          @before-upload="beforeNetworkUpload" @before-remove="onBeforeRemoveNetwork" :custom-icon="getCustomIcon()">
          <template #upload-button>
            <a-button>
              Select Network Files (limit: 5 files)
            </a-button>
          </template>
        </a-upload>
      </div>
      <div class="upload-media">
        <video v-show="mediaSrc" ref="videoRef" class="video" autoplay controls></video>
        <a-upload id="mediaUploadId" action="/" :auto-upload="false" :limit="1"
          v-model:file-list="mediaStore.mediaFiles" @before-upload="beforeMediaUpload"
          @before-remove="onBeforeRemoveMedia" accept="video/*">
          <template #upload-button>
            <a-button>
              Select Media Files (limit: 1 file)
            </a-button>
          </template>
        </a-upload>
      </div>
      <div class="analyze-part">
        <span>Time Zone: </span>
        <a-input-number class="time-zone-input" v-model="timeOffset" :step="1" :precision="0" :min="-12" :max="12"
          height="30px" />
        <a-button id="startBtn" type="primary" @click="onAnalyzeClicked">Start</a-button>
      </div>
    </a-spin>
    <div class="file-mid-notice">
      <h1>⬅ Select or Drag ➡</h1>
    </div>
    <div class="file-upload-drag">
      <a-upload draggable multiple action="/" accept=".json" :auto-upload="false" @before-upload="beforeDragUpload"
        @change="onDragFileChange" :custom-icon="getCustomIcon()" @before-remove="onBeforeRemove">
        <template #upload-button>
          <div class="drag-area">
            <span style="color: blue;font-weight:bold">Drag the console or network files here</span>
            <br>
            <span>file's name should be started with</span>
            <br>
            <span>'console-' or 'network-'</span>
          </div>
        </template>
      </a-upload>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useConsoleStore } from '@/store/console'
import { useNetworkStore } from '@/store/network'
import { useMediaStore } from '@/store/media'
import { setTimeOffset } from '@/utils/date-utils'
import { formatFileSize } from '@/utils/file-utils'
import { useRouter } from "vue-router";
import { initFileSelectGuide } from '../../utils/guide-utils'

const router = useRouter();
const consoleStore = useConsoleStore();
const networkStore = useNetworkStore();
const mediaStore = useMediaStore();

const videoRef = ref()

const mediaSrc = ref()

const loading = ref(false)


//#region 初始化指导
nextTick(() => {
  initFileSelectGuide();
});
//#endregion

//#region Drag 上传
const beforeDragUpload = async (file) => {
  try {
    console.log('beforeDragUpload', file);
    if (file.name.startsWith('console-'))
      return beforeLogUpload(file);
    else if (file.name.startsWith('network-'))
      return beforeNetworkUpload(file);
    else {
      Message.error('unknow file:' + file?.name)
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};
const onBeforeRemove = (e) => {
  return new Promise((resolve, reject) => {
    const { file } = e
    console.log('onBeforeRemove', file);
    consoleStore.removeOriginConsoleFile(file);
    networkStore.removeNetworkFile(file);
    resolve(true)
  });
}
//#endregion

//#region Console 日志
const beforeLogUpload = async (file) => {
  try {
    console.log('beforeLogUpload', file);
    return consoleStore.addOriginConsoleFile(file);
  } catch (error) {
    console.error(error);
    return false;
  }
};
function onBeforeRemoveConsole(file) {
  return new Promise((resolve, reject) => {
    console.log('onBeforeRemoveConsole', file);
    consoleStore.removeOriginConsoleFile(file);
    resolve(true)
  });
}
const getCustomIcon = () => {
  return {
    fileName: (file) => {
      const sizeStr = formatFileSize(file?.file?.size)
      return `[${sizeStr}] ${file.name}`
    },
  };
};
//#endregion

//#region Network 网络
const beforeNetworkUpload = async (file) => {
  try {
    networkStore.addNetworkFile(file);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
function onBeforeRemoveNetwork(file) {
  return new Promise((resolve, reject) => {
    console.log('onBeforeRemoveNetwork');
    networkStore.removeNetworkFile(file);
    resolve(true)
  });
}
//#endregion

//#region Media 媒体
const beforeMediaUpload = async (file) => {
  try {
    const url = URL.createObjectURL(file);
    mediaSrc.value = url;
    console.log('mediaSrc', mediaSrc.value);
    videoRef.value.src = url;
    mediaStore.setMediaSrc(url)
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
function onBeforeRemoveMedia() {
  return new Promise((resolve, reject) => {
    console.log('onBeforeRemoveMedia');
    mediaSrc.value = ''
    videoRef.value.src = ''
    mediaStore.clear();
    resolve(true)
  });
}
//#endregion

const timeOffset = ref(Number(localStorage.getItem('timeOffset')) || -3)
/**
 * 开始分析数据
 */
function onAnalyzeClicked() {
  console.log('onAnalyzeClicked', consoleStore.originConsoleFiles, networkStore.originNetworkFiles);
  setTimeOffset(timeOffset.value)
  consoleStore.build()
  networkStore.build()
  mediaStore.setMediaSrc(mediaSrc.value)
  if (consoleStore.originConsoleFiles.length > 0)
    return router.push("/console")
  if (networkStore.originNetworkFiles.length > 0)
    return router.push("/network")
  if (mediaSrc.value?.length > 0)
    return router.push("/media")
}
</script>
<style scoped lang="less">
@import url('./file-select.less');
</style>