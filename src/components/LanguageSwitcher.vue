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
  top: 20px;
  right: 20px;
}

.language-select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}
</style> 