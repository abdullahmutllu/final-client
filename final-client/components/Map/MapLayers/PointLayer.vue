<template>
  <ol-vector-layer>
    <ol-source-vector>
      <ol-feature v-for="point in trafficLights" :key="point.id">
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

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { transform } from 'ol/proj'
import markerIcon from '@/assets/parkalan.jpg'
import { useAnalysisStore } from '../../../stores/analysisStore'

const analysisStore = useAnalysisStore()
const trafficLights = ref([])

// Harita üzerindeki noktaların koordinatlarını güncellemek için kullanılan fonksiyon
const updateTrafficLights = () => {
  trafficLights.value = analysisStore.recommendedLocations.map(
    (point: any, index: number) => ({
      id: index, // Her bir noktayı benzersiz yapmak için id oluşturuyoruz
      coordinates: transform(
        [point.location.longitude, point.location.latitude],
        'EPSG:4326',
        'EPSG:3857'
      ),
    })
  )
}

onMounted(async () => {
  // İlk veri çekme işlemi
  await analysisStore.getAnalysisResponse()
  updateTrafficLights() // İlk veriyi haritaya yansıt

  // Veri değişimini izleme (store'dan gelen verilerin değişimini dinleyin)
  watch(
    () => analysisStore.recommendedLocations,
    () => {
      updateTrafficLights() // Veriler değiştiğinde trafik ışıklarını güncelle
    }
  )

  // Veriyi düzenli aralıklarla çekme (örneğin, her 10 saniyede bir)
  setInterval(async () => {
    await analysisStore.getAnalysisResponse()
    updateTrafficLights() // Veriler değiştiğinde haritayı güncelle
  }, 10000) // 10 saniyede bir API'yi kontrol et
})
</script>
