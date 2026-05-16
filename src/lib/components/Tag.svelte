<script lang="ts">
	import { formatTag } from '$lib/config';

	let { tag } = $props();
</script>

<a href="/?tag={tag}">
	{formatTag(tag)}
</a>

<style lang="scss">
	a {
		padding: 0.4rem 0.8rem;
		font-size: 1.2rem;
		color: var(--accent-color);
		text-decoration: none;
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
	}
</style>
