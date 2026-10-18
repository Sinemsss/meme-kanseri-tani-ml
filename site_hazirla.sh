#!/bin/sh
# site/ klasörünü yayına hazırlar: şekiller, rapor ve sonuçlar kopyalanır (veri.json notebook'tan gelir)
cd "$(dirname "$0")"
mkdir -p site/sekiller
cp sekiller/*.png site/sekiller/
cp proje_raporu.pdf sonuclar.json site/
printf '[[headers]]\n  for = "/*"\n  [headers.values]\n    X-Content-Type-Options = "nosniff"\n' > site/netlify.toml
ls site
