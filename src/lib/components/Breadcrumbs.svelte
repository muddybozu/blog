<script lang="ts">
	import { page } from '$app/state';

	const segments = $derived(page.url.pathname.split('/').filter(Boolean));

	const rootLabel = 'ノート';

	const getLabel = $derived((segment: string, isLast: boolean) => {
		if (segment === '') return rootLabel;

		// 記事ページではタイトルを採用
		if (isLast && page.data.post?.title) {
			return page.data.post.title;
		}

		// それ以外はURLのパスをそのまま出す
		return decodeURIComponent(segment);
	});
</script>

<nav aria-label="Breadcrumb">
	<ol class="breadcrumbs">
		<li>
			{#if segments.length === 0}
				<span aria-current="page">{rootLabel}</span>
			{:else}
				<a href="/">{rootLabel}</a>
			{/if}
		</li>

		{#each segments as segment, i (i)}
			{@const href = '/' + segments.slice(0, i + 1).join('/')}
			{@const isLast = i === segments.length - 1}
			{@const label = getLabel(segment, isLast)}

			<li>
				{#if isLast}
					<span aria-current="page">{label}</span>
				{:else}
					<a {href}>{label}</a>
				{/if}
			</li>
		{/each}
	</ol>
</nav>

<style lang="scss">
	.breadcrumbs {
		display: flex;

		li {
			font-size: 1.2rem;

			&::after {
				display: inline-block;
				content: '/';
				margin: 0 0.4rem;
			}

			&:last-of-type {
				&::after {
					content: none;
				}
			}
		}
	}
</style>
