<div class="root">
	<p>
		The Carnival of Venice is about to begin! Five Carnival participants are standing in a row,
		ready to perform. Assign each the correct mask colour following these rules:
	</p>
	<ul>
		<li>The <span class="solution-green">Green</span> mask is at one end of the row.</li>
		<li>The <span class="solution-purple">Purple</span> mask is not at either end of the row.</li>
		<li>
			The <span class="solution-red">Red</span> mask is to the right of the
			<span class="solution-yellow">Yellow</span> mask, but they are not adjacent.
		</li>
		<li>
			The <span class="solution-cyan">Cyan</span> mask is immediately to the right of the
			<span class="solution-purple">Purple</span> mask.
		</li>
		<li>The <span class="solution-cyan">Cyan</span> mask is not in the middle position.</li>
	</ul>
	<p>Drag and drop the masks on the participants.</p>
</div>

<style>
	@font-face {
		font-family: 'Figtree';
		src: url($lib/venice/Figtree.ttf);
	}

	.root {
		font-family: 'Figtree';
		color: #f0eed7;
		font-size: 16px;
		line-height: 1.6;
		font-weight: 500;
		padding: 40px;
		max-width: 600px;
		padding-bottom: unset;
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
