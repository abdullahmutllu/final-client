<template>
  <div>
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
        :layers="[PointLayer]"
      >
      </ol-interaction-select>

      <PointLayer 
        :points="mapStore.points" 
        :selected-city="selectedCity"
      />
    </ol-map>

    <div v-if="mapStore.isLoading" class="text-center mt-2">
      İstasyonlar yükleniyor...
    </div>

    <div v-else-if="mapStore.error" class="text-red-500 mt-2">
      Hata: {{ mapStore.error }}
    </div>

    <b-button 
      variant="primary" 
      @click="openCityFilterModal" 
      class="mt-2"
    >
      Şehre Göre Filtrele
    </b-button>
    
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
import { ref, computed, onMounted } from 'vue';
import { useMapStore } from '~/stores/mapStore';
import PointLayer from './MapLayers/PointLayer.vue';
import CityFilterModal from '~/components/Modal/CityFilterModal.vue';
import FeatureDetailsModal from '~/components/Modal/FeatureDetailModal.vue';
import { BButton } from 'bootstrap-vue-next';
import { singleClick } from 'ol/events/condition'

const mapStore = useMapStore();
const zoom = ref(6);
const center = computed(() => mapStore.mapCenter || [39, 35]); 
const selectedCity = ref('');
const isModalVisible = ref(false);
const isFeatureModalVisible = ref(false);
const selectedFeature = ref(null);

const selectCondition = singleClick;
const selectInteractionFilter = (feature) => {
  console.log('Feature properties:', feature.getProperties());
  return feature.getProperties().name !== undefined;
};

const featureSelected = (event) => {
  console.log('Seçim olayı:', event);
  if (event.selected && event.selected.length > 0) {
    selectedFeature.value = event.selected[0].getProperties();
    isFeatureModalVisible.value = true;
  }
};

onMounted(async () => {
  try {
    await mapStore.fetchMapData();
  } catch (error) {
    console.error('Map data fetch error:', error);
  }
});

const openCityFilterModal = () => {
  isModalVisible.value = true;
};

const closeCityFilterModal = () => {
  isModalVisible.value = false;
};

const closeFeatureModal = () => {
  isFeatureModalVisible.value = false;
};

const applyFilter = (city) => {
  selectedCity.value = city;
  console.log(`Filtre uygulandı: ${city}`);
};
</script>