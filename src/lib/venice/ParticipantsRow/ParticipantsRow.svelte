<script lang="ts" module>
	import Participant from './Participant.svelte';

	const participants = [
		{ id: 'a' as const, initialMask: 'red' as const },
		{ id: 'b' as const, initialMask: 'yellow' as const },
		{ id: 'c' as const, initialMask: 'green' as const },
		{ id: 'd' as const, initialMask: 'cyan' as const },
		{ id: 'e' as const, initialMask: 'purple' as const }
	];
</script>

<script lang="ts">
	let rowHeight = $state(0);
</script>

<div class="row" bind:clientHeight={rowHeight}>
	{#each participants as participant}
		<div class="pivot">
			<Participant
				participantId={participant.id}
				maskId={participant.initialMask}
				containerHeight={rowHeight}
			/>
		</div>
	{/each}
</div>

<style>
	.row {
		/* display: flex; */
		/* gap: 200px; */
		position: relative;
		height: 100%;
		border: 2px solid salmon;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		justify-items: center;
		align-items: end;
		overflow: clip;
		isolation: isolate;
	}

	.pivot {
		position: relative;
		width: 10px;
		height: 10px;
		background-color: red;
	}
</style>
