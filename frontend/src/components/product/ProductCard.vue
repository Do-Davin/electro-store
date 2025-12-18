<template>
  <div class="product-card">
    <div class="image-wrapper">
      <img :src="image" :alt="title" />
    </div>

    <h3>{{ title }}</h3>
    <p class="price">{{ price }}</p>

    <div class="rating">
      <span v-for="i in 5" :key="i" :class="{ active: i <= rating }">
        ★
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  price: string
  image: string
  rating: number
}>()
</script>

<style scoped>
.product-card {
  margin: 20px;
  width: 280px;
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* IMAGE */
.image-wrapper {
  background: #f6f6f6;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.image-wrapper img {
  width: 160px;
  height: auto;
  object-fit: contain;
}

/* TEXT */
h3 {
  font-size: 26px;
  font-weight: 700;
  color: #0b2c5f;
  margin-bottom: 10px;
}

.price {
  font-size: 22px;
  font-weight: 700;
  color: #0b2c5f;
  margin-bottom: 10px;
}

/* RATING */
.rating {
  font-size: 24px;
  letter-spacing: 4px;
}

.rating span {
  color: #dcdcdc;
}

.rating span.active {
  color: #0b2c5f;
}
</style>
