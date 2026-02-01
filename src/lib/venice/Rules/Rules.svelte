<div class="root">
	<p>
		The Grand Carnival of Venice is upon us! Five distinguished participants await their
		performance. Bestow upon each their rightful mask by adhering to the following decrees:
	</p>
	<ul>
		<li>The <span class="solution-green">Green</span> mask is at one end of the row.</li>
		<li>The <span class="solution-purple">Purple</span> mask is not at either end of the row.</li>
		<li>
			The <span class="solution-red">Red</span> mask is positioned to the right of the
			<span class="solution-yellow">Yellow</span> mask, yet they must not stand side-by-side.
		</li>
		<li>
			The <span class="solution-cyan">Cyan</span> mask is positioned immediately to the left of the
			<span class="solution-purple">Purple</span> mask.
		</li>
		<li>The <span class="solution-cyan">Cyan</span> mask shall not occupy the central position.</li>
	</ul>
	<p>Drag and drop each mask upon its wearer.</p>
	<div class="fade-overlay"></div>
</div>

<style>
	.root {
		--fade-size: 200px;
		color: #f0eed7;
		line-height: 1.6;
		padding: 60px;
		max-width: 800px;
		padding-bottom: 30px;
		margin-inline: auto;
		position: relative;
		overflow: clip;
	}

	.fade-overlay {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: calc(100% + var(--fade-size));
		background: linear-gradient(
			to top,
			#1e2b08 0%,
			#1e2b08 calc(100% - var(--fade-size)),
			transparent 100%
		);
		pointer-events: none;
		animation: reveal 2s ease-out 3s forwards;
		animation-fill-mode: forwards;
	}

	@keyframes reveal {
		to {
			bottom: calc(-100% - var(--fade-size));
		}
	}

	p,
	ul,
	li {
		margin: 0;
		padding: 0;
	}

	ul {
		list-style-type: disc;
		list-style-position: outside;
		padding-left: 30px;
		margin-block: 6px;
	}

	.solution-green,
	.solution-purple,
	.solution-red,
	.solution-cyan,
	.solution-yellow {
		font-weight: 600;
		/* -webkit-text-stroke: 2px black;
		paint-order: stroke fill; */
	}

	.solution-green {
		color: #c0c92d;
	}

	.solution-purple {
		color: #8a75d5;
	}

	.solution-red {
		color: #df5e29;
	}

	.solution-cyan {
		color: #57ccdf;
	}

	.solution-yellow {
		color: #ffb53f;
	}
</style>
