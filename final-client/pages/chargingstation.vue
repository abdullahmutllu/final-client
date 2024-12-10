<template>
  <div>
    <calculate-charging-station />

    <!-- Yüklenme animasyonu -->
    <div v-if="isLoading" class="text-center my-5">
      <BSpinner label="Veri Yükleniyor..."></BSpinner>
    </div>

    <!-- Hata Mesajı -->
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Şarj İstasyonları Listesi -->
    <div v-if="!isLoading && !error && nearestChargingStations.length > 0">
      <BRow>
        <BCol v-for="(chargingStation, index) in nearestChargingStations" :key="index" cols="12" md="6" lg="4" class="mb-4">
          <BCard>
            <BCardHeader class="bg-primary text-white">
              {{ chargingStation.city }}
            </BCardHeader>
            <BCardBody>
              <p><strong>İsim:</strong> {{ chargingStation.name || 'Bilinmeyen' }}</p>
              <p><strong>Kapasite:</strong> {{ chargingStation.capacity || 'Bilinmeyen' }}</p>
              <p><strong>Şarj Türü:</strong> {{ chargingStation.charge || 'Bilinmeyen' }}</p>
              <p><strong>Koordinatlar:</strong> {{ chargingStation.coordinates[1].toFixed(6) }}, {{ chargingStation.coordinates[0].toFixed(6) }}</p>
            </BCardBody>
            <BCardFooter>
              <!-- Yol Tarifi Butonu -->
              <BButton 
                :href="generateDirectionsLink(userLocation.latitude, userLocation.longitude, chargingStation.coordinates[1], chargingStation.coordinates[0])" 
                target="_blank" 
                variant="success" 
                block
              >
                Yol Tarifi Al
              </BButton>
            </BCardFooter>
          </BCard>
        </BCol>
      </BRow>
    </div>

    <!-- Boş Liste Durumu -->
    <div v-if="!isLoading && !error && nearestChargingStations.length === 0" class="alert alert-warning">
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
