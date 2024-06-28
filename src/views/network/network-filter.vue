<template>
  <div class="network-filter">
    <a-input placeholder="Name Filter" @input="onInputChanged"></a-input>
    <div class="status">
      <a-select placeholder="Status Filter" :options="options" @change="onStatusChanged" allow-clear></a-select>
    </div>
  </div>
</template>

<script setup>

const emit = defineEmits(['onInputChanged', 'onStatusChanged']);

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

function onInputChanged(val) {
  emit('onInputChanged', val);
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
