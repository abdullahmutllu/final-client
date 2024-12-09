import { defineStore } from 'pinia'

export const useFilterStore = defineStore('filterStore', {
  state: () => ({
    polygonCoordinates: [] as number[][][],  // Polygon koordinatlarını saklamak için
    filteredData: [] as any[],               // API'den gelecek filtrelenmiş veriler
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    // Polygon koordinatlarını ayarla
    setPolygonCoordinates(polygon: number[][][]) {
      this.polygonCoordinates = polygon;
    },

    // API'ye gönder ve filtrelenmiş verileri al
    async filterDataByPolygon() {
        this.isLoading = true;
        this.error = null;
        try {
          const response = await fetch('https://localhost:7129/api/Filter', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              polygon: this.polygonCoordinates,  // Polygon koordinatlarını gönderiyoruz
            }),
          });
      
          if (!response.ok) {
            throw new Error('Filtreleme isteğinde hata oluştu.');
          }
      
          const data = await response.json();
          this.filteredData = data;  // API'den gelen verileri kaydet
        } catch (error) {
          console.error('Veri filtreleme hatası:', error);
          this.error = 'Veri filtreleme sırasında bir hata oluştu.';
        } finally {
          this.isLoading = false;
        }
      },
  },
});
