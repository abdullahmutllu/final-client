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
            description: `Otopark: ${area.AbbOtopark || 'Bilinmiyor'}, Yer: ${
              area.City || 'Bilinmiyor'
            }, Ücretli: ${area.Charge || 'Hayır'}`,
            ...area,
          }"
          @click="featureSelected"
        >
          <!-- Polygon geometrisi çıkarıldı, sadece point kullanılıyor -->
          <ol-geom-point :coordinates="area.coordinates" />
          <ol-style>
            <ol-style-stroke color="red" :width="3"></ol-style-stroke>
            <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
            <ol-style-icon :src="markerIcon" :scale="0.1"></ol-style-icon>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>
  </div>
</template>

<script setup lang="ts">
import markerIcon from '@/assets/parkalan.jpg'
const props = defineProps({
  parkingAreas: {
    type: Array,
    default: () => [],
  },
})

// Koordinatları normalize eden fonksiyon
const normalizeCoordinates = (coords: any) => {
  if (Array.isArray(coords) && coords.length === 2) {
    // Koordinatları (lon, lat) olarak normalize et
    return [Number(coords[0]), Number(coords[1])]
  }
  return []
}

// Geçerli otopark alanlarını filtreleme
const validParkingAreas = computed(() => {
  return props.parkingAreas
    .map((area) => {
      const normalizedCoordinates = normalizeCoordinates(area.coordinates)
      return {
        id: area.id,
        coordinates: normalizedCoordinates,
        Name: area.Name,
        City: area.City,
        AbbOtopark: area.AbbOtopark,
        Charge: area.Charge,
      }
    })
    .filter((area) => area.coordinates && area.coordinates.length === 2) // Sadece geçerli point koordinatları olanları filtrele
})
</script>
