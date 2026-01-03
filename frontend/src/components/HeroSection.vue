<template>
  <section
    class="hero"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >

    <div class="hero__content">
      <span class="hero__tag">Hurry up only fews left!</span>

      <h1 class="hero__title">
        <span class="hero__typing-box">
          <TextType
            :text="[
              'Next-Level Smartphone\nExperience',
              'Discover IPhone 17 Pro Max\nToday!'
            ]"
            :typingSpeed="70"
            :pauseDuration="1200"
            :showCursor="true"
            cursorCharacter="|"
            className="hero__typing"
          />
        </span>
      </h1>

      <div class="hero__actions">
        <button class="btn-primary">Shop Now</button>
        <a href="#" class="btn-link">Explore Deals →</a>
      </div>
    </div>

    <div class="hero__image">
      <img src="/iphone.png" alt="iPhone">
    </div>
  </section>
</template>

<script setup lang="ts">
  import TextType from './TextType.vue';
// const backgroundImage = '/hero-bg.avif'
const backgroundImage = ''
</script>

<style scoped>
.hero {
  min-height: 520px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 100px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  background-color: #000;
  overflow: hidden;
}

/* Left */
.hero__content {
  max-width: 55%;
}

.hero__tag {
  color: #ff8c42;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.hero__title {
  margin: 20px 0 30px;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  position: relative;
  min-height: calc(1.2em * 2);
  height: auto;
  overflow: hidden;
}

/* Action */
.hero__actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.btn-primary {
  padding: 14px 28px;
  border-radius: 10px;
  border: none;
  background: #ff8c42;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-link {
  color: white;
  font-weight: 500;
}

/* Right image */
.hero__image img {
  max-width: 420px;
  transform: scale(1.35);
}

.hero-typing-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
}

.hero__typing {
  transform: translateZ(0);
  will-change: contents;
  white-space: pre-line;
}

.hero__typing span {
  display: block;
  overflow: hidden;
}
</style>
