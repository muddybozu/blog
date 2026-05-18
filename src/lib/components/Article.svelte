<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		copyButton();
	});

	const copyButton = (): void => {
		const containers: NodeListOf<HTMLElement> = document.querySelectorAll('.code-block-container');

		containers.forEach((container) => {
			if (container.querySelector('.copy-button')) return;

			const button = document.createElement('button');
			button.className = 'copy-button';

			const textSpan = document.createElement('span');
			textSpan.className = 'button-text';
			textSpan.textContent = 'copy';

			button.appendChild(textSpan);

			let timer: ReturnType<typeof setTimeout> | undefined;

			button.onclick = async (): Promise<void> => {
				if (timer) clearTimeout(timer);

				// 強制リフローをはさんで、かならずaddが実行されるように
				button.classList.remove('copied');
				void button.offsetWidth;
				button.classList.add('copied');

				const code = container.querySelector('code')?.innerText || '';
				await navigator.clipboard.writeText(code);

				timer = setTimeout(() => {
					button.classList.remove('copied');
					timer = undefined;
				}, 1000);
			};

			container.appendChild(button);
		});
	};

	let { content } = $props();
</script>

<article class="post-content">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html content}
</article>

<style lang="scss">
	.post-content {
		--post-content-padding: 4rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: var(--post-content-padding);
		border: 1px solid var(--main-color);
		background: var(--sub-color);

		// 基本
		:global {
			h2,
			h3,
			h4,
			h5,
			h6 {
				margin-top: 1em;
				letter-spacing: 0.04em;
				line-height: 1.4;
				color: var(--main-color);

				&:first-child {
					margin-top: 0;
				}
			}

			h2 {
				--line-height: 1.4;
				--border-width: 2px;
				position: relative;
				font-size: 2.6rem;
				font-weight: 900;
				line-height: var(--line-height);

				&::before {
					position: absolute;
					left: calc(-1 * var(--post-content-padding));
					top: calc((1em * var(--line-height)) / 2 - (var(--border-width) / 2));
					content: '';
					display: block;
					width: calc(var(--post-content-padding) - 0.8rem);
					height: 0;
					border-top: var(--border-width) solid var(--main-color);
				}

				@media (max-width: 767px) {
					font-size: 2.4rem;
				}
			}

			h3 {
				font-size: 2.2rem;
				font-weight: 700;

				@media (max-width: 767px) {
					font-size: 2rem;
				}
			}

			h4 {
				font-size: 2rem;

				@media (max-width: 767px) {
					font-size: 1.8rem;
				}
			}

			h5 {
				font-size: 1.8rem;

				@media (max-width: 767px) {
					font-size: 1.6rem;
				}
			}

			h6 {
				font-size: 1.6rem;

				@media (max-width: 767px) {
					font-size: 1.4rem;
				}
			}

			p {
				font-size: 1.6rem;
				line-height: 1.8;
				letter-spacing: 0.06em;
				word-break: auto-phrase;

				@media (max-width: 767px) {
					font-size: 1.4rem;
				}
			}

			a {
				&:hover {
					text-decoration: none;
				}
			}

			ul,
			ol {
				display: flex;
				flex-direction: column;
				gap: 1rem;
				padding-left: 2rem;
			}

			ul {
				& > li {
					list-style-type: disc;
				}
			}

			ol {
				& > li {
					list-style-type: decimal;
				}
			}

			li {
				font-size: 1.6rem;
				line-height: 1.8;

				li {
					&:first-of-type {
						margin-top: 1rem;
					}
				}
			}

			hr {
				border: 0;
				border-top: 1px solid var(--neutral-low);
				margin: 1em 0;
			}

			pre {
				background: transparent !important;

				& > code {
					display: block;
					margin: 0;
					padding: calc(2rem + 0.8rem) 0 1rem 0;
					font-family: var(--font-mono);
					line-height: 1.4;
					background: transparent;
					overflow-x: auto;
					tab-size: 2;
				}
			}

			code {
				display: inline-block;
				margin: 0 0.4rem;
				padding: 0 0.4rem;
				font-family: var(--font-mono);
				font-size: 1.4rem;
				line-height: 1.8;
				border-radius: 0.4rem;
				background: var(--neutral-faint);
			}

			blockquote {
				padding: 1rem;
				color: var(--mainLightColor);
				border-left: 4px solid var(--neutral-main);
				background: var(--neutral-faint);
			}

			table {
				border-collapse: collapse;
				border-spacing: 0;
			}

			th,
			td {
				padding: 1rem;
				border: 1px solid var(--neutral-main);
			}

			th {
				background: var(--neutral-faint);

				&[align='center'] {
					text-align: center;
				}

				&[align='right'] {
					text-align: right;
				}
			}

			img {
				width: 100%;
			}
		}

		// カスタムブロック
		:global {
			.custom-container {
				position: relative;
				display: flex;
				flex-direction: column;
				gap: 1rem;
				padding: 3rem 2rem 2rem 2rem;
				border-radius: 0.4rem;
				overflow: hidden;

				&::before {
					position: absolute;
					left: 0;
					top: 0;
					display: flex;
					justify-content: center;
					align-items: center;
					height: 2em;
					padding: 0 0.8rem;
					font-size: 1rem;
					border-radius: 0 0 0.4rem 0;
				}
			}

			.container-info {
				color: var(--info-main);
				background: var(--info-sub);

				&::before {
					content: 'Info';
					color: var(--info-sub);
					background: var(--info-main);
				}
			}

			.container-warning {
				color: var(--warning-main);
				background: var(--warning-sub);

				&::before {
					content: 'Wern';
					color: var(--warning-sub);
					background: var(--warning-main);
				}
			}
		}

		// 目次
		:global {
			.page-toc {
				position: relative;
				display: flex;
				flex-direction: column;
				gap: 2rem;
				padding-bottom: 2rem;
				border-bottom: 1px solid var(--neutral-main);

				&::before {
					align-self: flex-start;
					content: '目次';
					display: block;
					padding: 0.4rem calc(0.8rem + 0.8rem);
					font-size: 1.2rem;
					color: var(--sub-color);
					background: var(--main-color);
				}
			}

			.toc-list {
				display: flex;
				flex-direction: column;
				gap: 2rem;
				padding: 0;
			}

			.toc-item {
				--line-height: 1.8;
				--border-width: 1px;
				position: relative;
				padding-left: calc(0.8rem + 0.8rem);
				font-size: 1.4rem;
				line-height: var(--line-height);
				list-style-type: none;

				&::before {
					position: absolute;
					left: 0;
					top: calc((1em * var(--line-height)) / 2 - var(--border-width) / 2);
					content: '';
					display: block;
					width: 0.8rem;
					height: 0;
					font-size: inherit;
					border-top: var(--border-width) solid var(--main-color);
				}
			}

			.toc-link {
				display: inline-block;
				font-size: inherit;
			}
		}

		// コードブロックの拡張
		:global {
			.code-block-container {
				position: relative;
				background: var(--neutral-faint) !important;
			}

			.copy-button {
				position: absolute;
				right: 0.4rem;
				top: 0;
				padding: 0.4rem;
				color: var(--neutral-high);

				&:active {
					transform: scale(0.9);
				}

				.button-text {
					position: relative;
					font-size: 1.2rem;
				}

				// コピー成功時のスタイル
				&.copied {
					.button-text {
						color: var(--accent-color);

						&::before {
							position: absolute;
							left: 50%;
							top: 50%;
							content: '';
							width: 100%;
							aspect-ratio: 1;
							border: 1px solid var(--accent-color);
							border-radius: 50%;
							transform: translate(-50%, -50%) scale(1);
							opacity: 0;
							animation: pulse 0.2s ease-out;
						}
					}
				}

				@keyframes pulse {
					0% {
						transform: translate(-50%, -50%) scale(1);
						opacity: 1;
					}
					100% {
						transform: translate(-50%, -50%) scale(1.4);
						opacity: 0;
					}
				}
			}

			.code-info {
				position: absolute;
				left: 0;
				top: 0;
				display: flex;
				gap: 0.5rem;
				align-items: center;
				padding-right: 3rem;

				&__lang {
					display: flex;
					justify-content: center;
					align-items: center;
					height: 2em;
					padding: 0 0.8rem;
					font-size: 1rem;
					color: #fff;
					letter-spacing: 0.04em;
					border-radius: 0 0 0.4rem 0;
					background: var(--main-color);

					&[data-lang='TypeScript'] {
						background: #3178c6;
					}

					&[data-lang='JavaScript'] {
						background: #f7df1e;
						color: #000;
					}

					&[data-lang='JSON'] {
						background: #f7df1e;
						color: #000;
					}

					&[data-lang='Svelte'] {
						background: #ff3e00;
					}

					&[data-lang='CSS'] {
						background: rebeccapurple;
					}

					&[data-lang='HTML'] {
						background: #e34f26;
					}
				}

				&__extra {
					font-size: 1rem;
					color: var(--neutral-high);
				}
			}

			.line {
				display: inline-block;
				width: 100%;
				padding: 0.1rem 0;

				&::before {
					content: attr(data-line);
					display: inline-block;
					min-width: 2rem;
					font-size: 1.2rem;
					padding: 0.1rem 0;
					text-align: right;
					color: var(--neutral-main);
					user-select: none;
				}

				& > span:nth-of-type(1) {
					margin-left: 2rem;
				}
			}
		}
	}
</style>
