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

    <!-- Bu modal ayrılacak -->
    <b-modal v-model="isFeatureModalVisible" title="Çizim Detayları" size="sz" class="custom-modal">
      <div v-if="selectedFeature" class="grid grid-cols-2 gap-4">
        <div>
          <h3 class="text-lg font-bold mb-3">Temel Bilgiler</h3>
          <p v-if="selectedFeature.name"><strong>İsim:</strong> {{ selectedFeature.name }}</p>
          <p v-if="selectedFeature.city"><strong>Şehir:</strong> {{ selectedFeature.city }}</p>
          <p v-if="selectedFeature.district"><strong>İlçe:</strong> {{ selectedFeature.district }}</p>
          <p v-if="selectedFeature.subDistrict"><strong>Alt Bölge:</strong> {{ selectedFeature.subDistrict }}</p>
          <p v-if="selectedFeature.street"><strong>Sokak:</strong> {{ selectedFeature.street }}</p>
          <p v-if="selectedFeature.operator"><strong>İşletme:</strong> {{ selectedFeature.operator }}</p>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-3">İletişim Bilgileri</h3>
          <p v-if="selectedFeature.contactPhone"><strong>Telefon:</strong> {{ selectedFeature.contactPhone }}</p>
          <p v-if="selectedFeature.branch"><strong>Şube:</strong> {{ selectedFeature.branch }}</p>
          <p v-if="selectedFeature.openingHours"><strong>Açılış Saatleri:</strong> {{ selectedFeature.openingHours }}</p>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-3">Elektrik Bilgileri</h3>
          <p v-if="selectedFeature.voltage"><strong>Voltaj:</strong> {{ selectedFeature.voltage }}</p>
          <p v-if="selectedFeature.amperage"><strong>Amper:</strong> {{ selectedFeature.amperage }}</p>
          <p v-if="selectedFeature.capacity"><strong>Kapasite:</strong> {{ selectedFeature.capacity }}</p>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-3">Soket Bilgileri</h3>
          <p v-if="selectedFeature.socketType2"><strong>Soket Tipi:</strong> Type 2</p>
          <p v-if="selectedFeature.socketType1Combo"><strong>Soket Tipi:</strong> Type 1 Combo</p>
          <p v-if="selectedFeature.socketChademo"><strong>Chademo Soket:</strong> Var</p>
          <p v-if="selectedFeature.socketType2"><strong>Type 2 Soket:</strong> Var</p>
          <p v-if="selectedFeature.socketType2Combo"><strong>Type 2 Combo Soket:</strong> Var</p>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-3">Araç ve Şarj Bilgileri</h3>
          <p v-if="selectedFeature.brand"><strong>Marka:</strong> {{ selectedFeature.brand }}</p>
          <p v-if="selectedFeature.car"><strong>Araç:</strong> {{ selectedFeature.car }}</p>
          <p v-if="selectedFeature.bus"><strong>Otobüs:</strong> {{ selectedFeature.bus }}</p>
          <p v-if="selectedFeature.charge"><strong>Şarj:</strong> {{ selectedFeature.charge }}</p>
          <p v-if="selectedFeature.covered"><strong>Kapalı Alan:</strong> {{ selectedFeature.covered ? 'Evet' : 'Hayır' }}</p>
        </div>
      </div>
    </b-modal>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMapStore } from '~/stores/mapStore';
import PointLayer from './MapLayers/PointLayer.vue';
import { BModal, BButton } from 'bootstrap-vue-next';
import { singleClick } from 'ol/events/condition'

const mapStore = useMapStore();
const zoom = ref(6);
const center = computed(() => mapStore.mapCenter);
const selectedCity = ref('');
const isModalVisible = ref(false);
const isFeatureModalVisible = ref(false); // Modalın görünürlüğünü kontrol eden değişken
const selectedFeature = ref(null); // Seçilen çizimi saklamak için

const selectCondition = singleClick;
const selectInteractionFilter = (feature) => {
  console.log('Feature properties:', feature.getProperties()); // Daha detaylı konsol çıktısı
  return feature.getProperties().name !== undefined;
};

// Çizim seçildiğinde tetiklenen fonksiyon
const featureSelected = (event) => {
  console.log('Seçim olayı:', event);
  if (event.selected && event.selected.length > 0) {
    selectedFeature.value = event.selected[0].getProperties(); // Seçilen çizimi sakla
    isFeatureModalVisible.value = true; // Modalı göster
  }
};

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
.custom-modal .modal-dialog {
  width: 400px;  /* Genişlik */
  height: 400px; /* Yükseklik */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Ekranın tam ortasına yerleştirme */
  margin: 0;
}

.custom-modal .modal-content {
  width: 100%; /* İçeriği genişliğe göre uyarlama */
  height: 100%; /* İçeriği yüksekliğe göre uyarlama */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* İçeriği dikeyde dengeleme */
}

.custom-modal .modal-header {
  background-color: #f7f7f7; /* Modal başlığının arka plan rengi */
  padding: 10px; /* Başlık kısmının paddingi */
}

.custom-modal .modal-body {
  padding: 10px; /* İçerik kısmının paddingi */
  overflow-y: auto; /* İçerik fazla olduğunda kaydırma ekleme */
}
</style>

