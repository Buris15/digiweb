<!-- src/components/AboutView.vue -->
<script setup>
// Purely presentation component for the About page
</script>

<template>
  <div class="max-w-4xl mx-auto text-center complex-fade-in pb-16">
    <div class="glass-panel !rounded-[2rem] p-10 md:p-16 relative overflow-hidden group mb-10">
      <div class="absolute top-0 left-0 w-full h-1 theme-accent-bg opacity-50"></div>
      
      <div class="w-20 h-20 mx-auto rounded-2xl theme-accent-bg border border-[var(--accent-core)] flex items-center justify-center text-white mb-8 shadow-[0_0_30px_var(--accent-glow)] rotate-3 transition-transform duration-500 group-hover:rotate-12">
        <i class="fa-solid fa-fingerprint text-4xl"></i>
      </div>

      <h1 class="text-3xl md:text-5xl font-black tracking-tight mb-6 text-white leading-[1.1]">
        Systematic Design for <br />
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-[#0099ff] to-cyan-200 drop-shadow-[0_2px_20px_var(--accent-glow)]">High Achievers.</span>
      </h1>
      
      <p class="text-[var(--text-muted)] text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto mb-8">
        AESTHETIC.VAULT was initiated to solve a fundamental problem: academic and professional burnout caused by disorganized digital spaces. We build premium, obsidian-dark templates and workspace dynamics optimized to help you reclaim your focus and execute your tasks with surgical precision.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-12 border-t border-white/10 pt-12">
        <div>
          <h3 class="text-white font-black text-sm tracking-widest uppercase mb-3 flex items-center gap-2">
            <i class="fa-solid fa-crosshairs theme-accent-text"></i> Mission
          </h3>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
            To engineer digital infrastructure that transforms chaotic workloads into streamlined, frictionless operating systems.
          </p>
        </div>
        <div>
          <h3 class="text-white font-black text-sm tracking-widest uppercase mb-3 flex items-center gap-2">
            <i class="fa-solid fa-layer-group theme-accent-text"></i> Architecture
          </h3>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
            Every framework is rigorously tested on Notion, Canva, and Google Workspace to ensure flawless integration on all hardware.
          </p>
        </div>
        <div>
          <h3 class="text-white font-black text-sm tracking-widest uppercase mb-3 flex items-center gap-2">
            <i class="fa-solid fa-shield-halved theme-accent-text"></i> Integrity
          </h3>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
            Lifetime updates, unlocked base codes for customization, and continuous protocol improvements for all active users.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>