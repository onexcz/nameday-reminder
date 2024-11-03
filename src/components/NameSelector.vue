<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

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
      <input 
        v-model="searchInput"
        placeholder="Type or select a name..."
        class="name-input"
        @input="handleInput"
        @focus="showDropdown = true"
      />
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
          {{ person.name }}
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

.name-input {
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
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