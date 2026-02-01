<script lang="ts">
	import Root from '$lib/Root';
	import type { MaskId, ParticipantId } from '$lib/venice';
	import BottomBar from '$lib/venice/BottomBar/BottomBar.svelte';
	import ParticipantsRow from '$lib/venice/ParticipantsRow';
	import Rules from '$lib/venice/Rules';

	let maskAssignments = $state<Record<ParticipantId, MaskId | undefined>>({
		a: 'red',
		b: 'yellow',
		c: 'green',
		d: 'cyan',
		e: 'purple'
	});
	let revealParticipantsRow = $state(() => {});
	let scrollToParticipantsRow = $state(() => {});
	let playJumpAnimations = $state(false);
	let makeMasksInert = $state(() => {});

	function restart() {
		history.scrollRestoration = 'manual';
		window.scrollTo(0, 0);
		window.location.reload();
	}
</script>

<Root>
	<div class="font">
		<Rules />
		<ParticipantsRow
			bind:playJumpAnimations
			bind:maskAssignments
			bind:revealParticipantsRow
			bind:scrollToParticipantsRow
			bind:makeMasksInert
		/>
		<BottomBar
			{maskAssignments}
			{revealParticipantsRow}
			{scrollToParticipantsRow}
			bind:playJumpAnimations
			{restart}
			{makeMasksInert}
		/>
		<div class="spacer-bottom"></div>
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

	.spacer-bottom {
		height: 40px;
	}
</style>
