<template>
    <b-modal 
      :visible="isVisible" 
      title="Şarj İstasyonu" 
      size="sz" 
      class="custom-modal"
      @hidden="$emit('update:isVisible', false)"
    >
      <div v-if="feature" class="grid grid-cols-2 gap-4">
        <div>
          <h3 class="text-lg font-bold mb-3">Temel Bilgiler</h3>
          <p v-if="feature.name"><strong>İsim:</strong> {{ feature.name }}</p>
          <p v-if="feature.city"><strong>Şehir:</strong> {{ feature.city }}</p>
          <p v-if="feature.district"><strong>İlçe:</strong> {{ feature.district }}</p>
          <p v-if="feature.subDistrict"><strong>Alt Bölge:</strong> {{ feature.subDistrict }}</p>
          <p v-if="feature.street"><strong>Sokak:</strong> {{ feature.street }}</p>
          <p v-if="feature.operator"><strong>İşletme:</strong> {{ feature.operator }}</p>
        </div>
  
      </div>
    </b-modal>
  </template>
  
  <script setup>
  import { BModal } from 'bootstrap-vue-next';
  
  const props = defineProps({
    isVisible: {
      type: Boolean,
      required: true
    },
    feature: {
      type: Object,
      default: null
    }
  });
  
  const emit = defineEmits(['update:isVisible']);
  </script>
  
  <style scoped>

  </style>