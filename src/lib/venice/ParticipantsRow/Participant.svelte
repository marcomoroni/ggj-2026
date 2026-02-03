<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { MaskId, ParticipantId } from '..';

	let {
		participantId,
		maskId,
		containerHeight,
		onDropMask,
		isRevealed,
		playJumpAnimation
	}: {
		participantId: ParticipantId;
		maskId?: MaskId | undefined;
		containerHeight: number;
		onDropMask: (targetParticipantId: ParticipantId) => void;
		isRevealed: boolean;
		playJumpAnimation: boolean;
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
		'decoration-animation-pivot',
		participantId === 'a' && 'decoration-animation-pivot-a',
		participantId === 'b' && 'decoration-animation-pivot-b',
		participantId === 'c' && 'decoration-animation-pivot-c',
		participantId === 'd' && 'decoration-animation-pivot-d',
		participantId === 'e' && 'decoration-animation-pivot-e',
		isRevealed && 'revealed'
	]}
>
	<div
		class={[
			'jump-animation-pivot',
			playJumpAnimation && 'jump-animation-active',
			participantId === 'a' && 'jump-animation-pivot-a',
			participantId === 'b' && 'jump-animation-pivot-b',
			participantId === 'c' && 'jump-animation-pivot-c',
			participantId === 'd' && 'jump-animation-pivot-d',
			participantId === 'e' && 'jump-animation-pivot-e'
		]}
	>
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
				class={[
					'mask-drag-and-drop-pivot',
					isDraggingMask.kind === 'yes' && 'dragging-in-progress'
				]}
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
	</div>
</div>

<style>
	.participant,
	.mask {
		position: absolute;
		left: 0;
		bottom: 0;
		transform: translate3d(-50%, 0, 0);
		height: var(--container-height);
		aspect-ratio: 315 / 1125;

		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
	}

	.mask {
		touch-action: none;
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

	.decoration-animation-pivot:not(.revealed) {
		opacity: 0;
	}

	.decoration-animation-pivot {
		position: absolute;
		left: 0;
		bottom: 0;
	}

	.decoration-animation-pivot.revealed {
		animation-name: appear;
		animation-timing-function: ease-out;
		animation-duration: 1s;
		animation-fill-mode: backwards;
	}

	.decoration-animation-pivot-a {
		animation-delay: 0.5s;
	}

	.decoration-animation-pivot-b {
		animation-delay: 0.7s;
	}

	.decoration-animation-pivot-c {
		animation-delay: 0.9s;
	}

	.decoration-animation-pivot-d {
		animation-delay: 1.1s;
	}

	.decoration-animation-pivot-e {
		animation-delay: 1.3s;
	}

	@keyframes appear {
		0% {
			transform: translate3d(0, 0, 0);
			opacity: 0;
		}
		10% {
			transform: translate3d(0, -6px, 0);
			opacity: 1;
		}
		20% {
			transform: translate3d(0, 0, 0);
			opacity: 1;
		}
		100% {
			transform: translate3d(0, 0, 0);
			opacity: 1;
		}
	}

	.jump-animation-pivot {
		position: absolute;
		left: 0;
		bottom: 0;
	}

	.jump-animation-pivot.jump-animation-active {
		animation-name: jump;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}

	.jump-animation-pivot-a {
		animation-delay: 1.5s;
	}

	.jump-animation-pivot-b {
		animation-delay: 2.2s;
	}

	.jump-animation-pivot-c {
		animation-delay: 2.9s;
	}

	.jump-animation-pivot-d {
		animation-delay: 3.6s;
	}

	.jump-animation-pivot-e {
		animation-delay: 4.3s;
	}

	@keyframes jump {
		0% {
			transform: translate3d(0, 0, 0);
		}
		10% {
			transform: translate3d(0, -6px, 0);
		}
		20% {
			transform: translate3d(0, 0, 0);
		}
		100% {
			transform: translate3d(0, 0, 0);
		}
	}
</style>
