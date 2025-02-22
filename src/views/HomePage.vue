<template>
  <div class="home-container">
    <div class="home-sidebar">
      <ul>
        <li @click="viewTracking" :class="{ active: isActiveSection('track') }">
          Track Animals
        </li>
        <li @click="manageAnimals" :class="{ active: isActiveSection('sick') }">
          Manage Animals
        </li>
        <li @click="addNewAnimal" :class="{ active: isActiveSection('add') }">
          Add Animal
        </li>
        <li @click="animalTreatment" :class="{ active: isActiveSection('treat') }">
          Treatment
        </li>
        <li @click="viewProfile" :class="{ active: isActiveSection('profile') }">
          Profile
        </li>
      </ul>
    </div>

    <div class="home-content">
      <div v-if="activeSection === 'profile'">
        <h2>Profile Information</h2>
        <form @submit.prevent="updateProfile">
          <label for="name">Username</label>
          <input type="text" v-model="user.name" id="name" required />

          <label for="email">Email</label>
          <input type="email" v-model="user.email" id="email" required />

          <label for="province">Province</label>
          <input type="text" v-model="user.province" id="province" required />

          <button type="submit" class="update-btn">Update Profile</button>
        </form>
        <div style="margin-top: 5px;">
          <AlertMessage v-if="alertMessage" :message="alertMessage" :type="alertType" @dismiss="alertMessage = ''" />
        </div>
        <!-- Display Success or Failure Alert -->

      </div>

      <div v-if="activeSection === 'track'">
        <Tracking />
      </div>

      <div v-if="activeSection === 'manage'">
        <Animals />
      </div>

      <div v-if="activeSection === 'treat'">
        <Operations />
      </div>

      <div v-if="activeSection === 'add'">
        <AddAnimal />
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import AlertMessage from "../components/AlertMessage.vue";
import Tracking from "@/components/Tracking.vue";
import Animals from "@/components/Animals.vue";
import Operations from "@/components/Operations.vue";
import AddAnimal from "@/components/AddAnimal.vue";

export default {
  name: 'home',
  components: {
    AlertMessage,
    Tracking,
    Animals,
    Operations,
    AddAnimal
  },
  data() {
    return {
      user: {
        name: "",
        email: "",
        province: "",
      },
      sickAnimals: [],
      activeSection: "track",
      userId: 0,
      alertMessage: "",
      alertType: "",
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
  },
  mounted() {
    this.userId = this.getUser.user_id;
    this.user.name = this.getUser.name;
    this.user.email = this.getUser.email;
    this.user.province = this.getUser.province;
  },
  methods: {
    viewProfile() {
      this.activeSection = "profile";
    },

    manageAnimals() {
      this.activeSection = "manage";
    },

    viewTracking() {
      this.activeSection = "track";
    },

    animalTreatment() {
      this.activeSection = "treat";
    },

    addNewAnimal() {
      this.activeSection = "add";
    },

    isActiveSection(section) {
      return this.activeSection === section;
    },

    async updateProfile() {
      try {
        const response = await axios.post("api/v1/update-user/", {
          user_id: this.userId,
          name: this.user.name,
          email: this.user.email,
          province: this.user.province,
        });

        const userData = response.data
        localStorage.setItem("user", JSON.stringify(userData));
        this.$store.commit("SET_USER", userData);
        this.alertMessage = "user successfully updated";
        this.alertType = "success";

      } catch (error) {
        this.alertMessage = error.response?.data?.error || "Sign-up failed";
        this.alertType = "failure";
      }
    },
  },
};
</script>

<style scoped>
.home-container {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.home-sidebar {
  width: 20%;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.home-sidebar ul {
  list-style: none;
  padding: 0;
}

.home-sidebar li {
  padding: 10px 0;
  font-weight: bold;
  cursor: pointer;
}

.home-sidebar li.active {
  color: #4caf50;
}

.home-content {
  width: 75%;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
}

form label {
  display: block;
  margin: 10px 0 5px;
}

form input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e2e2;
  border-radius: 5px;
  margin-bottom: 20px;
}

.update-btn {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
