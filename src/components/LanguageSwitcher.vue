<script setup lang="ts">
import type { Language } from '../locales/translations'

defineProps<{
  currentLanguage: Language
  onLanguageChange: (lang: Language) => void
}>()
</script>

<template>
  <div class="language-switcher">
    <select 
      :value="currentLanguage"
      @change="e => onLanguageChange(e.target.value as Language)"
      class="language-select"
    >
      <option value="cs">Čeština</option>
      <option value="en">English</option>
    </select>
  </div>
</template>

<style scoped>
.language-switcher {
  position: absolute;
  top: 1rem;
  right: 0;
}

.language-select {
  padding: 0.5rem 2rem 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  background-color: white;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 0.875rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.25rem;
}

.language-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}
</style> 