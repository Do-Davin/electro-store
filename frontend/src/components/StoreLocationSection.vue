<template>
  <section class="store-location">
    <div class="container">

      <h2 class="section-title">
        Visit Our Organization
      </h2>

      <p class="section-subtitle">
        Russian Federation Blvd (110), Phnom Penh 120404
      </p>

      <div class="map-wrapper">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2170.193959011104!2d104.89694568810968!3d11.569410474186023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109517388680e15%3A0x63057e6682968f5!2sInstitute%20of%20Technology%20of%20Cambodia!5e1!3m2!1sen!2skh!4v1770798303295!5m2!1sen!2skh"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
        />
      </div>

      <div class="map-actions">
        <a
          href="https://www.google.com/maps/search/?api=1&query=Institute+of+Technology+of+Cambodia"
          target="_blank"
          rel="noopener"
          class="directions-btn"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.store-location {
  padding: 80px 0;
  background: #0a0a0a;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #ff8c42; /* your primary */
  margin-bottom: 10px;
}

.section-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 40px;
}

.map-wrapper {
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

iframe {
  width: 100%;
  height: 420px;
  border: 0;
}

.map-actions {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.directions-btn {
  padding: 10px 20px;
  border-radius: 12px;
  background-color: #ff8c42; /* your primary color */
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 8px 20px rgba(255, 140, 66, 0.3);
}

.directions-btn:hover {
  transform: translateY(-2px);
  background-color: #ff7a26;
}

.directions-btn:active {
  transform: scale(0.96);
}
</style>
