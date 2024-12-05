<template>

      
      <ol-vector-layer>
        <ol-source-vector>
          <ol-feature 
            v-for="path in paths" 
            :key="path.id"
            :properties="{
              id: path.id,
              name: path.name || path.ref,
              description: `Yüzey: ${path.surface}, Tek Yön: ${path.oneway}, Ücretli: ${path.toll || 'Hayır'}`
            }"
            @click="featureSelected"
          >
            <ol-geom-line-string 
              :coordinates="path.coordinates"
            />
            <ol-style>
              <ol-style-stroke 
                :color="strokeColor" 
                :width="strokeWidth"
              />
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>

  
    <!-- Modal -->
    <BModal v-model="isModalVisible" :title="selectedFeature?.name || 'Yol Detayları'" size="xl" centered>
      <div v-if="selectedFeature">
        <p><strong>İsim/Referans:</strong> {{ selectedFeature.name || 'Bilinmiyor' }}</p>
        <p><strong>Açıklama:</strong> {{ selectedFeature.description || 'Bilinmiyor' }}</p>
        <p v-if="selectedFeature.toll"><strong>Ücret Durumu:</strong> {{ selectedFeature.toll === 'yes' ? 'Ücretli' : 'Ücretsiz' }}</p>
      </div>
    </BModal>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { BModal } from 'bootstrap-vue-next';
  
  const center = ref([3627878.54, 4891371.59]); // Varsayılan merkez koordinatı
  const projection = ref("EPSG:3857"); // Web Mercator projeksiyon
  const zoom = ref(6); // Varsayılan zoom seviyesi
  const strokeWidth = ref(3);
  const strokeColor = ref("blue");
  
  const isModalVisible = ref(false);
  const selectedFeature = ref(null);
  
  const props = defineProps({
    paths: {
      type: Array,
      default: () => []
    }
  });
  
  const paths = computed(() => {
    console.log("Gelen yollar:", props.paths);
    return props.paths;
  });
  
  // Feature seçildiğinde modal göster
  const featureSelected = (event) => {
    const feature = event.target;
    selectedFeature.value = feature.getProperties();
    isModalVisible.value = true;
  };
  
  onMounted(() => {
    // Eğer paths varsa, ilk yolun merkezi ve zoom seviyesini ayarla
    if (props.paths && props.paths.length > 0) {
      const firstPath = props.paths[0];
      if (firstPath.coordinates && firstPath.coordinates.length > 0) {
        center.value = firstPath.coordinates[0];
      }
    }
  });
  </script>