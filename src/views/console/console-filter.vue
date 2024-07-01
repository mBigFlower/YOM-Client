<template>
  <div class="console-filter">
    <a-input class="console-filter-input" placeholder="Log Filter" @input="onInputChanged"></a-input>
    <div class="level">
      <a-select placeholder="Level Filter" :options="levelOptions" :default-value="['debug', 'log', 'warning', 'error']"
        multiple allow-search allow-clear @change="onLevelChanged"></a-select>
    </div>
  </div>
</template>

<script setup>

const emit = defineEmits(['onInputChanged', 'onLevelChanged']);

const props = defineProps({
});

const levelOptions = [
  { label: 'Verbose', value: 'debug' },
  { label: 'Info', value: 'log' },
  { label: 'Warnings', value: 'warning' },
  { label: 'Errors', value: 'error' },
]


// #region 输入过滤

function onInputChanged(val) {
  emit('onInputChanged', val);
}

// #endregion

//#region 请求结果过滤（200 还是 500 ？）
function onLevelChanged(val) {
  emit('onLevelChanged', val);
}
//#endregion

</script>
<style scoped>
@import url('./console-filter.less');
</style>
