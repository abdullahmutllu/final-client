import { defineStore } from "pinia";
import { ref } from 'vue';
export const useLocationStore = defineStore('location',()=>{
    const location = ref({ longitude: null, latitude: null }); // Koordinatlar burada tutulacak

  // Konum verisini güncelleyen bir yöntem
  const setLocation = (longitude, latitude) => {
    location.value = { longitude, latitude }; // Konumu 4236 formatında (longitude, latitude) kaydet
  };
    return {location,setLocation}
});