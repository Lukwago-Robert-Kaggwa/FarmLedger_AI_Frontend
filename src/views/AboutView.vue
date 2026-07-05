<template>
  <div class="about-page">
    <div class="content-section">
      <header>
        <h1>About FarmLedger AI</h1>
      </header>

      <main>
        <section class="about-description">
          <p>
            At FarmLedger AI, we are committed to revolutionizing the livestock farming industry through the power of advanced AI technologies. Our platform integrates modern data analytics with seamless farm management to help farmers optimize their operations and increase productivity. 
          </p>
          <p>
            With a focus on sustainability, animal health, and efficiency, FarmLedger AI offers tools that provide insights into livestock behavior, feeding patterns, and overall farm management. By shaping the future of farming, we empower farmers to make informed decisions that lead to healthier livestock and more sustainable practices.
          </p>
        </section>

        <section class="mission-vision">
          <h2>Our Mission & Vision</h2>
          <p>
            <strong>Mission:</strong> To equip livestock farmers with innovative AI solutions, enhancing their ability to monitor, manage, and improve their farming operations.
          </p>
          <p>
            <strong>Vision:</strong> A future where technology and farming work hand in hand to create sustainable and efficient agricultural practices worldwide.
          </p>
        </section>
      </main>
    </div>

    <div class="image-section"></div> <!-- This section will display a relevant image -->
  </div>
</template>

<script>
export default {
  name: "AboutPage",
};
</script>

<style scoped>
.about-page {
  display: flex;
  min-height: 85vh;
  background-color: var(--color-surface);
  overflow: hidden;
}

.content-section {
  flex: 1;
  padding: var(--space-xl);
  margin: var(--space-sm);
  background-color: var(--color-bg);
  z-index: 2;
}

header h1 {
  font-size: var(--font-size-2xl);
  color: var(--color-text);
  margin-bottom: var(--space-lg);
  line-height: 1.2;
}

.about-description p {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-md);
}

.mission-vision {
  margin-top: var(--space-xl);
}

.mission-vision h2 {
  font-size: var(--font-size-xl);
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.mission-vision p {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-sm);
}

.image-section {
  flex: 1;
  background-image: url('../assets/Livestock.png'); /* Ensure the image path is correct */
  background-size: cover;
  background-position: center;
  position: relative;
  margin: var(--space-sm);
  border-radius: var(--radius-lg);
  overflow: hidden;
  filter: brightness(0.8);
}

.image-section::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to left, rgba(0, 0, 0, 0.5), transparent);
  z-index: 1;
}

@media (max-width: 768px) {
  .about-page {
    flex-direction: column;
  }

  .content-section {
    padding: 20px;
  }

  .image-section {
    height: 50vh;
    background-position: center;
  }
}
</style>
