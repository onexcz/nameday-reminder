<script setup lang="ts">
defineProps<{
  message: string
  type: string
}>()
</script>

<template>
  <div v-if="message" :class="['message', type]">
    {{ message }}
  </div>
</template>

<style scoped>
.message {
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
}

.success {
  background-color: #dff0d8;
  color: #3c763d;
}

.error {
  background-color: #f2dede;
  color: #a94442;
}

.info {
  background-color: #d9edf7;
  color: #31708f;
}
</style> 