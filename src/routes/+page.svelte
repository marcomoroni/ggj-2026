<script lang="ts">
	import Root from '$lib/Root';
	import ParticipantsRow from '$lib/venice/ParticipantsRow';
	import Rules from '$lib/venice/Rules';
</script>

<Root>
	<div class="column">
		<Rules />
		<ParticipantsRow />
	</div>
	<button class="confirm-button">Confirm</button>
</Root>

<style>
	.column {
		display: grid;
		grid-template-rows: auto 1fr;
		min-height: calc(100dvh + 200px);
		position: relative;
	}

	.confirm-button {
		position: sticky;
		bottom: 0;
	}
</style>
