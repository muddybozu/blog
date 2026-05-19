// タグとラベルの対応表
const TAG_MAP: Record<string, string> = {
	ai: 'AI',
	css: 'CSS',
	deno: 'Deno',
	frontend: 'フロントエンド',
	html: 'HTML',
	javascript: 'JavaScript',
	meta: '雑記',
	svelte: 'Svelte',
	test: '開発用',
	typescript: 'TypeScript',
	unclassified: '未分類'
};

// タグをラベルに変換
export const formatTag = (rawTag: string): string => {
	const tag = rawTag.trim();

	return TAG_MAP[tag.toLowerCase()] ?? tag;
};
