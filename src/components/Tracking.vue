<template>
  <div id="app">
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

<style>
#app {
  text-align: center;
}
</style>
