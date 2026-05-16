<script lang="ts">
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import Article from '$lib/components/Article.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import { SITE_NAME } from '$lib/constants';
	import type { PageData } from './$types';
	import Tag from '$lib/components/Tag.svelte';

	let { data }: { data: PageData } = $props();

	const post = $derived(data.post);
	const pageTitle = $derived(`${post.title}｜${SITE_NAME}`);
	const pageDescription = $derived(post.description);
	const pageUrl = $derived(`${PUBLIC_SITE_URL}/${post.slug}/`);
</script>

<svelte:head>
	<title>{post.title}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={pageUrl} />
</svelte:head>

<div class="wrapper">
	<Breadcrumbs />

	<article>
		<header class="post-header">
			<h1>
				{post.title}
			</h1>

			<div class="post-header__info">
				{#if post.tags}
					{#each post.tags as tag (tag)}
						<Tag {tag} />
					{/each}
				{/if}

				{#if post.updatedDate}
					<div class="post-header__updated">
						{post.updatedDate} 更新
					</div>
				{/if}
			</div>
		</header>

		<Article content={post.content} />
	</article>

	<Breadcrumbs />
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	article {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
		margin: 0 auto;
	}

	.post-header {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		h1 {
			flex: 1;
			font-size: 3.2rem;
			font-weight: 900;
			color: var(--main-color);
			letter-spacing: 0.04em;
			line-height: 1.4;
		}

		&__info {
			display: flex;
			gap: 1rem;
			align-items: center;
			flex-wrap: wrap;
			font-size: 1.2rem;
		}

		&__updated {
			padding: 0 1rem;
			border-left: 1px solid var(--neutral-main);
		}
	}
</style>
