<template>
    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature 
          v-for="point in points" 
          :key="point.id"
        >
          <ol-geom-point 
            :coordinates="point.coordinates" 
          />
          <ol-style>
            <ol-style-circle 
              :radius="6"
              :fill="{ color: 'red' }"
              :stroke="{ color: 'black', width: 2 }"
            />
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    points: {
      type: Array,
      default: () => []
    },
    selectedCity: {
      type: String,
      default: ''
    }
  })
  
  const points = computed(() => {
    return props.selectedCity
      ? props.points.filter(point => point.city === props.selectedCity)
      : props.points
  })
  </script>