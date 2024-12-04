<template>
  <div>
    <div v-if="mapStore.isLoading" class="text-center">
      İstasyonlar yükleniyor...
    </div>
    
    <div v-else-if="mapStore.error" class="text-red-500">
      Hata: {{ mapStore.error }}
    </div>
    
    <ol-map
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
      style="height: 600px"
    >
      <ol-view
        :center="center"
        :zoom="zoom"
      />
      
      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>
      
      <!-- Sadece veriler yüklendiğinde PointLayer render edilecek -->
      <PointLayer 
        v-if="mapStore.points.length > 0"
        :points="mapStore.points" 
        :selected-city="selectedCity"
      />
    </ol-map>
    
    <div class="mt-4">
      <h3>Toplam İstasyon Sayısı: {{ mapStore.totalPoints }}</h3>
      
      <div class="mt-2">
        <label>Şehre Göre Filtrele:</label>
        <select v-model="selectedCity" class="ml-2 p-1 border rounded">
          <option value="">Tüm Şehirler</option>
          <option
            v-for="city in mapStore.uniqueCities"
            :key="city"
            :value="city"
          >
            {{ city }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMapStore } from '~/stores/mapStore'
import PointLayer from './MapLayers/PointLayer.vue'

const mapStore = useMapStore()
const zoom = ref(6)
const center = computed(() => mapStore.mapCenter)
const selectedCity = ref('')

onMounted(async () => {
  await mapStore.fetchMapData()
})
</script>
