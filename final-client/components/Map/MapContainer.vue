<template>
  <div>
    <ol-map
      id="map-container"
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
      style="height: 600px"
    >
      <ol-view :center="center" :zoom="zoom" />
      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>
      <LocationLayer
        @positionCoordinate="handlePositionUpdate"
        :mapView="$refs.mapView"
      />
      <PointLayer />
      <!-- <NearbyChargingStations
      v-if="userLocation"
      :userLocation="userLocation"
    /> -->
      <ol-interaction-select
        @select="featureSelected"
        :condition="selectCondition"
        :filter="selectInteractionFilter"
        :layers="[ChargingStationLayer, PathLayer]"
      >
      </ol-interaction-select>

      <!-- Existing layer templates -->
      <template v-if="layerVisibility.parkingAreas">
        <ParkingAreaLayer :parking-areas="parkingAreaStore.parkingAreas" />
      </template>
      <template v-if="layerVisibility.PetrolStation">
        <PetrolStationLayer :stations="petrolStationStore.stations" />
      </template>
      <template v-if="layerVisibility.ChargingStation">
        <ChargingStationLayer
          :points="mapStore.points"
          :selected-city="selectedCity"
        />
      </template>
      <template v-if="layerVisibility.TrafficLights">
        <TrafficLightsLayer :points="trafficLightsStore.points" />
      </template>

      <template v-if="layerVisibility.paths">
        <PathLayer :paths="pathStore.paths" />
      </template>

      <!-- Drawing Layer -->
      <ol-vector-layer>
        <ol-source-vector :features="drawnFeatures">
          <ol-interaction-draw
            v-if="isDrawingActive"
            type="Polygon"
            @drawstart="onDrawStart"
            @drawend="onDrawEnd"
          ></ol-interaction-draw>
        </ol-source-vector>
      </ol-vector-layer>
    </ol-map>

    <div class="mt-2 space-x-2">
      <!-- Existing layer toggle buttons -->
      <b-button
        :variant="layerVisibility.parkingAreas ? 'primary' : 'secondary'"
        @click="toggleLayerVisibility('parkingAreas')"
      >
        Park Alanları {{ layerVisibility.parkingAreas ? 'Açık' : 'Kapalı' }}
      </b-button>

      <b-button
        :variant="layerVisibility.ChargingStation ? 'primary' : 'secondary'"
        @click="toggleLayerVisibility('ChargingStation')"
      >
        Şarj İstasyonları
        {{ layerVisibility.ChargingStation ? 'Açık' : 'Kapalı' }}
      </b-button>
      <b-button
        :variant="layerVisibility.TrafficLights ? 'primary' : 'secondary'"
        @click="toggleLayerVisibility('TrafficLights')"
      >
        Trafik Lambaları {{ layerVisibility.TrafficLights ? 'Açık' : 'Kapalı' }}
      </b-button>

      <b-button
        :variant="layerVisibility.paths ? 'primary' : 'secondary'"
        @click="toggleLayerVisibility('paths')"
      >
        Yollar {{ layerVisibility.paths ? 'Açık' : 'Kapalı' }}
      </b-button>
      <b-button
        :variant="layerVisibility.PetrolStation ? 'primary' : 'secondary'"
        @click="toggleLayerVisibility('PetrolStation')"
      >
        Petrol İstasyonları
        {{ layerVisibility.PetrolStation ? 'Açık' : 'Kapalı' }}
      </b-button>
      <!-- Çizim Yap Butonu -->
      <b-button
        :variant="isDrawingActive ? 'danger' : 'success'"
        @click="toggleDrawing"
      >
        {{ isDrawingActive ? 'Çizimi Bitir' : 'Çizim Yap' }}
      </b-button>

      <!-- Clear Drawings Button -->
      <b-button
        v-if="drawnFeatures.length > 0"
        variant="warning"
        @click="clearDrawings"
      >
        Çizimleri Temizle
      </b-button>
      <!-- Filtrele Butonu -->
      <b-button
        v-if="drawnFeatures.length > 0"
        variant="primary"
        @click="sendPolygonCoordinates"
      >
        Filtrele
      </b-button>
      <b-button variant="primary" @click="takeScreenshotAsPdf">
        Ekran Görüntüsü Al
      </b-button>
    </div>

    <!-- Existing modals -->
    <CityFilterModal
      :is-visible="isModalVisible"
      :unique-cities="mapStore.uniqueCities"
      @close="closeCityFilterModal"
      @apply-filter="applyFilter"
    />

    <FeatureDetailsModal
      :is-visible="isFeatureModalVisible"
      :feature="selectedFeature"
      @close="closeFeatureModal"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useMapStore } from '~/stores/mapStore'
import { useParkingAreaStore } from '~/stores/parkingAreaStore'
import { usePathStore } from '~/stores/pathStore'
import { useFilterStore } from '~/stores/filterStore'
import ParkingAreaLayer from './MapLayers/ParkingAreaLayer.vue'
import LocationLayer from './MapLayers/LocationLayer.vue'
import PetrolStationLayer from './MapLayers/PetrolStationLayer.vue'
import ChargingStationLayer from './MapLayers/ChargingStationLayer.vue'
import PathLayer from './MapLayers/PathLayer.vue'
import CityFilterModal from '~/components/Modal/CityFilterModal.vue'
import FeatureDetailsModal from '~/components/Modal/FeatureDetailModal.vue'
import { BButton } from 'bootstrap-vue-next'
import { singleClick } from 'ol/events/condition'
import Feature from 'ol/Feature'
import { useTrafficLightsStore } from '../../stores/trafficLights'
import TrafficLightsLayer from './MapLayers/TrafficLightsLayer.vue'
import { fromLonLat } from 'ol/proj'
import { usePetrolStationStore } from '../../stores/petrolStationStore'
import PointLayer from './MapLayers/PointLayer.vue'
import html2pdf from 'html2pdf.js'
// Stores
const mapStore = useMapStore()
const pathStore = usePathStore()
const parkingAreaStore = useParkingAreaStore()
const filterStore = useFilterStore()
const trafficLightsStore = useTrafficLightsStore()
const petrolStationStore = usePetrolStationStore()
// Map state
const zoom = ref(6)
const center = computed(() => mapStore.mapCenter || [39, 35])
const selectedFeature = ref(null)
const selectedCity = ref('')
const handlePositionUpdate = (value) => {
  console.log('test', value)
}
const takeScreenshotAsPdf = async () => {
  try {
    const mapContainer = document.querySelector('#map-container') // Harita container'ını seç

    // PDF konfigürasyonu
    const opt = {
      margin: 0.5, // Sayfa kenar boşluğu
      filename: 'map_screenshot.pdf', // PDF dosyasının adı
      image: { type: 'jpeg', quality: 1.0 }, // Görüntü kalitesi
      html2canvas: { dpi: 300, letterRendering: true, scale: 2 }, // HTML2Canvas konfigürasyonu
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }, // jsPDF konfigürasyonu
    }

    // Harita görüntüsünü PDF'ye dönüştür
    html2pdf()
      .from(mapContainer)
      .set(opt)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        var totalPages = pdf.internal.getNumberOfPages()
        pdf.setFontSize(10) // Yazı font boyutunu ayarlayın

        // Yazıyı PDF'in altına düzgün şekilde ekleyin
        const text = `
          Harita Altındaki Rapor:
          Bu PDF, harita görüntüsünün altına eklenen bir rapordur.
          Harita üzerinde belirtilen konumlar ve önemli veriler raporlanmıştır.
            Bu PDF, harita görüntüsünün altına eklenen bir rapordur.
          Harita üzerinde belirtilen konumlar ve önemli veriler raporlanmıştır.
            Bu PDF, harita görüntüsünün altına eklenen bir rapordur.
          Harita üzerinde belirtilen konumlar ve önemli veriler raporlanmıştır.
            Bu PDF, harita görüntüsünün altına eklenen bir rapordur.
          Harita üzerinde belirtilen konumlar ve önemli veriler raporlanmıştır.

          Yazı ve resimler uyumlu ve düzgün bir şekilde yerleştirilmiştir.`

        // Yazıyı eklerken, maxWidth ile düzgün bir biçim sağlanır ve sayfa sonunda düzgün bir şekilde metin eklenir.
        pdf.text(text, 0.1, pdf.internal.pageSize.height - 4, { maxWidth: 5 }) // Alt boşluk 1.5 inç

        // PDF'i kaydedin
        pdf.save('map_screenshot_with_text.pdf')
      })
  } catch (error) {
    console.error('PDF kaydedilirken hata oluştu:', error)
  }
}

const isModalVisible = ref(false)
const isFeatureModalVisible = ref(false)

// Drawing state
const isDrawingActive = ref(false)
const drawnFeatures = ref([])
const polygonFilterCoordinate = ref([])
// Layer visibility
const layerVisibility = reactive({
  parkingAreas: false,
  points: false,
  paths: false,
  TrafficLights: false,
  PetrolStation: false,
})

// Toggle layer visibility
const toggleLayerVisibility = (layerName) => {
  layerVisibility[layerName] = !layerVisibility[layerName]
}

// Drawing methods
const toggleDrawing = () => {
  isDrawingActive.value = !isDrawingActive.value
}

const onDrawStart = (event) => {
  console.log('Drawing started')
}
const sendPolygonCoordinates = async () => {
  if (drawnFeatures.value.length > 0) {
    const geometry = drawnFeatures.value[0].getGeometry()
    const polygonValue = geometry.getCoordinates()
    polygonFilterCoordinate.value = polygonValue
    filterStore.setPolygonCoordinates(polygonFilterCoordinate.value)
    await filterStore.filterDataByPolygon()

    try {
      await filterStore.applyPolygonFilter(polygonFilterCoordinate.value)
      console.log(
        'Polygon coordinates sent to backend:',
        polygonFilterCoordinate.value
      )
    } catch (error) {
      console.error('Error sending polygon coordinates:', error)
    }
  } else {
    console.log('No polygon drawn')
  }
}
const onDrawEnd = (event) => {
  const feature = event.feature
  drawnFeatures.value.push(feature)

  // Log polygon coordinates
  const geometry = feature.getGeometry()
  const polygonValue = geometry.getCoordinates()

  console.log('Polygon Coordinates:', polygonValue)
}

const clearDrawings = () => {
  drawnFeatures.value = []
}

// Feature selection
const selectCondition = singleClick
const selectInteractionFilter = (feature) => {
  console.log('Feature properties:', feature.getProperties())
  return feature.getProperties().name !== undefined
}

const featureSelected = (event) => {
  if (event.selected && event.selected.length > 0) {
    selectedFeature.value = event.selected[0].getProperties()
    isFeatureModalVisible.value = true
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await mapStore.fetchMapData()
    await pathStore.fetchPathData()
    await parkingAreaStore.fetchParkingAreaData()
    await trafficLightsStore.fetchTrafficLights()
    await petrolStationStore.fetchPetrolStationData()
  } catch (error) {
    console.error('Veri çekme hatası:', error)
  }
})

const closeFeatureModal = () => {
  isFeatureModalVisible.value = false
}
</script>
