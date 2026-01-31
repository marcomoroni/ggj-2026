<div class="container">
	<button class="confirm-button">Confirm</button>
</div>

<style>
	.container {
		--background-base-color: #1e2b08;

		position: sticky;
		bottom: 0;
		width: 100%;
		display: grid;
		justify-items: center;
		background: linear-gradient(
			0deg,
			hsl(from var(--background-base-color) h s l / 0.6) 0%,
			hsl(from var(--background-base-color) h s l / 0) 100%
		);
	}

	.confirm-button {
		position: sticky;
		bottom: 0;
		margin-left: 30px;
		margin-right: 30px;
		margin-bottom: 30px;
		margin-top: 60px;
		height: 47px;
		border-radius: calc(infinity * 1px);
		padding-inline: 20px;
		font-weight: 550;
		background-color: #f0eed7;
		color: #403c1c;
	}
</style>
