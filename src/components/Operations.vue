<template>
    <div class="ledger-page">
        <h1>Animal Treatment</h1>
        <div class="animal-list">
            <div v-for="animal in animals" :key="animal.rfid" class="animal-card"
                :class="{ 'healthy': animal.healthStatus === 'healthy', 'sick': animal.healthStatus === 'sick' }">
                <div class="animal-info">
                    <h2>RFID: {{ animal.rfid }}</h2>
                    <p><strong>Health Status:</strong> <span class="status-pill" :class="animal.healthStatus">{{ animal.healthStatus }}</span></p>
                    <p><strong>Status Last Modified:</strong> {{ formatingDate(animal.statusLastModified) }}</p>
                    <p><strong>Current Location:</strong> {{ animal.lat }}, {{ animal.lng }}</p>
                    <button class="btn btn-primary" @click="treatAnimal(animal)">Enter Treatment Details</button>
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
    text-align: left;
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

.animal-info h2 {
    margin: 0 0 var(--space-sm);
    color: var(--color-text);
    font-size: var(--font-size-lg);
}

.animal-info p {
    margin: var(--space-xs) 0;
    font-size: var(--font-size-base);
}

.animal-info button {
    float: right;
    margin-top: var(--space-sm);
}

@media (max-width: 768px) {
    .animal-list {
        grid-template-columns: 1fr;
        /* Single column on small screens */
    }
}
</style>