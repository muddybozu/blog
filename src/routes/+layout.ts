// Cloudflare Pagesで静的ファイルをホストする想定なので、
// ビルド時にこのページ（または配下の全ページ）を静的なHTMLとして書き出す
export const prerender = true;

// すべてのURLの末尾に必ずスラッシュをつける
export const trailingSlash = 'always';
