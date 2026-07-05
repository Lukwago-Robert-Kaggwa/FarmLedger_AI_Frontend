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
          <p><strong v-if="animal.healthStatus != 'removed'">Health Status:</strong> <strong v-else>Status:</strong>
            <span class="status-pill" :class="animal.healthStatus">{{ animal.healthStatus }}</span></p>
          <p><strong>Status Last Modified:</strong> {{ formatingDate(animal.statusLastModified) }}</p>
          <button class="btn btn-primary" v-show="showButton" v-if="animal.fileIds.length > 0" @click="getBlockchainFiles(animal.fileIds)">Retrieve Record</button>
          <button class="btn btn-disabled" v-else>No Record</button>
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
  padding: var(--space-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.ledger-page h1 {
  margin-bottom: var(--space-lg);
  color: var(--color-text);
  font-size: var(--font-size-xl);
}

.animal-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}

.animal-card {
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.animal-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.animal-card.healthy {
  border-left: 5px solid var(--color-primary);
}

.animal-card.sick {
  border-left: 5px solid var(--color-danger);
}

.animal-card.removed {
  border-left: 5px solid var(--color-info);
}

.animal-info h2 {
  margin: 0 0 var(--space-sm);
  color: var(--color-text);
  font-size: var(--font-size-lg);
  text-align: left;
}

.animal-info p {
  margin: var(--space-xs) 0;
  font-size: var(--font-size-base);
  text-align: left;
}

.animal-info button {
  float: right;
  margin-top: var(--space-sm);
}

.animal-info strong {
  font-weight: 600;
}

@media (max-width: 768px) {
  .animal-list {
    grid-template-columns: 1fr;
  }
}
</style>