# 小学校6年生 学習プリント

小学校6年生向けの静的な学習サイトです。国語、社会・公民、社会・歴史の練習問題を収録し、問題切り替え、模範回答、A4印刷用プリントに対応しています。

## 使い方

1. `index.html` をブラウザで開きます。
2. 教科と単元を選び、「次へ」「前へ」「ランダム」で問題を切り替えます。
3. `answers.html` で模範回答を確認します。
4. `print.html` で問題プリントまたは解答プリントを選び、ブラウザの印刷機能でA4印刷します。

## 収録内容

- 国語: 主語・述語・修飾語、語句の係り方、語順、文の整え方
- 社会・公民: 日本国憲法、三権分立、選挙、地方自治、税、福祉、国際社会
- 社会・歴史: 縄文・弥生・古墳から戦後の日本まで、時代区分ごとに出来事・人物・文化・くらしを整理

問題数は合計103問です。

## ファイル構成

- `index.html`: 問題演習ページ
- `answers.html`: 模範回答ページ
- `print.html`: A4印刷用ページ
- `data.js`: 教科・問題・参照資料データ
- `script.js`: 問題演習ページの操作
- `print.js`: 模範回答ページと印刷用ページの表示
- `styles.css`: 画面表示と印刷用スタイル

## 参考資料

問題文は教科書本文の転載ではなく、以下の資料で示される単元や評価の観点を参考にしたオリジナル問題です。

- [文部科学省 小学校学習指導要領（平成29年告示）解説 国語編](https://www.mext.go.jp/content/20220606-mxt_kyoiku02-100002607_002.pdf)
- [文部科学省 小学校学習指導要領（平成29年告示）解説 社会編](https://www.mext.go.jp/content/20230308-mxt_kyoiku02-100002607_003.pdf)
- [光村図書 小学校国語 年間指導計画・評価計画資料](https://www.mitsumura-tosho.co.jp/kyokasho/s-kokugo/keikaku)
- [日本文教出版 小学校社会 サポート資料](https://www.nichibun-g.co.jp/textbooks/s-shakai/useful/)
- [教育出版 小学校社会 年間指導計画・評価計画資料](https://www.kyoiku-shuppan.co.jp/textbook/shou/shakai/document/ducu1/r6plan.html)

## GitHub

保存予定のリポジトリ名は `6nen-gakushu-site` です。初回はprivate repositoryとして作成し、`main` ブランチに直接保存する想定です。
