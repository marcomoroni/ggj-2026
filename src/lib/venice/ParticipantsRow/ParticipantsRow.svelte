<script lang="ts">
	import Participant from './Participant.svelte';
	import { type ParticipantId, type MaskId, participantIds } from '..';

	let {
		maskAssignments = $bindable(),
		revealParticipantsRow = $bindable(),
		scrollToParticipantsRow = $bindable(),
		playJumpAnimations = $bindable(),
		makeMasksInert = $bindable()
	}: {
		maskAssignments: Record<ParticipantId, MaskId | undefined>;
		revealParticipantsRow: () => void;
		scrollToParticipantsRow: () => void;
		playJumpAnimations: boolean;
		makeMasksInert: () => void;
	} = $props();

	let rowHeight = $state(0);

	let isRevealed = $state(false);
	let inert = $state(false);

	function handleDropMask(sourceParticipantId: ParticipantId, targetParticipantId: ParticipantId) {
		if (sourceParticipantId === targetParticipantId) return;

		const sourceMask = maskAssignments[sourceParticipantId];
		const targetMask = maskAssignments[targetParticipantId];

		maskAssignments[sourceParticipantId] = targetMask;
		maskAssignments[targetParticipantId] = sourceMask;
	}

	let participantRowElement = $state<HTMLDivElement>();
	revealParticipantsRow = () => {
		isRevealed = true;
	};
	scrollToParticipantsRow = () => {
		participantRowElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	};
	makeMasksInert = () => {
		inert = true;
	};
</script>

<div
	class="row"
	bind:clientHeight={rowHeight}
	bind:this={participantRowElement}
	inert={!isRevealed || inert}
>
	{#each participantIds as id}
		<div class="pivot" data-participant-id={id}>
			<Participant
				participantId={id}
				maskId={maskAssignments[id]}
				containerHeight={rowHeight}
				onDropMask={(targetId) => handleDropMask(id, targetId)}
				{isRevealed}
				playJumpAnimation={playJumpAnimations}
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
