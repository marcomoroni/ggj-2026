<script lang="ts">
	import './main.css';
	import './reset.css';

	const { children } = $props();
</script>

<div class="root">
	{@render children()}
</div>

<style>
	.root {
		font-size: 16px;
		line-height: 1.5;
		height: 100dvh;
		overflow: clip;
		isolation: isolate;
		background-color: grey;
		display: grid;
	}
</style>
