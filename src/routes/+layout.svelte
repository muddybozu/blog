<script lang="ts">
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import { SITE_AUTOR } from '$lib/constants';
	import 'destyle.css';
	import '$src/app.scss';

	// トップかどうかの判定
	const isTop = $derived(page.url.pathname === '/');

	// 著作権の年表示
	const blogStartYear = 2026;
	const currentYear = new Date().getFullYear();
	const copyrightYear =
		blogStartYear === currentYear ? blogStartYear : `${blogStartYear} - ${currentYear}`;

	// 滑らかなページ遷移
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let { children } = $props();
</script>

<svelte:head>
	<meta property="og:type" content="website" />
	<meta property="og:image" content="{PUBLIC_SITE_URL}/ogp.png" />
	<meta property="og:site_name" content={SITE_AUTOR} />
	<meta property="og:locale" content="ja_JP" />
	<!-- その他の項目はページ側で指定する -->
</svelte:head>

<div class="wrapper">
	<header>
		{#if isTop}
			<div class="logo">
				<div class="logo__image"></div>

				<h1 class="logo__name">{SITE_AUTOR}</h1>
			</div>
		{:else}
			<a href="/" class="logo">
				<div class="logo__image"></div>

				<p class="logo__name">{SITE_AUTOR}</p>
			</a>
		{/if}
	</header>

	<main>
		{@render children()}
	</main>

	<footer>
		<p>
			<small>
				<b>免責事項</b><br />
				本ブログのコンテンツは、可能な限り正確な情報を掲載するよう努めておりますが、情報の正確性・完全性を保証するものではありません。掲載された内容によって生じた損害等の一切の責任を負いかねますので、あらかじめご了承ください。また、予告なく記事の内容を変更・削除することがあります。
			</small>
		</p>

		<p>
			<small>
				© {copyrightYear}
				{SITE_AUTOR}
			</small>
		</p>
	</footer>
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 4rem;
		max-width: 80rem;
		margin: 0 auto;
		padding: 4rem;
	}

	header {
		display: flex;
		justify-content: center;
		align-items: center;

		.logo {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 16rem;
			height: auto;
			aspect-ratio: 1/1;
			font-size: 1.2rem;
			color: var(--neutral-main);
			text-decoration: none;

			&::before,
			&::after {
				position: absolute;
				left: 50%;
				top: 50%;
				content: '';
				aspect-ratio: 1;
				border: 1px solid var(--neutral-low);
				border-radius: 50%;
				transform: translate(-50%, -50%);
				clip-path: polygon(50% 50%, 100% 100%, 100% 0%, 0% 0%, 0% 100%);
			}

			&::before {
				width: 80%;
			}

			&::after {
				width: 100%;
				border-width: 10px;
			}

			&:is(a) {
				transition-property: color;
				transition-duration: var(--duration-normal);

				&::before,
				&::after {
					transition-property: border-color, width;
					transition-duration: var(--duration-normal);
				}

				&:hover {
					color: var(--accent-color);

					&::before,
					&::after {
						border-color: var(--accent-color);
					}

					&::before {
						width: calc(80% - 10%);
					}

					&::after {
						width: calc(100% - 10%);
						animation: spin 10s linear infinite reverse;
					}

					h1,
					p {
						bottom: calc(10% + 10%);
					}

					.logo__image {
						background: var(--accent-color);
					}
				}

				@keyframes spin {
					from {
						transform: translate(-50%, -50%) rotate(0deg);
					}
					to {
						transform: translate(-50%, -50%) rotate(360deg);
					}
				}
			}

			h1,
			p {
				position: absolute;
				left: 0;
				bottom: 10%;
				display: flex;
				justify-content: center;
				width: 100%;
				text-decoration: none;
				transition-property: bottom;
				transition-duration: var(--duration-normal);
			}

			&__image {
				width: 50%;
				aspect-ratio: 1;
				background: var(--main-color);
				-weblit-mask: url('/icon.svg') no-repeat center / contain;
				mask: url('/icon.svg') no-repeat center / contain;
				transition-property: width;
				transition-duration: var(--duration-normal);
			}
		}
	}

	footer {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		small {
			font-size: 1.1rem;
			color: var(--neutral-high);
			line-height: 1.8;
		}
	}
</style>
