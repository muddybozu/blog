
## 前提

Node.jsやpnpmのバージョン管理に[mise](https://mise.en.dev/) を使用。

## 初回clone時

ツールチェーンの有効化。

```
mise trust
```

環境変数をサンプルから複製。

```
cp .env.example .env.local
```

依存関係をインストール。

```
pnpm install --frozen-lockfile
```

型定義の生成。

```
pnpm svelte-kit sync
```

開発サーバーの起動。

```
pnpm dev
```

## コードの保守

リント。

```
pnpm lint
```

フォーマット。

```
pnpm format
```

## 何かおかしい時

```
rm -rf .svelte-kit node_modules
```

その後、依存関係のインストールなど。

## （メモ）pnpmの掃除

どこからも参照されていない古いパッケージのみ削除。

```
pnpm store prune
```

全データ削除。イチから再構築したい時などの最後の手段。

```
rm -rf $(pnpm store path)
```
