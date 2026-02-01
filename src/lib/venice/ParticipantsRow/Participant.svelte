<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { MaskId, ParticipantId } from '..';

	let {
		participantId,
		maskId,
		containerHeight,
		onDropMask
	}: {
		participantId: ParticipantId;
		maskId?: MaskId | undefined;
		containerHeight: number;
		onDropMask: (targetParticipantId: ParticipantId) => void;
	} = $props();

	let isDraggingMask = $state<
		| { kind: 'no' }
		| { kind: 'yes'; startX: number; startY: number; currentX: number; currentY: number }
	>({
		kind: 'no'
	});

	function dragAndDrop(): Attachment<HTMLDivElement> {
		return (element) => {
			element.addEventListener('pointerdown', (event) => {
				event.preventDefault();
				element.setPointerCapture(event.pointerId);
				isDraggingMask = {
					kind: 'yes',
					startX: event.clientX,
					startY: event.clientY,
					currentX: event.clientX,
					currentY: event.clientY
				};
			});
			element.addEventListener('pointermove', (event) => {
				if (isDraggingMask.kind === 'no') return;
				event.preventDefault();
				isDraggingMask = { ...isDraggingMask, currentX: event.clientX, currentY: event.clientY };
			});
			element.addEventListener('pointerup', (event) => {
				if (isDraggingMask.kind === 'no') return;
				event.preventDefault();

				const targetElement = document.elementFromPoint(event.clientX, event.clientY);
				const pivotElement = targetElement?.closest('.pivot');
				const targetParticipantId = pivotElement?.getAttribute(
					'data-participant-id'
				) as ParticipantId | null;

				if (targetParticipantId) {
					onDropMask(targetParticipantId);
				}

				isDraggingMask = { kind: 'no' };
			});
			element.addEventListener('pointercancel', (event) => {
				if (isDraggingMask.kind === 'no') return;
				event.preventDefault();
				isDraggingMask = { kind: 'no' };
			});
		};
	}
</script>

<div
	class={[
		'participant',
		participantId === 'a' && 'participant-a',
		participantId === 'b' && 'participant-b',
		participantId === 'c' && 'participant-c',
		participantId === 'd' && 'participant-d',
		participantId === 'e' && 'participant-e'
	]}
	style:--container-height={`${containerHeight}px`}
></div>
{#if maskId}
	<div
		class={['mask-drag-and-drop-pivot', isDraggingMask.kind === 'yes' && 'dragging-in-progress']}
		style:--drag-dx={isDraggingMask.kind === 'yes'
			? `${isDraggingMask.currentX - isDraggingMask.startX}px`
			: undefined}
		style:--drag-dy={isDraggingMask.kind === 'yes'
			? `${isDraggingMask.currentY - isDraggingMask.startY}px`
			: undefined}
	>
		<div
			class={[
				'mask',
				maskId === 'red' && 'mask-red',
				maskId === 'yellow' && 'mask-yellow',
				maskId === 'green' && 'mask-green',
				maskId === 'cyan' && 'mask-cyan',
				maskId === 'purple' && 'mask-purple'
			]}
			style:--container-height={`${containerHeight}px`}
			{@attach dragAndDrop()}
		></div>
	</div>
{/if}

<style>
	.participant,
	.mask {
		position: absolute;
		left: 0;
		bottom: 0;
		transform: translateX(-50%);
		height: var(--container-height);
		aspect-ratio: 315 / 1125;

		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
	}

	.mask-drag-and-drop-pivot {
		position: absolute;
		left: 0;
		bottom: 0;
		height: 0;
		width: 0;
	}

	.dragging-in-progress {
		transform: translateX(var(--drag-dx)) translateY(var(--drag-dy));
		z-index: 100;
		pointer-events: none;
	}

	.participant-a {
		background-image: url($lib/venice/ParticipantsRow/participant_a.png);
	}

	.participant-b {
		background-image: url($lib/venice/ParticipantsRow/participant_b.png);
	}

	.participant-c {
		background-image: url($lib/venice/ParticipantsRow/participant_c.png);
	}

	.participant-d {
		background-image: url($lib/venice/ParticipantsRow/participant_d.png);
	}

	.participant-e {
		background-image: url($lib/venice/ParticipantsRow/participant_e.png);
	}

	.mask-red {
		background-image: url($lib/venice/ParticipantsRow/mask_red.png);
	}

	.mask-yellow {
		background-image: url($lib/venice/ParticipantsRow/mask_yellow.png);
	}

	.mask-green {
		background-image: url($lib/venice/ParticipantsRow/mask_green.png);
	}

	.mask-cyan {
		background-image: url($lib/venice/ParticipantsRow/mask_cyan.png);
	}

	.mask-purple {
		background-image: url($lib/venice/ParticipantsRow/mask_purple.png);
	}
</style>
