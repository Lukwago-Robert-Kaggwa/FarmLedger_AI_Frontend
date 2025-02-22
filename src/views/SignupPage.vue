<template>
  <div class="signup-container">
    <form @submit.prevent="signup">
      <h2>Sign Up</h2>
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="email" v-model="email" placeholder="Email" required />
      <input
        type="tel"
        v-model="phone_number"
        placeholder="Phone Number"
        required
      />
      <select v-model="province" required>
        <option value="" disabled>Select Province</option>
        <option>Gauteng</option>
        <option>Western Cape</option>
        <option>Kwazulu Natal</option>
        <option>Limpopo</option>
        <option>Eastern Cape</option>
        <option>Free State</option>
        <option>Northern Cape</option>
        <option>North West</option>
        <option>Mpumalanga</option>
      </select>
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <input
        type="password"
        v-model="confirmPassword"
        placeholder="Confirm password"
        required
      />
      <button type="submit">Sign Up</button>
    </form>

    <AlertMessage
      v-if="alertMessage"
      :message="alertMessage"
      :type="alertType"
      @dismiss="alertMessage = ''"
    />
  </div>
</template>

<script>
import axios from "axios";
import AlertMessage from "@/components/AlertMessage.vue"; 
export default {
  components: {
    AlertMessage,
  },
  data() {
    return {
      username: "",
      email: "",
      phone_number: "",
      province: "",
      password: "",
      confirmPassword: "",
      alertMessage: "",
      alertType: "", 
    };
  },
  methods: {
    async signup() {
      // Reset alert messages on each new signup attempt
      this.alertMessage = "";
      this.alertType = "";

      // Validate inputs
      if (this.phone_number.length < 10 || this.phone_number.length > 12) {
        this.alertMessage = "Invalid telephone number";
        this.alertType = "failure";
      } else if (this.password !== this.confirmPassword) {
        this.alertMessage = "Passwords don't match";
        this.alertType = "failure";
      } else {
        try {
          // API request to sign up
          const response = await axios.post("/api/v1/signup/", {
            username: this.username,
            email: this.email,
            mobile: this.phone_number,
            location: this.province,
            password: this.password,
          });
          // On success
          this.alertMessage = response.data.message;
          this.alertType = "success";

          // Optionally reset form fields on successful signup
          this.username = "";
          this.email = "";
          this.phone_number = "";
          this.province = "";
          this.password = "";
          this.confirmPassword = "";
        } catch (error) {
          // Handle error and show the failure message
          this.alertMessage = error.response?.data?.error || "Sign-up failed";
          this.alertType = "failure";
        }
      }
    },
  },
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  background: #f5f5f5;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  height: 80vh;
}

form {
  display: flex;
  flex-direction: column;
}

input,
select,
button {
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}
</style>
