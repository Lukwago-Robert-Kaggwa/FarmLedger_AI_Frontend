<template>
    <div id="map" style="height: 500px;"></div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import sheepIcon from '@/assets/sheep-icon.jpg';
import axios from 'axios';

export default {
    name: 'TrackingPage',
    data() {
        return {
            map: null,
            marker: null,
            path: [],
            polyline: null,
            initialLat: 0.0,
            initialLng: 0.0,
            pollingInterval: null,
            rfidTag: '',
            status: '',
            behaviour: '',
            date: '',
        };
    },
    mounted() {
        const { rfid, behaviour, healthStatus, statusLastModified, longitude, latitude } = this.$route.params;
        this.initialLat = latitude;
        this.initialLng = longitude;
        this.rfidTag = rfid;
        this.behaviour = behaviour;
        this.status = healthStatus;
        this.date = statusLastModified;

        this.initializeMap(this.initialLat, this.initialLng);
        this.fetchAnimalCoordinates();
        this.startPolling();
    },
    beforeDestroy() {
        console.log('TrackingPage component is about to be destroyed.');
        this.stopPolling(); // Stop polling when the component is destroyed
    },
    methods: {
        initializeMap(lat, lng) {
            const customIcon = L.icon({
                iconUrl: sheepIcon,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32],
            });

            this.map = L.map('map').setView([lat, lng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(this.map);

            this.marker = L.marker([lat, lng], { icon: customIcon })
                .addTo(this.map)
                .bindTooltip(this.createTooltip(lat, lng), { permanent: true, direction: 'bottom' });

            this.polyline = L.polyline(this.path, { color: 'red' }).addTo(this.map);
            this.path.push([lat, lng]);
        },
        updatePosition(lat, lng) {
            this.marker.setLatLng([lat, lng]).bindTooltip(this.createTooltip(lat, lng), {
                permanent: true,
                direction: 'bottom'
            });

            this.path.push([lat, lng]);
            this.polyline.setLatLngs(this.path);
            this.map.setView([lat, lng], this.map.getZoom());
        },
        createTooltip(lat, lng) {
            return `Animal RFID: ${this.rfidTag}<br>Behaviour: ${this.behaviour}<br>
                    Animal Location: ${lat}, ${lng} <br>Status: ${this.status}<br>
                    Last Modified: ${this.date}`;
        },
        async fetchLatestLocation() {
            try {
                const response = await axios.post(`/api/v1/locations/latest-location/`, { rfid: this.rfidTag });
                const animalLocation = response.data;
                this.updatePosition(animalLocation.latitude, animalLocation.longitude);
            } catch (error) {
                console.error('Error fetching latest location:', error);
            }
        },
        startPolling() {
            this.pollingInterval = setInterval(() => {
                this.fetchLatestLocation();
            }, 10000);
        },
        stopPolling() {
            if (this.pollingInterval) {
                clearInterval(this.pollingInterval);
                this.pollingInterval = null;
            }
        },
        async fetchAnimalCoordinates() {
            try {
                const response = await axios.post('/api/v1/locations/get-locations/', { animal_id: this.rfidTag });
                const coordinates = response.data;

                coordinates.forEach(coordinate => {
                    this.path.push([coordinate.latitude, coordinate.longitude]);
                });

                if (coordinates.length > 0) {
                    const lastLocation = coordinates[coordinates.length - 1];
                    this.updatePosition(lastLocation.latitude, lastLocation.longitude);
                }
            } catch (error) {
                console.error('Error fetching coordinates:', error);
            }
        },
    },
};
</script>

<style>
#map {
    height: 500px;
    width: 100%;
}
</style>
