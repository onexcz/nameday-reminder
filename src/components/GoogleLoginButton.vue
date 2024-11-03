<script setup lang="ts">
import { useTranslations } from '../composables/useTranslations'

const { t } = useTranslations()

defineProps<{
  onLogin: () => void
}>()
</script>

<template>
  <button @click="onLogin" class="login-button">
    {{ t.login }}
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