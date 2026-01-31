<div class="container">
	<button class="confirm-button">Confirm</button>
	<!-- <div class="bar">
	</div> -->
</div>

<style>
	.container {
		--background-base-color: #1e2b08;
		--button-height: 47px;
		--margin-bottom: 30px;

		position: sticky;
		bottom: 0;
		width: 100%;
		display: grid;
		justify-items: center;

		background: linear-gradient(
			0deg,
			var(--background-base-color) 0%,
			var(--background-base-color) calc(var(--button-height) + var(--margin-bottom) + 15px),
			hsl(from var(--background-base-color) h s l / 0) 100%
		);
	}

	/* .bar {
		margin-left: 40px;
		margin-right: 40px;
		margin-bottom: 40px;
		background-color: #0f2007;
		height: 60px;
		border-radius: calc(infinity * 1px);
	}

	.confirm-button {
		height: 40px;
		border-radius: calc(infinity * 1px);
	} */

	.confirm-button {
		position: sticky;
		bottom: 0;
		margin-left: 30px;
		margin-right: 30px;
		margin-bottom: var(--margin-bottom);
		margin-top: 30px;
		height: var(--button-height);
		border-radius: calc(infinity * 1px);
		padding-inline: 20px;
		font-weight: 550;
		background-color: #f0eed7;
		color: #544f25;
	}
</style>
