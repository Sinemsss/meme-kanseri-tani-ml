# Meme Kanseri Tanısında Makine Öğrenmesi

Hücre çekirdeği ölçümlerinden meme kitlesinin **iyi huylu / kötü huylu** olduğunu tahmin eden bir sınıflandırma projesi. Logistic Regression, Random Forest ve SVM karşılaştırılmış; karar eşiği, kötü huylu vakaları kaçırmamak için recall öncelikli olarak ayarlanmıştır.

[![Colab'da aç](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/Sinemsss/meme-kanseri-tani-ml/blob/main/meme_kanseri_tani.ipynb)

**Veri seti:** Breast Cancer Wisconsin (Diagnostic), UCI Machine Learning Repository — CC BY 4.0
https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic (scikit-learn içinde `load_breast_cancer` olarak hazır gelir)

| Model (test, eşik 0.50) | Accuracy | Precision | Recall | F1 | ROC-AUC |
|---|---|---|---|---|---|
| Logistic Regression | 0.965 | 0.975 | 0.929 | 0.951 | 0.996 |
| Random Forest | 0.965 | 1.000 | 0.905 | 0.950 | 0.995 |
| **SVM (RBF)** | **0.974** | 0.976 | 0.952 | **0.964** | 0.995 |
| SVM (RBF), eşik 0.25 | 0.965 | 0.932 | **0.976** | 0.953 | 0.995 |

| Dosya | İçerik |
|---|---|
| `meme_kanseri_tani.ipynb` | Tüm çalışma: keşif, ön işleme, model seçimi, değerlendirme, hata analizi |
| `proje_raporu.pdf` / `.docx` | Proje raporu |
| `sekiller/` | Rapordaki şekiller |
| `sonuclar.json` | Notebook'un ürettiği tüm sayısal sonuçlar |
| `build_notebook.py`, `yorumlar.py` | Notebook'u üreten betik |

> Bu model bir karar destek aracıdır; tıbbi tanı koymaz.
