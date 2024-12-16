<template>
  <div>
    <!-- OpenLayers haritası -->
    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature
          v-for="point in sortedTrafficLights"
          :key="point.id"
          @click.native="featureSelected(point)"
        >
          <ol-geom-point :coordinates="point.coordinates" />
          <ol-style>
            <ol-style-stroke color="red" :width="2"></ol-style-stroke>
            <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
            <ol-style-icon
              :src="getMarkerIcon(point)"
              :scale="0.1"
            ></ol-style-icon>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>

    <!-- Bootstrap Vue Next Modal -->
    <BModal
      v-model="isModalVisible"
      :title="selectedFeature?.name || 'Nokta Detayları'"
      size="xl"
      centered
      @show="onModalShow"
      @hide="onModalHide"
    >
      <div v-if="selectedFeature" class="grid grid-cols-2 gap-4">
        <div>
          <h3 class="text-lg font-bold mb-3">Temel Bilgiler</h3>
          <p>
            <strong>İsim:</strong> {{ selectedFeature.name || 'Bilinmiyor' }}
          </p>
          <p>
            <strong>Şehir:</strong> {{ selectedFeature.city || 'Bilinmiyor' }}
          </p>
          <p>
            <strong>İlçe:</strong>
            {{ selectedFeature.district || 'Bilinmiyor' }}
          </p>
          <p>
            <strong>Alt Bölge:</strong>
            {{ selectedFeature.subDistrict || 'Bilinmiyor' }}
          </p>
          <p>
            <strong>Sokak:</strong> {{ selectedFeature.street || 'Bilinmiyor' }}
          </p>
          <p>
            <strong>İşletme:</strong>
            {{ selectedFeature.operator || 'Bilinmiyor' }}
          </p>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-3">İletişim Bilgileri</h3>
          <p>
            <strong>Telefon:</strong>
            {{ selectedFeature.contactPhone || 'Bilinmiyor' }}
          </p>
          <p>
            <strong>Şube:</strong> {{ selectedFeature.branch || 'Bilinmiyor' }}
          </p>
          <p>
            <strong>Açılış Saatleri:</strong>
            {{ selectedFeature.openingHours || 'Bilinmiyor' }}
          </p>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-3">Elektrik Bilgileri</h3>
          <p>
            <strong>Voltaj:</strong>
            {{ selectedFeature.voltage || 'Bilinmiyor' }}
          </p>
          <p>
            <strong>Amper:</strong>
            {{ selectedFeature.amperage || 'Bilinmiyor' }}
          </p>
          <p>
            <strong>Kapasite:</strong>
            {{ selectedFeature.capacity || 'Bilinmiyor' }}
          </p>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-3">Soket Bilgileri</h3>
          <p>
            <strong>Soket Tipi:</strong>
            <span v-if="selectedFeature.socketType2">Type 2</span>
            <span v-else-if="selectedFeature.socketType1Combo"
              >Type 1 Combo</span
            >
            <span v-else>Bilinmiyor</span>
          </p>
          <p>
            <strong>Chademo Soket:</strong>
            {{ selectedFeature.socketChademo ? 'Var' : 'Yok' }}
          </p>
          <p>
            <strong>Type 2 Soket:</strong>
            {{ selectedFeature.socketType2 ? 'Var' : 'Yok' }}
          </p>
          <p>
            <strong>Type 2 Combo Soket:</strong>
            {{ selectedFeature.socketType2Combo ? 'Var' : 'Yok' }}
          </p>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-3">Araç ve Şarj Bilgileri</h3>
          <p>
            <strong>Marka:</strong> {{ selectedFeature.brand || 'Bilinmiyor' }}
          </p>
          <p>
            <strong>Araç:</strong> {{ selectedFeature.car || 'Bilinmiyor' }}
          </p>
          <p>
            <strong>Otobüs:</strong> {{ selectedFeature.bus || 'Bilinmiyor' }}
          </p>
          <p>
            <strong>Şarj:</strong> {{ selectedFeature.charge || 'Bilinmiyor' }}
          </p>
          <p>
            <strong>Kapalı Alan:</strong>
            {{ selectedFeature.covered ? 'Evet' : 'Hayır' }}
          </p>
        </div>
      </div>
      <div v-else>Nokta bilgisi mevcut değil.</div>
    </BModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { transform } from 'ol/proj'
import { BModal } from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import markerIcon1 from '@/assets/1.png'
import markerIcon2 from '@/assets/2.jpg'
import markerIcon3 from '@/assets/3.png'
import { useAnalysisStore } from '../../../stores/analysisStore'

const analysisStore = useAnalysisStore()
const trafficLights = ref([])
const isModalVisible = ref(false)
const selectedFeature = ref(null)

// Trafik ışıklarını güncelle
const updateTrafficLights = () => {
  trafficLights.value = analysisStore.recommendedLocations.map(
    (point: any, index: number) => ({
      id: index,
      coordinates: transform(
        [point.location.longitude, point.location.latitude],
        'EPSG:4326',
        'EPSG:3857'
      ),
      score: point.score,
      ...point,
    })
  )
}

// Noktaları puanlarına göre sıralama
const sortedTrafficLights = computed(() => {
  return trafficLights.value.sort((a, b) => b.score - a.score)
})

// Puanına göre simgeyi belirleyin
const getMarkerIcon = (point: any) => {
  const rank = sortedTrafficLights.value.indexOf(point) + 1
  if (rank === 1) return markerIcon1
  if (rank === 2) return markerIcon2
  if (rank === 3) return markerIcon3
  return markerIcon1
}

// Feature seçim fonksiyonu
const featureSelected = (point: any) => {
  console.log('Seçilen nokta:', point)
  selectedFeature.value = point
  isModalVisible.value = true
}

const onModalShow = () => {
  console.log('Modal açıldı')
}

const onModalHide = () => {
  console.log('Modal kapandı')
  selectedFeature.value = null
}

onMounted(async () => {
  await analysisStore.getAnalysisResponse()
  updateTrafficLights()

  watch(
    () => analysisStore.recommendedLocations,
    () => {
      updateTrafficLights()
    }
  )

  const intervalId = setInterval(async () => {
    await analysisStore.getAnalysisResponse()
    updateTrafficLights()
  }, 10000)

  onUnmounted(() => {
    clearInterval(intervalId)
  })
})
</script>
