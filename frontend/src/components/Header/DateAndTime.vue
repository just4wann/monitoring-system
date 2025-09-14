<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { generateTime } from '../../utils';

const time = ref<string>();
const date = ref<string>();

setInterval(() => {
  const { timestamp } = generateTime();
  time.value = timestamp[0];
  date.value = timestamp[1];
}, 60000);

onMounted(() => {
  const { timestamp } = generateTime();
  time.value = timestamp[0];
  date.value = timestamp[1];
});
</script>
<template>
  <div class="pnsc-light text-xs absolute right-0">
      <p>{{ time }}</p>
      <p>{{ date }}</p>
    </div>
</template>

<style scoped></style>
