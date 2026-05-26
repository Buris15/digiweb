<script setup>
import { ref, computed } from 'vue'
import { initialProducts, initialSocialLinks } from './productsData.js'
import ProductCard from './components/ProductCard.vue'
import ToastNotification from './components/ToastNotification.vue'

// --- CORE STATE ---
const products = ref(initialProducts)
const channels = ref(initialSocialLinks)
const fxRate = 58.4 

const wishlist = ref([])
const isWishlistSidebarOpen = ref(false)
const selectedProduct = ref(null)
const searchQuery = ref("")
const activeCategory = ref("all")
const sortBy = ref("default")
const isContactOpen = ref(false)
const toastState = ref({ show: false, message: "" })

// --- TRUST ARCHITECTURE DATA (NEW) ---
const testimonials = ref([
  { 
    id: 1, 
    name: "Chloe M.", 
    role: "Architecture Student", 
    quote: "This Notion workspace literally saved my GPA this semester. The aesthetic is unmatched and the systems actually make sense.", 
    rating: 5 
  },
  { 
    id: 2, 
    name: "David K.", 
    role: "UX Researcher", 
    quote: "Cleanest digital assets I've ever deployed. The dark mode calibration is perfect for late-night deep work sessions.", 
    rating: 5 
  },
  { 
    id: 3, 
    name: "Sarah L.", 
    role: "Content Creator", 
    quote: "Finally, templates that don't look like boring spreadsheets. Dropped this into my workflow and instantly leveled up.", 
    rating: 5 
  }
])

const faqs = ref([
  { 
    id: 1, 
    question: "Do I need a paid software account to use these?", 
    answer: "Negative. All templates and vectors are fully optimized to run flawlessly on the free-tier versions of Notion, Canva, and Google Workspace." 
  },
  { 
    id: 2, 
    question: "How do I receive my digital files?", 
    answer: "Instantly. Upon secure checkout via Gumroad or Raket, a direct payload link is dispatched immediately to your email terminal." 
  },
  { 
    id: 3, 
    question: "Are system updates included in the purchase?", 
    answer: "Yes. Once you secure an asset, you are granted lifetime access to all future architectural updates for that specific framework." 
  },
  { 
    id: 4, 
    question: "Can I customize the frameworks?", 
    answer: "Absolutely. The base architecture is fully unlocked. You can modify color vectors, typography, and database properties to fit your exact operational needs." 
  }
])

// Interactive FAQ State Manager
const activeFaq = ref(null)
const toggleFaq = (id) => {
  activeFaq.value = activeFaq.value === id ? null : id
}

// --- CATEGORIES & FUNCTIONS ---
const categories = [
  { id: "all", name: "All Assets", icon: "fa-border-all" },
  { id: "templates", name: "Templates & Decks", icon: "fa-compass" },
  { id: "graphics", name: "Graphics & Art", icon: "fa-face-smile" },
  { id: "education", name: "Worksheets", icon: "fa-book-open" },
  { id: "services", name: "Custom Services", icon: "fa-wand-magic-sparkles" }
]

const triggerNotification = (msg) => {
  toastState.value.message = msg
  toastState.value.show = true
  setTimeout(() => { toastState.value.show = false }, 3000)
}

const dispatchAssetRoute = (product) => {
  triggerNotification(`Opening secure route to ${product.platformName}...`)
  window.open(product.platformUrl, '_blank')
}

const toggleWishlist = (product) => {
  const index = wishlist.value.findIndex(p => p.id === product.id)
  if (index === -1) {
    wishlist.value.push(product)
    triggerNotification(`Saved to your digital vault.`)
  } else {
    wishlist.value.splice(index, 1)
    triggerNotification(`Removed from your digital vault.`)
  }
}

const isWishlisted = (product) => wishlist.value.some(p => p.id === product.id)

const filteredProducts = computed(() => {
  let output = products.value.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = activeCategory.value === 'all' || p.category === activeCategory.value
    return matchesSearch && matchesCategory
  })
  if (sortBy.value === 'low-high') output.sort((a, b) => a.price - b.price)
  if (sortBy.value === 'high-low') output.sort((a, b) => b.price - a.price)
  if (sortBy.value === 'top-rated') output.sort((a, b) => b.rating - a.rating)
  return output
})
</script>

<template>
  <div class="min-h-screen text-[var(--text-primary)] relative selection:bg-[var(--accent-core)] selection:text-white pb-10 overflow-x-hidden">
    
    <div class="animated-bg"></div>

    <div class="relative z-10 complex-fade-in">
      
      <header class="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-[var(--border-subtle)] px-6 py-4 flex justify-between items-center transition-all duration-300 hover:border-white/20">
        <div class="flex items-center gap-3 group cursor-pointer">
          <div class="w-4 h-4 rounded-md theme-accent-bg rotate-12 transition-transform duration-500 group-hover:rotate-[225deg] shadow-[0_0_15px_var(--accent-glow)] group-hover:shadow-[0_0_25px_var(--accent-core)]"></div>
          <span class="font-black tracking-tight text-lg text-white transition-all duration-300 group-hover:tracking-widest">
            AESTHETIC<span class="text-[var(--text-muted)] group-hover:text-[var(--accent-core)] transition-colors duration-300 font-normal">.VAULT</span>
          </span>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden md:flex items-center gap-5 text-[var(--text-muted)]">
            <a :href="channels.tiktok" target="_blank" class="hover:text-white hover:scale-110 transform transition-all duration-300"><i class="fa-brands fa-tiktok text-base"></i></a>
            <a :href="channels.facebook" target="_blank" class="hover:text-blue-400 hover:scale-110 transform transition-all duration-300"><i class="fa-brands fa-facebook text-base"></i></a>
            <div class="w-[1px] h-4 bg-[var(--border-subtle)]"></div> 
          </div>
          
          <button @click="isWishlistSidebarOpen = true" class="cursor-pointer text-[var(--text-muted)] hover:text-red-400 p-2 transition-all duration-300 relative hover:scale-105 active:scale-95">
            <i class="fa-solid fa-heart text-xl transition-transform duration-300 hover:rotate-12"></i>
            <span v-if="wishlist.length > 0" class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[9px] font-black flex items-center justify-center rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]">
              {{ wishlist.length }}
            </span>
          </button>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-6 mt-16">
        
        <section class="mb-16">
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
            <div class="max-w-2xl text-reveal">
              <h1 class="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white leading-[1.1]">
                Systematic Tools to <br/>
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-core)] via-cyan-400 to-indigo-400 drop-shadow-[0_2px_20px_var(--accent-glow)] animate-gradient-flow">Organize</span> Your Term.
              </h1>
              <p class="text-[var(--text-muted)] text-base font-medium leading-relaxed max-w-lg">
                Premium obsidian-dark templates, layouts, and workspace dynamics structured specifically for high-achieving student creators.
              </p>
            </div>

            <div class="flex w-full lg:w-auto gap-4 flex-wrap sm:flex-nowrap">
              <div class="flex items-center bg-white/[0.03] backdrop-blur-md border border-[var(--border-subtle)] rounded-xl px-4 flex-grow lg:w-72 focus-within:border-[var(--accent-core)] focus-within:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-500 group">
                <i class="fa-solid fa-magnifying-glass text-[var(--text-muted)] text-xs group-focus-within:text-[var(--accent-core)] transition-colors"></i>
                <input v-model="searchQuery" type="text" placeholder="Query active vectors..." class="w-full bg-transparent py-3.5 px-3 text-sm text-white outline-none placeholder:text-gray-600 font-medium" />
              </div>
              
              <select v-model="sortBy" class="bg-white/[0.03] backdrop-blur-md border border-[var(--border-subtle)] rounded-xl px-5 py-3.5 text-sm font-bold text-white outline-none cursor-pointer focus:border-[var(--accent-core)] focus:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-500">
                <option value="default" class="bg-neutral-950">System Featured</option>
                <option value="top-rated" class="bg-neutral-950">Highest Rated</option>
                <option value="low-high" class="bg-neutral-950">Price: Ascending</option>
                <option value="high-low" class="bg-neutral-950">Price: Descending</option>
              </select>
            </div>
          </div>

          <div class="flex flex-wrap gap-2.5">
            <button v-for="cat in categories" :key="cat.id" @click="activeCategory = cat.id"
              :class="['px-5 py-3 rounded-xl text-xs font-black tracking-wider uppercase border transition-all duration-500 cursor-pointer backdrop-blur-md flex items-center gap-2.5 transform active:scale-95 hover:-translate-y-0.5', 
              activeCategory === cat.id ? 'theme-accent-bg text-white border-transparent shadow-[0_0_25px_var(--accent-glow)] border-t border-white/20' : 'bg-white/[0.02] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white hover:border-white/30 hover:bg-white/[0.05]']">
              <i :class="['fa-solid', cat.icon], activeCategory === cat.id ? 'animate-bounce' : ''"></i> 
              {{ cat.name }}
            </button>
          </div>
        </section>

        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 card-stagger-grid">
          <ProductCard v-for="prod in filteredProducts" :key="prod.id" :product="prod" :fxRate="fxRate" 
            :isWishlisted="isWishlisted(prod)"
            @toggleWishlist="toggleWishlist" @buy="dispatchAssetRoute" @quickView="selectedProduct = $event" />
        </section>
        
        <div v-if="filteredProducts.length === 0" class="w-full text-center py-32 border border-dashed border-[var(--border-subtle)] rounded-3xl bg-white/[0.01] backdrop-blur-sm transition-all duration-500 mt-8">
          <i class="fa-solid fa-shapes text-4xl text-gray-700 mb-4 animate-pulse"></i>
          <p class="text-[var(--text-muted)] font-bold tracking-tight">No active vectors matching your search criteria.</p>
        </div>

        <section class="mt-32 mb-20 relative z-10 complex-fade-in">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-black text-white tracking-tight mb-3">System <span class="theme-accent-text">Feedback</span></h2>
            <p class="text-[var(--text-muted)] text-sm font-medium">Data logs from active operators using our frameworks.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="review in testimonials" :key="review.id" class="group relative bg-white/[0.01] backdrop-blur-md border border-white/5 rounded-2xl p-8 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
              <i class="fa-solid fa-quote-right absolute top-6 right-6 text-4xl text-white/[0.03] group-hover:text-[var(--accent-core)] transition-colors duration-500 opacity-20 group-hover:opacity-10"></i>
              
              <div class="flex gap-1 mb-6">
                <i v-for="n in review.rating" :key="n" class="fa-solid fa-star text-amber-400 text-xs shadow-[0_0_10px_rgba(251,191,36,0.3)]"></i>
              </div>
              
              <p class="text-[var(--text-primary)] text-sm leading-relaxed mb-8 font-medium italic relative z-10">"{{ review.quote }}"</p>
              
              <div class="flex items-center gap-4 border-t border-white/5 pt-5">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-black border border-white/10 flex items-center justify-center text-white font-black text-xs shadow-inner">
                  {{ review.name.charAt(0) }}
                </div>
                <div>
                  <h4 class="text-white text-xs font-black tracking-wide">{{ review.name }}</h4>
                  <p class="text-[var(--accent-core)] text-[10px] font-bold uppercase tracking-widest">{{ review.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="mt-20 mb-10 max-w-3xl mx-auto relative z-10 complex-fade-in">
          <div class="text-center mb-10">
            <h2 class="text-3xl font-black text-white tracking-tight mb-3">Protocol <span class="theme-accent-text">Inquiries</span></h2>
            <p class="text-[var(--text-muted)] text-sm font-medium">Frequently accessed data files.</p>
          </div>

          <div class="space-y-3">
            <div v-for="faq in faqs" :key="faq.id" 
                 class="bg-white/[0.01] border rounded-xl backdrop-blur-sm transition-all duration-300 overflow-hidden"
                 :class="activeFaq === faq.id ? 'border-[var(--accent-core)] shadow-[0_0_20px_rgba(0,0,0,0.5)]' : 'border-white/5 hover:border-white/20'">
              
              <button @click="toggleFaq(faq.id)" class="w-full text-left px-6 py-5 flex items-center justify-between cursor-pointer focus:outline-none group">
                <span class="text-sm font-bold text-white group-hover:text-[var(--accent-core)] transition-colors pr-8">
                  {{ faq.question }}
                </span>
                <i class="fa-solid fa-chevron-down text-[var(--text-muted)] transition-transform duration-500"
                   :class="activeFaq === faq.id ? 'rotate-180 text-[var(--accent-core)]' : ''"></i>
              </button>

              <div class="grid transition-all duration-500 ease-in-out"
                   :style="{ gridTemplateRows: activeFaq === faq.id ? '1fr' : '0fr' }">
                <div class="overflow-hidden">
                  <p class="px-6 pb-6 text-sm text-[var(--text-muted)] font-medium leading-relaxed border-t border-white/5 pt-4 mt-2">
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Transition name="modal-zoom">
        <div v-if="selectedProduct" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6" @click.self="selectedProduct = null">
          <div class="bg-neutral-950/80 border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8)] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative backdrop-blur-2xl transition-all duration-500 hover:border-white/20">
            
            <button @click="selectedProduct = null" class="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 text-[var(--text-muted)] hover:text-white hover:bg-neutral-900 transition-all duration-300 cursor-pointer border border-white/5 shadow-md active:scale-90">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>

            <div class="md:w-1/2 h-72 md:h-auto bg-black relative overflow-hidden">
              <img :src="selectedProduct.image" class="w-full h-full object-cover opacity-75 scale-105 hover:scale-100 transition-transform duration-700" />
              <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/40"></div>
              <button @click="toggleWishlist(selectedProduct)" class="absolute top-5 left-5 w-11 h-11 rounded-full bg-black/60 backdrop-blur-md shadow-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-400 transition-all duration-300 cursor-pointer border border-white/10 active:scale-90">
                <i :class="isWishlisted(selectedProduct) ? 'fa-solid fa-heart text-red-500 text-xl animate-ping-once' : 'fa-regular fa-heart text-xl'"></i>
              </button>
            </div>
            
            <div class="md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto bg-gradient-to-b from-neutral-950/40 to-neutral-950/90">
              <div class="flex items-center gap-2.5 mb-4">
                <span class="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest bg-white/5 px-2.5 py-1 rounded-md border border-white/5"><i :class="selectedProduct.icon" class="mr-1.5 text-[var(--accent-core)]"></i>{{ selectedProduct.category }}</span>
                <span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs font-black border border-amber-500/20"><i class="fa-solid fa-star mr-1"></i>{{ selectedProduct.rating }}</span>
              </div>
              
              <h2 class="text-3xl font-black text-white mb-4 tracking-tight leading-tight">{{ selectedProduct.title }}</h2>
              <p class="text-sm text-[var(--text-muted)] mb-8 leading-relaxed font-medium">{{ selectedProduct.description }}</p>
              
              <h4 class="text-[10px] font-black uppercase text-white tracking-widest mb-4 opacity-60">Architecture & Deliverables</h4>
              <ul class="space-y-3 mb-8">
                <li v-for="(feat, idx) in selectedProduct.features" :key="idx" class="flex items-start gap-3.5 text-sm text-[var(--text-primary)] font-semibold bg-white/[0.02] p-3.5 rounded-xl border border-white/5 transition-all hover:bg-white/[0.04] hover:border-white/10">
                  <i class="fa-solid fa-circle-check text-[var(--accent-core)] mt-0.5 shadow-sm"></i> <span>{{ feat }}</span>
                </li>
              </ul>

              <div class="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div class="text-3xl font-black text-white tracking-tight">${{ selectedProduct.price.toFixed(2) }}</div>
                  <div class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1">Via: {{ selectedProduct.platformName }}</div>
                </div>
                <button @click="dispatchAssetRoute(selectedProduct)" class="px-8 py-4 rounded-xl theme-accent-bg text-white font-black text-sm tracking-wide shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent-core)] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 cursor-pointer flex items-center gap-2">
                  <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i> Secure Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="sidebar-slide">
        <div v-if="isWishlistSidebarOpen" class="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-neutral-950/95 shadow-[0_0_50px_rgba(0,0,0,0.9)] border-l border-white/10 flex flex-col backdrop-blur-2xl">
          <div class="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h2 class="font-black text-lg text-white flex items-center gap-2.5 tracking-tight">
              <i class="fa-solid fa-vault text-[var(--accent-core)]"></i> Vault Wishlist
            </h2>
            <button @click="isWishlistSidebarOpen = false" class="w-9 h-9 rounded-full bg-white/5 text-[var(--text-muted)] hover:text-white flex items-center justify-center cursor-pointer transition-all border border-white/5 active:scale-90"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="flex-grow overflow-y-auto p-6 flex flex-col gap-4">
            <div v-if="wishlist.length === 0" class="text-center py-32 text-[var(--text-muted)]">
              <i class="fa-solid fa-box-open text-3xl mb-4 opacity-30 animate-pulse"></i>
              <p class="font-bold text-sm tracking-tight">Vault memory banks are empty.</p>
            </div>
            
            <div v-for="item in wishlist" :key="item.id" class="flex gap-4 p-3.5 border border-white/5 rounded-2xl bg-white/[0.02] hover:border-[var(--accent-core)] hover:bg-white/[0.04] transition-all duration-300 group">
              <div class="w-20 h-20 rounded-xl overflow-hidden bg-black flex-shrink-0">
                <img :src="item.image" class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div class="flex-grow flex flex-col justify-between py-0.5">
                <div>
                  <h4 class="text-sm font-black text-white line-clamp-1 group-hover:text-[var(--accent-core)] transition-colors">{{ item.title }}</h4>
                  <div class="text-xs text-[var(--text-muted)] font-bold mt-1">${{ item.price.toFixed(2) }}</div>
                </div>
                <div class="flex justify-between items-center mt-2">
                  <button @click="toggleWishlist(item)" class="text-[10px] font-black text-red-400 hover:text-red-300 cursor-pointer tracking-wider uppercase">Purge</button>
                  <button @click="dispatchAssetRoute(item)" class="text-[10px] font-black theme-accent-text uppercase cursor-pointer tracking-wider flex items-center gap-1 hover:translate-x-1 transition-transform">Deploy <i class="fa-solid fa-angle-right"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <Transition name="fade">
        <div v-if="isWishlistSidebarOpen" @click="isWishlistSidebarOpen = false" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-40"></div>
      </Transition>

      <Transition name="modal-zoom">
        <div v-if="isContactOpen" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div class="bg-neutral-950/90 border border-white/10 w-full max-w-md rounded-2xl p-8 shadow-2xl relative backdrop-blur-2xl hover:border-white/20 transition-all duration-300">
            <button @click="isContactOpen = false" class="cursor-pointer absolute top-5 right-5 text-[var(--text-muted)] hover:text-white transition-colors p-1 active:scale-90"><i class="fa-solid fa-xmark text-lg"></i></button>
            <div class="w-10 h-10 rounded-xl bg-[var(--accent-glow)] border border-[var(--accent-core)] flex items-center justify-center text-[var(--accent-core)] mb-4 shadow-[0_0_15px_var(--accent-glow)]">
              <i class="fa-solid fa-satellite-dish"></i>
            </div>
            <h3 class="text-xl font-black text-white mb-1 tracking-tight">Open Link Support</h3>
            <p class="text-sm text-[var(--text-muted)] font-medium mb-6">Encountering vector download issues? Connect directly.</p>
            
            <form @submit.prevent="isContactOpen = false; triggerNotification('Signal dispatched successfully.')" class="space-y-4">
              <input required type="text" placeholder="Identity Vector (Name)" class="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--accent-core)] focus:shadow-[0_0_15px_var(--accent-glow)] placeholder:text-neutral-700 transition-all font-semibold" />
              <input required type="email" placeholder="Network Terminal (Email)" class="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--accent-core)] focus:shadow-[0_0_15px_var(--accent-glow)] placeholder:text-neutral-700 transition-all font-semibold" />
              <textarea required rows="3" placeholder="Transmission Payload (Message)..." class="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[var(--accent-core)] focus:shadow-[0_0_15px_var(--accent-glow)] resize-none placeholder:text-neutral-700 transition-all font-semibold"></textarea>
              <button type="submit" class="cursor-pointer w-full py-4 rounded-xl theme-accent-bg text-white font-black text-xs tracking-widest uppercase shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent-core)] hover:-translate-y-0.5 transition-all active:scale-[0.98]">Dispatch Payload</button>
            </form>
          </div>
        </div>
      </Transition>

      <footer class="border-t border-white/5 bg-black/60 backdrop-blur-xl py-16 px-6 mt-32">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-[var(--text-muted)]">
          <div>
            <h3 class="font-black text-white text-base tracking-tight mb-3">AESTHETIC<span class="theme-accent-text">.VAULT</span></h3>
            <p class="text-xs font-semibold leading-relaxed max-w-xs">Engineered infrastructure helping student networks stay hyper-organized with premium asset packs.</p>
          </div>

          <div>
            <h4 class="text-[10px] font-black uppercase text-white tracking-widest mb-5 opacity-60">Store Mainframes</h4>
            <ul class="space-y-3 text-sm font-semibold">
              <li><a :href="channels.gumroad" target="_blank" class="hover:text-white transition-all flex items-center gap-2.5 group"><i class="fa-solid fa-server text-xs group-hover:text-[var(--accent-core)]"></i> Gumroad Distribution</a></li>
              <li><a :href="channels.raketph" target="_blank" class="hover:text-white transition-all flex items-center gap-2.5 group"><i class="fa-solid fa-terminal text-xs group-hover:text-[var(--accent-core)]"></i> Raket Gateway</a></li>
              <li><a :href="channels.kofi" target="_blank" class="hover:text-white transition-all flex items-center gap-2.5 group"><i class="fa-solid fa-bolt text-xs group-hover:text-[var(--accent-core)]"></i> Ko-fi Direct Feed</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-[10px] font-black uppercase text-white tracking-widest mb-5 opacity-60">Signals Protocol</h4>
            <button @click="isContactOpen = true" class="text-sm font-bold hover:text-white transition-all cursor-pointer flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/5">
              <i class="fa-solid fa-paper-plane text-xs theme-accent-text"></i> Establish Support Link
            </button>
            <div class="mt-5 flex gap-3">
              <a :href="channels.facebook" target="_blank" class="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center hover:border-blue-500 hover:text-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 transition-all duration-300"><i class="fa-brands fa-facebook"></i></a>
              <a :href="channels.tiktok" target="_blank" class="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center hover:border-white hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all duration-300"><i class="fa-brands fa-tiktok"></i></a>
            </div>
          </div>
        </div>
      </footer>

    </div>

    <ToastNotification :show="toastState.show" :message="toastState.message" />
  </div>
</template>

<style scoped>
/* High-End Micro-Animations and Easing Configurations */

.complex-fade-in {
  animation: compileIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes compileIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Staggered load effects for card components */
.card-stagger-grid > * {
  opacity: 0;
  animation: compileIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.card-stagger-grid > *:nth-child(1) { animation-delay: 100ms; }
.card-stagger-grid > *:nth-child(2) { animation-delay: 150ms; }
.card-stagger-grid > *:nth-child(3) { animation-delay: 200ms; }
.card-stagger-grid > *:nth-child(4) { animation-delay: 250ms; }
.card-stagger-grid > *:nth-child(5) { animation-delay: 300ms; }
.card-stagger-grid > *:nth-child(6) { animation-delay: 350ms; }

/* Custom Text Mask Revelations */
.text-reveal {
  animation: spread 1.2s cubic-bezier(0.16, 1, 0.3, 1) cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Modal Zoom Keyframes */
.modal-zoom-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-zoom-leave-active {
  transition: all 0.25s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}
.modal-zoom-enter-from {
  opacity: 0;
  transform: scale(0.94);
}
.modal-zoom-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

/* Sidebar Slide Transitions */
.sidebar-slide-enter-active, .sidebar-slide-leave-active {
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.sidebar-slide-enter-from, .sidebar-slide-leave-to {
  transform: translateX(100%);
}

/* Generic Pure Fades */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Wishlist Heart Ping Engine */
.animate-ping-once {
  animation: heartPing 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1;
}
@keyframes heartPing {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
</style>