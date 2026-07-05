<template>
  <div class="landing-page">
    <div class="content-section">
      <header>
        <h1>FarmLedger AI</h1>
        <p>Shaping the future of livestock farming together!</p>
      </header>

      <main>
        <div class="action-buttons">
          <router-link to="/signup">
            <button class="btn btn-primary btn-lg">Sign Up</button>
          </router-link>
          <router-link to="/login">
            <button class="btn btn-secondary btn-lg">Login</button>
          </router-link>
        </div>
      </main>
    </div>

    <div class="image-section"></div> <!-- This section will display the livestock image -->
  </div>
</template>

<script>
export default {
  name: "LandingPage",
};
</script>

<style scoped>
.landing-page {
  display: flex;
  height: 85vh;
  background-color: var(--color-surface);
  overflow: hidden;
}

.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-xl);
  margin: var(--space-sm);
  background-color: var(--color-bg);
  z-index: 2; /* Keep content above the image */
}

header h1 {
  font-size: var(--font-size-2xl);
  color: var(--color-text);
  margin-bottom: var(--space-md);
  line-height: 1.2;
  text-align: left;
}

header p {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  margin-bottom: var(--space-xl);
  line-height: 1.5;
  text-align: left;
}

.action-buttons {
  display: flex;
  gap: var(--space-md);
}

.btn-lg {
  padding: 0.9rem 2rem;
  font-size: var(--font-size-lg);
}

/* Image section for blending the image with content */
.image-section {
  flex: 1;
  background-image: url('@/assets/Livestock.png'); /* Make sure the image path is correct */
  background-size: cover;
  background-position: center;
  position: relative;
  filter: brightness(0.8); /* Darken the image slightly for readability of text */
  margin: var(--space-sm);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.image-section::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to left, rgba(0, 0, 0, 0.5), transparent); /* Gradient for smoother transition */
  z-index: 1;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .landing-page {
    flex-direction: column;
  }

  .content-section {
    text-align: center;
    padding: 20px;
  }

  .image-section {
    height: 50vh;
    background-position: center;
  }
}
</style>
