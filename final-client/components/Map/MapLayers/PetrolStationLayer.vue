<template> 
  <!-- Petrol İstasyonu Katmanı -->
  <ol-vector-layer>
    <ol-source-vector>
      <ol-feature 
        v-for="station in stations" 
        :key="station.id"
        :properties="{
          id: station.id,
          city: station.city || 'Bilinmeyen',
          country: station.country,
          district: station.district,
          houseName: station.houseName,
          houseNumber: station.houseNumber,
          neighbourhood: station.neighbourhood,
          place: station.place,
          postcode: station.postcode,
          street: station.street,
          amenity: station.amenity,
          brand: station.brand,
          brandWikidata: station.brandWikidata,
          brandWikipedia: station.brandWikipedia,
          building: station.building,
          carWash: station.carWash,
          compressedAir: station.compressedAir,
          fax: station.fax,
          phone: station.phone,
          createdBy: station.createdBy,
          fuelAdblue: station.fuelAdblue,
          fuelBenzine: station.fuelBenzine,
          fuelBiodiesel: station.fuelBiodiesel,
          fuelBiogas: station.fuelBiogas,
          fuelDiesel: station.fuelDiesel,
          fuelEuroDiesel: station.fuelEuroDiesel,
          fuelGasoline: station.fuelGasoline,
          fuelLpg: station.fuelLpg,
          fuelOctane95: station.fuelOctane95,
          fuelOctane98: station.fuelOctane98,
          image: station.image,
          mobile: station.mobile,
          name: station.name,
          nameEn: station.nameEn,
          nameRu: station.nameRu,
          nameTr: station.nameTr,
          openingHours: station.openingHours,
          operator: station.operator,
          paymentCash: station.paymentCash,
          paymentCreditCards: station.paymentCreditCards,
          selfService: station.selfService,
          source: station.source,
          toiletsWheelchair: station.toiletsWheelchair,
          website: station.website,
          wheelchair: station.wheelchair,
        }"
        @click="featureSelected"
      >
        <ol-geom-point :coordinates="station.coordinates" />
        <ol-style>
          <ol-style-stroke color="green" :width="1"></ol-style-stroke>
          <ol-style-fill color="rgba(0, 255, 0, 0.2)"></ol-style-fill>
          <ol-style-icon :src="markerIcon" :scale="0.1"></ol-style-icon>
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
        <p><strong>Sokak:</strong> {{ selectedFeature.street || 'Bilinmiyor' }}</p>
        <p><strong>İşletme:</strong> {{ selectedFeature.operator || 'Bilinmiyor' }}</p>
      </div>

      <div>
        <h3 class="text-lg font-bold mb-3">İletişim Bilgileri</h3>
        <p><strong>Telefon:</strong> {{ selectedFeature.phone || 'Bilinmiyor' }}</p>
        <p><strong>Mobil:</strong> {{ selectedFeature.mobile || 'Bilinmiyor' }}</p>
        <p><strong>Faks:</strong> {{ selectedFeature.fax || 'Bilinmiyor' }}</p>
        <p><strong>Açılış Saatleri:</strong> {{ selectedFeature.openingHours || 'Bilinmiyor' }}</p>
      </div>

      <div>
        <h3 class="text-lg font-bold mb-3">Yakıt Bilgileri</h3>
        <p><strong>Benzin:</strong> {{ selectedFeature.fuelBenzine ? 'Var' : 'Yok' }}</p>
        <p><strong>Dizel:</strong> {{ selectedFeature.fuelDiesel ? 'Var' : 'Yok' }}</p>
        <p><strong>LPG:</strong> {{ selectedFeature.fuelLpg ? 'Var' : 'Yok' }}</p>
        <p><strong>Octane 95:</strong> {{ selectedFeature.fuelOctane95 ? 'Var' : 'Yok' }}</p>
        <p><strong>Octane 98:</strong> {{ selectedFeature.fuelOctane98 ? 'Var' : 'Yok' }}</p>
      </div>

      <div>
        <h3 class="text-lg font-bold mb-3">Diğer Bilgiler</h3>
        <p><strong>Tuvalet (Engelli):</strong> {{ selectedFeature.toiletsWheelchair ? 'Var' : 'Yok' }}</p>
        <p><strong>Web Sitesi:</strong> <a :href="selectedFeature.website">{{ selectedFeature.website || 'Yok' }}</a></p>
        <p><strong>Kendin Yap Hizmeti:</strong> {{ selectedFeature.selfService ? 'Evet' : 'Hayır' }}</p>
      </div>
    </div>
    <div v-else>
      Nokta bilgisi mevcut değil.
    </div>
  </BModal>
</template>

<script setup lang="ts">
import { ref,onMounted,watch } from 'vue'
import markerIcon from "@/assets/petrol.jpg";  // Petrol istasyonu ikonu

// props ile stations verisini al
const props = defineProps({
  stations: {
    type: Array,
    default: () => []
  },
});
watch(
  () => props.stations,
  (newStations) => {
    console.log('Updated Statiasddsasdaons:', newStations);
  }
);
onMounted(() => {
  console.log('Stationssssss:', props.stations);
});
const isModalVisible = ref(false)
const selectedFeature = ref(null)

const featureSelected = (event) => {
  const feature = event.target;  // tıklanan feature'ı alıyoruz
  selectedFeature.value = feature.getProperties();  // feature'ın özelliklerini al
  console.log('Petrol İstasyonu:', feature);  // feature'ın doğru özelliklerini görmek için
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
