<template>
  <div id="map" style="height: 500px;"></div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import sheepIcon from '@/assets/sheep-icon.jpg';

export default {
  name: 'MapTracker',
  props: {
    animals: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      map: null,
      markers: [], // To store markers
      polylines: [] // To store polylines
    };
  },
  watch: {
    animals: {
      handler: 'updateMap',
      immediate: true
    }
  },
  mounted() {
    this.initializeMap();
  },
  methods: {
    initializeMap() {
      // Initialize map with a default center
      this.map = L.map('map').setView([-29.0, 24.0], 5);  // Center in South Africa

      // Set map tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(this.map);
    },
    updateMap() {
      // Clear old markers and polylines
      this.markers.forEach(marker => this.map.removeLayer(marker));
      this.polylines.forEach(polyline => this.map.removeLayer(polyline));
      this.markers = [];
      this.polylines = [];


      this.animals.forEach((animal, index) => {

        if (animal.moves && animal.moves.length > 0) {
          // Get the latest move (last in the array) for the marker
          const [lat, lng] = animal.moves[animal.moves.length - 1];

          if (lat != null && lng != null) {
            const customIcon = L.icon({
              iconUrl: sheepIcon,
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            });

            // Add marker to the map
            const marker = L.marker([lat, lng], { icon: customIcon })
              .bindPopup(`RFID: ${animal.rfid}<br>Status: ${animal.healthStatus}`)
              .bindTooltip(`RFID: ${animal.rfid}<br>Behaviour: ${animal.behaviour}<br>Status: ${animal.healthStatus}<br>Lat: ${animal.lat}<br>Lng: ${animal.lng}`, { permanent: true, direction: 'bottom' })
              .addTo(this.map)
            this.markers.push(marker);

            // Check if there are at least two moves for polyline
            if (animal.moves.length > 1) {
              const lastTwoMoves = animal.moves.slice(-2); // Get last two moves
              const moveCoordinates = lastTwoMoves.map(move => [move[0], move[1]]);

              // Define a color for the polyline based on the animal index
              const colors = ['red', 'blue', 'green', 'orange', 'purple', 'cyan', 'magenta', 'yellow'];
              const color = colors[index % colors.length]; // Cycle through colors

              // Create a polyline for the last two moves
              const polyline = L.polyline(moveCoordinates, { color: color, weight: 3 }).addTo(this.map);
              this.polylines.push(polyline); // Store the polyline for removal later
            }
          } else {
            console.warn(`Invalid coordinates for animal: ${animal.rfid}`); // Warn if coordinates are invalid
          }
        } else {
          console.warn(`No moves found for animal: ${animal.rfid}`); // Warn if no moves are found
        }
      });
    }
  }
};
</script>

<style>
#map {
  height: 500px;
  width: 100%;
}
</style>
