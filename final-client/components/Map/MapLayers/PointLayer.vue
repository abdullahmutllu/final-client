<template>
  <!-- Harita ve özellikler -->
  <ol-vector-layer>
    <ol-source-vector>
      <ol-feature 
        v-for="point in points" 
        :key="point.id"
        :properties="{
          id: point.id,
          city: point.city || 'Bilinmeyen',
          district: point.district,
          province: point.province,
          street: point.street,
          subDistrict: point.subDistrict,
          subUrb: point.subUrb,
          amperage: point.amperage,
          membershipCard: point.membershipCard,
          branch: point.branch,
          brand: point.brand,
          bus: point.bus,
          capacity: point.capacity,
          car: point.car,
          charge: point.charge,
          contactPhone: point.contactPhone,
          covered: point.covered,
          name: point.name,
          openingHours: point.openingHours,
          operator: point.operator,
          phone: point.phone,
          socket: point.socket,
          socketChademo: point.socketChademo,
          socketType1Combo: point.socketType1Combo,
          socketType2: point.socketType2,
          socketType2Output: point.socketType2Output,
          socketType2Combo: point.socketType2Combo,
          socketType2ComboOutput: point.socketType2ComboOutput,
          voltage: point.voltage,
        }"
        @click="featureSelected"
      >
        <ol-geom-point :coordinates="point.coordinates" />
        <ol-style>
          <ol-style-circle 
            :radius="3"
            :fill="{ color: 'green' }"
            :stroke="{ color: 'green', width: 3 }"
          />
        </ol-style>
      </ol-feature>
    </ol-source-vector>
  </ol-vector-layer>

  <!-- Modal -->
  <BModal v-model="isModalVisible" :title="selectedFeature?.name || 'Nokta Detayları'" size="xl" centered @show="onModalShow"
    @hide="onModalHide">
    <div v-if="selectedFeature" class="grid grid-cols-2 gap-4">
      <div>
        <h3 class="text-lg font-bold mb-3">Temel Bilgiler</h3>
        <p><strong>İsim:</strong> {{ selectedFeature.name || 'Bilinmiyor' }}</p>
        <p><strong>Şehir:</strong> {{ selectedFeature.city || 'Bilinmiyor' }}</p>
        <p><strong>İlçe:</strong> {{ selectedFeature.district || 'Bilinmiyor' }}</p>
        <p><strong>Alt Bölge:</strong> {{ selectedFeature.subDistrict || 'Bilinmiyor' }}</p>
        <p><strong>Sokak:</strong> {{ selectedFeature.street || 'Bilinmiyor' }}</p>
        <p><strong>İşletme:</strong> {{ selectedFeature.operator || 'Bilinmiyor' }}</p>
      </div>

      <div>
        <h3 class="text-lg font-bold mb-3">İletişim Bilgileri</h3>
        <p><strong>Telefon:</strong> {{ selectedFeature.contactPhone || 'Bilinmiyor' }}</p>
        <p><strong>Şube:</strong> {{ selectedFeature.branch || 'Bilinmiyor' }}</p>
        <p><strong>Açılış Saatleri:</strong> {{ selectedFeature.openingHours || 'Bilinmiyor' }}</p>
      </div>

      <div>
        <h3 class="text-lg font-bold mb-3">Elektrik Bilgileri</h3>
        <p><strong>Voltaj:</strong> {{ selectedFeature.voltage || 'Bilinmiyor' }}</p>
        <p><strong>Amper:</strong> {{ selectedFeature.amperage || 'Bilinmiyor' }}</p>
        <p><strong>Kapasite:</strong> {{ selectedFeature.capacity || 'Bilinmiyor' }}</p>
      </div>

      <div>
        <h3 class="text-lg font-bold mb-3">Soket Bilgileri</h3>
        <p><strong>Soket Tipi:</strong> 
          <span v-if="selectedFeature.socketType2">Type 2</span>
          <span v-else-if="selectedFeature.socketType1Combo">Type 1 Combo</span>
          <span v-else>Bilinmiyor</span>
        </p>
        <p><strong>Chademo Soket:</strong> {{ selectedFeature.socketChademo ? 'Var' : 'Yok' }}</p>
        <p><strong>Type 2 Soket:</strong> {{ selectedFeature.socketType2 ? 'Var' : 'Yok' }}</p>
        <p><strong>Type 2 Combo Soket:</strong> {{ selectedFeature.socketType2Combo ? 'Var' : 'Yok' }}</p>
      </div>

      <div>
        <h3 class="text-lg font-bold mb-3">Araç ve Şarj Bilgileri</h3>
        <p><strong>Marka:</strong> {{ selectedFeature.brand || 'Bilinmiyor' }}</p>
        <p><strong>Araç:</strong> {{ selectedFeature.car || 'Bilinmiyor' }}</p>
        <p><strong>Otobüs:</strong> {{ selectedFeature.bus || 'Bilinmiyor' }}</p>
        <p><strong>Şarj:</strong> {{ selectedFeature.charge || 'Bilinmiyor' }}</p>
        <p><strong>Kapalı Alan:</strong> {{ selectedFeature.covered ? 'Evet' : 'Hayır' }}</p>
      </div>
    </div>
    <div v-else>
      Nokta bilgisi mevcut değil.
    </div>
  </BModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { BModal } from 'bootstrap-vue-next'

const isModalVisible = ref(false)
const selectedFeature = ref(null)

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

const featureSelected = (event) => {
  const feature = event.target;  // tıklanan feature'ı alıyoruz
  selectedFeature.value = feature.getProperties();  // feature'ın özelliklerini al
  console.log('testt:', feature);  // feature'ın doğru özelliklerini görmek için
  isModalVisible.value = true;
}

const onModalShow = () => {
  console.log('Modal açıldı')
}

const onModalHide = () => {
  console.log('Modal kapandı')
}
</script>

<style>
/* Stil düzenlemeleri */
.modal-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 0;
}

.modal-content {
  width: 80%;
  max-width: 800px;
  margin: 0 auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
</style>
