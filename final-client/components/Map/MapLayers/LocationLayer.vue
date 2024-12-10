<template>
  <ol-vector-layer :zIndex="2">
    <ol-source-vector>
      <!-- Koordinatlar varsa, göstermek için -->
      <ol-feature v-if="position.length > 0" ref="positionFeature">
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

        // Koordinatları güncelliyoruz
        position.value = coordinate;

        // Harita merkezini yeni koordinatlarla ayarlıyoruz
        if (props.mapView) {
          props.mapView.setCenter(coordinate); // Harita merkezini kullanıcı konumuna ayarla
          props.mapView.setZoom(16); // Yakınlaştırma düzeyini 16 yapıyoruz
        }
      },
      (error) => {
        console.error("Konum hatası:", error);
      },
      {
        enableHighAccuracy: true, // Yüksek doğrulukla konum al
        timeout: 10000, // Zaman aşımını biraz arttırıyoruz
        maximumAge: 0 // Her seferinde yeni konum alalım
      }
    );
  } else {
    console.error("Geolocation desteği mevcut değil.");
  }
});
</script>
