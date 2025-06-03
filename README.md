# Şarj İstasyonları Analiz Uygulaması (Charging Stations Analysis Application)

Bu proje, şarj istasyonlarının harita üzerinde görüntülenmesi ve analizi için geliştirilmiştir.

## Özellikler

- **Şarj İstasyonları (Charging Stations):** Kullanıcılar harita üzerinde şarj istasyonlarını görebilir, detaylarını inceleyebilir ve konumlarına göre filtreleme yapabilirler.
- **Park Alanları (Parking Area):** Kullanıcılar harita üzerinde otoparkları görebilir, detaylarını inceleyebilir ve konumlarına göre filtreleme yapabilirler.
- **Ana Yollar (Highways):** Türkiye'deki otobanları göstermektedir.
- **Trafik Lambaları (Traffic Lights):** Türkiye'deki trafik ışıklarını göstermektedir.
- **Filtrele Butonu (Filter Button):** Kullanıcının çizdiği alana göre o alanda bulunan şarj istasyonları, park alanları, ana yollar ve trafik lambalarını alır ve JSON formatında kaydeder.

## Proje Bileşenleri

- **Backend:** .NET Core Web API
- **Frontend:** Nuxt.js
- **Veritabanı:** PostgreSQL (PostGIS)
- **Harita Entegrasyonu:** OpenLayers

---

# Elektrik İstasyonu Konum Analiz Raporu

Bu rapor, belirli bir alandaki en iyi elektrik istasyonu kurulacak üç konumu analiz ederek harita üzerinde göstermektedir. Analiz, her konumun **Skor** değerine göre sıralanır ve her bir konum için aşağıdaki detaylar sağlanır:

![1JPG](https://github.com/user-attachments/assets/b6512aed-db86-4e3f-96df-819c9eabd7ca)
![rapor](https://github.com/user-attachments/assets/1a822927-b317-441f-8deb-ec546de2dc95)

### Konum Detayları

1. **Latitude (Enlem):** Konumun enlem bilgisi.
2. **Longitude (Boylam):** Konumun boylam bilgisi.
3. **Elektrik İstasyonuna En Yakın Mesafe:** Her konumun mevcut elektrik istasyonuna olan mesafesi.
4. **Yakın Çevre Detayları:**
   - **Otopark Alanları:** Konum çevresindeki otopark alanları.
   - **Yollar:** Konum çevresindeki yollar.
   - **Petrol İstasyonları:** Konum çevresindeki petrol istasyonları.
   - **Trafik Işıkları:** Konum çevresindeki trafik ışıkları.

### Rapor Oluşturma

Kullanıcılar, "Rapor Oluştur" butonuna tıkladığında, haritanın ekran görüntüsü alınır ve bu bilgilerle birlikte PDF formatında detaylı bir rapor oluşturulur. Rapor, her bir konumun analizini ve çevre detaylarını içeren metin bilgilerini içerir.

### Kullanım


1. Harita üzerinde en iyi elektrik istasyonu kurulacak üç nokta **Skor**'a göre sıralanır.
2. Her bir konum için belirtilen veriler toplanır.
## 📦 Veri Toplama ve Yönetimi

Bu projede coğrafi verilerin toplanması ve yönetimi için **PostgreSQL** veritabanı ve **PostGIS** eklentisi kullanılmaktadır.

Veritabanında aşağıdaki türde veriler saklanmaktadır:

- 📍 Mevcut şarj istasyonlarının konum verileri  
- ⛽ Petrol istasyonları  
- 🅿️ Park alanları  
- 🛣️ Yol ağları ve kavşaklar  
- 🚦 Trafik lambaları  

Bu veriler, **JSON** formatında **.NET Core API** aracılığıyla frontend uygulamasına iletilmektedir.

---

## 🤖 Makine Öğrenmesi Modelleri

Şarj istasyonu yerleştirme problemini çözmek amacıyla çeşitli makine öğrenmesi modelleri kullanılmıştır.

### 1️⃣ Regresyon Modelleri

Konum uygunluğunu puanlamak için aşağıdaki üç regresyon modeli karşılaştırılmıştır:

- **Random Forest Regressor**  
  - 150 ağaçlı yapı  
  - `random_state=42` parametresi ile

- **Gradient Boosting Regressor**  
  - 100 ağaçlı yapı

- **MLP Regressor (Multi-Layer Perceptron)**  
  - Gizli katman boyutları: `(50, 50)`

📊 Her modelin performansı şu metriklerle değerlendirilmiştir:

- MSE (Mean Squared Error)  
- RMSE (Root Mean Squared Error)  
- MAE (Mean Absolute Error)  
- R² (R-squared)

> Modeller, verilerin %80’i ile eğitilmiş ve %20’si ile test edilmiştir.

---

### 2️⃣ Kümeleme Modelleri

İstasyon yerleşimi için aday konumların gruplandırılmasında kullanılan algoritmalar:

- **K-Means**  
  - Optimal küme sayısı, "elbow method" ile belirlenmiştir

- **DBSCAN (Density-Based Spatial Clustering)**  
  - Parametreler: `eps=0.5`, `min_samples=3`

📈 Değerlendirme kriterleri:

- Silhouette Skoru  
- Calinski-Harabasz İndeksi

> Daha yüksek **Silhouette skoru** veren model tercih edilmiştir.

---

## ⚙️ Özellik Mühendisliği (Feature Engineering)

Konumların değerlendirilmesi için çıkarılan öznitelikler:

- `nearby_paths_count`: Belirli yarıçap içindeki yol sayısı  
- `nearby_traffic_lights_count`: Yakındaki trafik ışıklarının sayısı  
- `nearby_petrol_stations_count`: Yakındaki benzin istasyonlarının sayısı  
- `nearby_parking_count`: Yakındaki park alanlarının sayısı  
- `min_existing_distance`: En yakın mevcut şarj istasyonuna olan mesafe  
- `avg_path_dist`: Yakındaki yollara ortalama mesafe  
- `avg_traffic_dist`: Yakındaki trafik ışıklarına ortalama mesafe  
- `avg_petrol_dist`: Yakındaki benzin istasyonlarına ortalama mesafe  
- `avg_parking_dist`: Yakındaki park alanlarına ortalama mesafe  
- `latitude`: Enlem bilgisi  
- `longitude`: Boylam bilgisi  
- `path_density`: Yol yoğunluğu (belirli bir alandaki)  
- `accessibility_score`: Erişilebilirlik skoru (ana yollar, trafik ışıkları, parklar ve benzin istasyonlarına yakınlığa göre)  
- `population_density`: Tahmini nüfus yoğunluğu

📐 Tüm özellikler **StandardScaler** ve **MinMaxScaler** kullanılarak ölçeklendirilmiştir.

---

## 📍 Coğrafi Analiz Teknikleri

Konumların analizinde kullanılan teknikler şunlardır:

- **Voronoi Diyagramları**  
  - Mevcut istasyonların etki alanlarını belirlemede

- **Delaunay Üçgenlemesi**  
  - Şarj istasyonları arasındaki ilişkileri modellemede

- **Haversine Mesafe Hesaplamaları**  
  - Gerçek dünya koordinatları arasındaki mesafeleri hesaplamada

![h1](https://github.com/user-attachments/assets/dfbd4510-b05d-4866-8d7d-5879d1ad1dcd)
![h2](https://github.com/user-attachments/assets/2c229343-d733-4ac8-91c4-1f16b3f11389)
![h3](https://github.com/user-attachments/assets/526f4508-21cc-484f-933b-dea39fa316d1)
![h4](https://github.com/user-attachments/assets/133a424f-747f-4771-b282-8c7a16503fbb)
![h5](https://github.com/user-attachments/assets/a7c18ded-8f4b-4b3e-9f69-6d7bf9b7fa25)
![h6](https://github.com/user-attachments/assets/450be354-d791-4ea0-af1d-7357a988a547)

---

Bu rapor, belirli bir alandaki elektrik istasyonları için potansiyel yerlerin analiz edilmesi ve kullanıcıya detaylı bir rapor sunulmasını sağlamak için kullanılabilir.

![final-project](https://github.com/user-attachments/assets/16a07417-3489-48cd-b48a-5c1c0e78e5e5)
![map](https://github.com/user-attachments/assets/4b47d2cd-6183-4744-bbda-0fe30aec0fb0)
![trafikIsıkları-yol](https://github.com/user-attachments/assets/e46db48e-48d0-49dc-bc99-a0ffd06a1182)
![otopark-sarjIstasyon-petrolOfisi](https://github.com/user-attachments/assets/1d7f1082-8c2b-4f48-bacf-b59fbc336e8c)

---

# Şarj İstasyonu Bulma Uygulaması

Bu Vue.js uygulaması, kullanıcının mevcut konumunu alır ve en yakın 5 şarj istasyonunu harita üzerinde gösterir. Şarj istasyonları, şehir adı, kapasite, şarj türü ve koordinatlar gibi bilgileri içerir. Ayrıca, her bir şarj istasyonu için yol tarifi almak mümkündür.

## Özellikler

- **Konum Erişimi:** Uygulama, kullanıcının konum bilgilerini almak için Geolocation API'yi kullanır. Kullanıcı konumunu paylaştığında, en yakın şarj istasyonları hesaplanır.
- **Koordinat Dönüştürme:** Şarj istasyonlarının koordinatları, EPSG:3857 (Web Mercator) projeksiyonundan WGS84 (EPSG:4326) formatına dönüştürülür.
- **En Yakın 5 Şarj İstasyonu:** Kullanıcının konumuna en yakın 5 şarj istasyonu, haversine formülü kullanılarak hesaplanır.
- **Yol Tarifi:** Kullanıcı, her şarj istasyonu için Google Maps üzerinden yol tarifi alabilir.

## Teknolojiler

- **Vue.js:** Uygulama geliştirme için kullanılan JavaScript framework.
- **Haversine Formülü:** İki nokta arasındaki mesafeyi hesaplamak için kullanılan formül.
- **Google Maps API:** Şarj istasyonlarına yol tarifi almak için kullanılan harita API.

![en](https://github.com/user-attachments/assets/fd2570d4-23a5-4ffe-8304-5828ac0d0ee4)
