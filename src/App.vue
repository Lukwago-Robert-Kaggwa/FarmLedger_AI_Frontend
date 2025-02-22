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
        <button class="login-btn">
          <router-link to="/login">Login</router-link>
        </button>
      </li>
      <li v-if="!isLoggedIn">
        <button class="signup-btn">
          <router-link to="/signup">Sign up</router-link>
        </button>
      </li>

      <li v-if="isLoggedIn">
        <button class="logout-btn" @click="logout">Logout</button>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.nav-router-link {
  margin: 10px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Arial", sans-serif;
  line-height: 1.6;
  background-color: #f4f4f4;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  background-color: black;
  margin-bottom: 20px;
}

.navbar-brand .brand-name {
  font-size: 1rem;
  color: #fff;
  text-decoration: none;
}

.navbar-menu {
  list-style: none;
  display: flex;
}

.navbar-menu li {
  margin-left: 30px;
}

.links {
  padding: 3px 5px;
}

.navbar-menu a {
  text-decoration: none;
  color: #fff;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.navbar-menu a:hover {
  color: #ff6347;
}

.footer {
  background-color: black;
  color: #fff;
  padding: 30px 0;
  text-align: center;
  margin-top: 10px;
}

.footer-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section {
  flex: 1;
  margin: 5px;
}

.footer-section h2 {
  font-size: 0.8rem;
  margin-bottom: 20px;
}

.footer-section p,
.footer-section ul,
.footer-section li {
  font-size: 0.6rem;
  margin: 2px 0;
}

.footer-section ul {
  list-style-type: none;
  padding: 0;
}

.footer-section ul li a {
  color: #fff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: #ff6347;
}

.footer-bottom {
  margin-top: 2px;
  font-size: 0.8rem;
}

.logout-btn {
  background-color: #ff4b5c;
  /* Primary button color */
  color: white;
  border: none;
  padding: 3px 5px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-btn {
  background-color: #3498db;
  /* Primary button color */
  color: white;
  border: none;
  padding: 3px 5px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.signup-btn {
  background-color: #27ae60;
  ;
  /* Primary button color */
  color: white;
  border: none;
  padding: 3px 5px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

}

.logout-btn:hover {
  background-color: #ff2a3c;
  /* Slightly darker on hover */
  transform: translateY(-2px);
  /* Lift the button on hover */
}

.logout-btn:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(255, 75, 92, 0.5);
  /* Focus ring effect */
}

.logout-btn:active {
  background-color: #e63946;
  /* Darker when clicked */
  transform: translateY(1px);
  /* Slightly depress on click */
}

.logout-btn:disabled {
  background-color: #d3d3d3;
  /* Disabled button color */
  cursor: not-allowed;
}
</style>
