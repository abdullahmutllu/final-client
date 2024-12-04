<template>
    <b-modal 
      :visible="isVisible" 
      title="Şehre Göre Filtrele" 
      size="lg" 
      @hidden="handleClose"
    >
      <div class="mt-2">
        <label>Şehre Göre Filtrele:</label>
        <select 
          v-model="selectedCityModel" 
          class="ml-2 p-1 border rounded w-full"
        >
          <option value="">Tüm Şehirler</option>
          <option
            v-for="city in cities"
            :key="city"
            :value="city"
          >
            {{ city }}
          </option>
        </select>
      </div>
  
      <template #modal-footer>
        <b-button variant="secondary" @click="handleClose">Kapat</b-button>
        <b-button variant="primary" @click="applyFilter">Uygula</b-button>
      </template>
    </b-modal>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  import { BModal, BButton } from 'bootstrap-vue-next';
  
  const props = defineProps({
    isVisible: {
      type: Boolean,
      required: true
    },
    uniqueCities: {
      type: Array,
      default: () => ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya']
    }
  });
  
  const emit = defineEmits(['update:isVisible', 'apply-filter']);
  
  // Use computed to ensure cities are always available
  const cities = computed(() => {
    return props.uniqueCities.length > 0 
      ? props.uniqueCities 
      : ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'];
  });
  
  const selectedCityModel = ref('');
  
  // Reset selected city when modal opens
  watch(() => props.isVisible, (newVal) => {
    if (newVal) {
      selectedCityModel.value = '';
    }
  });
  
  // Handle modal close
  const handleClose = () => {
    emit('update:isVisible', false);
  };
  
  // Apply filter and close modal
  const applyFilter = () => {
    emit('apply-filter', selectedCityModel.value);
    handleClose();
  };
  </script>