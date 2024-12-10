<template>
  <div>
    <h1>Şarj İstasyonları</h1>
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
import { haversineDistance } from '@/utils/haversine'; // Haversine fonksiyonunu import et
import CalculateChargingStation from './components/Map/MapLayers/CalculateChargingStation.vue';
import { toLonLat } from 'ol/proj'; // OpenLayers projeksiyon fonksiyonu

export default defineComponent({
  components: { CalculateChargingStation },
  setup() {
    const store = useMapStore();
    const parkingAreas = ref(store.points); // Ref ile verileri saklıyoruz
    const isLoading = ref(store.isLoading); // Yükleniyor durumunu takip ediyoruz
    const error = ref(store.error); // Hata durumunu takip ediyoruz
    const nearestChargingStations = ref([]); // En yakın şarj istasyonları burada saklanacak

    // Kullanıcının mevcut konumunu almak için ref
    const userLocation = ref({ latitude: null, longitude: null });

    // Şarj istasyonu koordinatlarını WGS 84'e (EPSG:4326) dönüştüren fonksiyon
    const convertCoordinatesToWGS84 = (coordinates: [number, number]) => {
      return toLonLat(coordinates, 'EPSG:3857'); // 3857'den 4326'ya dönüştür
    };

    // Veri çekme işlemi onMounted ile yapılır
    onMounted(async () => {
      try {
        // Force veri çekme
        await store.fetchMapData(true); // forceUpdate: true
        parkingAreas.value = store.points.map((station: any) => {
          return {
            ...station,
            coordinates: convertCoordinatesToWGS84(station.coordinates), // Koordinatları 4326'ya dönüştür
          };
        });

        // Kullanıcının mevcut konumunu almak
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (geoPosition) => {
              userLocation.value.latitude = geoPosition.coords.latitude;
              userLocation.value.longitude = geoPosition.coords.longitude;

              // En yakın şarj istasyonlarını bulma işlemi
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

    // En yakın 5 şarj istasyonunu bulma fonksiyonu
    const findNearestChargingStations = () => {
      if (!userLocation.value.latitude || !userLocation.value.longitude) return;

      // Her bir şarj istasyonu için mesafe hesapla
      const distances = parkingAreas.value.map((chargingStation) => {
        const [lon, lat] = chargingStation.coordinates;
        const distance = haversineDistance(userLocation.value.latitude, userLocation.value.longitude, lat, lon);
        return { ...chargingStation, distance };
      });

      // Mesafeye göre sıralama yap ve ilk 5 tanesini al
      nearestChargingStations.value = distances
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);
    };

    return {
      parkingAreas,
      isLoading,
      error,
      nearestChargingStations,
    };
  }
});
</script>
