<script lang="ts">
	import Root from '$lib/Root';
	import BottomBar from '$lib/venice/BottomBar/BottomBar.svelte';
	import ParticipantsRow from '$lib/venice/ParticipantsRow';
	import Rules from '$lib/venice/Rules';
</script>

<Root>
	<div class="font">
		<Rules />
		<ParticipantsRow />
		<BottomBar />
	</div>
</Root>

<style>
	@font-face {
		font-family: 'Figtree';
		src: url($lib/Figtree.ttf);
	}

	.font {
		display: contents;
		font-family: 'Figtree';
		font-size: 16px;
		font-weight: 500;
	}
</style>
