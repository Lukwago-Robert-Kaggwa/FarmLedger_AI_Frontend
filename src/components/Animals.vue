<template>
    <div class="alert-wrapper">
        <AlertMessage v-if="alertMessage" :message="alertMessage" :type="alertType" @dismiss="alertMessage = ''" />
    </div>
    <div class="animal-container">

        <div class="ledger-page">
            <h3>Sick Animals</h3>
            <div class="animal-list">
                <div v-for="animal in animals" :key="animal.rfid" class="animal-card sick">
                    <div class="animal-info">
                        <h2>RFID: {{ animal.rfid }}</h2>
                        <p><strong>Behaviour:</strong> {{ animal.behaviour }}</p>
                        <p><strong>Health Status:</strong> <span class="status-pill" :class="animal.healthStatus">{{ animal.healthStatus }}</span></p>
                        <p><strong>Status Last Modified:</strong> {{ formatingDate(animal.statusLastModified) }}</p>
                        <p><strong>Current Location:</strong> {{ parseFloat(animal.latitude).toFixed(4) }}, {{
                            parseFloat(animal.longitude).toFixed(4) }}</p>
                        <div class="card-actions">
                            <button class="btn btn-primary" @click="trackAnimal(animal)">Track</button>
                            <button class="btn btn-secondary" @click="viewAnimalRecentAnomalies(animal)">Recent Anomalies</button>
                            <button class="btn btn-danger" @click="removeAnimal(animal)">End Tracking</button>
                        </div>
                        <div v-if="animal.showAnomalies" class="anomalies-container">
                            <h3>Recent Anomalies</h3>
                            <ul v-if="animal.anomalies.length > 0">
                                <li v-for="anomaly in animal.anomalies" :key="anomaly.id">
                                    Abnormal<strong> {{ anomaly[0] }}</strong> detected on <small> {{
                                        formatingDate(anomaly[1]) }}</small>
                                </li>
                            </ul>
                            <p v-else>No anomalies found.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="ledger-page">
            <h3>Healthy Animals</h3>
            <div class="animal-list">
                <div v-for="animal in livestock" :key="animal.rfid" class="animal-card healthy">
                    <div class="animal-info">
                        <h2>RFID: {{ animal.rfid }}</h2>
                        <p><strong>Behaviour:</strong> {{ animal.behaviour }}</p>
                        <p><strong>Health Status:</strong> <span class="status-pill" :class="animal.healthStatus">{{ animal.healthStatus }}</span></p>
                        <p><strong>Status Last Modified:</strong> {{ formatingDate(animal.statusLastModified) }}</p>
                        <p><strong>Current Location:</strong> {{ parseFloat(animal.latitude).toFixed(4) }}, {{
                            parseFloat(animal.longitude).toFixed(4) }}</p>
                        <div class="card-actions">
                            <button class="btn btn-primary" @click="trackAnimal(animal)">Track</button>
                            <button class="btn btn-secondary" @click="viewAnimalRecentAnomalies(animal)">Recent Anomalies</button>
                            <button class="btn btn-danger" @click="removeAnimal(animal)">End Tracking</button>
                        </div>
                        <!-- Anomalies Display -->
                        <div v-if="animal.showAnomalies" class="anomalies-container">
                            <h3>Recent Anomalies</h3>
                            <ul v-if="animal.anomalies.length > 0">
                                <li v-for="anomaly in animal.anomalies" :key="anomaly.id">
                                    Abnormal <strong> {{ anomaly[0] }}</strong> detected on <small> {{
                                        formatingDate(anomaly[1]) }}</small>
                                </li>
                            </ul>
                            <p v-else>No anomalies found.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from "vuex";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { Client, PrivateKey, FileCreateTransaction } from "@hashgraph/sdk";
import { formatDate } from "@/services/helpers";
import AlertMessage from "../components/AlertMessage.vue";

export default {
    data() {
        return {
            animals: [],
            livestock: [],
            client: null,
            alertMessage: "",
            alertType: "",
            transactionId: "",
            fileId: "",
        };
    },
    mounted() {
        this.fetchAnimals()
        this.client = Client.forTestnet();
        this.client.setOperator(process.env.VUE_APP_ACCOUNTID, process.env.VUE_APP_PRIVATEKEY);
        setInterval(() => {
            this.fetchAnimals()
        }, 10000);
    },

    computed: {
        ...mapGetters(["getUser"]),
    },

    methods: {
        trackAnimal(animal) {
            this.$router.push({
                name: 'TrackingPage',
                params: {
                    rfid: animal.rfid,
                    behaviour: animal.behaviour,
                    healthStatus: animal.healthStatus,
                    statusLastModified: animal.statusLastModified,
                    longitude: animal.longitude,
                    latitude: animal.latitude,
                }
            });
        },

        viewAnimalRecentAnomalies(animal) {
            animal.showAnomalies = !animal.showAnomalies
        },

        fetchAnimals() {
            this.fetchHealthyAnimals();
            this.fetchSickAnimals();
        },

        removeAnimal(animal) {
            this.uploadPdf(this.generatePdf(animal), animal.rfid);
            this.deleteAnimalActivities(animal.rfid);
            this.deleteAnimalLocations(animal.rfid);
            this.fetchHealthyAnimals()
        },

        deleteAnimalActivities(rfid) {
            axios.post(`api/v1/animals/delete-animal-activities/`,
                { rfid: rfid }
            )
                .then(response => {
                    console.log(response.data)
                })
                .catch(error => console.error('Error fetching sick animals:', error));
        },

        deleteAnimalLocations(rfid) {
            axios.post(`api/v1/animals/delete-animal-locations/`,
                { rfid: rfid }
            )
                .then(response => {
                    console.log(response.data)
                })
                .catch(error => console.error('Error fetching sick animals:', error));
        },

        async uploadPdf(blob, rfid) {
            try {
                const file = new File([blob], `${rfid}.pdf`, { type: 'application/pdf' });

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
                    .freezeWith(this.client);

                const signTx = await transaction.sign(
                    PrivateKey.fromStringDer(process.env.VUE_APP_PRIVATEKEY)
                );

                const responseHedera = await signTx.execute(this.client);
                const receipt = await responseHedera.getReceipt(this.client);
                this.fileId = receipt.fileId.toString();
                this.transactionId = responseHedera.transactionId.toString();

                this.alertMessage = `Animal removed and details added to blockchain with ${this.fileId} and ${this.transactionId}`;
                this.alertType = "info";

            } catch (error) {
                this.alertMessage = error;
                this.alertType = "failure";
                console.error("Error uploading file:", error);
            }
        },

        fetchSickAnimals() {
            axios.post(`api/v1/animals/get-sick-animals/`,
                { userId: this.getUser.user_id }
            )
                .then(response => {
                    this.animals = response.data;
                    this.animals = this.animals.map(animal => ({ ...animal, showAnomalies: false }))
                })
                .catch(error => console.error('Error fetching sick animals:', error));
        },

        generatePdf(animal) {
            const doc = new jsPDF();

            // Define constants for layout
            const titleFontSize = 20;
            const sectionFontSize = 16;
            const contentFontSize = 12;
            const startX = 10;
            const sectionSpacing = 20;
            const lineSpacing = 10;

            // Initialize Y coordinate
            let currentY = 10;

            // Title Section
            doc.setFontSize(titleFontSize);
            doc.text("End of Tracking Information", startX, currentY);
            currentY += sectionSpacing;

            // Animal Details Section
            doc.setFontSize(sectionFontSize);
            doc.text("Animal Details", startX, currentY);
            currentY += lineSpacing;

            doc.setFontSize(contentFontSize);
            doc.text(`RFID: ${animal.rfid || "N/A"}`, startX, currentY);
            currentY += lineSpacing;
            doc.text(`Health Status: ${animal.healthStatus || "N/A"}`, startX, currentY);
            currentY += lineSpacing;
            doc.text(`Last Health Modification: ${this.formatingDate(animal.statusLastModified) || "N/A"}`, startX, currentY);
            currentY += sectionSpacing;

            // Farmer's Details Section
            doc.setFontSize(sectionFontSize);
            doc.text("Farmer's Details", startX, currentY);
            currentY += lineSpacing;

            doc.setFontSize(contentFontSize);
            doc.text(`Name: ${this.getUser.name || "N/A"}`, startX, currentY);
            currentY += lineSpacing;
            doc.text(`Province: ${this.getUser.province || "N/A"}`, startX, currentY);
            currentY += lineSpacing;
            doc.text(`Email: ${this.getUser.email || "N/A"}`, startX, currentY);
            currentY += sectionSpacing;

            // Consumption Legibility Section
            doc.setFontSize(sectionFontSize);
            doc.text("Consumption Legibility", startX, currentY);
            currentY += lineSpacing;

            if (animal.healthStatus === "sick") {
                doc.setTextColor(255, 0, 0);
                doc.text("Animal tracking has ended while it was sick. Not suitable for processing.", startX, currentY);
            } else {
                doc.setTextColor(0, 128, 0);
                doc.text("Animal tracking has ended while it was healthy. Suitable for processing.", startX, currentY);
            }

            doc.setTextColor(0, 0, 0);
            currentY += sectionSpacing;

            // Save the PDF file
            const pdfFileName = `animal_tracking_${animal.rfid}.pdf`;
            doc.save(pdfFileName);

            // Generate QR code for the PDF file
            const qrCodeText = `Animal's RFID is ${animal.rfid} with file ID ${this.fileId} and transaction ID ${this.transactionId}.`;

            QRCode.toDataURL(qrCodeText, { width: 200, errorCorrectionLevel: "H" })
                .then(qrCodeDataUri => {
                    // Automatically download QR code
                    const qrLink = document.createElement("a");
                    qrLink.href = qrCodeDataUri;
                    qrLink.download = `qr_${animal.rfid}.png`;
                    document.body.appendChild(qrLink);
                    qrLink.click();
                    document.body.removeChild(qrLink);
                });

            return doc.output("blob");
        },
        fetchHealthyAnimals() {
            axios.post(`api/v1/animals/get-healthy-animals/`,
                { userId: this.getUser.user_id }
            )
                .then(response => {
                    this.livestock = response.data;
                })
                .catch(error => console.error('Error fetching sick animals:', error));
        },

        formatingDate(dateStr) {
            return formatDate(dateStr);
        },
    }
};
</script>

<style scoped>
.alert-wrapper {
    margin-top: var(--space-sm);
}

.animal-container {
    display: flex;
    flex-wrap: wrap;
}

.animal-container>div {
    flex: 100%;
}

.ledger-page {
    padding: var(--space-lg);
    max-width: 1200px;
    margin: 0 auto;
}

.ledger-page h3 {
    margin-bottom: var(--space-md);
    color: var(--color-text);
    font-size: var(--font-size-lg);
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
    text-align: left;
}

.animal-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.animal-card.sick {
    border-left: 5px solid var(--color-danger);
}

.animal-card.healthy {
    border-left: 5px solid var(--color-primary);
}

.animal-info h2 {
    margin: 0 0 var(--space-sm);
    color: var(--color-text);
    font-size: var(--font-size-lg);
}

.animal-info p {
    margin: var(--space-xs) 0;
    font-size: var(--font-size-base);
}

.card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-top: var(--space-sm);
}

.card-actions .btn {
    padding: 0.5rem 0.9rem;
    font-size: var(--font-size-sm);
}

.anomalies-container {
    margin-top: var(--space-md);
    padding-top: var(--space-sm);
    border-top: 1px solid var(--color-border);
}

.anomalies-container h3 {
    font-size: var(--font-size-base);
}

@media (max-width: 768px) {
    .animal-list {
        grid-template-columns: 1fr;
        /* Single column on small screens */
    }
}
</style>