<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTranslations } from '../composables/useTranslations'

interface Person {
  name: string
  day: string
  month: string
}

const props = defineProps<{
  names: Person[]
  onSelect: (person: Person) => void
}>()

const searchInput = ref('')
const showDropdown = ref(false)

const { t } = useTranslations()

const filteredNames = computed(() => {
  if (!searchInput.value) return props.names
  return props.names.filter(person => 
    person.name.toLowerCase().includes(searchInput.value.toLowerCase())
  )
})

function handleInput() {
  showDropdown.value = true
}

function selectName(person: Person) {
  searchInput.value = person.name
  showDropdown.value = false
  props.onSelect(person)
}

function clearInput() {
  searchInput.value = ''
  props.onSelect({} as Person)
  showDropdown.value = false
}

onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.input-container')) {
      showDropdown.value = false
    }
  })
})
</script>

<template>
  <div class="name-selector">
    <div class="input-container">
      <div class="input-wrapper">
        <input 
          v-model="searchInput"
          :placeholder="t.searchPlaceholder"
          class="name-input"
          @input="handleInput"
          @focus="showDropdown = true"
        />
        <button 
          v-if="searchInput"
          @click="clearInput"
          class="clear-button"
          title="Clear"
        >
          ×
        </button>
      </div>
      <div 
        v-if="showDropdown && filteredNames.length > 0" 
        class="dropdown"
      >
        <div 
          v-for="person in filteredNames" 
          :key="person.name"
          class="dropdown-item"
          @click="selectName(person)"
        >
          {{ `${person.name} (${person.day}.${person.month})` }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.name-selector {
  margin: 20px 0;
  width: 100%;
}

.input-container {
  position: relative;
  width: 100%;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.name-input {
  width: 100%;
  padding: 8px;
  padding-right: 30px; /* Make room for the clear button */
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.clear-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-button:hover {
  color: #333;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dropdown-item {
  padding: 8px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}
</style> 