<script lang="ts">
	import type { MaskId, ParticipantId } from '..';

	let {
		participantId,
		maskId,
		containerHeight
	}: { participantId: ParticipantId; maskId?: MaskId | undefined; containerHeight: number } =
		$props();
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
		class={[
			'mask',
			maskId === 'red' && 'mask-red',
			maskId === 'yellow' && 'mask-yellow',
			maskId === 'green' && 'mask-green',
			maskId === 'cyan' && 'mask-cyan',
			maskId === 'purple' && 'mask-purple'
		]}
		style:--container-height={`${containerHeight}px`}
	></div>
{/if}

<style>
	.participant,
	.mask {
		position: absolute;
		left: 0;
		bottom: 0;
		transform: translateX(-50%);
		height: var(--container-height);
		aspect-ratio: 384 / 1260;

		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
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
