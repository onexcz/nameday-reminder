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
  background: var(--background-light);
  border-radius: var(--radius);
  padding: 1.5rem;
}

.created-events h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
}

.events-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}

.event-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.event-item:last-child {
  border-bottom: none;
}

.event-item:hover {
  background-color: var(--background-light);
}
</style> 