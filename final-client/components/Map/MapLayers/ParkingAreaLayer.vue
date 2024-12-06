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
const props = defineProps({
  parkingAreas: {
    type: Array,
    default: () => []
  }
});

const normalizeCoordinates = (coords: any) => {
  const coordinatesArray = Array.isArray(coords)
    ? Array.from(coords).map(coord =>
        Array.isArray(coord)
          ? [Number(coord[0]), Number(coord[1])]
          : coord
      )
    : [];
  return coordinatesArray;
};

// Geçerli park alanları
const validParkingAreas = computed(() => {
  return props.parkingAreas
    .map(area => {
      const normalizedCoordinates = normalizeCoordinates(area.coordinates);
      return {
        id: area.id,
        coordinates: [normalizedCoordinates], 
        Name: area.Name,
        City: area.City,
        AbbOtopark: area.AbbOtopark,
        Charge: area.Charge
      };
    })
    .filter(area =>
      area.coordinates &&
      area.coordinates.length > 0 &&
      area.coordinates[0].length > 2
    );
});


</script>
