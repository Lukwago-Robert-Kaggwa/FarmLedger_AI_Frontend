<template>
  <div class="login-container">
    <div class="form card">
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
      <button type="submit" class="btn btn-primary">Login</button>
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
  padding: var(--space-md);
  justify-self: center;
  align-items: center;
  height: 70vh;
}

.form {
  flex: 1;
  flex-direction: column;
}

.form h2 {
  margin-top: 0;
  margin-bottom: var(--space-md);
  color: var(--color-text);
}

input {
  margin: var(--space-sm) 0;
  width: 90%;
}

button {
  margin: var(--space-sm) 0;
  width: 90%;
}
</style>
