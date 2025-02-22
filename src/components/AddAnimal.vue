<template>
  <div class="add-animal-page">

    <AlertMessage v-if="alertMessage" :message="alertMessage" :type="alertType" @dismiss="alertMessage = ''" />

    <h1>Add Animal</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="rfid">RFID UID:</label>
        <input type="text" id="rfid" v-model="animal.rfid_uid" required />
      </div>
      <div class="form-group">
        <label for="status">Status:</label>
        <select id="status" v-model="animal.status">
          <option value="healthy">healthy</option>
          <option value="sick">sick</option>
        </select>
      </div>
      <div class="form-group">
        <button type="submit">Submit</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import axios from 'axios';
import AlertMessage from './AlertMessage.vue';
import { useStore } from "vuex"

const userStore = useStore()
const currentUser = computed(() => userStore.getters.getUser)

const animal = reactive({
  rfid_uid: '',
  status: 'healthy',
});


const alertType = ref("")
const alertMessage = ref("")

const handleSubmit = async () => {
  try {
    await axios.post('/api/v1/animals/create-animal/',
      {
        rfid_uid: animal.rfid_uid,
        userId: currentUser.value.user_id,
        status: animal.status
      }
    );
    alertMessage.value = 'Animal added successfully!';
    alertType.value = 'success'
    resetForm();
  } catch (error) {
    console.error(error);
    alertMessage.value = error.response.data.error;
    alertType.value = 'failure'
  }
};

const resetForm = () => {
  animal.rfid_uid = '';
  animal.status = 'healthy';
};

</script>

<style scoped>
.add-animal-page {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input,
select {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  color: #fff;
  background-color: #4caf50;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.message {
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #e0ffe0;
  border: 1px solid #00c300;
  border-radius: 4px;
  text-align: center;
}

.message p {
  margin: 0;
}
</style>