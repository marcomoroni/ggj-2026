<script lang="ts">
	import { quadInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	let { children, onClick } = $props();

	const transitionDuration = 400;
</script>

<button
	in:fade={{ delay: transitionDuration, duration: transitionDuration, easing: quadInOut }}
	out:fade={{ duration: transitionDuration, easing: quadInOut }}
	class="button"
	onclick={onClick}
>
	{@render children()}
	<div class="decoration-left"></div>
	<div class="decoration-right"></div>
</button>

<style>
	.button {
		margin-bottom: 30px;
		height: 47px;
		align-content: center;

		margin-left: 30px;
		margin-right: 30px;
		border-radius: 16px;
		padding-inline: 18px;
		font-weight: 550;
		background-color: #f0eed7;
		color: #403c1c;
		position: relative;
	}

	.decoration-left,
	.decoration-right {
		--decoration-size: 22px;
		--decoration-horizontal-position-offset: 2px;
		position: absolute;
		top: calc(50% - var(--decoration-size) / 2);
		width: var(--decoration-size);
		height: var(--decoration-size);
		background-color: #f0eed7;
		border-radius: calc(infinity * 1px);
	}

	.decoration-left {
		left: calc(-1 * (var(--decoration-size) / 2) + var(--decoration-horizontal-position-offset));
	}

	.decoration-right {
		right: calc(-1 * (var(--decoration-size) / 2) + var(--decoration-horizontal-position-offset));
	}
</style>
