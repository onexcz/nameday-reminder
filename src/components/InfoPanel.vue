<script setup lang="ts">
import { useTranslations } from '../composables/useTranslations'

const { t } = useTranslations()
</script>

<template>
  <div class="info-panel">
    <div class="info-content">
      <h2>{{ t.infoTitle }}</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-text">{{ t.infoStep1 }}</div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-text">{{ t.infoStep2 }}</div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-text">{{ t.infoStep3 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-panel {
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.info-content {
  text-align: center;
}

.info-content h2 {
  color: var(--text-primary);
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  text-align: left;
}

.step {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.step-number {
  background: var(--primary-color);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-text {
  color: var(--text-secondary);
  line-height: 1.4;
}
</style> 