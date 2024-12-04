<template>
    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature 
          v-for="polygon in polygons" 
          :key="polygon.id"
        >
          <ol-geom-polygon :coordinates="polygon.coordinates" />
          <ol-style>
            <ol-style-fill :color="mapStyles.polygon.fillColor" />
            <ol-style-stroke 
              :color="mapStyles.polygon.strokeColor" 
              :width="mapStyles.polygon.strokeWidth"
            />
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>
  </template>
  
  <script setup>
  import { mapStyles } from '../MapStyles'
  
  const props = defineProps({
    polygons: {
      type: Array,
      default: () => []
    }
  })
  </script>