// Proje raporunu (proje_raporu.docx) sonuclar.json ve sekiller/ klasöründen üretir.
const fs = require('fs')
const path = require('path')
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, AlignmentType,
  BorderStyle, ShadingType, LevelFormat, ExternalHyperlink, Footer, PageNumber,
} = require('docx')

const S = JSON.parse(fs.readFileSync(path.join(__dirname, 'sonuclar.json'), 'utf8'))
const KOYU = '1E3A5F', VURGU = 'C2410C', GRI = '57534E', ACIK = 'F1F5F9'
const FONT = 'Calibri'
const GH = 'https://github.com/Sinemsss/meme-kanseri-tani-ml'
const COLAB = 'https://colab.research.google.com/github/Sinemsss/meme-kanseri-tani-ml/blob/main/meme_kanseri_tani.ipynb'
const UCI = 'https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic'

const yuzde = (v) => (v * 100).toFixed(1).replace('.', ',')
const ond = (v, n = 3) => v.toFixed(n).replace('.', ',')

const t = (text, o = {}) => new TextRun({ text, font: FONT, size: 20, ...o })
const k = (text, o = {}) => t(text, { bold: true, ...o })
const link = (text, url) => new ExternalHyperlink({ link: url, children: [new TextRun({ text, font: FONT, size: 18, color: '1D4ED8', underline: {} })] })
const H = (text) => new Paragraph({ spacing: { before: 200, after: 70 }, keepNext: true,
  children: [new TextRun({ text, font: 'Cambria', size: 26, bold: true, color: KOYU })] })
const P = (runs, after = 80) => new Paragraph({ spacing: { after, line: 264 }, alignment: AlignmentType.JUSTIFIED, children: runs })
const M = (runs) => new Paragraph({ numbering: { reference: 'm', level: 0 }, spacing: { after: 40, line: 256 }, alignment: AlignmentType.JUSTIFIED, children: runs })
const alt = (text) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 30, after: 120 },
  children: [t(text, { size: 16, italics: true, color: GRI })] })

const yok = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
const ince = { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' }

function tablo(gen, satirlar, { vurguSatir = -1, ortala = [] } = {}) {
  return new Table({
    width: { size: gen.reduce((a, b) => a + b), type: WidthType.DXA }, columnWidths: gen,
    rows: satirlar.map((r, ri) => new TableRow({
      tableHeader: ri === 0,
      children: r.map((h, ci) => new TableCell({
        width: { size: gen[ci], type: WidthType.DXA },
        shading: ri === 0 ? { type: ShadingType.CLEAR, color: 'auto', fill: KOYU } : ri === vurguSatir ? { type: ShadingType.CLEAR, color: 'auto', fill: 'FFF7ED' } : undefined,
        borders: { top: yok, left: yok, right: yok, bottom: ince },
        margins: { top: 45, bottom: 45, left: 80, right: 80 },
        children: [new Paragraph({ alignment: ortala.includes(ci) && ri > 0 ? AlignmentType.CENTER : AlignmentType.LEFT,
          children: [t(String(h), { size: 17, bold: ri === 0 || ri === vurguSatir, color: ri === 0 ? 'FFFFFF' : '1C1917' })] })],
      })),
    })),
  })
}

const resim = (dosya, gen, yuk) => new ImageRun({ type: 'png', data: fs.readFileSync(path.join(__dirname, 'sekiller', dosya)),
  transformation: { width: gen, height: yuk }, altText: { title: dosya, description: dosya, name: dosya } })
const ortaResim = (dosya, gen, yuk) => new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, children: [resim(dosya, gen, yuk)] })
// İki şekli yan yana koyan kenarlıksız tablo
function ikili(a, b) {
  const hucre = ([dosya, g, y, yazi]) => new TableCell({ width: { size: 4800, type: WidthType.DXA }, borders: { top: yok, bottom: yok, left: yok, right: yok },
    verticalAlign: 'bottom', children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [resim(dosya, g, y)] }), alt(yazi)] })
  return new Table({ width: { size: 9600, type: WidthType.DXA }, columnWidths: [4800, 4800], rows: [new TableRow({ children: [hucre(a), hucre(b)] })] })
}

const V = S.veri, Ke = S.kesif, Se = S.secilen, T = S.test_05, CV = S.cv
const cmA = Se.cm[Object.keys(Se.cm)[1]]
const satir = (ad, m) => [ad, ond(m.Accuracy), ond(m.Precision), ond(m.Recall), ond(m.F1), ond(m['ROC-AUC'])]

const doc = new Document({
  creator: 'Proje sahibi', title: 'Meme Kanseri Tanısında Makine Öğrenmesi — Proje Raporu',
  numbering: { config: [{ reference: 'm', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 340, hanging: 220 } } } }] }] },
  sections: [{
    properties: { page: { margin: { top: 1000, bottom: 900, left: 1150, right: 1150 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [t('Makine Öğrenmesi ile Probleme Uygun Çözüm Geliştirme · ', { size: 16, color: GRI }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: GRI })] })] }) },
    children: [
      new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: 'Meme Kanseri Tanısında Makine Öğrenmesi', font: 'Cambria', size: 38, bold: true, color: KOYU })] }),
      new Paragraph({ spacing: { after: 80 }, children: [t('Hücre çekirdeği ölçümlerinden tümörün iyi/kötü huylu sınıflandırılması — Proje Raporu', { color: VURGU, size: 21 })] }),
      tablo([1900, 7700], [
        ['Proje bilgisi', ''],
        ['Hazırlayan', '____________________'],
        ['Proje türü', 'Makine öğrenmesi · ikili sınıflandırma (Logistic Regression, Random Forest, SVM)'],
        ['Veri seti', 'Breast Cancer Wisconsin (Diagnostic) — UCI ML Repository, CC BY 4.0'],
      ]),
      new Paragraph({ spacing: { before: 60, after: 20 }, children: [k('Kod (GitHub): ', { size: 18 }), link(GH, GH)] }),
      new Paragraph({ spacing: { after: 20 }, children: [k('Notebook (Colab): ', { size: 18 }), link('Colab’da aç', COLAB)] }),
      new Paragraph({ spacing: { after: 60 }, children: [k('Veri kaynağı: ', { size: 18 }), link(UCI, UCI)] }),

      H('1. Problem tanımı'),
      P([t('İnce iğne aspirasyonu (FNA) ile alınan meme kitlesi örneğinin mikroskop görüntüsünden ölçülen '), k('hücre çekirdeği özellikleri'),
        t(' girdi olarak kullanılarak kitlenin '), k('kötü huylu (malign)'), t(' mi '), k('iyi huylu (benign)'),
        t(' mi olduğu tahmin edilmektedir. Böyle bir model patoloğun yerine geçmez; şüpheli örnekleri öne çıkaran bir '), k('karar destek aracı'),
        t(' olarak düşünülmüştür. Bu bağlamda kötü huylu bir kitleyi kaçırmak (yanlış negatif), iyi huylu bir kitleyi yeniden incelemeye göndermekten (yanlış pozitif) çok daha maliyetlidir. Bu nedenle yalnızca doğruluk değil, kötü huylu sınıf için '),
        k('recall (duyarlılık)'), t(' temel metrik olarak ele alınmıştır.')]),

      H('2. Veri seti'),
      tablo([2300, 7300], [
        ['Özellik', 'Açıklama'],
        ['Kaynak', 'UCI Machine Learning Repository (Wolberg, Street, Mangasarian, 1995); scikit-learn içinde load_breast_cancer olarak hazır'],
        ['Örnek sayısı', `${V.n} (anonim hasta örneği)`],
        ['Değişkenler', `${V.p} sayısal özellik: 10 çekirdek ölçümünün (radius, texture, perimeter, area, smoothness, compactness, concavity, concave points, symmetry, fractal dimension) ortalaması (mean), standart hatası (error) ve en kötü değeri (worst)`],
        ['Hedef değişken', 'kotu_huylu: 1 = kötü huylu, 0 = iyi huylu'],
        ['Sınıf dengesi', `${V.iyi} iyi huylu (%${yuzde(V.iyi / V.n)}) · ${V.kotu} kötü huylu (%${yuzde(V.kotu / V.n)}) — orta derecede dengesiz`],
      ]),

      H('3. Veri analizi ve ön işleme'),
      P([t(`Veride eksik değer ve tekrarlanan kayıt bulunmamaktadır. Keşif aşamasında üç görselleştirme ve bir aykırı değer incelemesi yapılmıştır:`)], 50),
      ikili(['1_sinif_dagilimi.png', 270, 176, 'Şekil 1. Sınıf dağılımı'], ['3_korelasyon.png', 260, 213, 'Şekil 3. “Mean” özellikleri arası korelasyon']),
      ortaResim('2_ozellik_dagilimlari.png', 600, 172),
      alt('Şekil 2. En ayırt edici özelliklerin sınıflara göre dağılımı'),
      M([k('Sınıf dengesi (Şekil 1): '), t('%63/%37 oranı yeniden örnekleme gerektirecek kadar aşırı değil; ancak bölme katmanlı yapılmalı ve yalnızca accuracy’ye güvenilmemelidir.')]),
      M([k('Ayırt edici özellikler (Şekil 2): '), t(`Etki büyüklüğü (Cohen’s d) en yüksek özellikler worst concave points (${ond(Ke.cohen_d['worst concave points'], 2)}), worst perimeter (${ond(Ke.cohen_d['worst perimeter'], 2)}) ve mean concave points (${ond(Ke.cohen_d['mean concave points'], 2)}). Boyut ve içbükeylik özelliklerinde sınıflar belirgin biçimde ayrışırken doku (texture) özelliklerinde örtüşme fazladır.`)]),
      M([k('Çoklu doğrusallık (Şekil 3): '), t(`radius–perimeter korelasyonu ${ond(Ke.kor_radius_perimeter, 2)}, radius–area ${ond(Ke.kor_radius_area, 2)}. Bu özellikler aynı bilgiyi taşıdığından doğrusal modelde düzenlileştirme gerekir.`)]),
      M([k('Aykırı değerler: '), t(`IQR kuralına göre ${Ke.aykiri_satir} örnekte en az bir aykırı özellik vardır ve bunların %${Math.round(Ke.aykiri_kotu_orani * 100)}’si kötü huyludur. Aykırılık ölçüm hatası değil, büyük ve düzensiz tümörlerin doğal özelliğidir; bu yüzden silinmemiştir.`)]),
      P([k('Uygulanan ön işleme: '), t(`Encoding gerekmedi (tüm özellikler sayısal). Logistic Regression ve SVM için StandardScaler uygulandı (özellik ölçekleri çok farklı; ör. area yüzlerce, smoothness ≈ 0,1); Random Forest ölçeğe duyarsız olduğundan ölçeklenmedi. Veri katmanlı olarak %80 eğitim (${S.bolme.egitim}) / %20 test (${S.bolme.test}) şeklinde bölündü. Ölçekleyici bir Pipeline içinde tanımlandığı için çapraz doğrulamada yalnızca eğitim katlarına uyduruldu; doğrulama verisinden bilgi sızması önlendi.`)]),

      H('4. Model / yöntem'),
      P([t('Problem ikili sınıflandırma olduğundan, farklı varsayımlara sahip üç algoritma karşılaştırılmıştır:')], 40),
      M([k('Logistic Regression: '), t('yorumlanabilir temel model; L2 düzenlileştirme çoklu doğrusallığın etkisini azaltır.')]),
      M([k('Random Forest: '), t('doğrusal olmayan ilişkileri ve özellik etkileşimlerini yakalar, ölçeklemeye ve aykırı değerlere dayanıklıdır.')]),
      M([k('SVM (RBF çekirdek): '), t('30 boyutlu uzayda eğri karar sınırlarıyla geniş marjlı ayrım yapar; küçük-orta ölçekli veride güçlüdür. Olasılık üretmesi için CalibratedClassifierCV ile kalibre edilmiştir.')]),

      H('5. Eğitim süreci'),
      P([t('Hiperparametreler, eğitim kümesi üzerinde katmanlı 5 katlı çapraz doğrulama ile ızgara araması (GridSearchCV, ölçüt: F1) yapılarak seçilmiştir. Final model, test verisine bakılmadan çapraz doğrulama skoruna göre belirlenmiştir.')], 50),
      tablo([2300, 4900, 2400], [
        ['Model', 'Denenen → seçilen hiperparametreler', 'CV F1'],
        ['Logistic Regression', `C ∈ {0,01; 0,1; 1; 10; 100} → C = ${CV['Logistic Regression'].params.C}`, ond(CV['Logistic Regression'].f1)],
        ['Random Forest', `ağaç {200, 500}, derinlik {sınırsız, 6}, min. yaprak {1, 3} → ${CV['Random Forest'].params.n_estimators} ağaç, derinlik ${CV['Random Forest'].params.max_depth}`, ond(CV['Random Forest'].f1)],
        ['SVM (RBF)', `C ∈ {0,1; 1; 10; 100}, gamma ∈ {scale; 0,01; 0,001} → C = ${CV['SVM (RBF)'].params.C}, gamma = ${CV['SVM (RBF)'].params.gamma}`, ond(CV['SVM (RBF)'].f1)],
      ], { vurguSatir: 3, ortala: [2] }),
      P([k('Eşik ayarı: '), t(`Kötü huylu vakaları kaçırmanın maliyeti yüksek olduğundan karar eşiği de ayarlanmıştır. Eşik yine test verisine bakılmadan, eğitim kümesindeki çapraz doğrulama olasılıkları üzerinden “recall ≥ 0,98 olacak en yüksek precision” kuralıyla seçilmiş ve ${ond(Se.esik, 2)} bulunmuştur.`)], 60),

      H('6. Değerlendirme sonuçları'),
      tablo([3000, 1320, 1320, 1320, 1320, 1320], [
        ['Model (test kümesi)', 'Accuracy', 'Precision', 'Recall', 'F1', 'ROC-AUC'],
        satir('Logistic Regression', T['Logistic Regression']),
        satir('Random Forest', T['Random Forest']),
        satir('SVM (RBF) — eşik 0,50', T['SVM (RBF)']),
        satir(`SVM (RBF) — eşik ${ond(Se.esik, 2)}`, Se.esikAyarli),
      ], { vurguSatir: 4, ortala: [1, 2, 3, 4, 5] }),
      alt('Tablo 1. Test kümesi (114 örnek, 42 kötü huylu) sonuçları'),
      ikili(['4_roc.png', 270, 229, 'Şekil 4. ROC eğrileri'], ['6_ozellik_onemi.png', 290, 181, 'Şekil 6. En etkili 10 özellik (permütasyon önemi)']),
      ortaResim('5_karisiklik.png', 470, 228),
      alt('Şekil 5. SVM karışıklık matrisleri: varsayılan ve ayarlı eşik'),
      M([k('SVM en dengeli sonucu verdi: '), t(`varsayılan eşikte accuracy %${yuzde(T['SVM (RBF)'].Accuracy)}, recall %${yuzde(T['SVM (RBF)'].Recall)}; 42 kötü huylu vakanın 40’ını yakaladı, 72 iyi huyludan yalnızca 1’ine yanlış alarm verdi.`)]),
      M([k('Eşik ayarının etkisi: '), t(`recall %${yuzde(Se.esikAyarli.Recall)}’ya çıktı (42’de 41), yanlış alarm 1’den 3’e yükseldi (precision %${yuzde(Se.esikAyarli.Precision)}). Tarama bağlamında 2 ek “tekrar incele” kararı, kaçırılan bir kanser vakasından daha kabul edilebilir bir bedeldir.`)]),
      M([k('ROC-AUC üç modelde de 0,99 üzerinde: '), t('sıralama başarıları neredeyse aynı; asıl fark eşikteki precision–recall dengesinde. Random Forest hiç yanlış alarm vermedi ama 4 kötü huylu vakayı kaçırdı; bu problem için daha riskli bir dengedir.')]),
      M([k('Dikkat: '), t('test kümesinde 42 kötü huylu örnek olduğundan tek bir örnek recall’u yaklaşık 2,4 puan değiştirir; modeller arasındaki 1–2 örneklik farklar güçlü bir üstünlük anlamına gelmez.')]),

      H('7. Hata analizi'),
      P([t(`Ayarlı eşikte toplam ${cmA[0][1] + cmA[1][0]} hata vardır (${cmA[1][0]} yanlış negatif, ${cmA[0][1]} yanlış pozitif). Hatalı örnekler eğitim kümesindeki sınıf dağılımlarıyla karşılaştırılmıştır:`)], 40),
      M([k('Kaçırılan kötü huylu vaka (olasılık 0,05): '), t('30 özelliğin yalnızca 10’unda kötü huylu sınıfa daha yakındır; worst perimeter (110) ve worst area (812) iki sınıfın medyanı arasında, mean texture (15,8) ise iyi huylu medyanının da altındadır. Ölçümlerin çoğunda iyi huylu görünen atipik bir malign vakadır. Model ondan neredeyse emin biçimde yanıldığı için eşiği daha da düşürmek onu yakalamaz, yalnızca yanlış alarmları artırır.')]),
      M([k('Yanlış alarmlar: '), t('Üç iyi huylu örnekten ikisi küçük hücreli olmalarına rağmen standart hata özelliklerinde aşırı değerler taşır (symmetry error ve fractal dimension error için z ≈ 6), yani çekirdekler arası ölçüm değişkenliği çok yüksektir. Üçüncüsünde worst symmetry ve compactness belirgin biçimde yüksektir; şekil düzensizliği kötü huylu kitleleri andırır.')]),
      M([k('Ortak örüntü: '), t('Model, boyut ve şekil özelliklerinin aynı yönde sinyal verdiği tipik vakalarda çok başarılıdır; hatalar, özelliklerin birbiriyle çeliştiği sınırda vakalarda toplanmaktadır. Şekil 6’da boyut özelliklerinin önemi düşük görünmesinin nedeni de birbirleriyle çok yüksek korelasyonlu olmaları ve önemi paylaşmalarıdır.')]),

      H('8. Sonuç ve geliştirme önerileri'),
      P([t(`Hücre çekirdeği ölçümlerinden kitlenin kötü huylu olup olmadığını %${yuzde(T['SVM (RBF)'].Accuracy)} doğruluk ve ${ond(T['SVM (RBF)']['ROC-AUC'])} ROC-AUC ile tahmin eden bir SVM modeli geliştirilmiş; recall’u önceleyen eşikle kötü huylu vakaların %${yuzde(Se.esikAyarli.Recall)}’sı yakalanmıştır. `),
        k('Güçlü yönler: '), t('sızıntısız değerlendirme (Pipeline, yalnızca eğitim verisinde seçilen model ve eşik), üç modelin karşılaştırılması, tıbbi maliyete uygun eşik seçimi. '),
        k('Zayıf yönler: '), t('veri küçük (569 örnek) ve tek merkezlidir; atipik vakaları ayırt edecek bilgi bu özelliklerde yoktur; model tanı koymaz.')], 40),
      M([t('Tekrarlı çapraz doğrulama ile metriklerin güven aralıklarını raporlamak.')]),
      M([t('Farklı merkezlerden toplanmış veriyle dış doğrulama yapmak.')]),
      M([t('Yüksek korelasyonlu boyut özelliklerini azaltarak (ör. yalnızca radius veya PCA) daha yorumlanabilir bir model kurmak.')]),
      M([t('Olasılığı belirsiz aralıkta (ör. 0,2–0,6) kalan örnekleri otomatik olarak uzman incelemesine yönlendiren üç bölgeli bir karar kuralı tasarlamak.')]),
    ],
  }],
})

Packer.toBuffer(doc).then((b) => { fs.writeFileSync(path.join(__dirname, 'proje_raporu.docx'), b); console.log('✓ proje_raporu.docx') })
