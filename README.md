# Vault Reserved — Web Sitesi

Mavişehir, Livin İzmir'deki **Vault** için tek sayfalık, rezervasyon odaklı web sitesi.
Saf HTML/CSS/JS — framework yok, build adımı yok, çalışma zamanı bağımlılığı yok.

```
src/index.html        KAYNAK sayfa — düzenlemeler burada yapılır
index.html            Yayınlanan sayfa — tools/build.py üretir (elle düzenlemeyin)
404.html              Markalı 404 sayfası
assets/css/main.css   Tasarım sistemi + tüm bölümler
assets/js/main.js     Rezervasyon penceresi, menü, animasyonlar (~7 KB)
assets/fonts/         Cormorant Garamond + Manrope (kendi sunucumuzda, Türkçe karakterli)
assets/img/           AVIF + WebP, 5 boyut (480–1600 px)
assets/video/         Açılış videosu (MP4 + WebM, sessiz, 12 sn döngü) + kapak karesi
tools/                build.py (sayfa derleyici) + optimize_images.py (fotoğraf hattı)
vercel.json           Önbellek + güvenlik başlıkları
```

## Marka sistemi (Vault'un kendi kimliğinden)

| Öğe | Değer | Kaynak |
| --- | --- | --- |
| Lacivert | `#122137` (zemin `#0c1424`) | Instagram profil logosu |
| Altın | `#b99877` (vurgu `#d5c0a0`) | Açılış davetiyesindeki varak, logo harfleri |
| Logo yazısı | Gravitas One + oyma iç çizgi (SVG) | Logoya en yakın font; **yaklaşıktır** |
| Etiketler / butonlar | Cinzel | Davetiyedeki klasik başlık harfleri |
| Başlıklar | Cormorant Garamond (italik vurgular) | Davetiyedeki altın italik |
| Amblem | Çift eşkenar dörtgen + V (SVG) | Personel gömleği ve videodaki amblem |

> **Logo:** Sitedeki "VAULT" yazısı Vault'un logosuna benzetilerek çizildi, birebir aynısı değil.
> Vault'tan **vektörel logo (SVG/AI/PDF)** alınınca `src/index.html` içindeki `#wm` sembolü onunla değiştirilmeli.

## Rezervasyon nasıl çalışıyor

- Vault zaten **Check&Place (SIMPRA)** kullanıyor. Instagram bio'sundaki `prte.io/Qqo2Ew` linki bu sisteme gidiyor.
- Sitedeki tüm rezervasyon butonları, bu **resmi formu** marka tasarımlı bir pencerenin içinde açıyor (iframe).
  Talepler doğrudan mekânın mevcut paneline düşer; ayrı bir sistem yok, rezervasyonlar bölünmez.
- JavaScript kapalıysa butonlar formu yeni sekmede açar. Form yüklenmezse pencere "yeni sekmede aç" seçeneği sunar.
- Doğrudan link: **`https://<alan-adı>/#rezervasyon-formu`** sayfayı form açık hâlde getirir (Instagram bio'su için ideal).
- Mobilde telefonun geri tuşu pencereyi kapatır (sayfadan çıkmaz).

## Doğrulanmış bilgiler (kaynaklı)

| Bilgi | Kaynak |
| --- | --- |
| Adres: Caher Dudayev Bulvarı, Livin İzmir No: 30H, İzmir 35500 | Instagram profili |
| Semt: Mavişehir, Karşıyaka | Livin İzmir'in konumu (harita kayıtları) |
| Tel: +90 535 064 00 00 · info@vaultreserved.org | Check&Place rezervasyon formu |
| "Bir modern ev, viski ve sohbet için." | Instagram bio |
| Sushi · Menü · Kokteyl · Yemek | Instagram öne çıkanlar |

**Bilerek eklenmeyenler:** menü kalemleri, fiyatlar, çalışma saatleri, viski/puro markaları.
Bunlara açık kaynakta ulaşılamadı; uydurulmadı. Site, güncel menü için Instagram'a yönlendiriyor.

## ⚠️ Yayına almadan önce

1. **Gerçek Vault görselleri:** Açılış videosu ve videodan alınan 6 kare (barmen, arka bar, tadım seti, misafir, kadeh)
   Vault'un Instagram reel'inden; mermer bar + davetiye fotoğrafı Vault'un Check&Place rezervasyon sayfasına yüklediği görselden.
   **Açılış videosu Vault'un kendi içeriğidir** (Instagram reel'i). Üstteki "VAULT" ve alttaki "V" logosu kırpılarak çıkarıldı;
   ses kaldırıldı. Daha yüksek çözünürlüklü orijinal gelirse aynı adlarla değiştirin.
   Ziyaretçi "hareketi azalt" ayarını açtıysa ya da veri tasarrufu modundaysa video oynamaz, kapak karesi görünür.
2. **Puro, mutfak ve galerinin bir kısmı hâlâ geçici fotoğraf.** Şu an [Unsplash](https://unsplash.com/license) lisanslı (ticari kullanıma açık) görseller var.
   Footer'da "Görseller temsilidir" yazıyor. Vault'tan gerçek fotoğrafları alıp aynı dosya adlarıyla değiştirin:
   ```bash
   python3 tools/optimize_images.py ~/vault-fotograflar 0.5
   ```
   Ardından footer'daki "Bazı görseller temsilidir." satırını silin.
3. **Puro bölümü** brief'e göre yazıldı; Vault'ta gerçekten puro alanı olduğunu ve nerede olduğunu (açık/kapalı alan) mekânla teyit edin.
4. **Alan adı** belli olunca `index.html` içine `<link rel="canonical">`, mutlak `og:image` URL'si ve `sitemap.xml` ekleyin.
5. İsterseniz Check&Place'te site için ayrı bir kampanya kodu açtırıp linkteki `campaignCode=online` değerini değiştirin; böylece siteden gelen rezervasyonlar ayrı ölçülür.

## Değişiklik yapma

1. Metin/yapı → `src/index.html`, stil → `assets/css/main.css`, davranış → `assets/js/main.js`.
2. `python3 tools/build.py` → `index.html` yeniden üretilir: görseller `<picture>` olarak yerleşir,
   CSS küçültülüp sayfaya gömülür (ayrı CSS isteği ilk çizimi geciktirmesin diye). Pillow gerekir.
3. Commit + push → Vercel otomatik yayınlar.

## Ölçüm (Lighthouse 13, 17 Kasım 2026, canlı Vercel sürümü)

| | Mobil | Masaüstü |
| --- | --- | --- |
| Performans | 97–100 (3 ölçüm) | 100 |
| Erişilebilirlik | 100 | 100 |
| En İyi Uygulamalar | 100 | 100 |
| SEO | 100 | 100 |

Mobil LCP 1,5–1,6 sn · masaüstü LCP 0,4 sn · CLS 0.

- Site Vercel korumasındayken PageSpeed'e düz link verilirse **Vercel'in giriş sayfası** ölçülür (~50 puan); bu sitenin skoru değildir.
- Paylaşım linkiyle ölçülürse linkin çerez yönlendirmesi mobilde ~1 puan düşürür; gerçek alan adında oluşmaz.
- "Resim yayınlama" uyarısı görselleri CSS piksel boyutuna göre değerlendirir. Telefon ekranlarında (2–3x) netlik için
  bilerek daha yüksek çözünürlük sunuluyor; uyarıya uyulursa fotoğraflar bulanık görünür.
- `llms.txt`: yapay zekâ asistanları için doğrulanmış mekân bilgileri (adres, telefon, rezervasyon linki).

## Yerelde çalıştırma

```bash
python3 -m http.server 8080   # http://localhost:8080
```

## Yayına alma (Vercel)

Statik site: Vercel'de "Framework: Other", build komutu boş, output dizini kök (`.`).

## Görsel kaynakları (geçici)

Unsplash Lisansı kapsamında: Egor Myznik, Thom Milkovic, phoebe lynch, Fabian García Acevedo,
Mahmoud Fawzy, Ömer Taha Çetin, Caramel, William Krause, Alek Olson, takahiro taguchi, William Bereza, Miguel Joya.
