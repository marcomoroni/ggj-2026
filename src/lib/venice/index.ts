export type MaskId = 'red' | 'yellow' | 'green' | 'cyan' | 'purple';
export type ParticipantId = 'a' | 'b' | 'c' | 'd' | 'e';
export const participantIds: ParticipantId[] = ['a', 'b', 'c', 'd', 'e'];

export const correctMaskAssignments: Record<ParticipantId, MaskId> = {
	a: 'yellow',
	b: 'cyan',
	c: 'purple',
	d: 'red',
	e: 'green'
};
