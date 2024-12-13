import { defineStore } from 'pinia'
import { transform } from 'ol/proj'

interface ParkingAreaInfo {
  ogc_fid: number
  id: string
  AbbOtopark?: string | null
  City?: string | null
  Country?: string | null
  District?: string | null
  HouseNumber?: string | null
  Neighbourhood?: string | null
  Postcode?: string | null
  Province?: string | null
  Street?: string | null
  AltName?: string | null
  Brand?: string | null
  Charge?: string | null
  CheckDate?: Date | null
  CheckDateFee?: Date | null
  ContactPhone?: string | null
  Description?: string | null
  DisabledVehicle?: string | null
  DrinkingWater?: string | null
  Duration?: string | null
  Email?: string | null
  Fee?: string | null
  Location?: string | null
  Mobile?: string | null
  Motorcar?: string | null
  Name?: string | null
  OpeningHours?: string | null
  Operator?: string | null
  Parking?: string | null
  Phone?: string | null
  Place?: string | null
  Power?: string | null
  coordinates: [number, number][] | null
}

export const useParkingAreaStore = defineStore('parkingAreaStore', {
  state: () => ({
    parkingAreas: [] as ParkingAreaInfo[],
    isLoading: false,
    error: null as string | null,
    cacheTimestamp: 0, // Önbellek için timestamp
  }),

  getters: {
    totalParkingAreas(): number {
      return this.parkingAreas.length
    },

    mapCenter(): [number, number] {
      return transform([35.2433, 38.9637], 'EPSG:4326', 'EPSG:3857')
    },

    isCacheValid(): boolean {
      const cacheDuration = 5 * 60 * 1000 // 5 dakika
      return Date.now() - this.cacheTimestamp < cacheDuration
    },
  },

  actions: {
    transformCoordinates(
      coordinates: [number, number]
    ): [number, number] | null {
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
          parseFloat(matches[2]),
        ]
        return this.transformCoordinates(coords)
      }

      return null
    },

    async fetchParkingAreaData(forceUpdate = false) {
      console.log('fetchParkingAreaData fonksiyonu tetiklendi')

      if (!forceUpdate && this.isCacheValid) {
        console.log('Önbellek geçerli, veri çekilmedi.')
        return
      }

      this.isLoading = true
      this.error = null
      console.log('Parking area verileri yükleniyor...')

      try {
        const response = await $fetch(
          'https://localhost:7129/api/ParkingArea',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            retry: 0,
            ignoreResponseError: true,
          }
        )

        // API yanıtını kontrol et
        console.log('API Yanıtı:', response)

        if (response && response.$values) {
          console.log('API yanıtındaki otopark verileri:', response.$values)

          // response.$values üzerinde gezinip geometriyi çözerek parkingAreas dizisine ekliyoruz
          this.parkingAreas = response.$values
            .map((item) => ({
              ogc_fid: item.ogc_fid,
              id: item.id,
              AbbOtopark: item.AbbOtopark,
              City: item.City,
              Country: item.Country,
              District: item.District,
              HouseNumber: item.HouseNumber,
              Neighbourhood: item.Neighbourhood,
              Postcode: item.Postcode,
              Province: item.Province,
              Street: item.Street,
              AltName: item.AltName,
              Brand: item.Brand,
              Charge: item.Charge,
              CheckDate: item.CheckDate,
              CheckDateFee: item.CheckDateFee,
              ContactPhone: item.ContactPhone,
              Description: item.Description,
              DisabledVehicle: item.DisabledVehicle,
              DrinkingWater: item.DrinkingWater,
              Duration: item.Duration,
              Email: item.Email,
              Fee: item.Fee,
              Location: item.Location,
              Mobile: item.Mobile,
              Motorcar: item.Motorcar,
              Name: item.Name,
              OpeningHours: item.OpeningHours,
              Operator: item.Operator,
              Parking: item.Parking,
              Phone: item.Phone,
              Place: item.Place,
              Power: item.Power,
              coordinates: this.parseGeometry(item.wkb_geometry), // Geometriyi çöz
            }))
            .filter((parking) => parking.coordinates !== null)

          console.log(
            'Çekilen ve işlenen parkingAreas verileri:',
            this.parkingAreas
          )

          this.cacheTimestamp = Date.now()
          this.isLoading = false
        } else {
          throw new Error('Geçersiz yanıt formatı')
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Bilinmeyen hata'
        this.isLoading = false
        console.error('Veri yüklenirken hata:', error)
      }
    },
  },
})
