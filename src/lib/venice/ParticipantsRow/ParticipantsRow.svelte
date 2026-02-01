<script lang="ts">
	import Participant from './Participant.svelte';
	import { type ParticipantId, type MaskId, participantIds } from '..';

	let {
		maskAssignments = $bindable(),
		scrollToParticipantsRow = $bindable()
	}: {
		maskAssignments: Record<ParticipantId, MaskId | undefined>;
		scrollToParticipantsRow: () => void;
	} = $props();

	let rowHeight = $state(0);

	function handleDropMask(sourceParticipantId: ParticipantId, targetParticipantId: ParticipantId) {
		if (sourceParticipantId === targetParticipantId) return;

		const sourceMask = maskAssignments[sourceParticipantId];
		const targetMask = maskAssignments[targetParticipantId];

		maskAssignments[sourceParticipantId] = targetMask;
		maskAssignments[targetParticipantId] = sourceMask;
	}

	let participantRowElement = $state<HTMLDivElement>();
	scrollToParticipantsRow = () => {
		participantRowElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	};
</script>

<div class="row" bind:clientHeight={rowHeight} bind:this={participantRowElement}>
	{#each participantIds as id}
		<div class="pivot" data-participant-id={id}>
			<Participant
				participantId={id}
				maskId={maskAssignments[id]}
				containerHeight={rowHeight}
				onDropMask={(targetId) => handleDropMask(id, targetId)}
			/>
		</div>
	{/each}
</div>

<style>
	.row {
		height: 800px;
		max-width: 1200px;
		margin-inline: auto;

		position: relative;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		justify-items: center;
		align-items: end;
		overflow: clip;
		isolation: isolate;
	}

	.pivot {
		position: relative;
		width: 0px;
		height: 0px;
	}
</style>
