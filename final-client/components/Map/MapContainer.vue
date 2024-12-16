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
        Rapor Al
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
import { useAnalysisStore } from '~/stores/analysisStore'
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
const analysisStore = useAnalysisStore()
analysisStore.recommendedLocations.forEach((location) => {
  console.log('test', location)
  console.log('Location Latitude:', location.location.latitude)
  console.log('Location Longitude:', location.location.longitude)
})

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
    const mapContainer = document.querySelector('#map-container')

    const opt = {
      margin: 0.5,
      filename: 'rapor.pdf',
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { dpi: 300, letterRendering: true, scale: 3 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    }

    html2pdf()
      .from(mapContainer)
      .set(opt)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const pageWidth = pdf.internal.pageSize.width
        const pageHeight = pdf.internal.pageSize.height

        pdf.setFontSize(8)

        let text = ''

        analysisStore.recommendedLocations.forEach((location, index) => {
          text += `Konum ${index + 1}:\n`
          text += `Latitude: ${location.location.latitude}\n`
          text += `Longitude: ${location.location.longitude}\n`
          text += `Elektrik istasyonuna en yakin mesafe: ${location.min_distance_to_existing_station} km \n`
          text += 'Yakin cevre detaylari:\n'
          text += `  - Otopark alanlari: ${location.nearby_details.parking_areas}\n`
          text += `  - Yollar: ${location.nearby_details.paths}\n`
          text += `- Petrol İstasyonlari: ${location.nearby_details.petrol_stations}\n`
          text += `  - Trafik Isiklari: ${location.nearby_details.traffic_lights}\n`
          text += `Konum Skoru: ${location.score}\n\n`
        })

        const yOffset = pageHeight - 4.2
        pdf.text(text, 0.1, yOffset, { maxWidth: pageWidth - 0.2 })

        const currentDate = new Date().toLocaleDateString('tr-TR')
        pdf.setFontSize(8)

        pdf.text(
          `Rapor Tarihi: ${currentDate}`,
          pageWidth - 0.5,
          pageHeight - 0.5,
          { align: 'right' }
        )

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
