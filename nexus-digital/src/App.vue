<script setup>
import { ref, computed, onMounted } from 'vue'
import { initialProducts, initialSocialLinks, studentTestimonials } from './productsData.js'
import ProductCard from './components/ProductCard.vue'
import ToastNotification from './components/ToastNotification.vue'

const products = ref(initialProducts)
const channels = ref(initialSocialLinks)
const testimonials = ref(studentTestimonials)
const fxRate = 58.4

// New Feature States
const wishlist = ref([])
const isWishlistSidebarOpen = ref(false)
const selectedProduct = ref(null)

const searchQuery = ref("")
const activeCategory = ref("all")
const sortBy = ref("default")
const isContactOpen = ref(false)
const toastState = ref({ show: false, message: "" })

const categories = [
  { id: "all", name: "All Assets", icon: "fa-border-all" },
  { id: "templates", name: "Templates & Decks", icon: "fa-compass" }, // Filters Notion, Canva, PPT, Resume
  { id: "graphics", name: "Graphics & Art", icon: "fa-face-smile" }, // Filters Stickers, Icons, Logos, Flyers
  { id: "education", name: "Worksheets", icon: "fa-book-open" }, // Filters Worksheets
  { id: "services", name: "Custom Services", icon: "fa-wand-magic-sparkles" } // Filters Commissions
]

// Richer, deeper accent themes for high-contrast visibility
const activeThemeId = ref("midnight")
const themes = ref([
  { id: "midnight", name: "Midnight Violet", color: "#6d28d9" },
  { id: "matcha", name: "Matcha Green", color: "#059669" },
  { id: "coral", name: "Coral Pink", color: "#e11d48" },
  { id: "ocean", name: "Ocean Blue", color: "#2563eb" }
])

const changeTheme = (theme) => {
  activeThemeId.value = theme.id
  document.documentElement.style.setProperty('--accent-core', theme.color)
}

onMounted(() => changeTheme(themes.value[0]))

const triggerNotification = (msg) => {
  toastState.value.message = msg
  toastState.value.show = true
  setTimeout(() => { toastState.value.show = false }, 3000)
}

const dispatchAssetRoute = (product) => {
  triggerNotification(`Redirecting to ${product.platformName}...`)
  window.open(product.platformUrl, '_blank')
}

// Wishlist Logic
const toggleWishlist = (product) => {
  const index = wishlist.value.findIndex(p => p.id === product.id)
  if (index === -1) {
    wishlist.value.push(product)
    triggerNotification(`Added to Wishlist!`)
  } else {
    wishlist.value.splice(index, 1)
    triggerNotification(`Removed from Wishlist.`)
  }
}
const isWishlisted = (product) => wishlist.value.some(p => p.id === product.id)

// Data Filtration
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
  <div class="min-h-screen relative font-sans text-gray-800 pb-32 selection:bg-gray-200">
    
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
  <div class="flex items-center gap-3">
    <div class="w-4 h-4 rounded-md theme-accent-bg rotate-12"></div>
    <span class="font-black tracking-tight text-gray-900 text-lg">AESTHETIC<span class="text-gray-400 font-normal">.VAULT</span></span>
  </div>

  <div class="flex items-center gap-4">
    <div class="hidden md:flex items-center gap-5 text-gray-400">
      <a :href="channels.tiktok" target="_blank" class="hover:text-black transition-colors"><i class="fa-brands fa-tiktok"></i></a>
      <a :href="channels.facebook" target="_blank" class="hover:text-blue-600 transition-colors"><i class="fa-brands fa-facebook"></i></a>
      <div class="w-[1px] h-4 bg-gray-200"></div> </div>
    
    <button @click="isWishlistSidebarOpen = true" class="relative cursor-pointer text-gray-500 hover:text-gray-900 transition-colors p-2">
      <i class="fa-solid fa-heart text-xl"></i>
    </button>
  </div>
</header>


    <main class="max-w-6xl mx-auto px-6 mt-12 relative z-10">
      
      <section class="mb-12">
        <div class="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
          <div class="max-w-2xl">
            <h1 class="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-[1.1]">
              Tools to <span class="theme-accent-text relative">
                Organize
                <svg class="absolute w-full h-3 -bottom-1 left-0 text-current opacity-30" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q 50 20 100 10" stroke="currentColor" stroke-width="4" fill="none"/></svg>
              </span> Your Semester.
            </h1>
            <p class="text-gray-500 text-sm mt-4 font-medium leading-relaxed">High-contrast, distraction-free templates and aesthetic assets built specifically for students, creators, and researchers.</p>
          </div>

          <div class="flex w-full md:w-auto gap-3 flex-wrap md:flex-nowrap">
            <div class="flex items-center bg-white border border-gray-200 rounded-lg px-3 flex-grow md:w-64 shadow-sm focus-within:ring-2 focus-within:theme-accent-border transition-all">
              <i class="fa-solid fa-magnifying-glass text-gray-400 text-xs"></i>
              <input v-model="searchQuery" type="text" placeholder="Search templates..." class="w-full bg-transparent py-2.5 px-2 text-sm text-gray-900 outline-none" />
            </div>
            <select v-model="sortBy" class="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 outline-none shadow-sm cursor-pointer focus:ring-2 focus:theme-accent-border">
              <option value="default">Featured</option>
              <option value="top-rated">Top Rated</option>
              <option value="low-high">Price: Low to High</option>
            </select>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <button v-for="cat in categories" :key="cat.id" @click="activeCategory = cat.id"
            :class="['px-4 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center gap-2', 
            activeCategory === cat.id ? 'theme-accent-bg border-transparent text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400']">
            <i :class="['fa-solid', cat.icon]"></i> {{ cat.name }}
          </button>
        </div>
      </section>

      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard v-for="prod in filteredProducts" :key="prod.id" :product="prod" :fxRate="fxRate" 
          :isWishlisted="isWishlisted(prod)"
          @toggleWishlist="toggleWishlist" @buy="dispatchAssetRoute" @quickView="selectedProduct = $event" />
      </section>

    </main>

    <Transition name="fade">
      <div v-if="selectedProduct" class="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6" @click.self="selectedProduct = null">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative">
          
          <button @click="selectedProduct = null" class="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
            <img :src="selectedProduct.image" class="w-full h-full object-cover" />
            <button @click="toggleWishlist(selectedProduct)" class="absolute top-4 left-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
              <i :class="['fa-heart text-xl', isWishlisted(selectedProduct) ? 'fa-solid text-red-500' : 'fa-regular']"></i>
            </button>
          </div>
          
          <div class="md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs font-bold uppercase text-gray-500"><i :class="selectedProduct.icon" class="mr-1"></i>{{ selectedProduct.category }}</span>
              <span class="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200"><i class="fa-solid fa-star text-amber-500 mr-1"></i>{{ selectedProduct.rating }}</span>
            </div>
            
            <h2 class="text-2xl font-black text-gray-900 mb-4 leading-tight">{{ selectedProduct.title }}</h2>
            <p class="text-sm text-gray-600 mb-6 leading-relaxed">{{ selectedProduct.description }}</p>
            
            <h4 class="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">What's Included</h4>
            <ul class="space-y-3 mb-8">
              <li v-for="(feat, idx) in selectedProduct.features" :key="idx" class="flex items-start gap-3 text-sm text-gray-700 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">
                <i class="fa-solid fa-check text-green-500 mt-1"></i> <span>{{ feat }}</span>
              </li>
            </ul>

            <div class="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
              <div>
                <div class="text-3xl font-black text-gray-900">${{ selectedProduct.price.toFixed(2) }}</div>
                <div class="text-xs font-bold text-gray-400 mt-1">Platform: {{ selectedProduct.platformName }}</div>
              </div>
              <button @click="dispatchAssetRoute(selectedProduct)" class="px-8 py-3 rounded-xl theme-accent-bg text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer">
                Download Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="slide-right">
      <div v-if="isWishlistSidebarOpen" class="fixed inset-y-0 right-0 z-50 w-full md:w-[400px] bg-white shadow-[auto_0_40px_rgba(0,0,0,0.1)] border-l border-gray-200 flex flex-col">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="font-black text-xl text-gray-900 flex items-center gap-2">
            <i class="fa-solid fa-heart text-red-500"></i> My Wishlist
          </h2>
          <button @click="isWishlistSidebarOpen = false" class="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center cursor-pointer transition-colors"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="flex-grow overflow-y-auto p-6 flex flex-col gap-4">
          <div v-if="wishlist.length === 0" class="text-center py-20 text-gray-400">
            <i class="fa-regular fa-folder-open text-4xl mb-4"></i>
            <p class="font-medium text-sm">Your wishlist is currently empty.</p>
          </div>
          
          <div v-for="item in wishlist" :key="item.id" class="flex gap-4 p-3 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors bg-white">
            <img :src="item.image" class="w-20 h-20 rounded-lg object-cover bg-gray-100" />
            <div class="flex-grow flex flex-col justify-between py-1">
              <div>
                <h4 class="text-sm font-bold text-gray-900 line-clamp-1">{{ item.title }}</h4>
                <div class="text-xs text-gray-500 font-medium mt-1">${{ item.price.toFixed(2) }}</div>
              </div>
              <div class="flex justify-between items-center mt-2">
                <button @click="toggleWishlist(item)" class="text-[10px] font-bold text-red-500 hover:text-red-700 cursor-pointer">Remove</button>
                <button @click="dispatchAssetRoute(item)" class="text-[10px] font-bold theme-accent-text uppercase cursor-pointer">Get Item <i class="fa-solid fa-arrow-right"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="isWishlistSidebarOpen" @click="isWishlistSidebarOpen = false" class="fixed inset-0 bg-gray-900/30 backdrop-blur-[2px] z-40"></div>
    </Transition>

    <Transition name="fade">
      <div v-if="isContactOpen" class="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-sm rounded-2xl p-8 shadow-2xl relative">
          <button @click="isContactOpen = false" class="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-800"><i class="fa-solid fa-xmark text-lg"></i></button>
          <h3 class="text-xl font-black text-gray-900 mb-1">Support Desk</h3>
          <p class="text-sm text-gray-500 font-medium mb-6">Having trouble with a template link? Drop a line.</p>
          
          <form @submit.prevent="isContactOpen = false; triggerNotification('Message routed to support desk!')" class="space-y-4">
            <input required type="text" placeholder="Your Name" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 theme-accent-border shadow-sm" />
            <input required type="email" placeholder="student@university.edu" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 theme-accent-border shadow-sm" />
            <textarea required rows="3" placeholder="Describe your issue..." class="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 theme-accent-border resize-none shadow-sm"></textarea>
            <button type="submit" class="cursor-pointer w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] hover:bg-gray-800">Send Ticket</button>
          </form>
        </div>
      </div>
    </Transition>

    <ToastNotification :show="toastState.show" :message="toastState.message" />
  </div>

  <footer class="bg-gray-50 border-t border-gray-200 py-12 px-6 mt-20">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
    <div>
      <h3 class="font-black text-gray-900 mb-2">Aesthetic Vault</h3>
      <p class="text-xs text-gray-500 leading-relaxed">Helping students organize their academic life with beautiful, functional, and affordable digital assets.</p>
    </div>

    <div>
      <h4 class="text-xs font-bold uppercase text-gray-900 mb-4 tracking-wider">Store Platforms</h4>
      <ul class="space-y-2 text-sm text-gray-600">
        <li><a :href="channels.gumroad" target="_blank" class="hover:theme-accent-text">Gumroad Store</a></li>
        <li><a :href="channels.raketph" target="_blank" class="hover:theme-accent-text">Raket.ph Profile</a></li>
        <li><a :href="channels.kofi" target="_blank" class="hover:theme-accent-text">Ko-fi Support</a></li>
      </ul>
    </div>

    <div>
      <h4 class="text-xs font-bold uppercase text-gray-900 mb-4 tracking-wider">Contact & Support</h4>
      <button @click="isContactOpen = true" class="text-sm text-gray-600 hover:theme-accent-text underline underline-offset-4 cursor-pointer">
        Send me a message
      </button>
      <div class="mt-4 flex gap-3">
        <a :href="channels.facebook" target="_blank" class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all"><i class="fa-brands fa-facebook"></i></a>
        <a :href="channels.tiktok" target="_blank" class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-black hover:text-black transition-all"><i class="fa-brands fa-tiktok"></i></a>
      </div>
    </div>
  </div>
  <div class="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
    &copy; 2026 Aesthetic Vault. All rights reserved.
  </div>
</footer>
</template>