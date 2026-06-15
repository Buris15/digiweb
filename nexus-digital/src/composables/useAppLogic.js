// src/composables/useAppLogic.js
import { ref, computed } from "vue";
import { initialProducts, initialSocialLinks } from "../productsData.js"; // Note the adjusted path (../)

export function useAppLogic() {
  // --- 1. State & Constants ---
  const products = ref(initialProducts);
  const channels = ref(initialSocialLinks);
  const fxRate = 58.4;

  const wishlist = ref([]);
  const selectedWishlistIds = ref([]);
  const isWishlistSidebarOpen = ref(false);
  const selectedProduct = ref(null);
  const searchQuery = ref("");
  const activeCategory = ref("all");
  const sortBy = ref("default");
  const isContactOpen = ref(false);
  const toastState = ref({ show: false, message: "" });

  const isCheckoutModalOpen = ref(false);
  const isSubmitting = ref(false);
  const checkoutItems = ref([]);

  const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  // --- 2. Static Data ---
  const categories = [
    { id: "all", name: "All Assets", icon: "fa-border-all" },
    { id: "templates", name: "Templates & Decks", icon: "fa-compass" },
    { id: "graphics", name: "Graphics & Art", icon: "fa-face-smile" },
    { id: "education", name: "Worksheets", icon: "fa-book-open" },
    { id: "services", name: "Custom Services", icon: "fa-wand-magic-sparkles" },
  ];

  const testimonials = ref([
    {
      id: 1,
      name: "Chloe M.",
      role: "Architecture Student",
      quote: "This Notion workspace literally saved my GPA this semester. The aesthetic is unmatched and the systems actually make sense.",
      rating: 5,
    },
    {
      id: 2,
      name: "David K.",
      role: "UX Researcher",
      quote: "Cleanest digital assets I've ever deployed. The dark mode calibration is perfect for late-night deep work sessions.",
      rating: 5,
    },
    {
      id: 3,
      name: "Sarah L.",
      role: "Content Creator",
      quote: "Finally, templates that don't look like boring spreadsheets. Dropped this into my workflow and instantly leveled up.",
      rating: 5,
    },
  ]);

  const faqs = ref([
    {
      id: 1,
      question: "Do I need a paid software account to use these?",
      answer: "Negative. All templates and vectors are fully optimized to run flawlessly on the free-tier versions of Notion, Canva, and Google Workspace.",
    },
    {
      id: 2,
      question: "How do I receive my digital files?",
      answer: "Instantly. Upon secure checkout via Gumroad or Raket, a direct payload link is dispatched immediately to your email terminal.",
    },
    {
      id: 3,
      question: "Are system updates included in the purchase?",
      answer: "Yes. Once you secure an asset, you are granted lifetime access to all future architectural updates for that specific framework.",
    },
    {
      id: 4,
      question: "Can I customize the frameworks?",
      answer: "Absolutely. The base architecture is fully unlocked. You can modify color vectors, typography, and database properties to fit your exact operational needs.",
    },
  ]);

  // --- 3. Computed Properties ---
  const filteredProducts = computed(() => {
    let output = products.value.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.value.toLowerCase());
      const matchesCategory =
        activeCategory.value === "all" || p.category === activeCategory.value;
      return matchesSearch && matchesCategory;
    });
    if (sortBy.value === "low-high") output.sort((a, b) => a.price - b.price);
    if (sortBy.value === "high-low") output.sort((a, b) => b.price - a.price);
    if (sortBy.value === "top-rated") output.sort((a, b) => b.rating - a.rating);
    return output;
  });

  const isAllSelected = computed({
    get: () => wishlist.value.length > 0 && selectedWishlistIds.value.length === wishlist.value.length,
    set: (val) => {
      selectedWishlistIds.value = val ? wishlist.value.map((p) => p.id) : [];
    },
  });

  const selectedWishlistTotal = computed(() => {
    return wishlist.value
      .filter((item) => selectedWishlistIds.value.includes(item.id))
      .reduce((sum, item) => sum + item.price, 0);
  });

  const totalCheckoutPrice = computed(() => {
    return checkoutItems.value.reduce((sum, item) => sum + item.price, 0);
  });

  // --- 4. Methods ---
  const activeFaq = ref(null);
  const toggleFaq = (id) => (activeFaq.value = activeFaq.value === id ? null : id);

  const triggerNotification = (msg) => {
    toastState.value.message = msg;
    toastState.value.show = true;
    setTimeout(() => {
      toastState.value.show = false;
    }, 3000);
  };

  const copyData = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      triggerNotification(`${type} copied to your clipboard.`);
    } catch (err) {
      triggerNotification("System Error: Unable to copy data.");
    }
  };

  const toggleWishlist = (product) => {
    const index = wishlist.value.findIndex((p) => p.id === product.id);
    if (index === -1) {
      wishlist.value.push(product);
      selectedWishlistIds.value.push(product.id);
      triggerNotification(`Saved to your digital vault.`);
    } else {
      wishlist.value.splice(index, 1);
      selectedWishlistIds.value = selectedWishlistIds.value.filter((id) => id !== product.id);
      triggerNotification(`Removed from your digital vault.`);
    }
  };

  const isWishlisted = (product) => wishlist.value.some((p) => p.id === product.id);

  const initiateManualCheckout = (product) => {
    checkoutItems.value = [product];
    isCheckoutModalOpen.value = true;
  };

  const initiateBatchCheckout = () => {
    const selected = wishlist.value.filter((item) =>
      selectedWishlistIds.value.includes(item.id)
    );
    if (selected.length === 0) {
      triggerNotification("System Error: Select item channels first.");
      return;
    }
    checkoutItems.value = selected;
    isCheckoutModalOpen.value = true;
  };

  const executeTransaction = async (event) => {
    isSubmitting.value = true;
    const form = event.target;

    const nameInput = form.name.value;
    const emailInput = form.email.value;
    const facebookInput = form.facebook.value;
    const fileInput = form.attachment.files[0];

    if (!fileInput) {
      triggerNotification("System Error: Receipt image required.");
      isSubmitting.value = false;
      return;
    }

    if (fileInput.size > 5 * 1024 * 1024) {
      triggerNotification("System Error: Image exceeds 5MB limit. Please compress.");
      isSubmitting.value = false;
      return;
    }

    try {
      triggerNotification("Encrypting receipt data...");
      const imgData = new FormData();
      imgData.append("image", fileInput);

      const imgResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: imgData,
      });

      const imgResult = await imgResponse.json();
      if (!imgResult.success) throw new Error("Image hosting rejected.");

      const receiptUrl = imgResult.data.url;

      triggerNotification("Dispatching payload to mainframe...");

      const manifestTitles = checkoutItems.value
        .map((item) => `${item.title} ($${item.price.toFixed(2)} / ₱${(item.price * fxRate).toFixed(2)})`)
        .join(", ");
      const aggregatePriceText = `$${totalCheckoutPrice.value.toFixed(2)} (₱${(totalCheckoutPrice.value * fxRate).toFixed(2)})`;

      const web3FormData = new FormData();
      web3FormData.append("access_key", WEB3FORMS_KEY);
      web3FormData.append("subject", `SYSTEM ALERT: Vault Purchase - ${checkoutItems.value.length} Frameworks`);
      web3FormData.append("from_name", "Aesthetic Vault Store");
      web3FormData.append("Buyer_Name", nameInput);
      web3FormData.append("Buyer_Email", emailInput);
      web3FormData.append("Buyer_Facebook", facebookInput);
      web3FormData.append("Requested_Asset", manifestTitles);
      web3FormData.append("Total_Price_Logged", aggregatePriceText);
      web3FormData.append("Receipt_Screenshot", receiptUrl);

      const web3Response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: web3FormData,
      });

      const web3Result = await web3Response.json();

      if (web3Result.success) {
        triggerNotification("Transfer verified. Access link will be dispatched shortly.");

        const purchasedIds = checkoutItems.value.map((item) => item.id);
        wishlist.value = wishlist.value.filter((item) => !purchasedIds.includes(item.id));
        selectedWishlistIds.value = selectedWishlistIds.value.filter((id) => !purchasedIds.includes(id));

        isCheckoutModalOpen.value = false;
        checkoutItems.value = [];
        form.reset();
      } else {
        triggerNotification("System Error: Form rejected.");
      }
    } catch (error) {
      console.error(error);
      triggerNotification("Critical Error: Connection lost.");
    } finally {
      isSubmitting.value = false;
    }
  };

  // --- 5. Return Everything to App.vue ---
  return {
    products, channels, fxRate, wishlist, selectedWishlistIds,
    isWishlistSidebarOpen, selectedProduct, searchQuery,
    activeCategory, sortBy, isContactOpen, toastState,
    isCheckoutModalOpen, isSubmitting, checkoutItems,
    categories, testimonials, faqs, activeFaq,
    filteredProducts, isAllSelected, selectedWishlistTotal, totalCheckoutPrice,
    toggleFaq, triggerNotification, copyData, toggleWishlist,
    isWishlisted, initiateManualCheckout, initiateBatchCheckout, executeTransaction
  };
}