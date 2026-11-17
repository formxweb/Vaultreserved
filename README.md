# Vault Reserved — Web Sitesi

Mavişehir, Livin İzmir'deki **Vault** için tek sayfalık, rezervasyon odaklı web sitesi.
Saf HTML/CSS/JS — framework yok, build adımı yok, çalışma zamanı bağımlılığı yok.

```
index.html            Tüm sayfa (TR içerik, EN editoryal başlıklar)
404.html              Markalı 404 sayfası
assets/css/main.css   Tasarım sistemi + tüm bölümler
assets/js/main.js     Rezervasyon penceresi, menü, animasyonlar (~7 KB)
assets/fonts/         Cormorant Garamond + Manrope (kendi sunucumuzda, Türkçe karakterli)
assets/img/           AVIF + WebP, 3 boyut (mobil / tablet / masaüstü)
assets/video/         Açılış videosu (MP4 + WebM, sessiz, 12 sn döngü) + kapak karesi
tools/                Fotoğraf optimizasyon aracı (yalnızca geliştirme için)
vercel.json           Önbellek + güvenlik başlıkları
```

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

1. **Açılış videosu Vault'un kendi içeriğidir** (Instagram reel'i). Üstteki "VAULT" ve alttaki "V" logosu kırpılarak çıkarıldı;
   ses kaldırıldı. Daha yüksek çözünürlüklü orijinal gelirse aynı adlarla değiştirin.
   Ziyaretçi "hareketi azalt" ayarını açtıysa ya da veri tasarrufu modundaysa video oynamaz, kapak karesi görünür.
2. **Diğer fotoğraflar geçicidir.** Şu an [Unsplash](https://unsplash.com/license) lisanslı (ticari kullanıma açık) görseller var.
   Footer'da "Görseller temsilidir" yazıyor. Vault'tan gerçek fotoğrafları alıp aynı dosya adlarıyla değiştirin:
   ```bash
   python3 tools/optimize_images.py ~/vault-fotograflar 0.5
   ```
   Ardından footer'daki "Görseller temsilidir." satırını silin.
3. **Puro bölümü** brief'e göre yazıldı; Vault'ta gerçekten puro alanı olduğunu ve nerede olduğunu (açık/kapalı alan) mekânla teyit edin.
4. **Alan adı** belli olunca `index.html` içine `<link rel="canonical">`, mutlak `og:image` URL'si ve `sitemap.xml` ekleyin.
5. İsterseniz Check&Place'te site için ayrı bir kampanya kodu açtırıp linkteki `campaignCode=online` değerini değiştirin; böylece siteden gelen rezervasyonlar ayrı ölçülür.

## Yerelde çalıştırma

```bash
python3 -m http.server 8080   # http://localhost:8080
```

## Yayına alma (Vercel)

Statik site: Vercel'de "Framework: Other", build komutu boş, output dizini kök (`.`).

## Görsel kaynakları (geçici)

Unsplash Lisansı kapsamında: Stefanie Jockschat, zero take, chaewon you, Egor Myznik,
Thom Milkovic, phoebe lynch, Fabian García Acevedo, Mahmoud Fawzy, Ömer Taha Çetin, Caramel, Ash Edmonds,
William Krause, Marcos Ferreira, Alek Olson, takahiro taguchi, William Bereza, Miguel Joya.
