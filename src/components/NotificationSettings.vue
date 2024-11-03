<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Notification } from '../types/types'
import { useTranslations } from '../composables/useTranslations'

const { t } = useTranslations()

const props = defineProps<{
  notifications: Notification[]
  onUpdate: (notifications: Notification[]) => void
}>()

// Initialize with default notifications if empty
onMounted(() => {
  if (props.notifications.length === 0) {
    props.onUpdate([
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
  }
})

function addNotification() {
  const notification: Notification = {
    id: crypto.randomUUID(),
    daysBefore: 1,
    time: '08:00'
  }
  
  props.onUpdate([...props.notifications, notification])
}

function deleteNotification(id: string) {
  props.onUpdate(props.notifications.filter(n => n.id !== id))
}

function updateNotification(id: string, daysBefore: number, time: string) {
  props.onUpdate(props.notifications.map(n => 
    n.id === id ? { ...n, daysBefore, time } : n
  ))
}
</script>

<template>
  <div class="notification-settings">
    <h3>{{ t.notificationSettings }}</h3>
    
    <div class="notifications-list">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        class="notification-item"
      >
        <div class="notification-inputs">
          <input 
            type="number" 
            v-model.number="notification.daysBefore"
            min="1"
            @change="updateNotification(notification.id, notification.daysBefore, notification.time)"
            class="days-input"
          />
          <span>{{ t.daysBefore }}</span>
          <input 
            type="time" 
            v-model="notification.time"
            @change="updateNotification(notification.id, notification.daysBefore, notification.time)"
            class="time-input"
          />
          <button 
            @click="deleteNotification(notification.id)"
            class="delete-button"
            title="Delete notification"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <button 
      @click="addNotification"
      class="new-notification-button"
    >
      {{ t.addNotification }}
    </button>
  </div>
</template>

<style scoped>
.notification-settings {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.notifications-list {
  margin: 10px 0;
}

.notification-item {
  margin: 8px 0;
}

.notification-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.days-input {
  width: 60px;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.time-input {
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.delete-button {
  padding: 4px 8px;
  background-color: transparent;
  color: #dc3545;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-button:hover {
  color: #bd2130;
}

.new-notification-button {
  background-color: #4CAF50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.new-notification-button:hover {
  background-color: #45a049;
}
</style> 