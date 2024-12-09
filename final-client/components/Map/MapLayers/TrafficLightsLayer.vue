<template>
    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature 
          v-for="point in trafficLights" 
          :key="point.id"
        >
          <ol-geom-point :coordinates="point.coordinates" />
          <ol-style>
            <ol-style-stroke color="red" :width="2"></ol-style-stroke>
            <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
            <ol-style-icon :src="markerIcon" :scale="0.1"></ol-style-icon>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>
  </template>
  
  <script lang="ts" setup>
  import { computed } from 'vue';
  import markerIcon from "@/assets/trafficLigts.png"; // marker icon dosyasının yolu
  
  const props = defineProps({
    points: {
      type: Array,
      default: () => []
    }
  });
  
  const trafficLights = computed(() => {
    return props.points; // `points` dizisini doğrudan döndürür
  });
  </script>
  
  <style scoped>
  /* Burada harita için özel stil ekleyebilirsiniz */
  </style>
  