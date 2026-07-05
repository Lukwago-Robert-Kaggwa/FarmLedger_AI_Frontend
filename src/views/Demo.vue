<template>
  <div class="demo-page card">
    <h3>Animal Behavior Prediction</h3>

    <!-- Prediction Form -->
    <form class="demo-form" @submit.prevent="predictBehavior">
      <input v-model="x" placeholder="Enter x value" />
      <input v-model="y" placeholder="Enter y value" />
      <input v-model="z" placeholder="Enter z value" />
      <button type="submit" class="btn btn-primary">Predict</button>
    </form>

    <!-- Predicted Behavior -->
    <div v-if="behavior">
      <h4>Predicted Behavior: {{ behavior }}</h4>
    </div>

    <!-- Firebase Data Display -->
    <div class="firebase-data" v-if="firebaseData">
      <h4>Sensor Data from Firebase</h4>

      <ul v-for="data in firebaseData">
        <li>{{ data }}</li>
      </ul>

    </div>
  </div>
</template>

<script>
import { ref, get } from "firebase/database"; // Use 'get' for manual fetching
import { database } from "@/services/firebase"; // Import your Firebase setup
import axios from "axios";

export default {
  data() {
    return {
      x: '',
      y: '',
      z: '',
      behavior: null,
      firebaseData: null, // Data from Firebase
    };
  },

  methods: {
    async predictBehavior() {
      try {
        const response = await axios.post('api/v1/activities/predict/', {
          animalId: '#00005',
          x: this.x,
          y: this.y,
          z: this.z,
        });
        this.behavior = response.data.prediction;
      } catch (error) {
        console.error("Error predicting behavior:", error);
      }
    },
    async fetchFirebaseData() {
      try {
        const dbRef = ref(database, '/'); // Path to your Firebase data
        const snapshot = await get(dbRef);
        this.firebaseData = snapshot.val(); // Get the Firebase data

        // Iterate through the Firebase data
        Object.keys(this.firebaseData).forEach(key => {
          const entry = this.firebaseData[key];
          console.log(`RFID UID: ${entry.rfid.uid}`);
          console.log(`Accelerometer Data: X=${entry.accelerometer.accelX}, Y=${entry.accelerometer.accelY}, Z=${entry.accelerometer.accelZ}`);
          console.log(`GPS Location: Latitude=${entry.gps.latitude}, Longitude=${entry.gps.longitude}`);
          console.log("-".repeat(50)); // Separator for readability
        });

      } catch (error) {
        console.error("Error fetching Firebase data:", error);
      }
    },
    startFirebaseDataFetch() {
      // Fetch data every 10 seconds
      setInterval(() => {
        this.fetchFirebaseData();
      }, 10000);
    }
  },

  mounted() {
    this.fetchFirebaseData(); // Fetch data initially when the component mounts
    this.startFirebaseDataFetch(); // Start fetching data every 10 seconds
  }

};
</script>

<style scoped>
.demo-page {
  max-width: 700px;
  margin: var(--space-lg) auto;
}

.demo-page h3 {
  margin-top: 0;
  color: var(--color-text);
}

.demo-form {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: center;
}

.demo-form input {
  flex: 1;
  min-width: 120px;
}

.firebase-data {
  margin-top: var(--space-lg);
  padding: var(--space-md);
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
}

h4 {
  margin-top: 0;
  margin-bottom: var(--space-sm);
  color: var(--color-text);
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  margin-bottom: var(--space-xs);
  font-size: var(--font-size-base);
}
</style>