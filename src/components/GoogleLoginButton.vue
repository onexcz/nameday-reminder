<script setup lang="ts">
import { useTranslations } from '../composables/useTranslations'

const { t } = useTranslations()

defineProps<{
  onLogin: () => void
}>()
</script>

<template>
  <button @click="onLogin" class="google-button" type="button">
    <span class="google-button__icon">
      <svg viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    </span>
    <span class="google-button__text">{{ t.login }}</span>
  </button>
</template>

<style scoped>
.google-button {
  display: inline-flex;
  align-items: center;
  background-color: white;
  color: #3c4043;
  border: 1px solid #dadce0;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15);
  padding: 0;
  cursor: pointer;
  font-family: 'Roboto', arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.25px;
  transition: background-color .218s, border-color .218s, box-shadow .218s;
}

.google-button:hover {
  background-color: #f8f9fa;
  border-color: #dadce0;
  box-shadow: 0 2px 4px 0 rgba(60,64,67,.3), 0 1px 3px 3px rgba(60,64,67,.15);
}

.google-button:active {
  background-color: #f4f8ff;
  border-color: #d2e3fc;
  box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15);
}

.google-button__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 12px;
  padding: 8px;
  box-sizing: border-box;
}

.google-button__icon svg {
  width: 18px;
  height: 18px;
}

.google-button__text {
  padding: 0 12px 0 0;
  font-weight: 500;
}
</style> 