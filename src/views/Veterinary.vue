<template>
    <div class="vet-form-container">
        
        <AlertMessage v-if="alertMessage" :message="alertMessage" :type="alertType" @dismiss="alertMessage = ''" />

        <h1>Veterinary Doctor Operation Form</h1>
        <form @submit.prevent="submitForm">
            <div class="input-data">
                <div>
                    <div class="form-group">
                        <label for="firstName">First Name:</label>
                        <input v-model="form.firstName" id="firstName" type="text" required />
                    </div>

                    <div class="form-group">
                        <label for="surname">Surname:</label>
                        <input v-model="form.surname" id="surname" type="text" required />
                    </div>

                    <div class="form-group">
                        <label for="id">ID:</label>
                        <input v-model="form.id" id="id" type="text" required />
                    </div>
                </div>

                <div>
                    <div class="form-group">
                        <label for="typeOfOperation">Type of Operation:</label>
                        <input v-model="form.typeOfOperation" id="typeOfOperation" type="text" required />
                    </div>

                    <div class="form-group">
                        <label for="details">Details of Operation:</label>
                        <textarea v-model="form.details" id="details" rows="5" required></textarea>
                    </div>
                </div>
            </div>
            <button :disabled="clickBtn" type="submit">Submit</button>
        </form>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import { jsPDF } from "jspdf";
import { useRoute } from "vue-router"
import { useStore } from "vuex"
import AlertMessage from "@/components/AlertMessage.vue";
import axios from "axios";
import { Client, PrivateKey, FileCreateTransaction } from "@hashgraph/sdk";

const route = useRoute()
const userStore = useStore()
const currentUser = computed(() => userStore.getters.getUser);
const client = ref(null);
const rfid = ref("")
const healthStatus = ref("")
const statusLastModified = ref("")
const alertMessage = ref("")
const alertType = ref("")
const clickBtn = ref(false)

const form = reactive({
    firstName: "",
    surname: "",
    id: "",
    typeOfOperation: "",
    details: "",
});

const transactionId = ref(null);
const fileId = ref(null);

onMounted(async () => {
    rfid.value = route.params.rfid
    healthStatus.value = route.params.healthStatus
    statusLastModified.value = route.params.statusLastModified

    client.value = Client.forTestnet();
    client.value.setOperator(
        process.env.VUE_APP_ACCOUNTID,
        process.env.VUE_APP_PRIVATEKEY
    );
});

const uploadPdf = async (blob) => {
    try {
        const file = new File([blob], `${rfid.value}.pdf`, { type: 'application/pdf' });

        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${process.env.VUE_APP_PINATA_API_KEY}`,
                },
            }
        );

        const ipfsHash = response.data.IpfsHash;

        const transaction = new FileCreateTransaction()
            .setKeys([PrivateKey.fromStringDer(process.env.VUE_APP_PRIVATEKEY).publicKey])
            .setContents(ipfsHash)
            .freezeWith(client.value);

        const signTx = await transaction.sign(
            PrivateKey.fromStringDer(process.env.VUE_APP_PRIVATEKEY)
        );
        const responseHedera = await signTx.execute(client.value);
        const receipt = await responseHedera.getReceipt(client.value);

        fileId.value = receipt.fileId.toString();
        transactionId.value = responseHedera.transactionId.toString();

        saveBlockchainCrendentials(rfid.value, fileId.value, transactionId.value)

        Object.keys(form).forEach((key) => {
            form[key] = "";
        });

    } catch (error) {
        alertMessage.value = error;
        alertType.value = "failure";
        console.error("Error uploading file:", error);
    }
};

const saveBlockchainCrendentials = async (rfId, fId, transId) => {
    try {
        await axios.post('/api/v1/animals/save-blockchain-credentials/', { rfid: rfId, fileId: fId, transactionId: transId });

        alertMessage.value = 'File blockchain credentials saved successfully';
        alertType.value = "success";

    } catch (error) {
        alertMessage.value = error;
        alertType.value = "failure";
        console.error('Error saving blockchain crendential:', error);
    }
};

const generatePdf = (f) => {
    const doc = new jsPDF();
    // Define constants for layout
    const titleFontSize = 20;
    const sectionFontSize = 16;
    const contentFontSize = 12;
    const startX = 10; // Left margin
    const sectionSpacing = 20; // Space between sections
    const lineSpacing = 10; // Space between lines

    // Initialize Y coordinate
    let currentY = 10;

    doc.setFontSize(titleFontSize);
    doc.text("Veterinary Form", startX, currentY);
    currentY += sectionSpacing;

    // Vet Details Section
    doc.setFontSize(sectionFontSize);
    doc.text("Vet Details", startX, currentY);
    currentY += lineSpacing;

    doc.setFontSize(contentFontSize);
    doc.text(`First Name: ${f.firstName || "N/A"}`, startX, currentY);
    currentY += lineSpacing;
    doc.text(`Surname: ${f.surname || "N/A"}`, startX, currentY);
    currentY += lineSpacing;
    doc.text(`ID: ${f.id || "N/A"}`, startX, currentY);
    currentY += sectionSpacing;

    // Animal Details Section
    doc.setFontSize(sectionFontSize);
    doc.text("Animal Details", startX, currentY);
    currentY += lineSpacing;

    doc.setFontSize(contentFontSize);
    doc.text(`RFID: ${rfid.value || "N/A"}`, startX, currentY);
    currentY += lineSpacing;
    doc.text(`Health Status: ${healthStatus.value || "N/A"}`, startX, currentY);
    currentY += lineSpacing;
    doc.text(`Last Health Modification: ${statusLastModified.value || "N/A"}`, startX, currentY);
    currentY += sectionSpacing;

    // Farmer's Details Section
    doc.setFontSize(sectionFontSize);
    doc.text("Farmer's Details", startX, currentY);
    currentY += lineSpacing;

    doc.setFontSize(contentFontSize);
    doc.text(`Name: ${currentUser.value.name || "N/A"}`, startX, currentY);
    currentY += lineSpacing;
    doc.text(`Province: ${currentUser.value.province || "N/A"}`, startX, currentY);
    currentY += lineSpacing;
    doc.text(`Email: ${currentUser.value.email || "N/A"}`, startX, currentY);
    currentY += sectionSpacing;

    // Treatment Details Section
    doc.setFontSize(sectionFontSize);
    doc.text("Treatment Details", startX, currentY);
    currentY += lineSpacing;

    doc.setFontSize(contentFontSize);
    doc.text(`Treatment Type: ${f.typeOfOperation || "N/A"}`, startX, currentY);
    currentY += lineSpacing;
    doc.text(`Treatment Details: ${f.details || "N/A"}`, startX, currentY);

    return doc.output("blob");
};

const submitForm = async () => {
    clickBtn.value = true
    uploadPdf(generatePdf(form))
    clickBtn.value = false
};
</script>

<style scoped>
.vet-form-container {
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #f9f9f9;
    font-family: Arial, sans-serif;
}

.input-data {
    display: flex;
    justify-content: center;
}

.input-data>div {
    margin: 20px;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input,
textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

button {
    width: 20%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    background: #4caf50;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
}

button:hover {
    background: #409243;
}

button:disabled{
    background-color: gray;
    cursor: not-allowed;
}
</style>