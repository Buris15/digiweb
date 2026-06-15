<script setup>
// src/App.vue
import { ref } from "vue"; // Added ref import
import ProductCard from "./components/ProductCard.vue";
import ToastNotification from "./components/ToastNotification.vue";
import AboutView from "./components/AboutView.vue";       // NEW
import ContactView from "./components/ContactView.vue";   // NEW
import { useAppLogic } from "./composables/useAppLogic.js";

// Page State Routing
const activePage = ref("home");

// Destructure everything you need to use in your <template>
const {
  products, channels, fxRate, wishlist, selectedWishlistIds,
  isWishlistSidebarOpen, selectedProduct, searchQuery,
  activeCategory, sortBy, isContactOpen, toastState,
  isCheckoutModalOpen, isSubmitting, checkoutItems,
  categories, testimonials, faqs, activeFaq,
  filteredProducts, isAllSelected, selectedWishlistTotal, totalCheckoutPrice,
  toggleFaq, triggerNotification, copyData, toggleWishlist,
  isWishlisted, initiateManualCheckout, initiateBatchCheckout, executeTransaction
} = useAppLogic();
</script>

<template>
  <div class="min-h-screen relative pb-10 font-sans">
    <div class="animated-bg"></div>

    <ToastNotification 
      v-if="toastState.show" 
      :message="toastState.message" 
      class="fixed top-5 left-1/2 -translate-x-1/2 z-[100]"
    />

    <div class="relative z-10 complex-fade-in">
      <div class="px-4 md:px-6 pt-4">
        <header
          class="sticky top-4 z-40 max-w-7xl mx-auto glass-panel backdrop-blur-xl bg-black/40 !rounded-[2rem] px-6 py-4 flex justify-between items-center shadow-lg"
        >
          <div @click="activePage = 'home'" class="flex items-center gap-3 group cursor-pointer" aria-label="Home">
            <div
              class="w-4 h-4 rounded-md theme-accent-bg rotate-12 transition-transform duration-500 group-hover:rotate-[225deg] shadow-[0_0_15px_var(--accent-glow)]"
            ></div>
            <span
              class="font-black tracking-tight text-lg text-white transition-all duration-300 group-hover:tracking-widest hidden sm:block"
            >
              AESTHETIC<span
                class="text-[var(--text-muted)] group-hover:text-[var(--accent-core)] transition-colors duration-300 font-normal"
                >.VAULT</span
              >
            </span>
          </div>

          <!-- NEW NAVIGATION MENU -->
          <nav class="flex items-center gap-4 sm:gap-8 font-black text-[10px] md:text-xs uppercase tracking-widest">
            <button 
              @click="activePage = 'home'" 
              :class="activePage === 'home' ? 'text-white drop-shadow-[0_0_8px_var(--accent-glow)]' : 'text-[var(--text-muted)] hover:text-white'"
              class="transition-all duration-300 outline-none focus-visible:text-white border-none bg-transparent cursor-pointer"
            >
              System
            </button>
            <button 
              @click="activePage = 'about'" 
              :class="activePage === 'about' ? 'text-white drop-shadow-[0_0_8px_var(--accent-glow)]' : 'text-[var(--text-muted)] hover:text-white'"
              class="transition-all duration-300 outline-none focus-visible:text-white border-none bg-transparent cursor-pointer"
            >
              About
            </button>
            <button 
              @click="activePage = 'contact'" 
              :class="activePage === 'contact' ? 'text-white drop-shadow-[0_0_8px_var(--accent-glow)]' : 'text-[var(--text-muted)] hover:text-white'"
              class="transition-all duration-300 outline-none focus-visible:text-white border-none bg-transparent cursor-pointer"
            >
              Comms
            </button>
          </nav>

          <div class="flex items-center gap-4">
            <div
              class="hidden lg:flex items-center gap-5 text-[var(--text-muted)]"
            >
              <a
                :href="channels.tiktok"
                target="_blank"
                aria-label="Visit our TikTok"
                class="hover:text-white hover:scale-110 focus-visible:text-white transform transition-all duration-300 outline-none"
                ><i class="fa-brands fa-tiktok text-base"></i
              ></a>
              <a
                :href="channels.facebook"
                target="_blank"
                aria-label="Visit our Facebook"
                class="hover:text-[#0099ff] hover:scale-110 focus-visible:text-[#0099ff] transform transition-all duration-300 outline-none"
                ><i class="fa-brands fa-facebook text-base"></i
              ></a>
              <div class="w-[1px] h-4 bg-white/10"></div>
            </div>

            <button
              @click="isWishlistSidebarOpen = true"
              aria-label="Open Wishlist"
              class="cursor-pointer text-[var(--text-muted)] hover:text-red-400 p-2 transition-all duration-300 relative hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded-full bg-transparent border-none"
            >
              <i
                class="fa-solid fa-heart text-xl transition-transform duration-300 hover:rotate-12"
              ></i>
              <span
                v-if="wishlist.length > 0"
                class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[9px] font-black flex items-center justify-center rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]"
              >
                {{ wishlist.length }}
              </span>
            </button>
          </div>
        </header>
      </div>

      <main class="max-w-7xl mx-auto px-4 md:px-6 mt-12">
        
        <!-- HOME PAGE RENDER -->
        <div v-show="activePage === 'home'">
          <section
            class="glass-panel !rounded-[2rem] p-6 md:p-12 lg:p-16 mb-16 relative overflow-hidden group"
          >
            <div
              class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 relative z-10"
            >
              <div class="max-w-2xl text-reveal">
                <h1
                  class="text-3xl md:text-6xl font-black tracking-tight mb-5 text-white leading-[1.1]"
                >
                  Systematic Tools to <br />
                  <span
                    class="bg-clip-text text-transparent bg-gradient-to-r from-[#0099ff] to-cyan-200 drop-shadow-[0_2px_20px_var(--accent-glow)]"
                    >Organize</span
                  >
                  Your Term.
                </h1>
                <p
                  class="text-[var(--text-muted)] text-sm md:text-base font-medium leading-relaxed max-w-lg"
                >
                  Premium obsidian-dark templates, layouts, and workspace dynamics
                  structured specifically for high-achieving student creators.
                </p>
              </div>

              <div class="flex w-full lg:w-auto gap-4 flex-wrap sm:flex-nowrap">
                <div
                  class="flex items-center glass-button px-4 flex-grow lg:w-72 focus-within:ring-2 focus-within:ring-[var(--accent-core)] transition-all duration-500 !bg-black/20"
                >
                  <i
                    class="fa-solid fa-magnifying-glass text-[var(--text-muted)] text-xs"
                  ></i>
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Query active vectors..."
                    class="w-full bg-transparent py-3.5 px-3 text-sm text-white outline-none placeholder:text-[var(--text-muted)] font-medium border-none shadow-none"
                  />
                </div>

                <select
                  v-model="sortBy"
                  aria-label="Sort products"
                  class="w-full sm:w-auto glass-button px-5 py-3.5 text-sm font-bold text-white outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--accent-core)] transition-all duration-500 appearance-none !bg-black/20"
                >
                  <option value="default" class="bg-black">
                    System Featured
                  </option>
                  <option value="top-rated" class="bg-black">
                    Highest Rated
                  </option>
                  <option value="low-high" class="bg-black">
                    Price: Ascending
                  </option>
                  <option value="high-low" class="bg-black">
                    Price: Descending
                  </option>
                </select>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 md:gap-3 mt-12 relative z-10">
              <button
                v-for="cat in categories"
                :key="cat.id"
                @click="activeCategory = cat.id"
                :aria-pressed="activeCategory === cat.id"
                :class="[
                  'px-4 py-3 rounded-xl text-[11px] md:text-xs font-black tracking-wider uppercase transition-all duration-500 cursor-pointer flex items-center gap-2.5 transform active:scale-95 border-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-core)] focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                  activeCategory === cat.id
                    ? 'theme-accent-bg text-white shadow-[0_0_25px_var(--accent-glow)]'
                    : 'glass-button text-[var(--text-muted)] hover:text-white',
                ]"
              >
                <i
                  :class="
                    (['fa-solid', cat.icon],
                    activeCategory === cat.id ? 'animate-bounce' : '')
                  "
                ></i>
                {{ cat.name }}
              </button>
            </div>
          </section>

          <section
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 card-stagger-grid"
          >
            <ProductCard
              v-for="prod in filteredProducts"
              :key="prod.id"
              :product="prod"
              :fxRate="fxRate"
              :isWishlisted="isWishlisted(prod)"
              @toggleWishlist="toggleWishlist"
              @buy="initiateManualCheckout"
              @quickView="selectedProduct = $event"
              class="glass-panel glass-panel-hover overflow-hidden"
            />
          </section>

          <div
            v-if="filteredProducts.length === 0"
            class="w-full text-center py-24 md:py-32 glass-panel border-dashed mt-8 transition-opacity duration-500"
          >
            <i
              class="fa-solid fa-shapes text-4xl text-[var(--text-muted)] mb-4 animate-pulse"
            ></i>
            <p class="text-[var(--text-muted)] font-bold tracking-tight">
              No active vectors matching your search criteria.
            </p>
          </div>

          <section class="mt-24 md:mt-32 mb-20 relative z-10 complex-fade-in">
            <div class="text-center mb-12">
              <h2
                class="text-2xl md:text-3xl font-black text-white tracking-tight mb-3"
              >
                System <span class="theme-accent-text">Feedback</span>
              </h2>
              <p class="text-[var(--text-muted)] text-xs md:text-sm font-medium">
                Data logs from active operators using our frameworks.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                v-for="review in testimonials"
                :key="review.id"
                class="glass-panel glass-panel-hover p-6 md:p-8 group relative cursor-default"
              >
                <i
                  class="fa-solid fa-quote-right absolute top-6 right-6 text-4xl text-white/5 group-hover:text-[var(--accent-core)] transition-colors duration-500"
                ></i>
                <div class="flex gap-1 mb-4 md:mb-6">
                  <i
                    v-for="n in review.rating"
                    :key="n"
                    class="fa-solid fa-star text-amber-400 text-xs drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                  ></i>
                </div>
                <p
                  class="text-[var(--text-primary)] text-xs md:text-sm leading-relaxed mb-6 md:mb-8 font-medium italic relative z-10"
                >
                  "{{ review.quote }}"
                </p>
                <div
                  class="flex items-center gap-4 border-t border-white/10 pt-5"
                >
                  <div
                    class="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white font-black text-xs shadow-inner"
                  >
                    {{ review.name.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="text-white text-xs font-black tracking-wide">
                      {{ review.name }}
                    </h4>
                    <p
                      class="theme-accent-text text-[10px] font-bold uppercase tracking-widest"
                    >
                      {{ review.role }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            class="mt-20 mb-10 max-w-3xl mx-auto relative z-10 complex-fade-in"
          >
            <div class="text-center mb-10">
              <h2
                class="text-2xl md:text-3xl font-black text-white tracking-tight mb-3"
              >
                Protocol <span class="theme-accent-text">Inquiries</span>
              </h2>
              <p class="text-[var(--text-muted)] text-xs md:text-sm font-medium">
                Frequently accessed data files.
              </p>
            </div>

            <div class="space-y-4">
              <div
                v-for="faq in faqs"
                :key="faq.id"
                class="glass-panel overflow-hidden transition-all duration-500"
                :class="
                  activeFaq === faq.id
                    ? 'border-[var(--accent-core)]/50 shadow-[0_0_30px_var(--accent-glow)]'
                    : ''
                "
              >
                <button
                  @click="toggleFaq(faq.id)"
                  :aria-expanded="activeFaq === faq.id"
                  class="w-full text-left px-6 py-5 flex items-center justify-between cursor-pointer focus:outline-none focus-visible:bg-white/5 group border-none shadow-none transition-colors"
                >
                  <span
                    class="text-xs md:text-sm font-bold text-white group-hover:text-[var(--accent-core)] transition-colors pr-8"
                  >
                    {{ faq.question }}
                  </span>
                  <div
                    class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[var(--accent-core)] transition-all flex-shrink-0"
                  >
                    <i
                      class="fa-solid fa-chevron-down text-[var(--text-muted)] transition-transform duration-500"
                      :class="
                        activeFaq === faq.id ? 'rotate-180 theme-accent-text' : ''
                      "
                    ></i>
                  </div>
                </button>
                <div
                  class="grid transition-all duration-500 ease-in-out"
                  :style="{
                    gridTemplateRows: activeFaq === faq.id ? '1fr' : '0fr',
                  }"
                >
                  <div class="overflow-hidden">
                    <p
                      class="px-6 pb-6 text-xs md:text-sm text-[var(--text-muted)] font-medium leading-relaxed border-t border-white/10 pt-4 mt-2"
                    >
                      {{ faq.answer }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- NEW ABOUT PAGE -->
        <AboutView v-if="activePage === 'about'" />

        <!-- NEW CONTACT PAGE -->
        <ContactView v-if="activePage === 'contact'" @trigger-notification="triggerNotification" />

      </main>

      <!-- CHECKOUT MODAL LOGIC STAYS HERE (UNCHANGED) -->
      <Transition name="modal-zoom">
        <div
          v-if="isCheckoutModalOpen"
          @click.self="isCheckoutModalOpen = false"
          class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          role="dialog"
          aria-modal="true"
        >
          <div
            class="glass-panel w-full max-w-md !rounded-[2rem] p-6 md:p-8 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-[95vh] overflow-y-auto cursor-default"
          >
            <button
              @click="isCheckoutModalOpen = false"
              aria-label="Close Checkout"
              class="cursor-pointer absolute top-5 right-5 text-[var(--text-muted)] hover:text-white rounded-full w-8 h-8 flex items-center justify-center transition-all active:scale-90 border-none bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>

            <div
              class="w-12 h-12 rounded-xl theme-accent-bg border border-[var(--accent-core)] flex items-center justify-center text-white mb-5 shadow-[0_0_15px_var(--accent-glow)]"
            >
              <i class="fa-solid fa-money-bill-transfer text-lg"></i>
            </div>

            <h3 class="text-xl font-black text-white mb-4 tracking-tight">
              Manual Secure Transfer
            </h3>

            <div class="bg-black/40 border border-[var(--accent-core)]/50 rounded-xl p-4 mb-5 shadow-[0_0_15px_rgba(0,153,255,0.1)]">
              <p class="text-[10px] font-black text-[var(--accent-core)] uppercase tracking-widest mb-3 text-center">
                Transfer Destination
              </p>
              <div class="space-y-2 text-sm font-bold text-white">
                <div 
                  @click="copyData('09123456789', 'GCash Number')"
                  class="flex justify-between items-center bg-black/60 px-4 py-2.5 rounded-lg border border-white/5 hover:border-[#007CF8]/50 transition-colors cursor-pointer group"
                >
                  <span class="text-[#007CF8] flex items-center gap-2"><i class="fa-solid fa-wallet"></i> GCash</span>
                  <div class="flex items-center gap-2">
                    <span class="tracking-wider group-hover:text-[#007CF8] transition-colors">0912 345 6789</span>
                    <i class="fa-regular fa-copy text-[var(--text-muted)] group-hover:text-[#007CF8] transition-colors text-xs"></i>
                  </div>
                </div>
                <div 
                  @click="copyData('your@email.com', 'PayPal Address')"
                  class="flex justify-between items-center bg-black/60 px-4 py-2.5 rounded-lg border border-white/5 hover:border-[#003087]/50 transition-colors cursor-pointer group"
                >
                  <span class="text-[#003087] flex items-center gap-2"><i class="fa-brands fa-paypal"></i> PayPal</span>
                  <div class="flex items-center gap-2">
                    <span class="tracking-wider text-xs group-hover:text-[#003087] transition-colors">your@email.com</span>
                    <i class="fa-regular fa-copy text-[var(--text-muted)] group-hover:text-[#003087] transition-colors text-xs"></i>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="text-xs text-[var(--text-muted)] bg-black/30 border border-white/10 rounded-xl p-4 max-h-40 overflow-y-auto mb-6 space-y-2 custom-scrollbar"
            >
              <div
                class="text-[9px] font-black tracking-widest text-white uppercase opacity-50 mb-1"
              >
                Items Terminal
              </div>
              <div
                v-for="item in checkoutItems"
                :key="item.id"
                class="flex justify-between items-center border-b border-white/5 pb-1 text-white gap-4"
              >
                <span
                  class="truncate max-w-[160px] sm:max-w-[220px] font-medium"
                  >• {{ item.title }}</span
                >
                <span
                  class="font-bold text-[var(--accent-core)] text-right shrink-0"
                >
                  ${{ item.price.toFixed(2) }}
                  <span class="text-[10px] text-[var(--text-muted)] block"
                    >₱{{ (item.price * fxRate).toFixed(2) }}</span
                  >
                </span>
              </div>
              <div
                class="flex justify-between items-center text-xs pt-2 font-black text-white border-t border-white/10"
              >
                <span>Aggregate Total:</span>
                <span class="theme-accent-text text-right shrink-0">
                  ${{ totalCheckoutPrice.toFixed(2) }}
                  <span class="text-[11px] text-white/60 block font-medium"
                    >₱{{ (totalCheckoutPrice * fxRate).toFixed(2) }}</span
                  >
                </span>
              </div>
            </div>

            <form @submit.prevent="executeTransaction" class="space-y-4">
              <input
                name="name"
                required
                type="text"
                placeholder="Identity Vector (Full Name)"
                class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-core)] placeholder:text-[var(--text-muted)] transition-all font-semibold"
              />
              <input
                name="email"
                required
                type="email"
                placeholder="Network Terminal (Email Address)"
                class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-core)] placeholder:text-[var(--text-muted)] transition-all font-semibold"
              />
              <input
                name="facebook"
                required
                type="text"
                placeholder="Social Comm Link (Facebook URL)"
                class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-core)] placeholder:text-[var(--text-muted)] transition-all font-semibold"
              />
              <div
                class="bg-black/20 border border-dashed border-white/20 hover:border-[var(--accent-core)] rounded-xl p-6 text-center transition-all focus-within:border-[var(--accent-core)] focus-within:border-solid relative group"
              >
                <i class="fa-solid fa-cloud-arrow-up text-2xl text-[var(--text-muted)] group-hover:text-[var(--accent-core)] mb-2 transition-colors"></i>
                <label
                  class="block text-xs font-bold text-white tracking-wide mb-1 cursor-pointer"
                  >Upload Transfer Receipt</label
                >
                <span class="text-[10px] text-[var(--text-muted)] block mb-4">PNG, JPG up to 5MB</span>
                <input
                  name="attachment"
                  required
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div class="mx-auto w-max px-4 py-2 rounded-lg bg-white/10 text-[10px] font-black uppercase tracking-wider text-white group-hover:bg-[var(--accent-core)] transition-colors pointer-events-none">
                  Select File
                </div>
              </div>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="cursor-pointer w-full py-4 rounded-xl theme-accent-bg text-white font-black text-xs tracking-widest uppercase shadow-[0_0_20px_var(--accent-glow)] hover:-translate-y-0.5 transition-all active:scale-[0.98] border-none mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-[var(--accent-core)]"
              >
                <i
                  v-if="isSubmitting"
                  class="fa-solid fa-circle-notch fa-spin"
                ></i>
                {{
                  isSubmitting
                    ? "Transmitting..."
                    : "Confirm Transfer & Secure Asset"
                }}
              </button>
            </form>
          </div>
        </div>
      </Transition>

      <!-- QUICK VIEW MODAL LOGIC STAYS HERE (UNCHANGED) -->
      <Transition name="modal-zoom">
        <div
          v-if="selectedProduct"
          class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 cursor-pointer"
          @click.self="selectedProduct = null"
          role="dialog"
          aria-modal="true"
        >
          <div
            class="glass-panel !rounded-[2rem] w-full max-w-4xl max-h-[92vh] md:max-h-[90vh] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row relative transition-all duration-500 cursor-default"
          >
            <button
              @click="selectedProduct = null"
              aria-label="Close Preview"
              class="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-full glass-button text-white/70 hover:text-white transition-all duration-300 cursor-pointer shadow-xl active:scale-90 outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
            <div
              class="w-full md:w-1/2 h-64 md:h-auto bg-black relative overflow-hidden flex-shrink-0 group"
            >
              <img
                :src="selectedProduct.image"
                :alt="selectedProduct.title"
                class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 mix-blend-lighten"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
              ></div>
              <button
                @click="toggleWishlist(selectedProduct)"
                aria-label="Toggle Wishlist"
                class="absolute top-5 left-5 w-11 h-11 rounded-full glass-button shadow-2xl flex items-center justify-center text-white/70 hover:text-red-400 transition-all duration-300 cursor-pointer active:scale-90 outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <i
                  :class="
                    isWishlisted(selectedProduct)
                      ? 'fa-solid fa-heart text-red-500 text-xl'
                      : 'fa-regular fa-heart text-xl'
                  "
                ></i>
              </button>
            </div>
            <div
              class="w-full md:w-1/2 p-6 md:p-12 flex flex-col overflow-y-auto custom-scrollbar"
            >
              <div class="flex items-center gap-2.5 mb-4">
                <span
                  class="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest bg-black/50 px-2.5 py-1 rounded-md border border-white/10"
                  ><i
                    :class="selectedProduct.icon"
                    class="mr-1.5 theme-accent-text"
                  ></i
                  >{{ selectedProduct.category }}</span
                >
              </div>
              <h2
                class="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight leading-tight"
              >
                {{ selectedProduct.title }}
              </h2>
              <p
                class="text-xs md:text-sm text-[var(--text-muted)] mb-6 md:mb-8 leading-relaxed font-medium"
              >
                {{ selectedProduct.description }}
              </p>
              <h4
                class="text-[10px] font-black uppercase text-white tracking-widest mb-4 opacity-60"
              >
                Architecture & Deliverables
              </h4>
              <ul class="space-y-3 mb-8">
                <li
                  v-for="(feat, idx) in selectedProduct.features"
                  :key="idx"
                  class="flex items-start gap-3.5 text-xs md:text-sm text-[var(--text-primary)] font-semibold bg-black/20 p-3.5 rounded-xl border border-white/10"
                >
                  <i
                    class="fa-solid fa-circle-check theme-accent-text mt-0.5"
                  ></i>
                  <span>{{ feat }}</span>
                </li>
              </ul>
              <div
                class="mt-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div
                    class="text-2xl md:text-3xl font-black text-white tracking-tight flex flex-wrap items-baseline gap-2"
                  >
                    <span>${{ selectedProduct.price.toFixed(2) }}</span>
                    <span class="text-sm md:text-base text-white/50 font-bold"
                      >/ ₱{{
                        (selectedProduct.price * fxRate).toFixed(2)
                      }}</span
                    >
                  </div>
                  <div
                    class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1"
                  >
                    Direct Payload Gateway
                  </div>
                </div>
                <button
                  @click="initiateManualCheckout(selectedProduct)"
                  class="w-full sm:w-auto px-8 py-4 rounded-xl theme-accent-bg text-white font-black text-sm tracking-wide shadow-[0_0_20px_var(--accent-glow)] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 cursor-pointer border-none flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-core)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                  Secure Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- WISHLIST SIDEBAR LOGIC STAYS HERE (UNCHANGED) -->
      <Transition name="sidebar-slide">
        <div
          v-if="isWishlistSidebarOpen"
          class="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-black/40 shadow-[-30px_0_100px_rgba(0,0,0,0.8)] border-l border-white/10 flex flex-col backdrop-blur-3xl"
        >
          <div
            class="p-6 border-b border-white/10 flex justify-between items-center"
          >
            <h2
              class="font-black text-lg text-white flex items-center gap-2.5 tracking-tight"
            >
              <i
                class="fa-solid fa-vault theme-accent-text drop-shadow-[0_0_8px_var(--accent-glow)]"
              ></i>
              Vault Wishlist
            </h2>
            <button
              @click="isWishlistSidebarOpen = false"
              aria-label="Close Wishlist"
              class="w-9 h-9 rounded-full glass-button text-[var(--text-muted)] hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-90 outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div
            v-if="wishlist.length > 0"
            class="mx-6 mt-4 flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3"
          >
            <label
              class="flex items-center gap-3 cursor-pointer text-xs font-bold text-white select-none"
            >
              <input
                type="checkbox"
                v-model="isAllSelected"
                class="w-4 h-4 rounded border-white/20 bg-black/40 text-[var(--accent-core)] checked:bg-[var(--accent-core)] focus:ring-[var(--accent-core)] cursor-pointer transition-all"
              />
              Select All Assets
            </label>
            <span
              class="text-[10px] text-[var(--text-muted)] font-black tracking-widest uppercase"
            >
              {{ selectedWishlistIds.length }} / {{ wishlist.length }} Selected
            </span>
          </div>
          <div class="flex-grow overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
            <div
              v-if="wishlist.length === 0"
              class="text-center py-32 text-[var(--text-muted)]"
            >
              <i
                class="fa-solid fa-box-open text-3xl mb-4 opacity-30 animate-pulse"
              ></i>
              <p class="font-bold text-sm tracking-tight">
                Vault memory banks are empty.
              </p>
            </div>
            <div
              v-for="item in wishlist"
              :key="item.id"
              class="glass-panel glass-panel-hover flex gap-4 p-3.5 group items-center"
            >
              <input
                type="checkbox"
                :value="item.id"
                v-model="selectedWishlistIds"
                class="w-4 h-4 rounded border-white/20 bg-black/40 text-[var(--accent-core)] checked:bg-[var(--accent-core)] focus:ring-[var(--accent-core)] cursor-pointer flex-shrink-0 transition-all"
              />
              <div
                class="w-16 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/10"
              >
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500 mix-blend-lighten"
                />
              </div>
              <div
                class="flex-grow flex flex-col justify-between py-0.5 min-w-0"
              >
                <div>
                  <h4
                    class="text-sm font-black text-white truncate group-hover:text-[var(--accent-core)] transition-colors"
                  >
                    {{ item.title }}
                  </h4>
                  <div
                    class="text-xs text-[var(--text-muted)] font-bold mt-1 flex items-center gap-1.5 flex-wrap"
                  >
                    <span>${{ item.price.toFixed(2) }}</span>
                    <span class="text-[11px] opacity-60"
                      >/ ₱{{ (item.price * fxRate).toFixed(2) }}</span
                    >
                  </div>
                </div>
                <div class="flex justify-between items-center mt-2">
                  <button
                    @click="toggleWishlist(item)"
                    class="text-[10px] font-black text-red-400 hover:text-red-300 cursor-pointer tracking-wider uppercase border-none bg-transparent p-0 outline-none focus-visible:underline"
                  >
                    Purge
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="wishlist.length > 0"
            class="p-6 border-t border-white/10 bg-black/30 backdrop-blur-md"
          >
            <div class="flex justify-between items-center mb-4 gap-4">
              <span
                class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider"
                >Bundle Total</span
              >
              <span
                class="theme-accent-text font-black text-lg md:text-xl text-right"
              >
                ${{ selectedWishlistTotal.toFixed(2) }}
                <span class="text-xs text-white/50 block font-semibold"
                  >₱{{ (selectedWishlistTotal * fxRate).toFixed(2) }}</span
                >
              </span>
            </div>
            <button
              @click="initiateBatchCheckout"
              :disabled="selectedWishlistIds.length === 0"
              class="w-full py-4 rounded-xl theme-accent-bg text-white font-black text-xs tracking-widest uppercase shadow-[0_0_20px_var(--accent-glow)] transition-all active:scale-[0.98] border-none disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-core)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <i class="fa-solid fa-cart-shopping"></i> Checkout Selected ({{
                selectedWishlistIds.length
              }})
            </button>
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <div
          v-if="isWishlistSidebarOpen"
          @click="isWishlistSidebarOpen = false"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        ></div>
      </Transition>

      <div class="px-4 md:px-6 pb-6">
        <footer
          class="glass-panel !rounded-[3rem] py-16 px-6 mt-20 max-w-7xl mx-auto"
        >
          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-12 text-[var(--text-muted)]"
          >
            <div>
              <h3
                class="font-black text-white text-base tracking-tight mb-3 flex items-center gap-2"
              >
                <div
                  class="w-3 h-3 rounded-sm theme-accent-bg shadow-[0_0_10px_var(--accent-glow)]"
                ></div>
                AESTHETIC<span class="theme-accent-text">.VAULT</span>
              </h3>
              <p class="text-xs font-semibold leading-relaxed max-w-xs">
                Engineered infrastructure helping student networks stay
                hyper-organized with premium asset packs.
              </p>
            </div>
            <div>
              <h4
                class="text-[10px] font-black uppercase text-white tracking-widest mb-5 opacity-80"
              >
                Store Mainframes
              </h4>
              <ul class="space-y-3 text-sm font-semibold">
                <li>
                  <a
                    :href="channels.gumroad"
                    target="_blank"
                    class="hover:text-white transition-all flex items-center gap-2.5 group outline-none focus-visible:text-white"
                    ><i
                      class="fa-solid fa-server text-xs group-hover:text-[var(--accent-core)] bg-white/5 p-1.5 rounded-md border border-white/10"
                    ></i>
                    Gumroad Distribution</a
                  >
                </li>
                <li>
                  <a
                    :href="channels.raketph"
                    target="_blank"
                    class="hover:text-white transition-all flex items-center gap-2.5 group outline-none focus-visible:text-white"
                    ><i
                      class="fa-solid fa-terminal text-xs group-hover:text-[var(--accent-core)] bg-white/5 p-1.5 rounded-md border border-white/10"
                    ></i>
                    Raket Gateway</a
                  >
                </li>
                <li>
                  <a
                    :href="channels.kofi"
                    target="_blank"
                    class="hover:text-white transition-all flex items-center gap-2.5 group outline-none focus-visible:text-white"
                    ><i
                      class="fa-solid fa-bolt text-xs group-hover:text-[var(--accent-core)] bg-white/5 p-1.5 rounded-md border border-white/10"
                    ></i>
                    Ko-fi Terminal</a
                  >
                </li>
              </ul>
            </div>
            <div>
              <h4
                class="text-[10px] font-black uppercase text-white tracking-widest mb-5 opacity-80"
              >
                System Protection
              </h4>
              <p class="text-xs font-semibold leading-relaxed mb-2">
                All assets are encrypted. Unauthorized distribution or
                reproduction compromises token license access codes.
              </p>
              <span class="text-[10px] text-white/30 font-bold font-mono"
                >© 2026 AESTHETIC.VAULT // ALL RIGHTS RESERVED</span
              >
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>