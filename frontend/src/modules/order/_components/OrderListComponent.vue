<template>
  <div class="bg-white rounded-lg shadow-sm p-6 mx-auto mt-4" style="max-width: 1200px">
    <!-- Title -->
    
    <!-- Table header -->
    <div class="hidden md:grid grid-cols-12 gap-4 items-center text-sm text-primary font-semibold mb-6 px-2">
      <div class="col-span-3">Product</div>
      <div class="col-span-3 text-center">Address</div>
      <div class="col-span-1 text-center">Quantity</div>
      <div class="col-span-2 text-center">Total Price</div>
      <div class="col-span-2 text-center">Date</div>
      <div class="col-span-1 text-center">Status</div>
    </div>

    <!-- Items -->
    <div class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="grid grid-cols-12 items-center gap-4 py-5 px-2 border-b border-slate-100 hover:bg-slate-50 transition-colors rounded-lg"
      >
        <!-- Product -->
        <div class="col-span-12 md:col-span-3 flex items-center gap-4">
          <img :src="order.product.image" alt="product" class="w-16 h-16 rounded-lg object-cover bg-slate-100" />
          <div>
            <div class="text-slate-800 font-semibold">{{ order.product.name }}</div>
            <div class="text-xs text-slate-400">{{ order.product.subtitle }}</div>
            <div class="text-sm text-primary font-semibold mt-1">${{ order.product.price.toFixed(2) }}</div>
          </div>
        </div>

        <!-- Address -->
        <div class="col-span-12 md:col-span-3 text-sm text-slate-500 text-center">
          <div v-for="(line, idx) in order.addressLines" :key="idx">{{ line }}</div>
        </div>

        <!-- Quantity -->
        <div class="col-span-12 md:col-span-1 text-center text-slate-700 font-medium">{{ order.quantity }}</div>

        <!-- Total Price -->
        <div class="col-span-12 md:col-span-2 text-center text-slate-800 font-semibold">${{ order.total.toFixed(2) }}</div>

        <!-- Date -->
        <div class="col-span-12 md:col-span-2 text-center text-slate-500 text-sm">{{ order.date }}</div>

        <!-- Status -->
        <div class="col-span-12 md:col-span-1 text-center">
          <span
            :class="['inline-block px-4 py-1.5 rounded-full text-xs font-medium', statusClass(order.status)]"
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
  {
    id: 6,
    product: {
      name: 'MacBook Pro',
      subtitle: 'Laptop 14-inch M3',
      price: 1999.99,
      image: '/products/macbook.png',
    },
    addressLines: ['No. 128, Street 271,', 'Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh'],
    quantity: 1,
    total: 1999.99,
    date: 'Wed Dec 14 2026',
    status: 'Pending',
  },
  {
    id: 7,
    product: {
      name: 'iPhone 15 Pro',
      subtitle: 'Smartphone 256GB',
      price: 1199.99,
      image: '/products/iphone.png',
    },
    addressLines: ['No. 128, Street 271,', 'Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh'],
    quantity: 2,
    total: 2399.98,
    date: 'Thu Dec 15 2026',
    status: 'Delivered',
  },
])

const statusClass = (s) => {
  if (s.toLowerCase() === 'pending') return 'bg-amber-50 text-amber-600 border border-amber-200'
  if (s.toLowerCase() === 'delivered') return 'bg-cyan-50 text-cyan-600 border border-cyan-200'
  return 'bg-slate-100 text-slate-600'
}
</script>

<style scoped>
</style>
