<template>
  <div class="login-container">
    <div class="form">
      <form @submit.prevent="login">
      <h2>Login</h2>
      <input type="email" v-model="email" placeholder="Email" required />
      <br>
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <br>
      <button type="submit">Login</button>
    </form>
     <!-- Display Success or Failure Alert -->
     <AlertMessage
      v-if="alertMessage"
      :message="alertMessage"
      :type="alertType"
      @dismiss="alertMessage = ''"
    />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import AlertMessage from "../components/AlertMessage.vue"; 

export default {
  components: {
    AlertMessage,
  },
  data() {
    return {
      email: "",
      password: "",
      alertMessage: "",
      alertType: "", 
    };
  },
  methods: {
    async login() {
      this.alertMessage = "";
      this.alertType = "";
      try {
        const response = await axios.post("api/v1/login/", {
          email: this.email,
          password: this.password,
        });
        const userData = response.data;
        this.$store.commit("SET_USER", userData);

        this.$router.push('/home')
      } catch (error) {
        this.alertMessage = error.response?.data?.error || "Sign-in failed";
        this.alertType = "failure";
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  justify-self: center;
  align-items: center;
  height: 70vh;
}

.form {
  flex:1;
  border-radius: 8px;
  background: #f5f5f5;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  flex-direction: column;
}

input,
button {
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 90%;
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
