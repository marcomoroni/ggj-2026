<script lang="ts">
	import { quadInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { correctMaskAssignments, type MaskId, type ParticipantId } from '..';
	import Button from './Button.svelte';

	let {
		maskAssignments,
		revealParticipantsRow,
		scrollToParticipantsRow,
		playJumpAnimations = $bindable(),
		restart,
		makeMasksInert
	}: {
		maskAssignments: Record<ParticipantId, MaskId | undefined>;
		revealParticipantsRow: () => void;
		scrollToParticipantsRow: () => void;
		playJumpAnimations: boolean;
		restart: () => void;
		makeMasksInert: () => void;
	} = $props();

	const transitionDuration = 400;

	let state = $state<
		'empty' | 'start' | 'correct' | 'incorrect' | 'showConfirmButton' | 'showRestartButton'
	>('start');

	$effect(() => {
		if (state === 'incorrect') {
			setTimeout(() => {
				state = 'showConfirmButton';
			}, 4000);
		}
	});

	$effect(() => {
		if (state === 'start') {
			setTimeout(() => {
				revealParticipantsRow();
			}, 1000);
			setTimeout(() => {
				state = 'showConfirmButton';
			}, 5000);
		}
	});

	function onConfirm() {
		const isCorrect = Object.entries(maskAssignments).every(([participantId, maskId]) => {
			return maskId === correctMaskAssignments[participantId as ParticipantId];
		});

		if (isCorrect) {
			makeMasksInert();
			state = 'correct';
			// scrollToParticipantsRow();
			playJumpAnimations = true;
			setTimeout(() => {
				state = 'showRestartButton';
			}, 6000);
		} else {
			state = 'incorrect';
		}
	}
</script>

<div class="container">
	{#if state === 'showConfirmButton'}
		<Button onClick={onConfirm}>Confirm</Button>
	{:else if state === 'showRestartButton'}
		<Button onClick={restart}>Restart</Button>
	{:else if state === 'correct'}
		<div
			in:fade={{ delay: transitionDuration, duration: transitionDuration, easing: quadInOut }}
			out:fade={{ duration: transitionDuration, easing: quadInOut }}
			class="label-correct-answers"
		>
			Splendidly done!
		</div>
	{:else if state === 'incorrect'}
		<div
			in:fade={{ delay: transitionDuration, duration: transitionDuration, easing: quadInOut }}
			out:fade={{ duration: transitionDuration, easing: quadInOut }}
			class="label-incorrect-answers"
		>
			Alas, not quite!
		</div>
	{/if}
</div>

<style>
	.container {
		--background-base-color: #1e2b08;

		position: sticky;
		bottom: 0;
		width: 100%;
		height: 137px;
		display: grid;
		justify-items: center;
		align-items: end;
		background: linear-gradient(
			0deg,
			hsl(from var(--background-base-color) h s l / 0.6) 0%,
			hsl(from var(--background-base-color) h s l / 0) 100%
		);
	}

	.container > :global(*) {
		grid-column-start: 1;
		grid-column-end: 2;
		grid-row-start: 1;
		grid-row-end: 2;
	}

	.label-correct-answers,
	.label-incorrect-answers {
		margin-bottom: 30px;
		height: 47px;
		align-content: center;
	}

	.label-correct-answers,
	.label-incorrect-answers {
		pointer-events: none;
		text-shadow:
			var(--background-base-color) 0px 0px 20px,
			var(--background-base-color) 0px 0px 20px,
			var(--background-base-color) 0px 0px 20px;
		-webkit-text-stroke: 3px var(--background-base-color);
		paint-order: stroke fill;
		/* font-size: 22px; */
	}

	.label-correct-answers {
		color: #afcc5d;
	}

	.label-incorrect-answers {
		color: #e16745;
	}
</style>
