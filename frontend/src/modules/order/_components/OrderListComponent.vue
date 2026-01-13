<template>
  <div class="bg-white rounded-lg shadow-sm p-6 mx-auto mt-4" style="max-width:1500px">
    <!-- Table header -->
    <div class="hidden md:grid grid-cols-12 gap-5 items-center text-lg text-primary font-semibold mb-4">
      <div class="col-span-4">Product</div>
      <div class="col-span-3">Address</div>
      <div class="col-span-1 text-center">Quantity</div>
      <div class="col-span-1 text-center">Total Price</div>
      <div class="col-span-2 text-center">Date</div>
      <div class="col-span-1 text-center">Status</div>
    </div>

    <!-- Items (no divider) -->
    <div class="space-y-6">
      <div
        v-for="order in orders"
        :key="order.id"
        class="grid grid-cols-12 items-center gap-5 py-4"
      >
        <!-- Product -->
        <div class="col-span-12 md:col-span-4 flex items-center gap-5">
          <img :src="order.product.image" alt="product" class="w-20 h-20 rounded-md object-cover shadow-sm" />
          <div>
            <div class="text-primary font-semibold text-lg">{{ order.product.name }}</div>
            <div class="text-sm text-slate-400">{{ order.product.subtitle }}</div>
            <div class="text-base text-primary font-semibold mt-1">${{ order.product.price.toFixed(2) }}</div>
          </div>
        </div>

        <!-- Address -->
        <div class="col-span-12 md:col-span-3 text-sm text-slate-600">
          <div v-for="(line, idx) in order.addressLines" :key="idx">{{ line }}</div>
        </div>

        <!-- Quantity -->
        <div class="col-span-12 md:col-span-1 text-center text-primary font-medium">{{ order.quantity }}</div>

        <!-- Total Price -->
        <div class="col-span-12 md:col-span-1 text-center text-primary font-medium">${{ order.total.toFixed(2) }}</div>

        <!-- Date -->
        <div class="col-span-12 md:col-span-2 text-center text-slate-600">{{ order.date }}</div>

        <!-- Status -->
        <div class="col-span-12 md:col-span-1 text-center">
          <span
            :class="['inline-block px-4 py-1 rounded-full text-sm font-medium', statusClass(order.status)]"
          >
            {{ order.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const orders = ref([
  {
    id: 1,
    product: {
      name: 'Airpod',
      subtitle: 'Wireless Earbuds',
      price: 299.99,
      image: '/products/airpod.png',
    },
    addressLines: ['No. 128, Street 271,', 'Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh'],
    quantity: 7,
    total: 2129.93,
    date: 'Sun Dec 11 2026',
    status: 'Pending',
  },
  {
    id: 2,
    product: {
      name: 'Galaxy Buds',
      subtitle: 'Wireless Earbuds',
      price: 199.99,
      image: '/products/galaxy-buds.png',
    },
    addressLines: ['No. 128, Street 271,', 'Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh'],
    quantity: 3,
    total: 599.97,
    date: 'Mon Dec 12 2026',
    status: 'Delivered',
  },
  {
    id: 3,
    product: {
      name: 'Airpod',
      subtitle: 'Wireless Earbuds',
      price: 299.99,
      image: '/products/airpod.png',
    },
    addressLines: ['No. 128, Street 271,', 'Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh'],
    quantity: 7,
    total: 2129.93,
    date: 'Sun Dec 11 2026',
    status: 'Delivered',
  },
  {
    id: 4,
    product: {
      name: 'Airpod',
      subtitle: 'Wireless Earbuds',
      price: 299.99,
      image: '/products/airpod.png',
    },
    addressLines: ['No. 128, Street 271,', 'Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh'],
    quantity: 7,
    total: 2129.93,
    date: 'Sun Dec 11 2026',
    status: 'Delivered',
  },
  {
    id: 5,
    product: {
      name: 'Sony Headset',
      subtitle: 'Over-ear Headphones',
      price: 149.99,
      image: '/products/sony-headset.png',
    },
    addressLines: ['No. 128, Street 271,', 'Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh'],
    quantity: 2,
    total: 299.98,
    date: 'Tue Dec 13 2026',
    status: 'Pending',
  },

])

const statusClass = (s) => {
  if (s.toLowerCase() === 'pending') return 'bg-yellow-100 text-yellow-800'
  if (s.toLowerCase() === 'delivered') return 'bg-emerald-100 text-emerald-700'
  return 'bg-slate-100 text-slate-700'
}
</script>

<style scoped>
.container {
  max-width: 1600px;
}

</style>
