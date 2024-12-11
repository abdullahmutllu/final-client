
# Şarj İstasyonları Analiz Uygulaması (Charging Stations Analysis Application)

Bu proje, şarj istasyonlarının harita üzerinde görüntülenmesi ve analizi için geliştirilmiştir.

## Özellikler

- **Şarj İstasyonları (Charging Stations):** Kullanıcılar harita üzerinde şarj istasyonlarını görebilir, detaylarını inceleyebilir ve konumlarına göre filtreleme yapabilirler.
- **Park Alanları (Parking Area):** Kullanıcılar harita üzerinde Otoparkları  görebilir, detaylarını inceleyebilir ve konumlarına göre filtreleme yapabilirler.
- **Ana Yollar (Highways):** Türkiyedeki otobanları gostermektedir.
- **Trafik Lambaları (Traffic Lights):** Türkiyedeki otobanları gostermektedir.
- **Filtrele Butonu (Filter Button):** Kullanıcın çizdiği alana gore o alanda bulunanan şarj istasyonları, park alanları , ana yollar ,trafik lambalarını alır ve json formatında kaydeder.
## Proje Bileşenleri
- **Backend:** .NET Core Web API
- **Frontend:** Nuxt.js
- **Veritabanı:** PostgreSQL (PostGIS)
- **Harita Entegrasyonu:**  OpenLayers
  
![final-project](https://github.com/user-attachments/assets/16a07417-3489-48cd-b48a-5c1c0e78e5e5)

![map](https://github.com/user-attachments/assets/4b47d2cd-6183-4744-bbda-0fe30aec0fb0)

# Şarj İstasyonu Bulma Uygulaması
Bu Vue.js uygulaması, kullanıcının mevcut konumunu alır ve en yakın 5 şarj istasyonunu harita üzerinde gösterir. Şarj istasyonları, şehir adı, kapasite, şarj türü ve koordinatlar gibi bilgileri içerir. Ayrıca, her bir şarj istasyonu için yol tarifi almak mümkündür.

## Özellikler
Konum Erişimi:
Uygulama, kullanıcının konum bilgilerini almak için Geolocation API'yi kullanır. Kullanıcı konumunu paylaştığında, en yakın şarj istasyonları hesaplanır.

Koordinat Dönüştürme:
Şarj istasyonlarının koordinatları, EPSG:3857 (Web Mercator) projeksiyonundan WGS84 (EPSG:4326) formatına dönüştürülür.

En Yakın 5 Şarj İstasyonu:
Kullanıcının konumuna en yakın 5 şarj istasyonu, haversine formülü kullanılarak hesaplanır.

Yol Tarifi:
Kullanıcı, her şarj istasyonu için Google Maps üzerinden yol tarifi alabilir.

## Teknolojiler

- **Vue.js**: Uygulama geliştirme için kullanılan JavaScript framework.
- **Haversine Formülü**: İki nokta arasındaki mesafeyi hesaplamak için kullanılan formül.
- **Google Maps API**: Şarj istasyonlarına yol tarifi almak için kullanılan harita API.



![en](https://github.com/user-attachments/assets/fd2570d4-23a5-4ffe-8304-5828ac0d0ee4)
