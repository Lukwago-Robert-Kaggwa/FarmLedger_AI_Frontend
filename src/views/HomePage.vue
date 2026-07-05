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

          <button type="submit" class="update-btn btn btn-primary">Update Profile</button>
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
  gap: var(--space-lg);
  padding: var(--space-lg);
  flex-wrap: wrap;
}

.home-sidebar {
  width: 20%;
  min-width: 200px;
  background-color: var(--color-surface);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  text-align: left;
}

.home-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.home-sidebar li {
  padding: 0.65rem var(--space-sm);
  margin-bottom: var(--space-xs);
  border-radius: var(--radius-sm);
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.home-sidebar li:hover {
  background-color: var(--color-primary-surface);
  color: var(--color-primary-dark);
}

.home-sidebar li.active {
  background-color: var(--color-primary);
  color: #fff;
}

.home-content {
  flex: 1;
  min-width: 280px;
  background-color: var(--color-surface);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

h2 {
  margin-top: 0;
  margin-bottom: var(--space-lg);
  font-size: var(--font-size-lg);
  color: var(--color-text);
}

form {
  text-align: left;
}

form label {
  display: block;
  margin: var(--space-md) 0 var(--space-xs);
  font-weight: 600;
}

form input {
  width: 100%;
  margin-bottom: var(--space-md);
}
</style>
