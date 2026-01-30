<script lang="ts">
	import Game from '$lib/Game';
	import Root from '$lib/Root';
	import { placeholderGameDefinition } from '$lib/placeholder-game';
</script>

<Root>
	<div class="game-viewport">
		<Game gameDefinition={placeholderGameDefinition} />
	</div>
</Root>

<style>
	.game-viewport {
		height: 100dvh;
		width: 100dvw;
	}
</style>
