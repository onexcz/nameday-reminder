<script setup lang="ts">
import { useTranslations } from '../composables/useTranslations'

const { t } = useTranslations()

defineProps<{
  createdEvents: string[]
}>()
</script>

<template>
  <div v-if="createdEvents.length > 0" class="created-events">
    <h3>{{ t.createdEventsTitle }}</h3>
    <ul class="events-list">
      <li 
        v-for="name in createdEvents" 
        :key="name"
        class="event-item"
      >
        {{ name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.created-events {
  margin-top: 30px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.events-list {
  list-style: none;
  padding: 0;
  margin: 10px 0;
  max-height: 200px;
  overflow-y: auto;
}

.event-item {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.event-item:last-child {
  border-bottom: none;
}
</style> 