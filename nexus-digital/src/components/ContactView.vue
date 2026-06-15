<!-- src/components/ContactView.vue -->
<script setup>
import { ref } from 'vue';

const emit = defineEmits(['trigger-notification']);
const isSubmitting = ref(false);

const handleContactSubmit = (e) => {
  e.preventDefault();
  isSubmitting.value = true;
  
  // Simulate network request
  setTimeout(() => {
    isSubmitting.value = false;
    emit('trigger-notification', 'Transmission successful. We will respond shortly.');
    e.target.reset();
  }, 1500);
};
</script>

<template>
  <div class="max-w-3xl mx-auto complex-fade-in pb-16">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
        Establish <span class="theme-accent-text">Connection</span>
      </h2>
      <p class="text-[var(--text-muted)] text-sm font-medium">
        Ping our servers for custom requests, system support, or partnership inquiries.
      </p>
    </div>

    <div class="glass-panel !rounded-[2rem] p-8 md:p-12 relative">
      <form @submit="handleContactSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-[10px] font-black text-white uppercase tracking-widest mb-2 opacity-80">Identity Vector</label>
            <input
              required
              type="text"
              placeholder="Your Name"
              class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-core)] placeholder:text-[var(--text-muted)] transition-all font-semibold"
            />
          </div>
          <div>
            <label class="block text-[10px] font-black text-white uppercase tracking-widest mb-2 opacity-80">Return Terminal</label>
            <input
              required
              type="email"
              placeholder="Your Email"
              class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-core)] placeholder:text-[var(--text-muted)] transition-all font-semibold"
            />
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-black text-white uppercase tracking-widest mb-2 opacity-80">Transmission Payload</label>
          <textarea
            required
            rows="5"
            placeholder="Enter your message parameters here..."
            class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-core)] placeholder:text-[var(--text-muted)] transition-all font-semibold resize-none custom-scrollbar"
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="cursor-pointer w-full py-4 rounded-xl theme-accent-bg text-white font-black text-xs tracking-widest uppercase shadow-[0_0_20px_var(--accent-glow)] hover:-translate-y-0.5 transition-all active:scale-[0.98] border-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <i v-if="isSubmitting" class="fa-solid fa-circle-notch fa-spin"></i>
          <i v-else class="fa-solid fa-satellite-dish"></i>
          {{ isSubmitting ? "Transmitting..." : "Dispatch Message" }}
        </button>
      </form>
    </div>
  </div>
</template>