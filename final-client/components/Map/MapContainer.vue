<template>
  <div>
    <div v-if="mapStore.isLoading" class="text-center">
      İstasyonlar yükleniyor...
    </div>

    <div v-else-if="mapStore.error" class="text-red-500">
      Hata: {{ mapStore.error }}
    </div>

    <ol-map
      v-else
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
      style="height: 600px"
    >
      <ol-view :center="center" :zoom="zoom" />

      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>

      <PointLayer 
        :points="mapStore.points" 
        :selected-city="selectedCity"
      />
    </ol-map>

    <b-button variant="primary" @click="openCityFilterModal">Şehre Göre Filtrele</b-button>

    <b-modal v-model="isModalVisible" title="Şehre Göre Filtrele" size="lg">
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

      <template #modal-footer>
        <b-button variant="secondary" @click="closeCityFilterModal">Kapat</b-button>
        <b-button variant="primary" @click="applyFilter">Uygula</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMapStore } from '~/stores/mapStore';
import PointLayer from './MapLayers/PointLayer.vue';
import { BModal, BButton } from 'bootstrap-vue-next';

const mapStore = useMapStore();
const zoom = ref(6);
const center = computed(() => mapStore.mapCenter);
const selectedCity = ref('');
const isModalVisible = ref(false);

onMounted(async () => {
  await mapStore.fetchMapData();
});

const openCityFilterModal = () => {
  isModalVisible.value = true;
};

const closeCityFilterModal = () => {
  isModalVisible.value = false;
};

const applyFilter = () => {
  console.log(`Filtre uygulandı: ${selectedCity.value}`);
  closeCityFilterModal();
};
</script>

<style scoped>
</style>
