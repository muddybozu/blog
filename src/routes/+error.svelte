<script lang="ts">
	import { page } from '$app/state';
	import { SITE_NAME } from '$lib/constants';
</script>

<div class="error">
	<div class="error__body">
		<h1>
			{page.status}
		</h1>

		{#if page.error?.message}
			<p>
				{page.error.message}
			</p>
		{/if}
	</div>

	<a href="/">
		{SITE_NAME} トップへ
	</a>
</div>

<style lang="scss">
	.error {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4rem;
		padding-top: 4rem;
		text-align: center;

		&__body {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.5rem;
		}

		h1 {
			font-size: 5rem;
			font-weight: 700;
			color: var(--neutral-high);
		}
		p {
			font-size: 1.2rem;
			color: var(--neutral-high);
		}
	}
</style>
