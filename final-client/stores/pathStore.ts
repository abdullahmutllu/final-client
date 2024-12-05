import { defineStore } from 'pinia'
import { transform } from 'ol/proj'
import { LineString } from 'ol/geom'

interface PathInfo {
  id: string | null
  toll?: string | null
  surface?: string | null
  ref?: string | null
  oneway?: string | null
  name?: string | null
  maxSpeed?: string | null
  lanes?: string | null
  intRef?: string | null
  highway?: string | null
  description?: string | null
  destination?: string | null
  altName?: string | null
  coordinates: [number, number][] | null
}

export const usePathStore = defineStore('pathStore', {
  state: () => ({
    paths: [] as PathInfo[],
    isLoading: false,
    error: null as string | null,
    cacheTimestamp: 0 // Önbellek için timestamp
  }),

  getters: {
    totalPaths(): number {
      return this.paths.length
    },

    uniqueHighways(): string[] {
      return [...new Set(this.paths.map(path => path.highway).filter(Boolean))]
    },

    mapCenter(): [number, number] {
      return transform([35.2433, 38.9637], 'EPSG:4326', 'EPSG:3857')
    },

    isCacheValid(): boolean {
      const cacheDuration = 5 * 60 * 1000 // 5 dakika
      return Date.now() - this.cacheTimestamp < cacheDuration
    }
  },

  actions: {
    transformCoordinates(coordinates: [number, number]): [number, number] | null {
      if (!coordinates) return null
      try {
        return transform(coordinates, 'EPSG:4326', 'EPSG:3857')
      } catch (error) {
        console.error('Koordinat dönüşüm hatası:', error)
        return null
      }
    },

    parseGeometry(geometryString: string): [number, number][] | null {
      // Geometriyi LINESTRING formatında parse et
      const matches = geometryString.match(/LINESTRING \(([^)]+)\)/)
      if (matches && matches.length === 2) {
        // Koordinatları ayır ve her birini array içine al
        const coords: [number, number][] = matches[1]
          .split(',')
          .map(coord => {
            const [x, y] = coord.trim().split(' ').map(parseFloat)
            return [x, y]
          })
        
        // Koordinatları EPSG:3857'ye dönüştür
        return coords.map(this.transformCoordinates).filter(coord => coord !== null)
      }
      return null
    },

    async fetchPathData(forceUpdate = false) {
      console.log('fetchPathData fonksiyonu tetiklendi') // Fonksiyonun tetiklendiğini kontrol edin

      if (!forceUpdate && this.isCacheValid) {
        console.log('Önbellek geçerli, veri çekilmedi.')
        return
      }

      this.isLoading = true
      this.error = null
      console.log('Path verileri yükleniyor...')

      try {
        const response = await $fetch('https://localhost:7129/api/Path', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          retry: 0,
          ignoreResponseError: true
        })

        console.log('API Yanıtı:', response) // API yanıtını kontrol edin

        if (response && response.$values) {
          console.log('API yanıtındaki path verileri:', response.$values) // Yanıtın içeriğini kontrol edin
          this.paths = response.$values.map(item => ({
            id: item.id,
            toll: item.toll,
            surface: item.surface,
            ref: item.ref,
            oneway: item.oneway,
            name: item.name,
            maxSpeed: item.maxSpeed,
            lanes: item.lanes,
            intRef: item.intRef,
            highway: item.highway,
            description: item.description,
            destination: item.destination,
            altName: item.altName,
            coordinates: this.parseGeometry(item.wkbGeometry) // Geometriyi dönüştürme
          })).filter(path => path.coordinates !== null)

          console.log('Çekilen ve işlenen path verileri:', this.paths) // İşlenmiş veriyi kontrol edin

          this.cacheTimestamp = Date.now()
        } else {
          throw new Error('Geçersiz yanıt formatı')
        }

        this.isLoading = false
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Bilinmeyen hata'
        this.isLoading = false
        console.error('Path verileri yüklenirken hata:', error)
      }
    }
  }
})
