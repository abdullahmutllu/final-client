import { defineStore } from "pinia";
import { transform } from "ol/proj";

// Trafik ışıkları için interface
interface TrafficLights {
  id?: number;
  coordinates: [number, number] | null;
}

// Pinia store'u tanımla
export const useTrafficLightsStore = defineStore("trafficLightsStore", {
  state: () => ({
    points: [] as TrafficLights[],
    isLoading: false,
    error: null as string | null,
    cacheTimeStamp: 0,
  }),

  getters: {
    // Trafik ışıklarının sayısını dönen getter
    trafficLightsCount(): number {
      return this.points.length;
    },

    // Cache geçerliliği kontrolü
    isCacheValid(): boolean {
      const cacheDuration = 5 * 60 * 1000; // 5 dakika
      return Date.now() - this.cacheTimeStamp < cacheDuration;
    },
  },

  actions: {
    // Trafik ışıkları koordinatlarını EPSG:4326'dan EPSG:3857'ye dönüştürür
    transformCoordinates(coordinates: [number, number]): [number, number] | null {
      if (!coordinates) return null;
      try {
        return transform(coordinates, "EPSG:4326", "EPSG:3857");
      } catch (error) {
        console.error("Koordinat dönüşüm hatası:", error);
        return null;
      }
    },

    // Geometry verisini parse eder ve [longitude, latitude] olarak döner
    parseGeometry(geometry: string): [number, number] | null {
      const matches = geometry.match(/POINT \(([^\s]+)\s([^\s]+)\)/);
      if (matches && matches.length === 3) {
        const coords: [number, number] = [
          parseFloat(matches[1]),
          parseFloat(matches[2]),
        ];
        return this.transformCoordinates(coords);
      }
      return null;
    },

    // Trafik ışıkları verisini API'den çeker ve state'e ekler
    async fetchTrafficLights(forceUpdate = false) {
      // Cache kontrolü, forceUpdate parametresi true değilse cache geçerliyse veri çekilmez
      if (!forceUpdate && this.isCacheValid) {
        return;
      }

      this.isLoading = true;
      this.error = null;

      try {
        const response = await fetch("https://localhost:7129/api/TrafficLights", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          console.log("API'den gelen veri:", data); // API verisini loglayalım

          // Gelen veriyi parse et
          this.points = data.$values.map((item: any) => {
            const coords = this.parseGeometry(item.geometry);

            if (coords) {
              return {
                id: item.id,
                coordinates: coords,
              };
            } else {
              console.warn("Geometri hatalı:", item.geometry);
              return null; // Geometri geçerli değilse null döndür
            }
          }).filter((point) => point !== null); // Geometrisi geçerli olmayanları filtrele

          this.cacheTimeStamp = Date.now();
        } else {
          throw new Error("Veri çekilemedi!");
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
      } finally {
        this.isLoading = false;
      }
    },
  },
});
