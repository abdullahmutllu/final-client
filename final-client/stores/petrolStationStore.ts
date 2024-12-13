import { defineStore } from 'pinia'
import { transform } from 'ol/proj'

interface PetrolStation {
  id: number
  city?: string
  country?: string
  district?: string
  houseName?: string
  houseNumber?: string
  neighbourhood?: string
  place?: string
  postcode?: string
  street?: string
  amenity?: string
  amenity1?: string
  brand?: string
  brandWikidata?: string
  brandWikipedia?: string
  building?: string
  carWash?: string
  compressedAir?: string
  fax?: string
  phone?: string
  createdBy?: string
  fuelAdblue?: string
  fuelBenzine?: string
  fuelBiodiesel?: string
  fuelBiogas?: string
  fuelDiesel?: string
  fuelEuroDiesel?: string
  fuelGasoline?: string
  fuelLpg?: string
  fuelOctane95?: string
  fuelOctane98?: string
  image?: string
  mobile?: string
  name?: string
  nameEn?: string
  nameRu?: string
  nameTr?: string
  openingHours?: string
  operator?: string
  paymentCash?: string
  paymentCreditCards?: string
  selfService?: string
  source?: string
  toiletsWheelchair?: string
  website?: string
  wheelchair?: string
  coordinates: [number, number] | null
}

export const usePetrolStationStore = defineStore('petrolStationStore', {
  state: () => ({
    stations: [] as PetrolStation[],
    isLoading: false,
    error: null as string | null,
    cacheTimestamp: 0,
  }),

  getters: {
    totalStations(): number {
      return this.stations.length
    },

    uniqueCities(): string[] {
      return [...new Set(this.stations.map(station => station.city).filter(Boolean))]
    },

    mapCenter(): [number, number] {
      return transform([35.2433, 38.9637], 'EPSG:4326', 'EPSG:3857')
    },

    isCacheValid(): boolean {
      const cacheDuration = 5 * 60 * 1000 // 5 dakikalık önbellek süresi
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

    async fetchPetrolStationData(forceUpdate = false) {
      if (!forceUpdate && this.isCacheValid) {
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const response = await $fetch('https://localhost:7129/api/PetrolStation', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          retry: 0,
          ignoreResponseError: true
        })

        if (response && response.$values) {
          console.log('Gelen veri:', response.$values);
          this.stations = response.$values.map(item => ({
            id: item.id,
            city: item.city || 'Bilinmeyen',
            country: item.country,
            district: item.district,
            houseName: item.houseName,
            houseNumber: item.houseNumber,
            neighbourhood: item.neighbourhood,
            place: item.place,
            postcode: item.postcode,
            street: item.street,
            amenity: item.amenity,
            amenity1: item.amenity1,
            brand: item.brand,
            brandWikidata: item.brandWikidata,
            brandWikipedia: item.brandWikipedia,
            building: item.building,
            carWash: item.carWash,
            compressedAir: item.compressedAir,
            fax: item.fax,
            phone: item.phone,
            createdBy: item.createdBy,
            fuelAdblue: item.fuelAdblue,
            fuelBenzine: item.fuelBenzine,
            fuelBiodiesel: item.fuelBiodiesel,
            fuelBiogas: item.fuelBiogas,
            fuelDiesel: item.fuelDiesel,
            fuelEuroDiesel: item.fuelEuroDiesel,
            fuelGasoline: item.fuelGasoline,
            fuelLpg: item.fuelLpg,
            fuelOctane95: item.fuelOctane95,
            fuelOctane98: item.fuelOctane98,
            image: item.image,
            mobile: item.mobile,
            name: item.name,
            coordinates: this.parseGeometry(item.wkbGeometry)
          })).filter(station => station.coordinates !== null)
          this.cacheTimestamp = Date.now()
        } else {
          throw new Error("Invalid response format")
        }

        this.isLoading = false
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
        this.isLoading = false
        console.error('Veriler yüklenirken hata:', error)
      }
    }
  }
})
