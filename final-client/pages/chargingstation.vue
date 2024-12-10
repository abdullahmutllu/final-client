<template>
  <div>
    <calculate-charging-station/>
    <div v-if="isLoading">Veri Yükleniyor...</div>

    <div v-if="error">{{ error }}</div>

    <ul v-if="!isLoading && !error && nearestChargingStations.length > 0">
      <li v-for="(chargingStation, index) in nearestChargingStations" :key="index">
        <strong>{{ chargingStation.city }}</strong>
        <ul>
          <li><strong>İsim:</strong> {{ chargingStation.name || 'Bilinmeyen' }}</li>
          <li><strong>Kapasite:</strong> {{ chargingStation.capacity || 'Bilinmeyen' }}</li>
          <li><strong>Şarj Türü:</strong> {{ chargingStation.charge || 'Bilinmeyen' }}</li>
          <li>
            <strong>Koordinatlar:</strong> 
            {{ chargingStation.coordinates[1].toFixed(6) }}, {{ chargingStation.coordinates[0].toFixed(6) }} <!-- enlem, boylam formatı -->
          </li>
          <!-- Yol Tarifi Al Butonu -->
          <li>
            <a 
              :href="generateDirectionsLink(userLocation.latitude, userLocation.longitude, chargingStation.coordinates[1], chargingStation.coordinates[0])"
              target="_blank"
              class="btn btn-primary"
            >
              Yol Tarifi Al
            </a>
          </li>
        </ul>
      </li>
    </ul>

    <div v-if="!isLoading && !error && nearestChargingStations.length === 0">
      Şarj istasyonu bulunamadı.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useMapStore } from '@/stores/mapStore';
import { haversineDistance } from '@/utils/haversine';
import CalculateChargingStation from './components/Map/MapLayers/CalculateChargingStation.vue';
import { toLonLat } from 'ol/proj'; 

export default defineComponent({
  components: { CalculateChargingStation },
  setup() {
    const store = useMapStore();
    const parkingAreas = ref(store.points);
    const isLoading = ref(store.isLoading);
    const error = ref(store.error);
    const nearestChargingStations = ref([]);

    const userLocation = ref({ latitude: null, longitude: null });

    const convertCoordinatesToWGS84 = (coordinates: [number, number]) => {
      return toLonLat(coordinates, 'EPSG:3857');
    };

    onMounted(async () => {
      try {
        await store.fetchMapData(true);
        parkingAreas.value = store.points.map((station: any) => {
          return {
            ...station,
            coordinates: convertCoordinatesToWGS84(station.coordinates),
          };
        });

        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (geoPosition) => {
              userLocation.value.latitude = geoPosition.coords.latitude;
              userLocation.value.longitude = geoPosition.coords.longitude;

              findNearestChargingStations();
            },
            (error) => {
              console.error("Konum hatası:", error);
              error.value = "Konum alınamadı.";
            }
          );
        } else {
          error.value = "Geolocation desteği mevcut değil.";
        }
      } catch (e) {
        console.error('Hata:', e);
        error.value = 'Veri yüklenirken bir hata oluştu.';
      }
    });

    const findNearestChargingStations = () => {
      if (!userLocation.value.latitude || !userLocation.value.longitude) return;

      const distances = parkingAreas.value.map((chargingStation) => {
        const [lon, lat] = chargingStation.coordinates;
        const distance = haversineDistance(userLocation.value.latitude, userLocation.value.longitude, lat, lon);
        return { ...chargingStation, distance };
      });

      nearestChargingStations.value = distances
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);
    };

    // Yol tarifi linki oluşturma fonksiyonu
    const generateDirectionsLink = (userLat: number, userLon: number, stationLat: number, stationLon: number) => {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=${stationLat},${stationLon}`;
    };

    return {
      parkingAreas,
      isLoading,
      error,
      nearestChargingStations,
      userLocation,
      generateDirectionsLink, // Yol tarifi fonksiyonunu döndürüyoruz
    };
  }
});
</script>
