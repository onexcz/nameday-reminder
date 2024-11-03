<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import * as Papa from 'papaparse'
import { GOOGLE_CONFIG } from './config/google-api'

interface Person {
  name: string
  day: string
  month: string
}

const isAuthenticated = ref(false)
const selectedNameInput = ref('')
const selectedName = ref<Person | null>(null)
const names = ref<Person[]>([])
const message = ref('')
const messageType = ref('')

let gapiInited = ref(false)
let gisInited = ref(false)
let tokenClient: google.accounts.oauth2.TokenClient

const searchInput = ref('')
const showDropdown = ref(false)

const filteredNames = computed(() => {
  if (!searchInput.value) return names.value
  return names.value.filter(person => 
    person.name.toLowerCase().includes(searchInput.value.toLowerCase())
  )
})

onMounted(async () => {
  await loadGoogleAPI()
  loadCSVData()
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.input-container')) {
      showDropdown.value = false
    }
  })
})

async function loadGoogleAPI() {
  // Load Google API Script
  const gapiScript = document.createElement('script')
  gapiScript.src = 'https://apis.google.com/js/api.js'
  document.body.appendChild(gapiScript)

  // Load Google Identity Services Script
  const gisScript = document.createElement('script')
  gisScript.src = 'https://accounts.google.com/gsi/client'
  document.body.appendChild(gisScript)

  return new Promise<boolean>((resolve) => {
    // Handle GAPI loading
    gapiScript.onload = async () => {
      await new Promise<void>((resolveGapi) => {
        if (typeof gapi !== 'undefined') {
          (gapi as any).load('client', () => resolveGapi())
        }
      })
      await gapi.client.init({
        apiKey: GOOGLE_CONFIG.API_KEY,
        discoveryDocs: [GOOGLE_CONFIG.DISCOVERY_DOC]
      })
      gapiInited.value = true
      checkBothLoaded()
    }

    // Handle GIS loading separately
    gisScript.onload = () => {
      gisInited.value = true
      checkBothLoaded()
    }

    // Helper function to resolve when both are loaded
    function checkBothLoaded() {
      if (gapiInited.value && gisInited.value) {
        resolve(true)
      }
    }
  })
}

function loadCSVData() {
  fetch('/src/data/name_days.csv')
    .then(response => response.text())
    .then(csvString => {
      const results = Papa.parse<string[]>(csvString, {
        delimiter: ';',
        skipEmptyLines: true
      })
      
      names.value = results.data.map((row) => ({
        name: row[0] || '',
        day: (row[1] || '').padStart(2, '0'),
        month: (row[2] || '').padStart(2, '0')
      }))
    })
    .catch(error => {
      message.value = 'Error loading names data'
      messageType.value = 'error'
      console.error('Error loading CSV:', error)
    })
}

async function handleLogin() {
  if (!gapiInited.value || !gisInited.value) {
    message.value = 'Please wait for Google API to load'
    messageType.value = 'error'
    return
  }

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CONFIG.CLIENT_ID,
    scope: GOOGLE_CONFIG.SCOPES,
    callback: (response) => {
      if (response.error) {
        message.value = 'Error during authentication'
        messageType.value = 'error'
        return
      }
      isAuthenticated.value = true
      message.value = 'Successfully logged in'
      messageType.value = 'success'
    }
  })
  
  tokenClient.requestAccessToken()
}

async function createReminder() {
  if (!selectedName.value) return

  try {
    const person = selectedName.value
    const year = new Date().getFullYear()
    const eventDate = `${year}-${person.month}-${person.day}`
    
    // Create calendar event
    const event = {
      summary: `${person.name}: svátek!`,
      start: {
        date: eventDate,
      },
      end: {
        date: eventDate,
      },
      recurrence: ['RRULE:FREQ=YEARLY'],
    }

    await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    })

    // Create tasks
    await gapi.client.tasks.tasklists.list().then(async (response) => {
      const taskListId = response.result.items?.[0].id

      if (!taskListId) throw new Error('No task list found')

      // Create task for 7 days before
      const sevenDaysBefore = new Date(year, parseInt(person.month) - 1, parseInt(person.day))
      sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7)
      
      await gapi.client.tasks.tasks.insert({
        tasklist: taskListId,
        resource: {
          title: `${person.name}: svátek!`,
          due: sevenDaysBefore.toISOString(),
        },
      })

      // Create task for 1 day before
      const oneDayBefore = new Date(year, parseInt(person.month) - 1, parseInt(person.day))
      oneDayBefore.setDate(oneDayBefore.getDate() - 1)
      
      await gapi.client.tasks.tasks.insert({
        tasklist: taskListId,
        resource: {
          title: `${person.name}: svátek!`,
          due: oneDayBefore.toISOString(),
        },
      })
    })

    message.value = 'Reminder created successfully!'
    messageType.value = 'success'
  } catch (error) {
    message.value = 'Error creating reminder'
    messageType.value = 'error'
    console.error('Error:', error)
  }
}

function handleInput() {
  showDropdown.value = true
  selectedName.value = null
}

function selectName(person: Person) {
  selectedName.value = person
  searchInput.value = person.name
  showDropdown.value = false
}
</script>

<template>
  <div class="app">
    <h1>Calendar Reminder App</h1>
    
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
    
    <div v-if="!isAuthenticated">
      <button @click="handleLogin">Login with Google</button>
    </div>
    
    <div v-else>
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

      <button 
        @click="createReminder"
        :disabled="!selectedName"
        class="create-button"
      >
        Create Reminder
      </button>
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

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

.create-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.message {
  margin-top: 20px;
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
</style>
