<script setup>
import { ref, onMounted } from 'vue';
import { Star } from 'lucide-vue-next';

// Props to allow customization
const props = defineProps({
  reviews: {
    type: Array,
    default: () => []
  }
});

const defaultTestimonials = [
  {
    name: 'Do Davin',
    image: 'users/dodavin.jpg',
    rating: '5.0',
    review: 'Best electronics store! Got my new laptop at an amazing price. Fast shipping and excellent customer service. Highly recommend!'
  },
  {
    name: 'Tath Chansereyvong',
    image: 'users/vong.jpeg',
    rating: '5.0',
    review: 'The iPhone I ordered arrived in perfect condition. Great deals and authentic products. Will definitely shop here again!'
  },
  {
    name: 'Bro Code',
    image: 'users/brocode.jpg',
    rating: '5.0',
    review: 'Amazing selection of tech products! Found exactly what I needed for my home office setup. Professional service all the way.'
  },
  {
    name: 'Tom',
    image: 'users/tom.png',
    rating: '5.0',
    review: 'Top-notch quality products and competitive prices. The gaming headset I purchased exceeded my expectations. Five stars!'
  },
  {
    name: 'Cristiano Ronaldo',
    image: 'users/ronaldo.gif',
    rating: '5.0',
    review: 'Excellent shopping experience! The website is easy to navigate and checkout was smooth. My smartwatch arrived faster than expected.'
  },
  {
    name: 'Leo Messi',
    image: 'users/messi.jpg',
    rating: '5.0',
    review: 'Reliable and trustworthy store. Purchased a tablet for my kids and they love it! Great customer support team too.'
  }
];

const testimonials = ref(props.reviews.length > 0 ? props.reviews : defaultTestimonials);

const track1 = ref(null);
const track2 = ref(null);

// Duplicate cards for infinite scroll effect
onMounted(() => {
  const tracks = [track1.value, track2.value];

  tracks.forEach(track => {
    if (track) {
      const cards = [...track.children];

      // Duplicate cards for seamless loop
      cards.forEach(card => {
        track.appendChild(card.cloneNode(true));
      });
    }
  });
});
</script>

<template>
  <section class="w-full py-16 bg-white dark:bg-[#000000]">
    <div class="w-full">
      <div class="max-w-6xl mx-auto px-6 mb-12">
        <h2 class="text-3xl font-bold text-primary text-center mb-4">
          What Our Customers Say
        </h2>

        <p class="text-center text-secondary">
          Real feedback from real customers
        </p>
      </div>

      <!-- Carousel wrapper -->
      <div class="testimonials-carousel-wrapper">
        <!-- Carousel cards 1 -->
        <div ref="track1" class="carousel-content">
          <article
            v-for="(testimonial, index) in testimonials"
            :key="`row1-${index}`"
            class="carousel-card"
          >
            <div class="carousel-image">
              <img :src="testimonial.image" :alt="testimonial.name" class="carousel-img">
            </div>

            <h3 class="carousel-name">{{ testimonial.name }}</h3>

            <div class="carousel-rating">
              <div class="carousel-stars">
                <Star
                  v-for="star in 5"
                  :key="`star-${index}-${star}`"
                  :size="16"
                  :fill="'currentColor'"
                  :stroke="'currentColor'"
                  class="star-icon"
                />
              </div>

              <h3 class="carousel-number">{{ testimonial.rating }}</h3>
            </div>

            <p class="carousel-review">{{ testimonial.review }}</p>
          </article>
        </div>

        <!-- Carousel cards 2 (reverse) -->
        <div ref="track2" class="carousel-content carousel-reverse">
          <article
            v-for="(testimonial, index) in testimonials"
            :key="`row2-${index}`"
            class="carousel-card"
          >
            <div class="carousel-image">
              <img :src="testimonial.image" :alt="testimonial.name" class="carousel-img">
            </div>

            <h3 class="carousel-name">{{ testimonial.name }}</h3>

            <div class="carousel-rating">
              <div class="carousel-stars">
                <Star
                  v-for="star in 5"
                  :key="`star-reverse-${index}-${star}`"
                  :size="16"
                  :fill="'currentColor'"
                  :stroke="'currentColor'"
                  class="star-icon"
                />
              </div>

              <h3 class="carousel-number">{{ testimonial.rating }}</h3>
            </div>

            <p class="carousel-review">{{ testimonial.review }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* TESTIMONIALS CAROUSEL */
.testimonials-carousel-wrapper {
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 0;
  display: grid;
  align-content: center;
  row-gap: 2rem;
  overflow: hidden;
}

.carousel-card {
  width: 320px;
  background-color: #f5f7fa;
  box-shadow: 0 12px 24px rgba(0, 52, 101, 0.1);
  padding: 1.5rem 1rem 2.5rem;
  margin: 0 1.5rem;
  border-radius: 3rem;
  text-align: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.dark .carousel-card {
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.carousel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 52, 101, 0.15);
}

.dark .carousel-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.carousel-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 52, 101, 0.3);
  margin: 0 auto 0.5rem;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.carousel-name,
.carousel-number {
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-primary);
}

.dark .carousel-name,
.dark .carousel-number {
  color: var(--color-primary);
}

.carousel-name {
  margin-bottom: 1.5rem;
}

.carousel-rating {
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.carousel-stars {
  display: flex;
  column-gap: 0.25rem;
}

.star-icon {
  color: var(--color-primary);
  transition: transform 0.2s;
  cursor: pointer;
}

.dark .star-icon {
  color: var(--color-primary);
}

.carousel-review {
  font-size: 0.938rem;
  color: var(--color-secondary);
  line-height: 1.6;
  margin: 0;
}

.dark .carousel-review {
  color: var(--color-secondary);
}

.carousel-card:hover .carousel-img {
  transform: scale(1.2);
}

.star-icon:hover {
  transform: scale(1.3);
}

.carousel-content {
  width: max-content;
  display: flex;
  animation: scroll 50s linear infinite;
}

.carousel-reverse {
  flex-direction: row-reverse;
  animation-direction: reverse;
  animation-delay: -1s;
}

.carousel-content:hover {
  animation-play-state: paused;
}

/* Infinite scroll animation */
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* BREAKPOINTS */
@media screen and (max-width: 320px) {
  .carousel-card {
    width: 250px;
    padding-bottom: 2rem;
  }
}

@media screen and (min-width: 1150px) {
  .testimonials-carousel-wrapper {
    row-gap: 3rem;
  }

  .testimonials-carousel-wrapper::before,
  .testimonials-carousel-wrapper::after {
    content: "";
    position: absolute;
    top: 0;
    width: 20%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }

  .testimonials-carousel-wrapper::before {
    right: 0;
    background: linear-gradient(90deg,
  rgba(255, 255, 255, 0) 0%,
  #ffffff 100%);
  }

  .dark .testimonials-carousel-wrapper::before {
    background: linear-gradient(90deg,
  rgba(0, 0, 0, 0) 0%,
  #000000 100%);
  }

  .testimonials-carousel-wrapper::after {
    left: 0;
    background: linear-gradient(90deg,
  #ffffff 0%,
  rgba(255, 255, 255, 0) 100%);
  }

  .dark .testimonials-carousel-wrapper::after {
    background: linear-gradient(90deg,
  #000000 0%,
  rgba(0, 0, 0, 0) 100%);
  }

  .carousel-card {
    width: 370px;
    padding: 3rem 2rem;
    border-radius: 4rem;
  }

  .carousel-review {
    font-size: 1rem;
  }
}
</style>
