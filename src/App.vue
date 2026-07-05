<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <a href="#" class="brand-name">FarmLegder AI</a>
    </div>
    <ul class="navbar-menu">
      <li class="links"><router-link to="/ledger">Legder</router-link></li>
      <li class="links"><router-link to="/about">About</router-link></li>
      <li class="links" v-if="isLoggedIn"><router-link to="/home">Home</router-link></li>
      <li v-if="!isLoggedIn">
        <button class="login-btn btn btn-secondary">
          <router-link to="/login">Login</router-link>
        </button>
      </li>
      <li v-if="!isLoggedIn">
        <button class="signup-btn btn btn-primary">
          <router-link to="/signup">Sign up</router-link>
        </button>
      </li>

      <li v-if="isLoggedIn">
        <button class="logout-btn btn btn-danger" @click="logout">Logout</button>
      </li>
    </ul>
  </nav>


  <router-view />

  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section links">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="#">Services</a></li>
        </ul>
      </div>
      <div class="footer-bottom">&copy; 2024 Fuel | Designed by Lukwago</div>
      <div class="footer-section contact">
        <h3>Contact Us</h3>
        <p>Email: lukwagorsaved@gmail.com</p>
        <p>Phone: +27 738976343</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapGetters } from "vuex";
import { ref, get } from "firebase/database";
import { database } from "@/services/firebase";
import axios from 'axios'

export default {
  data() {
    return {
      animals: [],
      livestock: [],
    };
  },

  computed: {
    ...mapGetters(["isLoggedIn"]),
  },

  mounted() {
    this.fetchFirebaseData();
    this.startFirebaseDataFetch();
  },

  methods: {
    logout() {
      this.$store.commit("LOGOUT");
      this.$router.push("/");
    },

    async predictBehavior(x, y, z, id) {
      try {
        await axios.post('api/v1/activities/predict/', {
          animalId: id,
          x: x,
          y: y,
          z: z,
        });
      } catch (error) {
        console.error("Error predicting behavior:", error);
      }
    },

    async updateLocation(lat, lng, id) {
      try {
        await axios.post('/api/v1/locations/update-location/', {
          animalId: id,
          latitude: lat,
          longitude: lng,
        });
      } catch (error) {
        console.error("Error predicting behavior:", error);
      }
    },

    async fetchFirebaseData() {
      try {
        const dbRef = ref(database, '/');
        const snapshot = await get(dbRef);
        let firebaseData = snapshot.val(); // Get the Firebase data

        // Iterate through the Firebase data
        Object.keys(firebaseData).forEach(key => {
          const entry = firebaseData[key];
          this.predictBehavior(entry.accelerometer.accelX, entry.accelerometer.accelY, entry.accelerometer.accelZ, entry.rfid.uid)
          this.updateLocation(entry.gps.latitude, entry.gps.longitude, entry.rfid.uid)

        });
      } catch (error) {
        console.error("Error fetching Firebase data:", error);
      }
    },

    startFirebaseDataFetch() {
      setInterval(() => {
        this.fetchFirebaseData();
      }, 10000);
    }
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  background-color: var(--color-primary-dark);
}

.navbar-brand .brand-name {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  letter-spacing: 0.3px;
}

.navbar-menu {
  list-style: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  gap: var(--space-sm);
}

.navbar-menu li {
  margin-left: var(--space-md);
}

.links {
  padding: 3px 5px;
}

.navbar-menu a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: var(--font-size-base);
  transition: color var(--transition-fast);
}

.navbar-menu a:hover,
.navbar-menu a.router-link-active {
  color: #fff;
  font-weight: 600;
}

.navbar-menu .btn {
  padding: 0.4rem 1rem;
  font-size: var(--font-size-sm);
  box-shadow: none;
}

.footer {
  background-color: var(--color-primary-dark);
  color: #fff;
  padding: var(--space-xl) var(--space-md) var(--space-lg);
  text-align: center;
  margin-top: var(--space-xl);
}

.footer-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  gap: var(--space-md);
}

.footer-section {
  flex: 1;
  min-width: 180px;
  margin: var(--space-xs);
}

.footer-section h3 {
  font-size: var(--font-size-base);
  margin-bottom: var(--space-md);
  color: #fff;
}

.footer-section p,
.footer-section ul,
.footer-section li {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.75);
  margin: var(--space-xs) 0;
}

.footer-section ul {
  list-style-type: none;
  padding: 0;
}

.footer-section ul li a {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-section ul li a:hover {
  color: #fff;
}

.footer-bottom {
  width: 100%;
  order: 2;
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.6);
}

@media (max-width: 768px) {
  .navbar {
    justify-content: center;
    text-align: center;
    padding: var(--space-md);
  }

  .navbar-menu li {
    margin-left: var(--space-sm);
  }
}
</style>
