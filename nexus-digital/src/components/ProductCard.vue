<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  isWishlisted: {
    type: Boolean,
    default: false,
  },
  fxRate: {
    type: Number,
    default: 58.4,
  },
});

const emit = defineEmits(["toggleWishlist", "buy", "quickView"]);
</script>

<template>
  <div
    class="group relative flex flex-col bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--border-subtle)] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_var(--accent-glow)] hover:border-[var(--accent-core)]"
  >
    <div class="relative h-52 overflow-hidden bg-black">
      <img
        :src="product.image"
        :alt="product.title"
        class="w-full h-full object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-100"
      />

      <div
        class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
      ></div>

      <div class="absolute top-3 left-3 flex flex-col gap-2">
        <span
          class="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10 shadow-sm flex items-center gap-1.5"
        >
          <i :class="product.icon" class="text-[var(--accent-core)]"></i>
          {{ product.category }}
        </span>
      </div>

      <button
        @click.stop="emit('toggleWishlist', product)"
        class="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center transition-all duration-300 border border-white/10 hover:bg-black hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer z-10"
      >
        <i
          :class="
            isWishlisted
              ? 'fa-solid fa-heart text-red-500'
              : 'fa-regular fa-heart text-[var(--text-muted)] group-hover:text-white'
          "
        ></i>
      </button>

      <div
        class="absolute inset-0 flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none"
      >
        <button
          @click.stop="emit('quickView', product)"
          class="pointer-events-auto px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold shadow-lg hover:bg-white hover:text-black transition-colors cursor-pointer flex items-center gap-2"
        >
          <i class="fa-regular fa-eye"></i> Quick View
        </button>
      </div>

      <div
        class="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-bold text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded border border-white/10"
      >
        <i class="fa-solid fa-star text-amber-400 text-[10px]"></i>
        {{ product.rating }}
      </div>
    </div>

    <div
      class="p-5 flex flex-col flex-grow relative z-10 bg-gradient-to-b from-transparent to-black/40"
    >
      <h3
        class="text-lg font-black text-white mb-1.5 line-clamp-1 group-hover:text-[var(--accent-core)] transition-colors duration-300"
      >
        {{ product.title }}
      </h3>
      <p
        class="text-[var(--text-muted)] text-sm line-clamp-2 leading-relaxed mb-5 flex-grow font-medium"
      >
        {{ product.description }}
      </p>

      <div
        class="w-full h-px bg-gradient-to-r from-[var(--border-subtle)] via-[var(--border-subtle)] to-transparent mb-4"
      ></div>

      <div class="flex items-center justify-between mt-auto">
        <div>
          <div
            class="text-2xl font-black text-white tracking-tight flex items-baseline gap-1"
          >
            <span class="text-[var(--text-muted)] text-sm font-medium">$</span
            >{{ product.price.toFixed(2) }}
          </div>
          <div class="text-[10px] text-[var(--text-muted)] font-medium">
            ≈ ₱{{ (product.price * fxRate).toFixed(0) }}
          </div>
        </div>

        <button
          @click.stop="emit('buy', product)"
          class="px-4 py-2.5 rounded-xl theme-accent-bg text-white font-bold text-sm shadow-[0_0_10px_var(--accent-glow)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent-core)] hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer flex items-center gap-2"
        >
          <i class="fa-solid fa-download"></i> Get
        </button>
      </div>
    </div>
  </div>
</template>
