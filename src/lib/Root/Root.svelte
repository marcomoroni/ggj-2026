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
		min-height: 100dvh;
		isolation: isolate;
	}
</style>
