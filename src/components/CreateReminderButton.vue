<script setup lang="ts">
import { useTranslations } from '../composables/useTranslations'

const { t } = useTranslations()

defineProps<{
  disabled: boolean
  isCreating: boolean
  onCreate: () => void
}>()
</script>

<template>
  <button 
    @click="onCreate"
    :disabled="disabled || isCreating"
    class="create-button"
  >
    <span v-if="!isCreating">{{ t.createReminder }}</span>
    <div v-else class="spinner"></div>
  </button>
</template>

<style scoped>
.create-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  min-width: 120px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #ffffff;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 