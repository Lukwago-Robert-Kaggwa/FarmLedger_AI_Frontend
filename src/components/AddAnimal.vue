<template>
  <div class="add-animal-page card">

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
        <button type="submit" class="btn btn-primary">Submit</button>
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
}

h1 {
  font-size: var(--font-size-lg);
  margin-top: 0;
  margin-bottom: var(--space-md);
  color: var(--color-text);
  text-align: center;
}

.form-group {
  margin-bottom: var(--space-md);
}

label {
  display: block;
  margin-bottom: var(--space-xs);
  font-weight: 600;
}

.form-group button {
  width: 100%;
}
</style>