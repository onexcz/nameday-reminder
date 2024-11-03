import { ref, computed } from 'vue'
import { translations, type Language } from '../locales/translations'

const currentLanguage = ref<Language>('cs')

export function useTranslations() {
  const t = computed(() => translations[currentLanguage.value])
  
  function setLanguage(lang: Language) {
    currentLanguage.value = lang
  }

  return {
    t,
    currentLanguage,
    setLanguage
  }
} 