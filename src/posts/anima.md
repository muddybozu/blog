---
title: 'Anima Base v1.0でイラストをつくってみる'
description: '画像生成モデル「Anima Base v1.0」をローカルで動かして、イラストをつくってみる。'
updatedDate: '2026-06-06'
tags: ['ai']
published: true
pinned: false
---

## Anima Base v1.0とは？

ComfyUIとCircleStone Labsが共同開発したアニメ特化型の画像生成モデル。

## 動かしてみた

ComfyUIのテンプレート「Anima Base v1：テキストから画像へ」をベースに、Anima Turbo LoRAを経由させて高速化し、RealESRGAN_x4plusでアップスケールしてみた。

画像サイズは960x704を指定（アップスケールが適用されるので最終的には4倍の3840x2816）したところ、steps「4」の指定だとわずか80秒前後でそこそこのクオリティの画像が出てきた。

![出力例](/assets/img/posts/anima/steps4.webp)

steps「8」の指定だと120秒前後かかるが、クオリティは格段に上がる印象。

![出力例](/assets/img/posts/anima/steps8.webp)

ちなみにプロンプトは以下。

```text positive
1girl, solo, masterpiece, high quality, (graphic novel style:1.3), sharp lineart, (yellow hair:1.2), medium hair, amber eyes, sharp eyes, cool expression, demeanor, (simple yellow cloak:1.2), black turtleneck, slender build, (from above: 1.4), (bright daylight from camera:1.2), (high contrast:1.2), deserted fantasy background, negative space, washed out colors, sepia tones, edgy, stylish
```

```text negative
worst quality, low quality, score_1, score_2, score_3, blurry, jpeg artifacts, sepia, bad hands, missing fingers
```
