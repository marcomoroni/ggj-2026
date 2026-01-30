import type { GameDefinition, GameTick } from '$lib/Game';

export const placeholderGameDefinition: GameDefinition = {
	logic: ({ screenSize }) => {
		const velocity = 0.0008;
		let lastPointerPosition = { x: 0, y: 0 };
		let dots = [] as Array<{ kind: 'down' | 'move' | 'up'; x: number; y: number }>;

		const tick: GameTick = ({ deltaTime, elapsedTime, canvas, input: { pointer } }) => {
			if (pointer.kind === 'down') {
				lastPointerPosition = { x: pointer.x, y: pointer.y };
			}

			if (pointer.kind === 'down' && pointer.justPressed) {
				dots.push({ kind: 'down', x: pointer.x, y: pointer.y });
			} else if (pointer.kind === 'down' && !pointer.justPressed) {
				dots.push({ kind: 'move', x: pointer.x, y: pointer.y });
			} else if (pointer.kind === 'up' && pointer.justReleased.kind === 'yes') {
				dots.push({ kind: 'up', x: lastPointerPosition.x, y: lastPointerPosition.y });
			}

			dots.forEach((dot) => {
				dot.y += velocity * deltaTime;
			});

			dots = dots.filter(({ y }) => y <= screenSize.y - 10);

			canvas.setFillStyle('blue');
			canvas.fillRect(0, 0, screenSize.x, screenSize.y);

			// Cycle through hue every 5 seconds (5000 milliseconds).
			const hue = ((elapsedTime * 360) / 5000) % 360;

			// Full saturation, medium lightness for vibrant colors.
			const color = `hsl(${hue}, 100%, 50%)`;

			dots.forEach((dot) => {
				const size = dot.kind === 'move' ? 1 : 5;
				canvas.setFillStyle(color);
				canvas.fillRect(dot.x - size / 2, dot.y - size / 2, size, size);
			});
		};

		return { tick, dispose: () => {} };
	}
};
