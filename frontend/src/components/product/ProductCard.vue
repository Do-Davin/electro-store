<template>
  <div class="card">
    <div class="product-card">
      <div class="image-wrapper">
        <img
          :src="currentImage"
          :alt="title"
          :class="['product-image', { placeholder: isPlaceholder }]"
          draggable="false"
          @error="onImageError"
        />
      </div>

      <h3>{{ title }}</h3>
      <p class="price">{{ price }}</p>

      <div class="rating">
        <span v-for="i in 5" :key="i" :class="{ active: i <= rating }">
          ★
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import placeholderImg from "@/assets/placeholder.png"

export default defineComponent({
  name: 'ProductCard',

  props: {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: '',
    },
    rating: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    const isPlaceholder = ref(!props.image)
    const currentImage = ref(props.image || placeholderImg);
    const onImageError = () => {
      currentImage.value = placeholderImg;
      isPlaceholder.value = true
    };
    return {
      currentImage,
      isPlaceholder,
      onImageError,
     };
  },
});
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: row;
}

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
  width: 100%;
  height: 200px;
  background: #f6f6f6;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
}

.product-image:not(.placeholder) {
  object-fit: contain;
}

.product-image.placeholder {
  object-fit: cover;
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
