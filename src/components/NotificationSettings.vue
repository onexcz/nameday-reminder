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
  background: var(--background-light);
  border-radius: var(--radius);
  padding: 1.5rem;
}

@media (max-width: 399px) {
  .notification-settings {
    padding: 0;
  }
}

.notification-settings h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-inputs {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}

.days-input {
  width: 70px;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
}

.time-input {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
}

.delete-button {
  padding: 0.5rem;
  color: var(--error-color);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.delete-button:hover {
  color: var(--error-hover);
}

.new-notification-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--success-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background-color 0.2s;
}

.new-notification-button:hover {
  background-color: var(--success-hover);
}
</style> 