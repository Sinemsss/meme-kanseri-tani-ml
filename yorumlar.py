"""Not defterindeki yorum hücreleri — sonuçlar.json'daki gerçek çıktılara göre yazıldı."""

YORUM = {
    "kesif": """**Keşif bulguları**

1. **Eksik veya tekrarlanan kayıt yok.** Veri temiz; eksik değer doldurma gerekmiyor.
2. **Sınıflar orta derecede dengesiz** (%63 iyi huylu, %37 kötü huylu, Şekil 1). Bu oran, sınıf ağırlıklandırma veya yeniden örnekleme gerektirecek kadar aşırı değil; ancak bölme işleminin **katmanlı (stratified)** yapılması ve yalnızca accuracy'ye güvenilmemesi gerekir.
3. **Boyut ve şekil özellikleri sınıfları güçlü biçimde ayırıyor.** Etki büyüklüğü (Cohen's d) en yüksek özellikler *worst concave points* (1.64), *worst perimeter* (1.62) ve *mean concave points* (1.60). Şekil 2'de bu özelliklerde iki sınıfın dağılımları büyük ölçüde ayrışırken *mean texture* gibi doku özelliklerinde belirgin bir örtüşme var.
4. **Güçlü çoklu doğrusallık var** (Şekil 3): *radius–perimeter* korelasyonu 1.00, *radius–area* 0.99. Bu üç özellik neredeyse aynı bilgiyi taşıyor; doğrusal modelde katsayıların yorumunu zorlaştırır ve düzenlileştirme (regularization) gerektirir.
5. **Aykırı değerler bilgi taşıyor.** IQR kuralına göre 569 örneğin 171'inde en az bir aykırı özellik var ve bu örneklerin **%67'si kötü huylu**. Aykırılık burada ölçüm hatası değil, büyük ve düzensiz tümörlerin doğal özelliği; bu yüzden aykırı değerler **silinmedi**.""",

    "onisleme": """**Uygulanan ön işleme adımları ve gerekçeleri**

| Adım | Karar | Gerekçe |
|---|---|---|
| Eksik değer | Gerekmedi | Veride eksik değer yok |
| Aykırı değer | Silinmedi | Aykırı örneklerin %67'si kötü huylu; silmek tam da yakalanması gereken vakaları atmak olur |
| Encoding | Gerekmedi | Tüm özellikler sayısal; yalnızca hedef etiket "kötü huylu = 1" olacak şekilde çevrildi |
| Ölçekleme | StandardScaler (LR ve SVM için) | Özellik ölçekleri çok farklı (ör. *area* yüzlerce, *smoothness* 0.1 civarı); mesafe/katsayı tabanlı modeller ölçeğe duyarlı. Random Forest ölçekten etkilenmediği için uygulanmadı |
| Veri bölme | %80 eğitim (455) / %20 test (114), katmanlı | Test kümesinde kötü huylu oranı (%36.8) genel oranla aynı tutuldu |

Ölçekleyici bir **Pipeline** içinde tanımlandı; böylece çapraz doğrulamanın her katında yalnızca o katın eğitim verisiyle uyduruluyor ve doğrulama verisinden bilgi sızması önleniyor.""",

    "model": """**Model seçimi ve gerekçe**

Üç farklı yaklaşım aynı katmanlı 5 katlı çapraz doğrulama ve ızgara araması (GridSearchCV, ölçüt: F1) ile karşılaştırıldı:

- **Logistic Regression** — yorumlanabilir temel model. L2 düzenlileştirme (C) çoklu doğrusallığın etkisini azaltır. En iyi: C = 1, CV F1 = 0.964.
- **Random Forest** — doğrusal olmayan ilişkileri ve etkileşimleri yakalar, ölçeklemeye ihtiyaç duymaz. En iyi: 200 ağaç, max_depth = 6, CV F1 = 0.952.
- **SVM (RBF çekirdek)** — 30 boyutlu, sınırları eğri olabilen bir uzayda geniş marjlı ayrım yapar; küçük-orta ölçekli veride güçlüdür. SVM olasılık üretmediği için `CalibratedClassifierCV` ile kalibre edildi. En iyi: C = 1, gamma = "scale", **CV F1 = 0.967**.

Final model **test verisine bakılmadan**, çapraz doğrulama F1 skoruna göre seçildi: **SVM (RBF)**. Üç modelin CV skorları arasındaki fark küçüktür (0.952–0.967); bu, problemin özellik uzayında iyi ayrışabildiğini gösterir.""",

    "degerlendirme": """**Değerlendirme yorumu**

- **Varsayılan eşikte (0.50)** SVM test kümesinde accuracy 0.974, precision 0.976, **recall 0.952**, F1 0.964 elde etti: 42 kötü huylu vakanın 40'ını yakaladı, 2'sini kaçırdı; 72 iyi huyludan yalnızca 1'ine yanlış alarm verdi.
- **Recall'a göre ayarlanan eşikte (0.25)** recall **0.976**'ya çıktı (42'de 41), buna karşılık yanlış alarm sayısı 1'den 3'e yükseldi (precision 0.932). Tıbbi tarama bağlamında 2 ek "tekrar incele" kararı, 1 kaçırılan kanser vakasından daha kabul edilebilir bir bedeldir.
- **ROC-AUC değerleri üç modelde de 0.99 üzerinde** (Şekil 4); yani sıralama başarısı neredeyse aynı. Modeller arasındaki asıl fark, hangi eşikte nasıl bir precision–recall dengesi kurdukları.
- Test kümesinde yalnızca 42 kötü huylu örnek bulunduğundan **tek bir örnek recall'u ~2.4 puan değiştirir**. Modeller arasındaki 1–2 örneklik farklar istatistiksel olarak güçlü bir üstünlük anlamına gelmez.
- **Özellik önemi** (Şekil 6, permütasyon önemi): model en çok *worst texture*, *mean fractal dimension* ve boyut özelliklerine (*worst area*, *worst radius*) dayanıyor. Boyut özellikleri birbiriyle çok yüksek korelasyonlu olduğu için önem aralarında paylaşılıyor; tek tek değerleri düşük görünse de grup olarak en belirleyici bilgi kaynağı bunlar.""",

    "hata": """**Hata analizi (ayarlı eşik, 4 hata)**

- **Kaçırılan kötü huylu vaka (örnek #73, olasılık 0.05):** Model bu örnekten neredeyse emin biçimde yanılıyor. 30 özelliğin yalnızca **10'unda** kötü huylu sınıfın medyanına daha yakın; *worst perimeter* (110) ve *worst area* (812) iki sınıfın medyanı arasında, *mean texture* (15.8) ise iyi huylu medyanının bile altında. Yani bu, ölçümlerin çoğunda iyi huylu bir kitle gibi görünen **atipik bir malign vaka**. Eşiği daha da düşürmek onu yakalamaz (olasılığı 0.05), yalnızca yanlış alarmları artırır; bu tür vakalar bu 30 özellikle ayırt edilemiyor.
- **Yanlış alarmlar (örnek #208, #314, #71):** Üçü de iyi huylu ama sıra dışı ölçümlere sahip. #314 ve #71 küçük hücreli olmalarına rağmen **standart hata (error) özelliklerinde aşırı değerler** taşıyor (*symmetry error*, *fractal dimension error* için z ≈ 6): çekirdekler arasında ölçüm değişkenliği çok yüksek. #208'de ise *worst symmetry* ve *compactness* belirgin biçimde yüksek, yani şekil düzensizliği kötü huylu kitleleri andırıyor.
- **Ortak örüntü:** Model, boyut ve şekil özelliklerinin aynı yönde sinyal verdiği "tipik" vakalarda çok başarılı; hatalar, özelliklerin birbiriyle **çeliştiği** sınırda vakalarda toplanıyor.""",

    "sonuc": """## 9. Sonuç ve geliştirme önerileri

- Hücre çekirdeği ölçümlerinden kitlenin kötü huylu olup olmadığını **%97.4 doğruluk ve 0.995 ROC-AUC** ile tahmin eden bir SVM modeli geliştirildi. Recall'u önceleyen eşikle kötü huylu vakaların **%97.6'sı** yakalandı.
- **Güçlü yönler:** sızıntısız (pipeline + yalnızca eğitim verisinde seçilen eşik) değerlendirme, üç modelle karşılaştırma, tıbbi maliyete uygun eşik seçimi.
- **Zayıf yönler:** veri küçük (569 örnek) ve tek bir merkezden; test kümesindeki 42 kötü huylu vaka metrikleri oynak kılar. Atipik vakaları ayırt edecek bilgi bu özelliklerde yok. Model bir **karar destek aracıdır**, tanı koymaz.
- **Geliştirme önerileri:** (1) tekrarlı çapraz doğrulama ile metriklerin güven aralığını raporlamak; (2) farklı merkezlerden veriyle dış doğrulama; (3) yüksek korelasyonlu boyut özelliklerini azaltıp (ör. yalnızca *radius* tutmak veya PCA) daha yorumlanabilir bir model kurmak; (4) olasılığı 0.2–0.6 arasında kalan "belirsiz" örnekleri otomatik olarak uzman incelemesine yönlendiren üç bölgeli bir karar kuralı.""",
}
