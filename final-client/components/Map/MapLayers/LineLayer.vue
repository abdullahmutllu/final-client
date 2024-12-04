<template>
    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature 
          v-for="line in lines" 
          :key="line.id"
        >
          <ol-geom-line-string :coordinates="line.coordinates" />
          <ol-style>
            <ol-style-stroke 
              :color="mapStyles.line.color" 
              :width="mapStyles.line.width"
            />
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>
  </template>
  
  <script setup>
  import { mapStyles } from '../MapStyles'
  
  const props = defineProps({
    lines: {
      type: Array,
      default: () => []
    }
  })
  </script>