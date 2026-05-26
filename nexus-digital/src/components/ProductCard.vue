<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: Object,
  fxRate: Number,
  isWishlisted: Boolean
})
defineEmits(['buy', 'quickView', 'toggleWishlist'])

const phpPrice = computed(() => (props.product.price * props.fxRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
</script>

<template>
  <div class="structured-panel rounded-2xl overflow-hidden group flex flex-col h-full cursor-pointer" @click="$emit('quickView', product)">
    
    <div class="h-48 w-full overflow-hidden relative bg-gray-100">
      <img :src="product.image" :alt="product.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      
      <div class="absolute top-3 left-3 flex flex-col gap-2 z-20">
        <span v-if="product.isBestseller" class="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-amber-400 text-amber-950 shadow-sm flex items-center gap-1 w-max">
          <i class="fa-solid fa-fire text-amber-700"></i> Bestseller
        </span>
        <span v-if="product.isNew" class="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-blue-500 text-white shadow-sm flex items-center gap-1 w-max">
          <i class="fa-solid fa-sparkles text-blue-200"></i> New Arrival
        </span>
      </div>

      <button @click.stop="$emit('toggleWishlist', product)" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-all z-20 shadow-sm">
        <i :class="['fa-heart', isWishlisted ? 'fa-solid text-red-500' : 'fa-regular']"></i>
      </button>
    </div>
    
    <div class="p-5 flex-grow flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-[10px] font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
            <i :class="product.icon" class="theme-accent-text"></i> {{ product.category }}
          </span>
          <div class="flex items-center gap-1 text-[10px] font-bold text-gray-600">
            <i class="fa-solid fa-star text-amber-400"></i> {{ product.rating }} ({{ product.reviews }})
          </div>
        </div>

        <h3 class="text-base font-bold text-gray-900 tracking-tight leading-tight">{{ product.title }}</h3>
        <p class="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{{ product.description }}</p>
      </div>

      <div class="mt-5 pt-4 border-t border-gray-100 flex justify-between items-end">
        <div>
          <div class="text-[10px] font-bold text-gray-400 mb-0.5">₱{{ phpPrice }} PHP</div>
          <div class="text-xl font-black tracking-tight text-gray-900 leading-none">${{ product.price.toFixed(2) }}</div>
        </div>
        
        <button @click.stop="$emit('buy', product)" class="px-4 py-2 rounded-lg theme-accent-bg text-white text-xs font-bold shadow-sm transition-all active:scale-95 hover:brightness-110 flex items-center gap-2">
          <span>Get It</span>
          <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      </div>
    </div>
  </div>
</template>