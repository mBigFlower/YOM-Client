<template>
  <div class="network-filter">
    <a-input class="network-filter-input" placeholder="Name Filter" allow-clear
      @input="debouncedOnNameInputChanged" @clear="onNameCleared"></a-input>
    <a-input class="network-filter-input" placeholder="ResponseBody Filter" allow-clear
      @input="debouncedOnResponseBodyInputChanged" @clear="onResponseBodyCleared"></a-input>
    <div class="status">
      <a-select placeholder="Status Filter" :options="statusOptions" multiple allow-search allow-clear
        @change="onStatusChanged"></a-select>
    </div>
  </div>
</template>

<script setup>
import { debounce } from 'lodash';

const emit = defineEmits(['onNameChanged', 'onResponseBodyChanged', 'onStatusChanged']);

const props = defineProps({
  statusOptions: {
    type: Array,
    default: () => [
      { label: '200', value: '200' },
      { label: '4**', value: '4**' },
      { label: '5**', value: '5**' },
      { label: 'others', value: 'others' },
    ],
  },
});

// #region 输入过滤
const debouncedOnNameInputChanged = debounce(onNameInputChanged, 1000);
function onNameInputChanged(val) {
  emit('onNameChanged', val);
}
function onNameCleared() {
  emit('onNameChanged', '');
}

const debouncedOnResponseBodyInputChanged = debounce(onResponseBodyInputChanged, 1000);
function onResponseBodyInputChanged(val) {
  emit('onResponseBodyChanged', val);
}
function onResponseBodyCleared() {
  emit('onResponseBodyChanged', '');
}

// #endregion

//#region 请求结果过滤（200 还是 500 ？）
function onStatusChanged(val) {
  emit('onStatusChanged', val);
}
//#endregion

</script>
<style scoped>
@import url('./network-filter.less');
</style>
