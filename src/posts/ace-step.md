---
title: 'ACE-Step v1.5で音楽をつくってみる'
description: '音楽生成モデル「ACE-Step v1.5」をローカルで動かして、音楽をつくってみる。'
updatedDate: '2026-06-06'
tags: ['ai']
published: true
pinned: false
---

## ACE-Step v1.5とは？

https://huggingface.co/ACE-Step/Ace-Step1.5

## 動かしてみた

ACE-Step-1.5をGitHubからダウンロード。

```shell
git clone https://github.com/ace-step/ACE-Step-1.5.git
```

依存関係をインストール。

```shell ACE-Step-1.5
uv sync
```

GUIを起動。

```shell ACE-Step-1.5
PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.0 uv run acestep
```

:::info
曲の生成時に「RuntimeError: MPS backend out of memory」というエラーが出るため、PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.0を指定してメモリ使用上限を無くしている。
:::

http://127.0.0.1:7860

### 設定

#### 初期化

Service Configuration - Initialize Serviceで初期化を開始すると、初回はこのタイミングでモデルのダウンロードが走る。

:::info
GPU Tier Overrideのデフォルトはtier4だった。メモリ不足になるようなら、3や2を検討してみる。
:::

#### 除外する曲の情報

```text
Service Configuration
  └──LM Generation
    └──LM Negative Prompt
```

たとえばダークな曲を作りたい時は明るい雰囲気を除外。

> bright, heroic, uplifting

単調な曲や平坦な曲を禁止。

> flat dynamics, monotonous rhythm

急激な終わり方を禁止。

> abrupt cut-off, sudden ending

:::info
英語で指示したほうが精度が高いらしい。
:::

### 曲の生成

メモリ使用率を抑えるため、インストゥルメンタル（＝歌詞なし）でつくる。

#### 曲の説明（Generation - Music Caption）

たとえば、

> Starts instantly with a heavy ominous dark piano strike and sub-bass impact at second zero, followed by a very brief, tense, fast-pulsing piano arpeggio that quickly builds suspense within seconds. Then, it immediately explodes into a furious fast-paced combat section dominated by a frantic, virtuosic dark gothic piano leading aggressive orchestral strings, which later drops in intensity into a rhythmic lower gear to create breathtaking dynamic contrast. Finally, it builds up through a massive second crescendo with rapid piano keys, surging toward a spectacular thrilling climax. The music must complete its full progression, smoothly fading out and resolving into absolute silence by the 55th second, leaving only quiet trailing piano reverb at the very end. Relentless heavy monumental boss fight energy, dramatic piano-driven orchestration.

「0秒目の重い一撃からすぐさま狂気のピアノ戦闘へ突入し、意図的な『中だるみ（引き算）』で抑揚をつけながら、最後は55秒できっちり美しく消え去る、1分間完結型のドラマチックなボス戦演出曲」。

#### 歌詞（Generation - Lyrics）

インストゥルメンタルの場合は、下部の「Instrumental」にチェックを入れる。

#### 歌詞の言語（Generation - Optional Parameters - Vocal Language）

今回はインストゥルメンタルなので変更しないが、日本語の歌詞をつけたい場合は、Language Autoのチェックを外して、```ja```を選択する。

#### 曲長（Generation - Optional Parameters - Audio Duration）

デフォルトは```-1```（auto）。長くなるほどメモリ使用量が増えるので、最初はDuration Autoのチェックを外して、手動で短く設定（たとえば```30```）して試す。

#### 生成数（Generation - Optional Parameters - Batch Size）

生成する数もメモリ使用率に影響するので、まずは```1```としておく。

#### 生成

Generate Musicで生成が開始される。

#### 成果

https://muddybozu.sakura.ne.jp/demos/wavesurferjs/
