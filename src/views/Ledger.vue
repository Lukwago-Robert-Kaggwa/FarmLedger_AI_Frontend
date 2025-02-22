<template>
  <div class="ledger-page">
    <AlertMessage v-if="alertMessage" :message="alertMessage" :type="alertType" @dismiss="alertMessage = ''" />
    <h1>Global Blockchain Records</h1>
    <div class="animal-list">
      <div v-for="animal in animals" :key="animal.rfid" class="animal-card"
        :class="{ 'healthy': animal.healthStatus === 'healthy', 'sick': animal.healthStatus === 'sick', 'removed': animal.healthStatus === 'removed' }">
        <div class="animal-info">
          <h2>RFID: {{ animal.rfid }}</h2>
          <p><strong>Owner:</strong> {{ animal.userName }}</p>
          <p><strong v-if="animal.healthStatus != 'removed'">Health Status:</strong> <strong v-else>Status:</strong> <i
              :style="{ color: animal.healthStatus === 'healthy' ? 'green' : animal.healthStatus === 'sick' ? 'red' : 'blue' }">{{ animal.healthStatus }}</i></p>
          <p><strong>Status Last Modified:</strong> {{ formatingDate(animal.statusLastModified) }}</p>
          <button v-show="showButton" v-if="animal.fileIds.length > 0" @click="getBlockchainFiles(animal.fileIds)">Retrieve Record</button>
          <button style="background-color: red; cursor: not-allowed;" v-else>No Record</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { formatDate } from "@/services/helpers";
import axios from "axios";
import AlertMessage from "@/components/AlertMessage.vue";
import { Client, FileContentsQuery } from "@hashgraph/sdk";
import JSZip from "jszip"; 
import { saveAs } from "file-saver";

const animals = ref({});
const client = ref(null);
const alertType = ref("")
const alertMessage = ref("")
const showButton = ref(true)

onMounted(async () => {
  fetchAllAnimalData()
  client.value = Client.forTestnet();
  client.value.setOperator(
    process.env.VUE_APP_ACCOUNTID,
    process.env.VUE_APP_PRIVATEKEY
  );
});

const formatingDate = (dateStr) => formatDate(dateStr);

const getBlockchainFiles = async (fileIDs) => {
  showButton.value = false
  if (!Array.isArray(fileIDs) || fileIDs.length === 0) {
    alertMessage.value = "Please provide an array of valid File IDs.";
    alertType.value = "failure";
    return;
  }

  try {
    const zip = new JSZip();

    for (const fileID of fileIDs) {
      const fileFromPinata = await retrieveFile(fileID);
      if (fileFromPinata) {
        const fileName = `${fileID}.pdf`; 
        zip.file(fileName, fileFromPinata.data); 
      }
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "blockchain_files.zip");

    alertMessage.value = "Files successfully downloaded.";
    alertType.value = "success";
  } catch (error) {
    console.error("Error downloading files:", error);
    alertMessage.value = "An error occurred while retrieving or downloading the files.";
    alertType.value = "failure";
  }
  showButton.value = true
};

const retrieveFile = async (fileID) => {
  try {
    if (!fileID) {
      throw new Error("Invalid File ID.");
    }

    const fileContents = await new FileContentsQuery()
      .setFileId(fileID)
      .execute(client.value);

    const ipfsHash = String.fromCharCode(...fileContents);
    if (!ipfsHash) {
      throw new Error("Failed to retrieve IPFS hash.");
    }

    const pinataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    return await axios.get(pinataUrl, { responseType: "arraybuffer" });
  } catch (error) {
    console.error("Error retrieving file:", error.message);
    throw error; 
  }
};

const fetchAllAnimalData = async () => {
  axios.get(`api/v1/animals/get-all-animals-data/`)
    .then(response => {
      animals.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching all animal data:', error);
    });
}
</script>

<style scoped>
.ledger-page {
  padding: 20px;
  background-color: #f4f4f9;
  font-family: Arial, sans-serif;
}

.animal-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.animal-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.animal-card:hover {
  transform: scale(1.02);
}

.animal-card.healthy {
  border-left: 5px solid #4caf50;
}

.animal-card.sick {
  border-left: 5px solid #f44336;
}

.animal-card.removed {
  border-left: 5px solid blue;
}

.animal-info h2 {
  margin: 0 0 10px;
  color: #333;
  text-align: left;
}

.animal-info p {
  margin: 5px 0;
  font-size: 16px;
  text-align: left;
}

.animal-info button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  float: right;
}

button:hover {
  background-color: #45a049;
}

.animal-info strong {
  font-weight: bold;
}

@media (max-width: 768px) {
  .animal-list {
    grid-template-columns: 1fr;
  }
}
</style>