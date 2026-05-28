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

// --- SECURE TRANSFER STATE (WEB3FORMS + IMGBB) ---
const WEB3FORMS_KEY = "97d9635f-bbb3-42b2-b3ab-5674a76406cf" 
const IMGBB_API_KEY = "82aeed05375dfb93a39a58bbe0ed0f0c"

const isCheckoutModalOpen = ref(false)
const isSubmitting = ref(false)
const targetCheckoutAsset = ref(null)

// --- TRUST ARCHITECTURE DATA ---
const testimonials = ref([
  { id: 1, name: "Chloe M.", role: "Architecture Student", quote: "This Notion workspace literally saved my GPA this semester. The aesthetic is unmatched and the systems actually make sense.", rating: 5 },
  { id: 2, name: "David K.", role: "UX Researcher", quote: "Cleanest digital assets I've ever deployed. The dark mode calibration is perfect for late-night deep work sessions.", rating: 5 },
  { id: 3, name: "Sarah L.", role: "Content Creator", quote: "Finally, templates that don't look like boring spreadsheets. Dropped this into my workflow and instantly leveled up.", rating: 5 }
])

const faqs = ref([
  { id: 1, question: "Do I need a paid software account to use these?", answer: "Negative. All templates and vectors are fully optimized to run flawlessly on the free-tier versions of Notion, Canva, and Google Workspace." },
  { id: 2, question: "How do I receive my digital files?", answer: "Instantly. Upon secure checkout via Gumroad or Raket, a direct payload link is dispatched immediately to your email terminal." },
  { id: 3, question: "Are system updates included in the purchase?", answer: "Yes. Once you secure an asset, you are granted lifetime access to all future architectural updates for that specific framework." },
  { id: 4, question: "Can I customize the frameworks?", answer: "Absolutely. The base architecture is fully unlocked. You can modify color vectors, typography, and database properties to fit your exact operational needs." }
])

const activeFaq = ref(null)
const toggleFaq = (id) => activeFaq.value = activeFaq.value === id ? null : id

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

const initiateManualCheckout = (product) => {
  targetCheckoutAsset.value = product
  isCheckoutModalOpen.value = true
}

// THE INVISIBLE BRIDGE: Handles File Upload -> Web3Forms Submission
const executeTransaction = async (event) => {
  isSubmitting.value = true
  const form = event.target
  
  // 1. Grab the inputs
  const nameInput = form.name.value
  const emailInput = form.email.value
  const fileInput = form.attachment.files[0]

  if (!fileInput) {
    triggerNotification("System Error: Receipt image required.")
    isSubmitting.value = false
    return
  }

  try {
    // STEP 1: Upload Image to ImgBB invisibly
    triggerNotification("Encrypting receipt data...")
    const imgData = new FormData()
    imgData.append("image", fileInput)

    const imgResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: imgData
    })
    
    const imgResult = await imgResponse.json()
    
    if (!imgResult.success) {
      throw new Error("Image hosting rejected.")
    }
    
    const receiptUrl = imgResult.data.url

    // STEP 2: Send clean text data to Web3Forms
    triggerNotification("Dispatching payload to mainframe...")
    const web3FormData = new FormData()
    web3FormData.append("access_key", WEB3FORMS_KEY)
    web3FormData.append("subject", `SYSTEM ALERT: Vault Purchase - ${targetCheckoutAsset.value.title}`)
    web3FormData.append("from_name", "Aesthetic Vault Store")
    web3FormData.append("Buyer_Name", nameInput)
    web3FormData.append("Buyer_Email", emailInput)
    web3FormData.append("Requested_Asset", targetCheckoutAsset.value.title)
    web3FormData.append("Receipt_Screenshot", receiptUrl) // Sends URL instead of the file!

    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: web3FormData
    })
    
    const web3Result = await web3Response.json()
    
    if (web3Result.success) {
      triggerNotification("Transfer verified. Access link will be dispatched shortly.")
      isCheckoutModalOpen.value = false
      targetCheckoutAsset.value = null
      form.reset()
    } else {
      triggerNotification("System Error: Form rejected.")
    }
  } catch (error) {
    console.error(error)
    triggerNotification("Critical Error: Connection lost.")
  } finally {
    isSubmitting.value = false
  }
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
  <div class="min-h-screen relative pb-10 font-sans">
    
    <div class="animated-bg"></div>

    <div class="relative z-10 complex-fade-in">
      
      <div class="px-4 md:px-6 pt-4">
        <header class="sticky top-4 z-40 max-w-7xl mx-auto glass-panel !rounded-[2rem] px-6 py-4 flex justify-between items-center">
          <div class="flex items-center gap-3 group cursor-pointer">
            <div class="w-4 h-4 rounded-md theme-accent-bg rotate-12 transition-transform duration-500 group-hover:rotate-[225deg] shadow-[0_0_15px_var(--accent-glow)]"></div>
            <span class="font-black tracking-tight text-lg text-white transition-all duration-300 group-hover:tracking-widest">
              AESTHETIC<span class="text-[var(--text-muted)] group-hover:text-[var(--accent-core)] transition-colors duration-300 font-normal">.VAULT</span>
            </span>
          </div>

          <div class="flex items-center gap-4">
            <div class="hidden md:flex items-center gap-5 text-[var(--text-muted)]">
              <a :href="channels.tiktok" target="_blank" class="hover:text-white hover:scale-110 transform transition-all duration-300"><i class="fa-brands fa-tiktok text-base"></i></a>
              <a :href="channels.facebook" target="_blank" class="hover:text-[#0099ff] hover:scale-110 transform transition-all duration-300"><i class="fa-brands fa-facebook text-base"></i></a>
              <div class="w-[1px] h-4 bg-white/10"></div> 
            </div>
            
            <button @click="isWishlistSidebarOpen = true" class="cursor-pointer text-[var(--text-muted)] hover:text-red-400 p-2 transition-all duration-300 relative hover:scale-105 active:scale-95">
              <i class="fa-solid fa-heart text-xl transition-transform duration-300 hover:rotate-12"></i>
              <span v-if="wishlist.length > 0" class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[9px] font-black flex items-center justify-center rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                {{ wishlist.length }}
              </span>
            </button>
          </div>
        </header>
      </div>

      <main class="max-w-7xl mx-auto px-6 mt-12">
        
        <section class="glass-panel !rounded-[2rem] p-8 md:p-12 lg:p-16 mb-16 relative overflow-hidden group">
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 relative z-10">
            <div class="max-w-2xl text-reveal">
              <h1 class="text-4xl md:text-6xl font-black tracking-tight mb-5 text-white leading-[1.1]">
                Systematic Tools to <br/>
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-[#0099ff] to-cyan-200 drop-shadow-[0_2px_20px_var(--accent-glow)]">Organize</span> Your Term.
              </h1>
              <p class="text-[var(--text-muted)] text-base font-medium leading-relaxed max-w-lg">
                Premium obsidian-dark templates, layouts, and workspace dynamics structured specifically for high-achieving student creators.
              </p>
            </div>

            <div class="flex w-full lg:w-auto gap-4 flex-wrap sm:flex-nowrap">
              <div class="flex items-center glass-button px-4 flex-grow lg:w-72 focus-within:border-[var(--accent-core)] transition-all duration-500 !bg-black/20">
                <i class="fa-solid fa-magnifying-glass text-[var(--text-muted)] text-xs"></i>
                <input v-model="searchQuery" type="text" placeholder="Query active vectors..." class="w-full bg-transparent py-3.5 px-3 text-sm text-white outline-none placeholder:text-[var(--text-muted)] font-medium border-none shadow-none" />
              </div>
              
              <select v-model="sortBy" class="glass-button px-5 py-3.5 text-sm font-bold text-white outline-none cursor-pointer focus:border-[var(--accent-core)] transition-all duration-500 appearance-none !bg-black/20">
                <option value="default" class="bg-black">System Featured</option>
                <option value="top-rated" class="bg-black">Highest Rated</option>
                <option value="low-high" class="bg-black">Price: Ascending</option>
                <option value="high-low" class="bg-black">Price: Descending</option>
              </select>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 mt-12 relative z-10">
            <button v-for="cat in categories" :key="cat.id" @click="activeCategory = cat.id"
              :class="['px-5 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-500 cursor-pointer flex items-center gap-2.5 transform active:scale-95 border-none', 
              activeCategory === cat.id ? 'theme-accent-bg text-white shadow-[0_0_25px_var(--accent-glow)]' : 'glass-button text-[var(--text-muted)] hover:text-white']">
              <i :class="['fa-solid', cat.icon], activeCategory === cat.id ? 'animate-bounce' : ''"></i> 
              {{ cat.name }}
            </button>
          </div>
        </section>

        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 card-stagger-grid">
          <ProductCard v-for="prod in filteredProducts" :key="prod.id" :product="prod" :fxRate="fxRate" 
            :isWishlisted="isWishlisted(prod)"
            @toggleWishlist="toggleWishlist" @buy="initiateManualCheckout" @quickView="selectedProduct = $event" 
            class="glass-panel glass-panel-hover overflow-hidden" />
        </section>
        
        <div v-if="filteredProducts.length === 0" class="w-full text-center py-32 glass-panel border-dashed mt-8">
          <i class="fa-solid fa-shapes text-4xl text-[var(--text-muted)] mb-4 animate-pulse"></i>
          <p class="text-[var(--text-muted)] font-bold tracking-tight">No active vectors matching your search criteria.</p>
        </div>

        <section class="mt-32 mb-20 relative z-10 complex-fade-in">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-black text-white tracking-tight mb-3">System <span class="theme-accent-text">Feedback</span></h2>
            <p class="text-[var(--text-muted)] text-sm font-medium">Data logs from active operators using our frameworks.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="review in testimonials" :key="review.id" class="glass-panel glass-panel-hover p-8 group relative cursor-default">
              <i class="fa-solid fa-quote-right absolute top-6 right-6 text-4xl text-white/5 group-hover:text-[var(--accent-core)] transition-colors duration-500"></i>
              
              <div class="flex gap-1 mb-6">
                <i v-for="n in review.rating" :key="n" class="fa-solid fa-star text-amber-400 text-xs drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"></i>
              </div>
              
              <p class="text-[var(--text-primary)] text-sm leading-relaxed mb-8 font-medium italic relative z-10">"{{ review.quote }}"</p>
              
              <div class="flex items-center gap-4 border-t border-white/10 pt-5">
                <div class="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white font-black text-xs shadow-inner">
                  {{ review.name.charAt(0) }}
                </div>
                <div>
                  <h4 class="text-white text-xs font-black tracking-wide">{{ review.name }}</h4>
                  <p class="theme-accent-text text-[10px] font-bold uppercase tracking-widest">{{ review.role }}</p>
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

          <div class="space-y-4">
            <div v-for="faq in faqs" :key="faq.id" 
                 class="glass-panel overflow-hidden transition-all duration-500"
                 :class="activeFaq === faq.id ? 'border-[var(--accent-core)]/50 shadow-[0_0_30px_var(--accent-glow)]' : ''">
              
              <button @click="toggleFaq(faq.id)" class="w-full text-left px-6 py-5 flex items-center justify-between cursor-pointer focus:outline-none group border-none shadow-none">
                <span class="text-sm font-bold text-white group-hover:text-[var(--accent-core)] transition-colors pr-8">
                  {{ faq.question }}
                </span>
                <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[var(--accent-core)] transition-all">
                  <i class="fa-solid fa-chevron-down text-[var(--text-muted)] transition-transform duration-500"
                     :class="activeFaq === faq.id ? 'rotate-180 theme-accent-text' : ''"></i>
                </div>
              </button>

              <div class="grid transition-all duration-500 ease-in-out" :style="{ gridTemplateRows: activeFaq === faq.id ? '1fr' : '0fr' }">
                <div class="overflow-hidden">
                  <p class="px-6 pb-6 text-sm text-[var(--text-muted)] font-medium leading-relaxed border-t border-white/10 pt-4 mt-2">
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Transition name="modal-zoom">
        <div v-if="isCheckoutModalOpen" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div class="glass-panel w-full max-w-md !rounded-[2rem] p-8 relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <button @click="isCheckoutModalOpen = false" class="cursor-pointer absolute top-5 right-5 text-[var(--text-muted)] hover:text-white rounded-full w-8 h-8 flex items-center justify-center transition-all active:scale-90 border-none bg-transparent">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
            
            <div class="w-12 h-12 rounded-xl theme-accent-bg border border-[var(--accent-core)] flex items-center justify-center text-white mb-5 shadow-[0_0_15px_var(--accent-glow)]">
              <i class="fa-solid fa-money-bill-transfer text-lg"></i>
            </div>
            
            <h3 class="text-xl font-black text-white mb-1 tracking-tight">Manual Secure Transfer</h3>
            <p class="text-sm text-[var(--text-muted)] font-medium mb-6">
              Asset: <span class="text-white">{{ targetCheckoutAsset?.title }}</span><br/>
              Total: <span class="theme-accent-text font-black tracking-wide">${{ targetCheckoutAsset?.price.toFixed(2) }}</span>
            </p>
            
            <form @submit.prevent="executeTransaction" class="space-y-4">
              <input name="name" required type="text" placeholder="Identity Vector (Full Name)" class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--accent-core)] placeholder:text-[var(--text-muted)] transition-all font-semibold" />
              
              <input name="email" required type="email" placeholder="Network Terminal (Email Address)" class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--accent-core)] placeholder:text-[var(--text-muted)] transition-all font-semibold" />
              
              <div class="bg-black/20 border border-white/10 rounded-xl p-4 transition-all focus-within:border-[var(--accent-core)]">
                <label class="block text-[10px] font-black text-white uppercase tracking-widest mb-2 opacity-80">Upload Transfer Receipt</label>
                <input name="attachment" required type="file" accept="image/png, image/jpeg, image/jpg" class="w-full text-sm text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:uppercase file:tracking-wider file:theme-accent-bg file:text-white hover:file:opacity-80 transition-all cursor-pointer" />
              </div>

              <button type="submit" :disabled="isSubmitting" class="cursor-pointer w-full py-4 rounded-xl theme-accent-bg text-white font-black text-xs tracking-widest uppercase shadow-[0_0_20px_var(--accent-glow)] hover:-translate-y-0.5 transition-all active:scale-[0.98] border-none mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <i v-if="isSubmitting" class="fa-solid fa-circle-notch fa-spin"></i>
                {{ isSubmitting ? 'Transmitting...' : 'Confirm Transfer & Secure Asset' }}
              </button>
            </form>
          </div>
        </div>
      </Transition>

      <Transition name="modal-zoom">
        <div v-if="selectedProduct" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6" @click.self="selectedProduct = null">
          <div class="glass-panel !rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative transition-all duration-500">
            
            <button @click="selectedProduct = null" class="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-full glass-button text-white/70 hover:text-white transition-all duration-300 cursor-pointer shadow-xl active:scale-90">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>

            <div class="md:w-1/2 h-72 md:h-auto bg-black relative overflow-hidden">
              <img :src="selectedProduct.image" class="w-full h-full object-cover opacity-80 scale-105 hover:scale-100 transition-transform duration-700 mix-blend-lighten" />
              <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <button @click="toggleWishlist(selectedProduct)" class="absolute top-5 left-5 w-11 h-11 rounded-full glass-button shadow-2xl flex items-center justify-center text-white/70 hover:text-red-400 transition-all duration-300 cursor-pointer active:scale-90">
                <i :class="isWishlisted(selectedProduct) ? 'fa-solid fa-heart text-red-500 text-xl animate-ping-once' : 'fa-regular fa-heart text-xl'"></i>
              </button>
            </div>
            
            <div class="md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
              <div class="flex items-center gap-2.5 mb-4">
                <span class="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest bg-black/50 px-2.5 py-1 rounded-md border border-white/10"><i :class="selectedProduct.icon" class="mr-1.5 theme-accent-text"></i>{{ selectedProduct.category }}</span>
              </div>
              
              <h2 class="text-3xl font-black text-white mb-4 tracking-tight leading-tight">{{ selectedProduct.title }}</h2>
              <p class="text-sm text-[var(--text-muted)] mb-8 leading-relaxed font-medium">{{ selectedProduct.description }}</p>
              
              <h4 class="text-[10px] font-black uppercase text-white tracking-widest mb-4 opacity-60">Architecture & Deliverables</h4>
              <ul class="space-y-3 mb-8">
                <li v-for="(feat, idx) in selectedProduct.features" :key="idx" class="flex items-start gap-3.5 text-sm text-[var(--text-primary)] font-semibold bg-black/20 p-3.5 rounded-xl border border-white/10">
                  <i class="fa-solid fa-circle-check theme-accent-text mt-0.5"></i> <span>{{ feat }}</span>
                </li>
              </ul>

              <div class="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div class="text-3xl font-black text-white tracking-tight">${{ selectedProduct.price.toFixed(2) }}</div>
                  <div class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1">Manual Transfer</div>
                </div>
                <button @click="initiateManualCheckout(selectedProduct)" class="px-8 py-4 rounded-xl theme-accent-bg text-white font-black text-sm tracking-wide shadow-[0_0_20px_var(--accent-glow)] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 cursor-pointer border-none flex items-center gap-2">
                  <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i> Secure Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="sidebar-slide">
        <div v-if="isWishlistSidebarOpen" class="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-black/40 shadow-[-30px_0_100px_rgba(0,0,0,0.8)] border-l border-white/10 flex flex-col backdrop-blur-3xl">
          <div class="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 class="font-black text-lg text-white flex items-center gap-2.5 tracking-tight">
              <i class="fa-solid fa-vault theme-accent-text drop-shadow-[0_0_8px_var(--accent-glow)]"></i> Vault Wishlist
            </h2>
            <button @click="isWishlistSidebarOpen = false" class="w-9 h-9 rounded-full glass-button text-[var(--text-muted)] hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-90"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="flex-grow overflow-y-auto p-6 flex flex-col gap-4">
            <div v-if="wishlist.length === 0" class="text-center py-32 text-[var(--text-muted)]">
              <i class="fa-solid fa-box-open text-3xl mb-4 opacity-30 animate-pulse"></i>
              <p class="font-bold text-sm tracking-tight">Vault memory banks are empty.</p>
            </div>
            
            <div v-for="item in wishlist" :key="item.id" class="glass-panel glass-panel-hover flex gap-4 p-3.5 group">
              <div class="w-20 h-20 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/10">
                <img :src="item.image" class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500 mix-blend-lighten" />
              </div>
              <div class="flex-grow flex flex-col justify-between py-0.5">
                <div>
                  <h4 class="text-sm font-black text-white line-clamp-1 group-hover:text-[var(--accent-core)] transition-colors">{{ item.title }}</h4>
                  <div class="text-xs text-[var(--text-muted)] font-bold mt-1">${{ item.price.toFixed(2) }}</div>
                </div>
                <div class="flex justify-between items-center mt-2">
                  <button @click="toggleWishlist(item)" class="text-[10px] font-black text-red-400 hover:text-red-300 cursor-pointer tracking-wider uppercase border-none bg-transparent p-0">Purge</button>
                  <button @click="initiateManualCheckout(item)" class="text-[10px] font-black theme-accent-text uppercase cursor-pointer tracking-wider flex items-center gap-1 hover:translate-x-1 transition-transform border-none bg-transparent p-0">Deploy <i class="fa-solid fa-angle-right"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <Transition name="fade">
        <div v-if="isWishlistSidebarOpen" @click="isWishlistSidebarOpen = false" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"></div>
      </Transition>

      <div class="px-4 md:px-6 pb-6">
        <footer class="glass-panel !rounded-[3rem] py-16 px-6 mt-20 max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-[var(--text-muted)]">
            <div>
              <h3 class="font-black text-white text-base tracking-tight mb-3 flex items-center gap-2">
                <div class="w-3 h-3 rounded-sm theme-accent-bg shadow-[0_0_10px_var(--accent-glow)]"></div>
                AESTHETIC<span class="theme-accent-text">.VAULT</span>
              </h3>
              <p class="text-xs font-semibold leading-relaxed max-w-xs">Engineered infrastructure helping student networks stay hyper-organized with premium asset packs.</p>
            </div>

            <div>
              <h4 class="text-[10px] font-black uppercase text-white tracking-widest mb-5 opacity-80">Store Mainframes</h4>
              <ul class="space-y-3 text-sm font-semibold">
                <li><a :href="channels.gumroad" target="_blank" class="hover:text-white transition-all flex items-center gap-2.5 group"><i class="fa-solid fa-server text-xs group-hover:text-[var(--accent-core)] bg-white/5 p-1.5 rounded-md border border-white/10"></i> Gumroad Distribution</a></li>
                <li><a :href="channels.raketph" target="_blank" class="hover:text-white transition-all flex items-center gap-2.5 group"><i class="fa-solid fa-terminal text-xs group-hover:text-[var(--accent-core)] bg-white/5 p-1.5 rounded-md border border-white/10"></i> Raket Gateway</a></li>
                <li><a :href="channels.kofi" target="_blank" class="hover:text-white transition-all flex items-center gap-2.5 group"><i class="fa-solid fa-bolt text-xs group-hover:text-[var(--accent-core)] bg-white/5 p-1.5 rounded-md border border-white/10"></i> Ko-fi Direct Feed</a></li>
              </ul>
            </div>

            <div>
              <h4 class="text-[10px] font-black uppercase text-white tracking-widest mb-5 opacity-80">Signals Protocol</h4>
              <button class="text-sm font-bold text-[var(--text-muted)] flex items-center gap-2 px-4 py-2.5">
                <i class="fa-solid fa-shield-halved text-xs"></i> Secure Protocols Active
              </button>
              <div class="mt-5 flex gap-3">
                <a :href="channels.facebook" target="_blank" class="w-10 h-10 glass-button flex items-center justify-center hover:border-blue-500 hover:text-blue-400 transition-all duration-300"><i class="fa-brands fa-facebook text-lg"></i></a>
                <a :href="channels.tiktok" target="_blank" class="w-10 h-10 glass-button flex items-center justify-center hover:border-white hover:text-white transition-all duration-300"><i class="fa-brands fa-tiktok text-lg"></i></a>
              </div>
            </div>
          </div>
        </footer>
      </div>

    </div>

    <ToastNotification :show="toastState.show" :message="toastState.message" />
  </div>
</template>

<style>
.complex-fade-in { animation: compileIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes compileIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
.card-stagger-grid > * { opacity: 0; animation: compileIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.card-stagger-grid > *:nth-child(1) { animation-delay: 100ms; }
.card-stagger-grid > *:nth-child(2) { animation-delay: 150ms; }
.card-stagger-grid > *:nth-child(3) { animation-delay: 200ms; }
.card-stagger-grid > *:nth-child(4) { animation-delay: 250ms; }
.text-reveal { animation: spread 1.2s cubic-bezier(0.16, 1, 0.3, 1) cubic-bezier(0.25, 0.46, 0.45, 0.94); }
.modal-zoom-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-zoom-leave-active { transition: all 0.25s cubic-bezier(0.36, 0.07, 0.19, 0.97); }
.modal-zoom-enter-from { opacity: 0; transform: scale(0.94); }
.modal-zoom-leave-to { opacity: 0; transform: scale(0.97); }
.sidebar-slide-enter-active, .sidebar-slide-leave-active { transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1); }
.sidebar-slide-enter-from, .sidebar-slide-leave-to { transform: translateX(100%); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.animate-ping-once { animation: heartPing 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1; }
@keyframes heartPing { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
</style>