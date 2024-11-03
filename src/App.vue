<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as Papa from 'papaparse'
import { GOOGLE_CONFIG } from './config/google-api'
import GoogleLoginButton from './components/GoogleLoginButton.vue'
import NameSelector from './components/NameSelector.vue'
import CreateReminderButton from './components/CreateReminderButton.vue'
import StatusMessage from './components/StatusMessage.vue'
import NotificationSettings from './components/NotificationSettings.vue'
import type { Person, Notification } from './types/types'

interface Person {
  name: string
  day: string
  month: string
}

const isAuthenticated = ref(false)
const selectedName = ref<Person | null>(null)
const names = ref<Person[]>([])
const message = ref('')
const messageType = ref('')
const isCreating = ref(false)

let gapiInited = ref(false)
let gisInited = ref(false)
let tokenClient: google.accounts.oauth2.TokenClient

// Initialize notifications with default values
const notifications = ref<Notification[]>([
  {
    id: crypto.randomUUID(),
    daysBefore: 7,
    time: '08:00'
  },
  {
    id: crypto.randomUUID(),
    daysBefore: 1,
    time: '08:00'
  }
])

onMounted(async () => {
  await loadGoogleAPI()
  loadCSVData()
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
      .sort((a, b) => a.name.localeCompare(b.name, 'cs'))
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
  if (!selectedName.value || isCreating.value) return

  isCreating.value = true
  message.value = 'Creating reminder...'
  messageType.value = 'info'

  const startTime = Date.now()

  try {
    const person = selectedName.value
    const year = new Date().getFullYear()
    const eventDate = `${year}-${person.month}-${person.day}`
    
    // Find or create "Svátky" calendar
    let calendarId = null
    const calendarList = await gapi.client.request({
      path: 'https://www.googleapis.com/calendar/v3/users/me/calendarList'
    })
    const svatkyCalendar = calendarList.result.items?.find(
      cal => cal.summary === 'Svátky'
    )

    if (svatkyCalendar) {
      calendarId = svatkyCalendar.id
    } else {
      // Create new calendar
      const newCalendar = await gapi.client.request({
        path: 'https://www.googleapis.com/calendar/v3/calendars',
        method: 'POST',
        body: {
          summary: 'Svátky',
          timeZone: 'Europe/Prague'
        }
      })
      calendarId = newCalendar.result.id
    }

    // Create calendar event with custom notifications
    const event = {
      summary: `${person.name}: svátek!`,
      start: {
        date: eventDate,
      },
      end: {
        date: eventDate,
      },
      recurrence: ['RRULE:FREQ=YEARLY'],
      reminders: {
        useDefault: false,
        overrides: notifications.value.map(notification => {
          // Convert days and time to minutes
          const [hours, minutes] = notification.time.split(':').map(Number)
          const totalMinutes = (notification.daysBefore * 24 * 60) - (hours * 60 + minutes)
          return {
            method: 'popup',
            minutes: totalMinutes
          }
        })
      }
    }

     await gapi.client.calendar.events.insert({
      calendarId: calendarId,  // Use the Svátky calendar ID instead of 'primary'
      resource: event,
    })

    // Calculate how long the operation took
    const operationTime = Date.now() - startTime
    
    // If operation took less than 2 seconds, wait for the remaining time
    if (operationTime < 2000) {
      await new Promise(resolve => setTimeout(resolve, 2000 - operationTime))
    }

    message.value = 'Reminder created successfully!'
    messageType.value = 'success'
  } catch (error) {
    // For errors, also ensure minimum 2 second delay
    const operationTime = Date.now() - startTime
    if (operationTime < 2000) {
      await new Promise(resolve => setTimeout(resolve, 2000 - operationTime))
    }

    message.value = 'Error creating reminder'
    messageType.value = 'error'
    console.error('Error:', error)
  } finally {
    isCreating.value = false
  }
}

function handleNameSelect(person: Person) {
  selectedName.value = person
}

function handleNotificationsUpdate(newNotifications: Notification[]) {
  notifications.value = newNotifications
}
</script>

<template>
  <div class="app">
    <h1>Calendar Reminder App</h1>
    
    <StatusMessage 
      :message="message"
      :type="messageType"
    />
    
    <div v-if="!isAuthenticated">
      <GoogleLoginButton :onLogin="handleLogin" />
    </div>
    
    <div v-else>
      <NameSelector 
        :names="names"
        :onSelect="handleNameSelect"
      />

      <NotificationSettings
        :notifications="notifications"
        :onUpdate="handleNotificationsUpdate"
      />

      <CreateReminderButton 
        :disabled="!selectedName"
        :isCreating="isCreating"
        :onCreate="createReminder"
      />
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style>
