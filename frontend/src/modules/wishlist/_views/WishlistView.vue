<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <main class="flex-1 pt-24 px-6 max-w-7xl mx-auto mb-24 w-full">
    <BreadcrumbNav :crumbs="[
      { label: 'Home', to: '/' },
      { label: 'Wishlist', to: '/wishlist' },
    ]" class="mb-4" />

    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl text-primary font-bold">
        My Wishlist
      </h1>

      <button
        v-if="wishlist.items.length > 0"
        @click="openClearAllModal"
        class="text-sm text-red-500 hover:underline
        hover:font-bold hover:text-red-600 transition-all
        duration-300 ease-out"
      >
        Clear all
      </button>
    </div>

    <!-- Empty state -->
    <StateView
      v-if="!wishlist.loading && wishlist.items.length === 0"
      icon="wishlist"
      title="Your wishlist is empty"
      subtitle="Save products you love for later."
      action-to="/products"
      action-text="Browse Products"
    />

    <!-- Loading state -->
    <SkeletonLoader v-else-if="wishlist.loading" variant="grid" :count="3" />

    <!-- Wishlist grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
    >
      <RouterLink
        v-for="product in wishlist.items"
        :key="product.id"
        :to="`/products/${product.id}`"
        class="group bg-[#111111] rounded-2xl p-5 border-3 border-primary/6 hover:border-primary/10 transition-all
        duration-400 ease-out cursor-pointer"
      >
        <!-- Image -->
        <div class="h-44 flex items-center justify-center mb-4 bg-white rounded-xl p-4">
          <img
            :src="product.imageUrl"
            alt=""
            class="max-h-full object-contain group-hover:scale-110 transition-all
            duration-400 ease-out"
          />
        </div>

        <!-- Info -->
        <div class="space-y-1">
          <p class="font-semibold text-lg line-clamp-2">
            {{ product.name }}
          </p>

          <p class="text-primary font-bold text-xl">
            ${{ Number(product.finalPrice ?? product.price).toFixed(2) }}
          </p>
        </div>

        <!-- Actions -->
        <div class="mt-5 flex items-center justify-end gap-3">
          <button
            @click.prevent="openRemoveModal(product.id)"
            class="border border-red-500 text-red-500
            px-4 py-2 rounded-xl
            flex items-center gap-2
          hover:bg-red-500/10
            active:scale-[0.98]
            transition"
          >
            <Trash2 class="w-4 h-4" />
            Remove
          </button>
        </div>
      </RouterLink>
    </div>
    </main>

    <Footer />

    <!-- Confirm Modal -->
    <ConfirmModal
      :is-open="modal.isOpen"
      :type="modal.type"
      :title="modal.title"
      :message="modal.message"
      :confirm-text="modal.confirmText"
      :cancel-text="modal.cancelText"
      :loading="modal.loading"
      @confirm="handleConfirm"
      @cancel="closeModal"
    />
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useWishlistStore } from '../_stores/wishlist.store';
import Navbar from '@/components/Navbar.vue';
import BreadcrumbNav from '@/components/BreadcrumbNav.vue';
import Footer from '@/components/Footer.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import { Trash2 } from 'lucide-vue-next';
import StateView from '@/components/StateView.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';

const wishlist = useWishlistStore();

// Fetch fresh product data on mount
onMounted(() => {
  wishlist.refreshProducts();
});

// Modal state
const modal = reactive({
  isOpen: false,
  type: 'danger',
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  loading: false,
  action: null, // 'clearAll' or 'remove'
  productId: null // For remove action
});

// Open modal for clearing all items
const openClearAllModal = () => {
  modal.isOpen = true;
  modal.type = 'warning';
  modal.title = 'Clear Wishlist';
  modal.message = `Are you sure you want to remove all ${wishlist.items.length} item${wishlist.items.length > 1 ? 's' : ''} from your wishlist? This action cannot be undone.`;
  modal.confirmText = 'Clear All';
  modal.cancelText = 'Cancel';
  modal.action = 'clearAll';
  modal.productId = null;
};

// Open modal for removing a single item
const openRemoveModal = (productId) => {
  modal.isOpen = true;
  modal.type = 'danger';
  modal.title = 'Remove from Wishlist';
  modal.message = 'Are you sure you want to remove this item from your wishlist?';
  modal.confirmText = 'Remove';
  modal.cancelText = 'Cancel';
  modal.action = 'remove';
  modal.productId = productId;
};

// Handle confirm action
const handleConfirm = async () => {
  modal.loading = true;

  try {
    if (modal.action === 'clearAll') {
      await wishlist.clearAll();
    } else if (modal.action === 'remove' && modal.productId) {
      await wishlist.remove(modal.productId);
    }
  } finally {
    modal.loading = false;
    closeModal();
  }
};

// Close modal
const closeModal = () => {
  modal.isOpen = false;
  modal.action = null;
  modal.productId = null;
};
</script>
