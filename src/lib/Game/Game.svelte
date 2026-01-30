<script lang="ts" module>
	export type GameDefinition = {
		logic: (args: { screenSize: { x: number; y: number } }) => {
			tick: GameTick;
			dispose: () => void;
		};
	};
	export type VirtualPointer =
		| {
				kind: 'up';
				justReleased: { kind: 'no' } | { kind: 'yes'; intent: 'intentional' | 'canceled' };
		  }
		| { kind: 'down'; justPressed: boolean; x: number; y: number };
	export type GameTick = (args: {
		deltaTime: number;
		elapsedTime: number;
		input: {
			pointer: VirtualPointer;
		};
		canvas: CanvasCommands;
	}) => void;
	export type CanvasCommands = {
		setFillStyle: (fillStyle: CanvasRenderingContext2D['fillStyle']) => void;
		fillRect: CanvasRenderingContext2D['fillRect'];
		drawImage: CanvasRenderingContext2D['drawImage'];
		setStrokeStyle: (strokeStyle: CanvasRenderingContext2D['strokeStyle']) => void;
		setLineWidth: (lineWidth: CanvasRenderingContext2D['lineWidth']) => void;
		strokeRect: CanvasRenderingContext2D['strokeRect'];
	};

	function viewportToVirtualScreenPosition(
		vieportPosition: { x: number; y: number },
		virtualWidth: number,
		virtualHeight: number,
		canvasElRect: DOMRect
	) {
		return {
			x: Math.max(
				0,
				Math.min(
					virtualWidth,
					Math.floor((vieportPosition.x - canvasElRect.left) * (virtualWidth / canvasElRect.width))
				)
			),
			y: Math.max(
				0,
				Math.min(
					virtualHeight,
					Math.floor((vieportPosition.y - canvasElRect.top) * (virtualHeight / canvasElRect.height))
				)
			)
		};
	}
</script>

<script lang="ts">
	import { AnimationFrames, ElementSize } from 'runed';

	const { gameDefinition }: { gameDefinition: GameDefinition } = $props();

	const virtualWidth = 426;
	const virtualHeight = 240;

	let rootEl = $state<HTMLElement | null>(null);
	let gameWrapperEl = $state<HTMLElement | null>(null);
	let canvasEl = $state<HTMLCanvasElement | null>(null);

	const rootElSize = new ElementSize(() => rootEl);
	let wrapperElementLayout = $state({
		offsetX: 0,
		offsetY: 0,
		width: virtualWidth,
		height: virtualHeight
	});
	function resize() {
		if (!gameWrapperEl) {
			return;
		}

		const scale = Math.min(rootElSize.width / virtualWidth, rootElSize.height / virtualHeight);
		const width = virtualWidth * scale;
		const height = virtualHeight * scale;
		const offsetX = (rootElSize.width - width) / 2;
		const offsetY = (rootElSize.height - height) / 2;
		wrapperElementLayout = { offsetX, offsetY, width, height };
	}
	$effect(resize);

	$effect(() => {
		if (!canvasEl) {
			return;
		}

		const canvasCtx = canvasEl.getContext('2d');
		if (!canvasCtx) {
			return;
		}

		const abortController = new AbortController();

		// Prevent touch gestures on the viewport container.
		canvasEl.addEventListener(
			'touchstart',
			(e) => {
				e.preventDefault();
			},
			{ passive: false, signal: abortController.signal }
		);
		canvasEl.addEventListener(
			'touchmove',
			(e) => {
				e.preventDefault();
			},
			{ passive: false, signal: abortController.signal }
		);
		canvasEl.addEventListener(
			'touchend',
			(e) => {
				e.preventDefault();
			},
			{ passive: false, signal: abortController.signal }
		);

		canvasCtx.imageSmoothingEnabled = false;

		// Fill the canvas as it should never be transparent.
		canvasCtx.fillStyle = 'black';
		canvasCtx.fillRect(0, 0, virtualWidth, virtualHeight);

		// Detect input. Note that we want to have a sigle pointer.
		let activePointer: { virtualX: number; virtualY: number; id: number } | null = null;
		let activePointerUpIntentional = false;
		canvasEl.addEventListener(
			'pointerdown',
			(e) => {
				if (!canvasEl) {
					return;
				}

				e.preventDefault();

				const anotherPointerIsAlreadyActive =
					activePointer !== null && activePointer.id !== e.pointerId;
				if (anotherPointerIsAlreadyActive) {
					return;
				}

				canvasEl.setPointerCapture(e.pointerId);

				const virtualPointerPosition = viewportToVirtualScreenPosition(
					{ x: e.clientX, y: e.clientY },
					virtualWidth,
					virtualHeight,
					canvasEl.getBoundingClientRect()
				);

				activePointer = {
					virtualX: virtualPointerPosition.x,
					virtualY: virtualPointerPosition.y,
					id: e.pointerId
				};
			},
			{ signal: abortController.signal }
		);
		canvasEl.addEventListener(
			'pointermove',
			(e) => {
				if (!canvasEl || !activePointer) {
					return;
				}

				e.preventDefault();

				const isActivePointer = activePointer.id === e.pointerId;
				if (!isActivePointer) {
					return;
				}

				const virtualPointerPosition = viewportToVirtualScreenPosition(
					{ x: e.clientX, y: e.clientY },
					virtualWidth,
					virtualHeight,
					canvasEl.getBoundingClientRect()
				);

				activePointer = {
					...activePointer,
					virtualX: virtualPointerPosition.x,
					virtualY: virtualPointerPosition.y
				};
			},
			{ signal: abortController.signal }
		);
		canvasEl.addEventListener(
			'pointerup',
			(e) => {
				if (!activePointer) {
					return;
				}

				e.preventDefault();

				const isActivePointer = activePointer.id === e.pointerId;
				if (!isActivePointer) {
					return;
				}

				activePointer = null;
				activePointerUpIntentional = true;
			},
			{ signal: abortController.signal }
		);
		canvasEl.addEventListener(
			'pointercancel',
			(e) => {
				if (!activePointer) {
					return;
				}

				e.preventDefault();

				const isActivePointer = activePointer.id === e.pointerId;
				if (!isActivePointer) {
					return;
				}

				activePointer = null;
				activePointerUpIntentional = false;
			},
			{ signal: abortController.signal }
		);
		window.addEventListener(
			'blur',
			() => {
				activePointer = null;
				activePointerUpIntentional = false;
			},
			{ signal: abortController.signal }
		);

		const { tick: gameTick, dispose: gameDispose } = gameDefinition.logic({
			screenSize: { x: virtualWidth, y: virtualHeight }
		});

		// These variables are needed through game frames.
		let virtualPointer: VirtualPointer = { kind: 'up', justReleased: { kind: 'no' } };
		let elapsedTime = 0;

		const tickAnimation = new AnimationFrames(({ delta }) => {
			if (virtualPointer.kind === 'up' && activePointer !== null) {
				virtualPointer = {
					kind: 'down',
					justPressed: true,
					x: activePointer.virtualX,
					y: activePointer.virtualY
				};
			} else if (virtualPointer.kind === 'up' && activePointer === null) {
				virtualPointer = { ...virtualPointer, justReleased: { kind: 'no' } };
			} else if (virtualPointer.kind === 'down' && activePointer !== null) {
				virtualPointer = {
					...virtualPointer,
					justPressed: false,
					x: activePointer.virtualX,
					y: activePointer.virtualY
				};
			} else if (virtualPointer.kind === 'down' && activePointer === null) {
				virtualPointer = {
					kind: 'up',
					justReleased: {
						kind: 'yes',
						intent: activePointerUpIntentional ? 'intentional' : 'canceled'
					}
				};
			}

			elapsedTime += delta;

			gameTick({
				deltaTime: delta,

				elapsedTime,

				input: { pointer: structuredClone(virtualPointer) },

				// All the functions provided should draw snapping to the pixel grid.
				canvas: {
					setFillStyle: (fillStyle) => {
						canvasCtx.fillStyle = fillStyle;
					},
					fillRect: (x, y, w, h) =>
						canvasCtx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)),
					drawImage: (image: CanvasImageSource, ...args: number[]) => {
						if (args.length === 2) {
							const [dx, dy] = args;
							canvasCtx.drawImage(image, Math.round(dx), Math.round(dy));
						} else if (args.length === 4) {
							const [dx, dy, dw, dh] = args;
							canvasCtx.drawImage(
								image,
								Math.round(dx),
								Math.round(dy),
								Math.round(dw),
								Math.round(dh)
							);
						} else if (args.length === 8) {
							const [sx, sy, sw, sh, dx, dy, dw, dh] = args;
							canvasCtx.drawImage(
								image,
								sx,
								sy,
								sw,
								sh,
								Math.round(dx),
								Math.round(dy),
								Math.round(dw),
								Math.round(dh)
							);
						}
					},
					setStrokeStyle: (strokeStyle) => {
						canvasCtx.strokeStyle = strokeStyle;
					},
					setLineWidth: (lineWidth) => {
						canvasCtx.lineWidth = lineWidth;
					},
					strokeRect: (x, y, w, h) =>
						canvasCtx.strokeRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
				}
			});
		});

		return () => {
			abortController.abort();
			tickAnimation.stop();
			gameDispose();
		};
	});
</script>

<div bind:this={rootEl} class="root">
	<div
		bind:this={gameWrapperEl}
		class="game-wrapper"
		style:--offset-x={`${wrapperElementLayout.offsetX}px`}
		style:--offset-y={`${wrapperElementLayout.offsetY}px`}
		style:--width={`${wrapperElementLayout.width}px`}
		style:--height={`${wrapperElementLayout.height}px`}
	>
		<canvas bind:this={canvasEl} class="canvas" width={virtualWidth} height={virtualHeight}
		></canvas>
	</div>
</div>

<style>
	.root {
		width: 100%;
		height: 100%;
		overflow: clip;
		background-color: palegreen;
	}

	.game-wrapper {
		position: absolute;
		transform-origin: top left;
		transform: translate(var(--offset-x), var(--offset-y));
		width: var(--width);
		height: var(--height);
		overflow: clip;
		background-color: blueviolet;
	}

	.canvas {
		width: 100%;
		height: 100%;
		image-rendering: pixelated;
		touch-action: none;
		overscroll-behavior: none;
	}
</style>
