<template>
  <div>
    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature
  v-for="(area, index) in validParkingAreas"
  :key="area.id || index"
  :properties="{
    id: area.id,
    name: area.Name || 'Bilinmiyor',
    description: `Otopark: ${area.AbbOtopark || 'Bilinmiyor'}, Yer: ${area.City || 'Bilinmiyor'}, Ücretli: ${area.Charge || 'Hayır'}`,
    ...area
  }"
  @click="featureSelected"
>
  <ol-geom-polygon
    v-if="area.coordinates && area.coordinates.length > 0"
    :coordinates="area.coordinates" 
  />
  <ol-style>
  <ol-style-stroke color="red" :width="10"></ol-style-stroke>
  <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
</ol-style>
        </ol-feature>

      </ol-source-vector>
    </ol-vector-layer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps({
  parkingAreas: {
    type: Array,
    default: () => []
  }
});

// Koordinatları düzleştiren ve kontrol eden yardımcı fonksiyon
const normalizeCoordinates = (coords: any) => {
  // Proxy veya benzeri nesneleri diziye çevirme
  const coordinatesArray = Array.isArray(coords) 
    ? Array.from(coords).map(coord => 
        Array.isArray(coord) 
          ? [Number(coord[0]), Number(coord[1])] 
          : coord
      )
    : [];

  console.log('Normalized Coordinates:', coordinatesArray);
  return coordinatesArray;
};

// Valid park alanları
const validParkingAreas = computed(() => {
  return props.parkingAreas
    .map(area => {
      const normalizedCoordinates = normalizeCoordinates(area.coordinates);
      
      return {
        id: area.id ,
        coordinates: [normalizedCoordinates], // Dikkat: İç içe dizi
        Name: area.Name,
        City: area.City,
        AbbOtopark: area.AbbOtopark,
        Charge: area.Charge
      };
    })
    .filter(area => 
      area.coordinates && 
      area.coordinates.length > 0 && 
      area.coordinates[0].length > 2 // Poligon için en az 3 nokta gerekli
    );
});

// Koordinatların detaylı kontrolü
const isValidCoordinates = (coordinates: any) => {
  if (!coordinates || coordinates.length === 0) {
    console.warn('Koordinatlar boş');
    return false;
  }

  const isValid = coordinates[0].every((coord: any) => 
    Array.isArray(coord) && 
    coord.length === 2 && 
    !isNaN(coord[0]) && 
    !isNaN(coord[1])
  );

  if (!isValid) {
    console.warn('Geçersiz koordinat formatı', coordinates);
  }

  return isValid;
};

// İzleme ve log
watch(validParkingAreas, (newVal) => {
  
  newVal.forEach((area, index) => {
    console.group(`Alan ${index + 1}`);
    console.log('ID:', area.id);
    console.log('İsim:', area.Name);
    console.log('Şehir:', area.City);
    console.log('Koordinatlar:', area.coordinates);
    console.log('Koordinatlar Geçerli mi:', isValidCoordinates(area.coordinates));
    console.groupEnd();
  });
  console.groupEnd();
});

// İlk yüklenme
onMounted(() => {
  console.log('İlk Yüklenen Park Alanları:', validParkingAreas.value);
});

// Feature seçildiğinde
const featureSelected = (event) => {
  console.log('Seçilen Özellik:', event);
};
</script>
