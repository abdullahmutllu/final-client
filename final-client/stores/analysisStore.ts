import { defineStore } from 'pinia'

export const useAnalysisStore = defineStore('analysisStore', {
  state: () => ({
    recommendedLocations: [], // API'den gelen verileri burada saklayacağız
  }),

  actions: {
    async getAnalysisResponse() {
      try {
        const response = await fetch(
          'http://localhost:5000/api/charging-stations/data',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error('Veri alınamadı')
        }

        const data = await response.json()

        const newRecommendedLocations = data.data.recommended_locations

        // Eğer veri değişmişse, haritayı güncelle
        if (
          JSON.stringify(newRecommendedLocations) !==
          JSON.stringify(this.recommendedLocations)
        ) {
          this.recommendedLocations = newRecommendedLocations
          this.updateMapWithNewData(newRecommendedLocations) // Harita güncelleniyor
        }
      } catch (error) {
        console.error('Veri alınırken hata oluştu:', error)
      }
    },

    startFetchingData() {
      // İlk veri çekme
      this.getAnalysisResponse()

      // Her 20 saniyede bir veri çekme
      setInterval(() => {
        this.getAnalysisResponse()
      }, 20000) // 20 saniyede bir veri çekme
    },

    // Haritadaki veriyi güncelleme fonksiyonu
    updateMapWithNewData(newLocations) {
      console.log('Harita yeni verilerle güncelleniyor...', newLocations)

      // OpenLayers harita nesnesine erişmek için örnek bir işlem (global bir harita nesnesi üzerinden)
      const map = window.map // Harita nesnesini global olarak alıyorsunuz

      // Harita katmanındaki verileri temizleme
      const source = map.getLayers().item(0).getSource()
      source.clear() // Önce eski verileri temizleyin

      // Yeni verilerle haritaya ekleme
      newLocations.forEach((location) => {
        const coord = [location.x, location.y]
        const feature = new ol.Feature({
          geometry: new ol.geom.Point(coord),
        })
        source.addFeature(feature)
      })
    },
  },
})
