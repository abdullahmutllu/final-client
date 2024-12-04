import { defineStore } from 'pinia'
import { transform } from 'ol/proj'

interface ChargingStation {
  id: number
  city?: string
  district?: string
  province?: string
  street?: string
  subDistrict?: string
  subUrb?: string
  amperage?: string
  membershipCard?: string
  branch?: string
  brand?: string
  bus?: string
  capacity?: string
  car?: string
  charge?: string
  contactPhone?: string
  covered?: string
  name?: string
  openingHours?: string
  operator?: string
  phone?: string
  socket?: string
  socketChademo?: string
  socketType1Combo?: string
  socketType2?: string
  socketType2Output?: string
  socketType2Combo?: string
  socketType2ComboOutput?: string
  voltage?: string
  coordinates: [number, number] | null
}

export const useMapStore = defineStore('mapStore', {
  state: () => ({
    points: [] as ChargingStation[],
    isLoading: false,
    error: null as string | null,
    cacheTimestamp: 0 // Önbellek için timestamp
  }),

  getters: {
    totalPoints(): number {
      return this.points.length
    },

    uniqueCities(): string[] {
      return [...new Set(this.points.map(point => point.city).filter(Boolean))]
    },

    mapCenter(): [number, number] {
      return transform([35.2433, 38.9637], 'EPSG:4326', 'EPSG:3857')
    },

    // Önbellek süresi: 5 dakika
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

    parseGeometry(geometryString: string): [number, number] | null {
      const matches = geometryString.match(/POINT \(([^\s]+)\s([^\s]+)\)/)

      if (matches && matches.length === 3) {
        const coords: [number, number] = [
          parseFloat(matches[1]),
          parseFloat(matches[2])
        ]
        return this.transformCoordinates(coords)
      }

      return null
    },

    async fetchMapData(forceUpdate = false) {
      // Önbellek geçerli ise veriyi tekrar çekmeye gerek yok
      if (!forceUpdate && this.isCacheValid) {
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const response = await $fetch('https://localhost:7129/api/ChargingStation', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          retry: 0,
          ignoreResponseError: true
        })

        if (response && response.$values) {
          this.points = response.$values.map(item => ({
            id: item.id,
            city: item.city || 'Bilinmeyen',
            district: item.district,
            province: item.province,
            street: item.street,
            subDistrict: item.subDistrict,
            subUrb: item.subUrb,
            amperage: item.amperage,
            membershipCard: item.membershipCard,
            branch: item.branch,
            brand: item.brand,
            bus: item.bus,
            capacity: item.capacity,
            car: item.car,
            charge: item.charge,
            contactPhone: item.contactPhone,
            covered: item.covered,
            name: item.name,
            openingHours: item.openingHours,
            operator: item.operator,
            phone: item.phone,
            socket: item.socket,
            socketChademo: item.socketChademo,
            socketType1Combo: item.socketType1Combo,
            socketType2: item.socketType2,
            socketType2Output: item.socketType2Output,
            socketType2Combo: item.socketType2Combo,
            socketType2ComboOutput: item.socketType2ComboOutput,
            voltage: item.voltage,
            coordinates: this.parseGeometry(item.geometry) // Geometriyi dönüştürme
          })).filter(point => point.coordinates !== null)

          // Veriyi başarılı şekilde aldıktan sonra önbellek timestamp'ini güncelle
          this.cacheTimestamp = Date.now()
        } else {
          throw new Error("Invalid response format")
        }

        this.isLoading = false
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
        this.isLoading = false
        console.error('Harita verileri yüklenirken hata:', error)
      }
    }
  }
})
