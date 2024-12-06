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
const strokeWidth = ref(2);
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
  return props.paths;
});

const featureSelected = (event) => {
  const feature = event.target;
  selectedFeature.value = feature.getProperties();
  isModalVisible.value = true;
};
</script>
