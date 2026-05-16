// マークダウン関連
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { fromHtml } from 'hast-util-from-html';
import remarkDirective from 'remark-directive';
import rehypeToc from 'rehype-toc';

// Shiki 関連
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import langBash from 'shiki/langs/bash.mjs';
import langCss from 'shiki/langs/css.mjs';
import langHtml from 'shiki/langs/html.mjs';
import langJavascript from 'shiki/langs/javascript.mjs';
import langJson from 'shiki/langs/json.mjs';
import langSvelte from 'shiki/langs/svelte.mjs';
import langTypescript from 'shiki/langs/typescript.mjs';
import themeGitHubLight from 'shiki/themes/github-light.mjs';

// 型定義
import type { Root as MdastRoot } from 'mdast';
import type { Directives } from 'mdast-util-directive';
import type { Root as HastRoot, Element } from 'hast';
import type { HighlighterCore } from 'shiki/core';

// 言語とラベルの対応表
const langMap: Record<string, string> = {
	css: 'CSS',
	html: 'HTML',
	javascript: 'JavaScript',
	js: 'JavaScript',
	json: 'JSON',
	ts: 'TypeScript',
	typescript: 'TypeScript',
	bash: 'Shell',
	sh: 'Shell',
	shell: 'Shell',
	svelte: 'Svelte',
	text: 'Text'
};

// コードハイライターはコストが高いので一度きり
let highlighter: HighlighterCore;

export async function parseMarkdown(content: string) {
	if (!content) return '';

	if (!highlighter) {
		highlighter = await createHighlighterCore({
			themes: [themeGitHubLight],
			langs: [langBash, langCss, langHtml, langJavascript, langJson, langSvelte, langTypescript],
			engine: createJavaScriptRegexEngine() // Wasmは使わない
		});
	}

	const processor = unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkDirective)
		.use(() => (tree: MdastRoot) => {
			// AST（抽象構文木）を巡回してコンテナディレクティブをdivで出力
			visit(tree, (node) => {
				if (node.type === 'containerDirective') {
					const n = node as Directives;
					const data = (n.data ||= {});

					data.hName = 'div';
					data.hProperties = { class: `custom-container container-${n.name}` };
				}
			});
		})
		.use(remarkBreaks)
		.use(remarkRehype)
		.use(rehypeSlug)
		.use(rehypeToc, {
			headings: ['h2'], // 目次はh2だけでいいや
			cssClasses: {
				toc: 'page-toc',
				list: 'toc-list',
				listItem: 'toc-item',
				link: 'toc-link'
			},
			customizeTOC: (toc) => {
				const listElement = toc.children?.find(
					// trueが返ればElement型と判断する（いわゆる型ガード）
					(child): child is Element =>
						child.type === 'element' &&
						'tagName' in child &&
						(child.tagName === 'ol' || child.tagName === 'ul')
				);

				if (!listElement || listElement.children.length === 0) {
					return false;
				}

				return toc;
			}
		})
		.use(() => (tree: HastRoot) => {
			visit(tree, 'element', (node: Element, index, parent) => {
				// 画像
				if (node.tagName === 'img') {
					const src = node.properties?.src;

					if (typeof src === 'string' && src.startsWith('/src/lib/assets/')) {
						// enhanced-img用のクエリを付与
						node.properties.src = `${src}?enhanced`;

						node.properties.loading = 'lazy';
						node.properties.decoding = 'async';
					}
				}

				// 外部リンク
				if (node.tagName === 'a' && typeof node.properties?.href === 'string') {
					const href = node.properties.href;

					if (href.startsWith('http')) {
						node.properties.target = '_blank';
						node.properties.rel = 'noreferrer';
					}
				}

				// コードブロック
				if (
					node.tagName === 'pre' &&
					node.children[0]?.type === 'element' &&
					node.children[0].tagName === 'code'
				) {
					const codeElement = node.children[0] as Element;

					const codeTextNode = codeElement.children[0];
					if (codeTextNode?.type !== 'text') return;
					const codeText = codeTextNode.value.trimEnd();
					const className = codeElement.properties?.className;
					const langClass = Array.isArray(className)
						? className.find((c): c is string => typeof c === 'string' && c.startsWith('language-'))
						: null;

					const rawLangAttr = langClass ? langClass.replace('language-', '') : 'text';
					const delimiter = ':';
					const rawLang = rawLangAttr.split(delimiter)[0];
					const isSupportedLang = Object.prototype.hasOwnProperty.call(langMap, rawLang);
					const lang = isSupportedLang ? rawLang : 'text';
					const displayLang = langMap[lang];

					const highlightedHtml = highlighter.codeToHtml(codeText, {
						lang,
						theme: 'github-light',
						transformers: [
							{
								line(node, line) {
									node.properties['data-line'] = line;
								}
							}
						]
					});

					const fragment = fromHtml(highlightedHtml, { fragment: true });
					const highlightedNode = fragment.children.find(
						(child): child is Element => child.type === 'element'
					);
					if (!highlightedNode) return;

					// 補足情報
					const meta = (codeElement.data as { meta?: string })?.meta || '';
					const rawExtra = meta.trim();
					const extra = rawExtra.startsWith(':') ? rawExtra.slice(1) : rawExtra;

					// 情報を専用のdivにまとめて吐き出す
					const langBlock: Element = {
						type: 'element',
						tagName: 'div',
						properties: {
							className: ['code-info__lang'],
							'data-lang': displayLang
						},
						children: [{ type: 'text', value: displayLang }]
					};

					const extraBlock: Element = {
						type: 'element',
						tagName: 'div',
						properties: {
							className: ['code-info__extra']
						},
						children: [{ type: 'text', value: extra }]
					};

					const infoBlock: Element = {
						type: 'element',
						tagName: 'div',
						properties: {
							className: ['code-info']
						},
						children: [langBlock, extraBlock]
					};

					const container: Element = {
						type: 'element',
						tagName: 'div',
						properties: { className: ['code-block-container'] },
						children: [infoBlock, highlightedNode]
					};

					if (highlightedNode && parent && typeof index === 'number') {
						parent.children[index] = container;
					}
				}
			});
		})
		.use(rehypeStringify);

	const result = await processor.process(content);

	return String(result);
}
