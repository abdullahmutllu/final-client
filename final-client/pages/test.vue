<template>
    <div>
      <h1>Park Alanları</h1>
  
      <!-- Yükleniyor mesajı -->
      <div v-if="isLoading">Veri Yükleniyor...</div>
  
      <!-- Hata mesajı -->
      <div v-if="error">{{ error }}</div>
    
      <!-- Park alanları listesini oluşturuyoruz -->
      <ul v-if="!isLoading && !error && parkingAreas.length > 0">
        <li v-for="(parking, index) in parkingAreas" :key="index">
          <strong>{{ parking.Name }}</strong>
          <ul>
            <li><strong>ID:</strong> {{ parking.id }}</li>
            <li><strong>Coordinates:</strong> {{ parking.coordinates }}</li>
          </ul>
        </li>
      </ul>
      
      <!-- Eğer park alanı yoksa -->
      <div v-if="!isLoading && !error && parkingAreas.length === 0">
        Park alanı bulunamadı.
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useParkingAreaStore } from '../stores/parkingAreaStore';
  
  export default defineComponent({
    setup() {
      const store = useParkingAreaStore();
      const parkingAreas = ref(store.parkingAreas); // Ref ile verileri saklıyoruz
      const isLoading = ref(store.isLoading); // Yükleniyor durumunu takip ediyoruz
      const error = ref(store.error); // Hata durumunu takip ediyoruz
  
      // Veri çekme işlemi onMounted ile yapılır
      onMounted(async () => {
        try {
          // Force veri çekme
          await store.fetchParkingAreaData(true); // forceUpdate: true
          // store.fetchParkingAreaData() asenkron bir işlem olduğundan, onu bekliyoruz.
        } catch (e) {
          console.error('Hata:', e);
          error.value = 'Veri yüklenirken bir hata oluştu.';
        }
      });
  
      // Data binding ile verileri template'te kullanıyoruz
      return {
        parkingAreas,
        isLoading,
        error
      };
    }
  });
  </script>
  