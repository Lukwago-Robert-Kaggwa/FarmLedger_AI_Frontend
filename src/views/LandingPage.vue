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
            <button class="btn signup-btn">Sign Up</button>
          </router-link>
          <router-link to="/login">
            <button class="btn login-btn">Login</button>
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
  background-color: #ffffff;
  overflow: hidden;
}

.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 50px;
  margin: 10px;
  background-color: #f9f9f9; /* Subtle background color for contrast */
  z-index: 2; /* Keep content above the image */
}

header h1 {
  font-size: 3.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
  line-height: 1.2;
  text-align: left;
}

header p {
  font-size: 1rem;
  color: #7f8c8d;
  margin-bottom: 40px;
  line-height: 1.5;
  text-align: left;
}

.action-buttons {
  display: flex;
  gap: 20px;
}

.btn {
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.signup-btn {
  background-color: #27ae60;
  color: #fff;
}

.signup-btn:hover {
  background-color: #2ecc71;
}

.login-btn {
  background-color: #2980b9;
  color: #fff;
}

.login-btn:hover {
  background-color: #3498db;
}

/* Image section for blending the image with content */
.image-section {
  flex: 1;
  background-image: url('@/assets/Livestock.png'); /* Make sure the image path is correct */
  background-size: cover;
  background-position: center;
  position: relative;
  filter: brightness(0.8); /* Darken the image slightly for readability of text */
  margin: 10px;
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
