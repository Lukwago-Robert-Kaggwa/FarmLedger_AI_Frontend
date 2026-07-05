<template>
  <div class="tracking-page">
    <MapTracker :animals="animals" ref="map" />
  </div>
</template>


<script>
import axios from 'axios'
import MapTracker from '@/components/MapTracker.vue';
import { mapGetters } from "vuex";

export default {
  components: {
    MapTracker,
  },
  data() {
    return {
      animals: [],
    };
  },
  mounted() {
    this.fetchUserAnimalData()
    setInterval(() => {
      this.fetchUserAnimalData()
    }, 10000);
  },

  computed: {
    ...mapGetters(["isLoggedIn", "getUser"]),
  },

  methods: {
    fetchUserAnimalData() {
      axios.post(`api/v1/animals/get-user-animals-data/`,
        { userId: this.getUser.user_id }
      )
        .then(response => {
          this.animals = response.data;
        })
        .catch(error => {
          console.error('Error fetching all animal data:', error);
        });
    }
  },
};
</script>

<style scoped>
.tracking-page {
  padding: var(--space-lg);
  max-width: 1200px;
  margin: 0 auto;
}
</style>
