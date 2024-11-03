<script setup lang="ts">
defineProps<{
  onLogin: () => void
}>()
</script>

<template>
  <button @click="onLogin" class="login-button">
    Login with Google
  </button>
</template>

<style scoped>
.login-button {
  background-color: #4285f4;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #357abd;
}
</style> 