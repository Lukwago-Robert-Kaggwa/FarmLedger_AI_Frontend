<template>
    <div class="ledger-page">
        <h1>Animal Treatment</h1>
        <div class="animal-list">
            <div v-for="animal in animals" :key="animal.rfid" class="animal-card"
                :class="{ 'healthy': animal.healthStatus === 'healthy', 'sick': animal.healthStatus === 'sick' }">
                <div class="animal-info">
                    <h2>RFID: {{ animal.rfid }}</h2>
                    <p><strong>Health Status:</strong> {{ animal.healthStatus }}</p>
                    <p><strong>Status Last Modified:</strong> {{ formatingDate(animal.statusLastModified) }}</p>
                    <p><strong>Current Location:</strong> {{ animal.lat }}, {{ animal.lng }}</p>
                    <button @click="treatAnimal(animal)">Enter Treatment Details</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { formatDate } from '@/services/helpers';
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            animals: [],
        };
    },
    mounted() {
        this.fetchUserAnimals()
    },

    computed: {
        ...mapGetters(["isLoggedIn", "getUser"]),
    },

    methods: {
        treatAnimal(animal) {
            this.$router.push({
                name: 'Veterinary',
                params: {
                    rfid: animal.rfid,
                    healthStatus: animal.healthStatus,
                    statusLastModified: this.formatingDate(animal.statusLastModified),
                }
            });
        },
        fetchUserAnimals() {
            axios.post(`api/v1/animals/get-user-animals-data/`,
                { userId: this.getUser.user_id }
            )
                .then(response => {
                    this.animals = response.data;
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
    text-align: left;
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

.animal-info h2 {
    margin: 0 0 10px;
    color: #333;
}

.animal-info p {
    margin: 5px 0;
    font-size: 16px;
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

.animal-info button:hover {
    background-color: #409243;
}

@media (max-width: 768px) {
    .animal-list {
        grid-template-columns: 1fr;
        /* Single column on small screens */
    }
}
</style>