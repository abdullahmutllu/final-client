<template>
  <ol-vector-layer :zIndex="2">
    <ol-source-vector>
      <!-- Konum verisini yalnızca mevcutsa ekleyelim -->
      <ol-feature v-if="position.length > 0" ref="positionFeature">
        <!-- Koordinatları doğrudan position'dan alıyoruz -->
        <ol-geom-point :coordinates="position"></ol-geom-point>
        <ol-style>
          <ol-style-icon :src="hereIcon" :scale="0.1"></ol-style-icon>
        </ol-style>
      </ol-feature>
    </ol-source-vector>
  </ol-vector-layer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fromLonLat } from 'ol/proj';
import hereIcon from '@/assets/parkalan.jpg';

const props = defineProps({
  mapView: {
    type: Object,
    required: true
  }
});

const position = ref([]); // Konum verisini burada tutuyoruz

onMounted(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        // Ham koordinatlar (longitude, latitude) formatında alınır
        const longitude = geoPosition.coords.longitude;
        const latitude = geoPosition.coords.latitude;

        console.log('Ham Koordinatlar:', [longitude, latitude]);

        // OpenLayers için koordinat dönüşümü
        // `fromLonLat` EPSG:4326 -> EPSG:3857 dönüşümü yapar
        const coordinate = fromLonLat([longitude, latitude]);

        console.log('Dönüştürülmüş Koordinatlar:', coordinate);

        // Konum verisini güncelliyoruz
        position.value = coordinate;

        // Harita merkezini yeni koordinatlarla ayarlıyoruz
        if (props.mapView) {
          props.mapView.setCenter(coordinate);
          props.mapView.setZoom(16); // Harita yakınlaştırması
        }
      },
      (error) => {
        console.error("Konum hatası:", error);
      },
      {
        enableHighAccuracy: true, // Daha hassas konum
        timeout: 5000,
        maximumAge: 0
      }
    );
  } else {
    console.error("Geolocation desteği mevcut değil.");
  }
});
</script>
