<script lang="ts">
	import Info from '@lucide/svelte/icons/info';
	import NotepadText from '@lucide/svelte/icons/notepad-text';
	import Settings from '@lucide/svelte/icons/settings';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import { browser, dev } from '$app/environment';
	import { formatTag } from '$lib/config';
	import { SITE_NAME } from '$lib/constants';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const allPosts = $derived(
		data.posts.filter((post) => {
			if (dev) return true;

			// 本番では「test」タグがある記事は含めない
			const hasTestTag = post.tags?.some((tag) => tag.toLowerCase().includes('test'));
			return !hasTestTag;
		})
	);

	const defaultTag = 'すべて';

	const allTags = $derived([
		defaultTag,
		...new Set(
			allPosts
				.flatMap((post) => post.tags || [])
				.map((tag) => tag.trim())
				.filter(Boolean)
		)
	]);

	// SSGだとurl.searchParamsでコケる
	// let selectedTag = $derived(page.url.searchParams.get('tag') ?? defaultTag);

	let selectedTag = $state(defaultTag);

	const filteredPosts = $derived(
		selectedTag === defaultTag
			? allPosts
			: allPosts.filter((post) => post.tags?.includes(selectedTag))
	);

	onMount(() => {
		selectedTag = getTagFromURL();

		const handlePopState = () => {
			selectedTag = getTagFromURL();
		};

		window.addEventListener('popstate', handlePopState);

		// クリーンアップ（コンポーネントが破棄されるときにイベントを解除）
		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	});

	function getTagFromURL() {
		if (!browser) return defaultTag;
		const params = new URLSearchParams(window.location.search);
		return params.get('tag') ?? defaultTag;
	}

	function updateTag(tag: string) {
		if (selectedTag === tag) return;

		selectedTag = tag;

		if (browser) {
			const url = new URL(window.location.href);
			if (tag === defaultTag) {
				url.searchParams.delete('tag');
			} else {
				url.searchParams.set('tag', tag);
			}

			history.pushState({}, '', url);
		}
	}

	const pageTitle = $derived(selectedTag === defaultTag ? SITE_NAME : formatTag(selectedTag));

	const pageDescription = $derived(
		selectedTag === defaultTag ? 'ノート一覧' : formatTag(selectedTag) + 'の記事一覧。'
	);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
</svelte:head>

<div class="wrapper">
	<nav class="tag-filter">
		{#each allTags as tag (tag)}
			<button class="tag-button" class:active={selectedTag === tag} onclick={() => updateTag(tag)}>
				{formatTag(tag)}
			</button>
		{/each}
	</nav>

	{#if filteredPosts.length === 0}
		<p>公開されている記事がありません。</p>
	{:else}
		<ul class="post-list">
			{#each filteredPosts as post (post.slug)}
				<li class="post-item" animate:flip={{ duration: 300 }} in:fade={{ duration: 200 }}>
					<a href="/{post.slug}" class="post-link">
						{post.title}

						<div class="post-icon">
							{#if post.tags?.includes('test')}
								<Settings size={18} strokeWidth={1.6} />
							{:else if post.slug === 'about'}
								<Info size={18} strokeWidth={1.6} />
							{:else}
								<NotepadText size={18} strokeWidth={1.6} />
							{/if}
						</div>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 2.4rem;
		margin-top: 1.6rem;
	}

	.tag-filter {
		display: flex;
		gap: 0.8rem;
		flex-wrap: wrap;
	}

	.tag-button {
		padding: 0.4rem 0.8rem;
		font-size: 1.2rem;
		color: var(--accent-color);
		border: 1px solid var(--neutral-main);
		border-radius: calc(0.8rem * 2);
		background: var(--sub-color);

		@media (hover) {
			transition-property: border-color;
			transition-duration: var(--duration-normal);

			&:hover {
				border-color: var(--accent-color);
			}
		}

		&.active {
			color: var(--sub-color);
			border-color: var(--main-color);
			background: var(--main-color);
			pointer-events: none;
		}
	}

	.post-list {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.post-item {
		position: relative;
	}

	.post-link {
		--local-shadow-size: 4px;
		position: relative;
		left: calc(-1 * var(--local-shadow-size));
		top: calc(-1 * var(--local-shadow-size));
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100%;
		padding: 2rem;
		text-decoration: none;
		border: 1px solid var(--main-color);
		background: var(--sub-color);
		box-shadow: var(--local-shadow-size) var(--local-shadow-size) 0 0 var(--main-color);

		@media (hover) {
			transition-property: left, top, box-shadow;
			transition-duration: var(--duration-normal);

			&:hover {
				left: 0;
				top: 0;
				border-color: var(--accent-color);
				box-shadow: none;

				.post-icon {
					color: var(--accent-color);
				}
			}
		}
	}

	.post-icon {
		color: var(--neutral-high);
		transition-property: color;
		transition-duration: var(--duration-normal);
	}
</style>
