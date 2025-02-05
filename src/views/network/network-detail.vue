<template>
  <div v-if="visible" class="network-detail">
    <div class="network-detail-header">
      <span class="network-detail-close" @click="onCloseClicked">×</span>
    </div>
    <a-collapse :default-active-key="['1', '3']">
      <a-collapse-item header="BasicInfo" key="1">
        <a-descriptions :data="basicInfo" :column="1" />
      </a-collapse-item>
      <a-collapse-item header="Response Body" key="2">
        <JsonViewer v-if="bodyRefreshFlag" :value="responseBody" :show-double-quotes="true" :show-array-index="false"
          :copyable="true" :preview-mode="true">
        </JsonViewer>
      </a-collapse-item>
      <a-collapse-item header="Request Param" key="3">
        <a-descriptions v-if="isRequestGet" :data="requestGetParam" :column="1" />
        <JsonViewer v-else :preview-mode="true" :value="requestPostParam" :show-double-quotes="true"
          :show-array-index="false" :copyable="true"></JsonViewer>
      </a-collapse-item>
      <a-collapse-item header="Request Header" key="4">
        <a-descriptions :data="requestHeader" :column="1" />
      </a-collapse-item>
      <a-collapse-item header="Response Header" key="5">
        <a-descriptions :data="responseHeader" :column="1" />
      </a-collapse-item>
    </a-collapse>
  </div>
</template>

<script setup>
import { computed, watch, ref, nextTick } from 'vue'
import JsonViewer from '@/components/json-viewer.vue'
import { timestamp2dateTimeMs } from '@/utils/date-utils';
import { TYPE_NOT_JSON } from '@/utils/network-utils';

const emit = defineEmits(['update:visible']);

const props = defineProps({
  visible: {
    required: true,
  },
  data: {
    required: true,
  },
});

const basicInfo = computed(() => {
  console.log('basicInfo props.data', props.data);
  const { basicInfo } = props.data;
  const statusContent = !basicInfo ? undefined : `${basicInfo?.status} ${basicInfo?.statusText}`
  return [{
    label: 'Request URL',
    value: basicInfo?.requestUrl
  }, {
    label: 'Request Method',
    value: basicInfo?.requestMethod
  }, {
    label: 'Status Code',
    value: statusContent
  }, {
    label: 'Remote Address',
    value: basicInfo?.originAddress
  }, {
    label: 'Request Time',
    value: timestamp2dateTimeMs(basicInfo?.timestamp)
  }]
});
const isRequestGet = computed(() => {
  const { basicInfo } = props.data;
  return basicInfo?.requestMethod === 'GET';
});
const responseHeader = computed(() => {
  const { responseHeaders } = props.data;
  console.log('responseHeader', responseHeaders);
  if (!responseHeaders) return [];
  return Object.entries(responseHeaders).map(([key, value]) => ({
    label: key,
    value: value,
  }));
});
const requestHeader = computed(() => {
  console.log('requestHeader 1', props.data);
  const { requestHeaders } = props.data;
  console.log('requestHeader 2', requestHeaders);
  if (!requestHeaders) return [];
  return Object.entries(requestHeaders).map(([key, value]) => ({
    label: key,
    value: value,
  }));
});
const requestPostParam = computed(() => {
  return props.data.requestParams;
});
const requestGetParam = computed(() => {
  const url = new URL(props.data.basicInfo.requestUrl);
  // 获取 URL 中的请求参数
  let params = new URLSearchParams(url.search);
  console.log('requestGetParam', params);
  // 将请求参数转换为一个数组
  return Array.from(params, ([key, value]) => ({ label: key, value: value }));
});
const responseBody = computed(() => {
  try {
    if (TYPE_NOT_JSON.includes(props.data.basicInfo.type)) return props.data.responseBody
    return JSON.parse(props.data.responseBody)
  } catch (error) {
    return undefined
  }
})
/** body 是否显示，以此控制body强制刷新，
 * 解决 vue-json-viewer 库加载大数据后，切换数据时显示不更新的问题
 */
const bodyRefreshFlag = ref(true);
watch(
  () => props.data?.responseBody,
  async () => {
    bodyRefreshFlag.value = false;
    await nextTick();
    bodyRefreshFlag.value = true;
  },
);

function onCloseClicked() {
  emit('update:visible', false);
}



</script>
<style scoped lang="less">
@import url('./network-detail.less');
</style>
