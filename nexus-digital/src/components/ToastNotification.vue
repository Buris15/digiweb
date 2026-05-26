<script setup>
defineProps({
  show: Boolean,
  message: String
})
</script>

<template>
  <Transition name="slide-up">
    <div v-if="show" class="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 glass-panel px-6 py-3 rounded-full shadow-lg border border-white flex items-center gap-3">
      <i class="fa-solid fa-circle-check theme-accent-text text-lg"></i>
      <span class="text-sm font-bold text-slate-700">{{ message }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translate(-50%, 20px); }
</style>