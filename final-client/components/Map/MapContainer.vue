<template>
  <div>
       <!-- Harita İşlemleri -->
    <ol-map
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
      style="height: 600px"
    >
      <ol-view :center="center" :zoom="zoom" />
      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>
      
      <ol-interaction-select
        @select="featureSelected"
        :condition="selectCondition"
        :filter="selectInteractionFilter"
        :layers="[ChargingStationLayer, PathLayer]"
      >
      </ol-interaction-select>
      <template v-if="layerVisibility.parkingAreas">
        <ParkingAreaLayer 
          :parking-areas="parkingAreaStore.parkingAreas" 
        />
      </template>


      <template v-if="layerVisibility.ChargingStation">
        <ChargingStationLayer 
          :points="mapStore.points" 
          :selected-city="selectedCity"
        />
      </template>

      <template v-if="layerVisibility.paths">
        <PathLayer 
          :paths="pathStore.paths" 
        />
      </template>

    </ol-map>

    <div v-if="mapStore.isLoading" class="text-center mt-2">
      İstasyonlar yükleniyor...
    </div>

    <div v-else-if="mapStore.error" class="text-red-500 mt-2">
      Hata: {{ mapStore.error }}
    </div>

    <!-- Katman Açma Kapatma İşlemleri -->
    <div class="mt-2 space-x-2">
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
        Şarj İstasyonları {{ layerVisibility.ChargingStation ? 'Açık' : 'Kapalı' }}
      </b-button>
      
      <b-button 
        :variant="layerVisibility.paths ? 'primary' : 'secondary'"
        @click="toggleLayerVisibility('paths')"
      >
        Yollar {{ layerVisibility.paths ? 'Açık' : 'Kapalı' }}
      </b-button>
    </div>
    
    
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
// Store
import { useMapStore } from '~/stores/mapStore';
import { useParkingAreaStore } from '~/stores/parkingAreaStore';
import { usePathStore } from '~/stores/pathStore'; 
// Layer
import ParkingAreaLayer from './MapLayers/ParkingAreaLayer.vue'; 
import ChargingStationLayer from './MapLayers/ChargingStationLayer.vue';
import PathLayer from './MapLayers/PathLayer.vue';
// Modal
import CityFilterModal from '~/components/Modal/CityFilterModal.vue';
import FeatureDetailsModal from '~/components/Modal/FeatureDetailModal.vue';
// Boostrap-Vue-next
import { BButton } from 'bootstrap-vue-next';
//vue3-openlayers
import { singleClick } from 'ol/events/condition';

//
const mapStore = useMapStore();
const pathStore = usePathStore(); 
const parkingAreaStore = useParkingAreaStore();
//
const zoom = ref(6);
const center = computed(() => mapStore.mapCenter || [39, 35]);
const selectedFeature = ref(null);
const selectedCity = ref('');
//
const isModalVisible = ref(false);
const isFeatureModalVisible = ref(false);

// Layer Control
const layerVisibility = reactive({
  parkingAreas: false,
  points: false,
  paths: false
});

const toggleLayerVisibility = (layerName) => {
  layerVisibility[layerName] = !layerVisibility[layerName];
};

const selectCondition = singleClick;
const selectInteractionFilter = (feature) => {
  console.log('Feature properties:', feature.getProperties());
  return feature.getProperties().name !== undefined;
};

const featureSelected = (event) => {
  if (event.selected && event.selected.length > 0) {
    selectedFeature.value = event.selected[0].getProperties();
    isFeatureModalVisible.value = true;
  }
};

onMounted(async () => {
  try {
    await mapStore.fetchMapData();
    await pathStore.fetchPathData();
    await parkingAreaStore.fetchParkingAreaData();
  } catch (error) {
    console.error('Veri çekme hatası:', error);
  }
});




const closeFeatureModal = () => {
  isFeatureModalVisible.value = false;
};

</script>