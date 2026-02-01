<script lang="ts">
	import { quadInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { correctMaskAssignments, type MaskId, type ParticipantId } from '..';

	let {
		maskAssignments,
		scrollToParticipantsRow
	}: {
		maskAssignments: Record<ParticipantId, MaskId | undefined>;
		scrollToParticipantsRow: () => void;
	} = $props();

	const transitionDuration = 700;

	let state = $state<'correct' | 'incorrect' | 'showConfirmButton'>('showConfirmButton');

	$effect(() => {
		if (state === 'incorrect') {
			setTimeout(() => {
				state = 'showConfirmButton';
			}, 4000);
		}
	});

	function onConfirm() {
		const isCorrect = Object.entries(maskAssignments).every(([participantId, maskId]) => {
			return maskId === correctMaskAssignments[participantId as ParticipantId];
		});

		if (isCorrect) {
			state = 'correct';
			scrollToParticipantsRow();
		} else {
			state = 'incorrect';
		}
	}

	// ... add a restart button
</script>

<div class="container">
	{#if state === 'showConfirmButton'}
		<button
			in:fade={{ delay: transitionDuration, duration: transitionDuration, easing: quadInOut }}
			out:fade={{ duration: transitionDuration, easing: quadInOut }}
			class="confirm-button"
			onclick={onConfirm}>Confirm</button
		>
	{:else if state === 'correct'}
		<div
			in:fade={{ delay: transitionDuration, duration: transitionDuration, easing: quadInOut }}
			out:fade={{ duration: transitionDuration, easing: quadInOut }}
			class="label-correct-answers"
		>
			Correct!
		</div>
	{:else if state === 'incorrect'}
		<div
			in:fade={{ delay: transitionDuration, duration: transitionDuration, easing: quadInOut }}
			out:fade={{ duration: transitionDuration, easing: quadInOut }}
			class="label-incorrect-answers"
		>
			Incorrect!
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

	.container > * {
		grid-column-start: 1;
		grid-column-end: 2;
		grid-row-start: 1;
		grid-row-end: 2;
	}

	.confirm-button,
	.label-correct-answers,
	.label-incorrect-answers {
		margin-bottom: 30px;
		height: 47px;
		align-content: center;
	}

	.confirm-button {
		margin-left: 30px;
		margin-right: 30px;
		border-radius: calc(infinity * 1px);
		padding-inline: 20px;
		font-weight: 550;
		background-color: #f0eed7;
		color: #403c1c;
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
	}

	.label-correct-answers {
		color: #9ac033;
	}

	.label-incorrect-answers {
		color: #dc4d26;
	}
</style>
