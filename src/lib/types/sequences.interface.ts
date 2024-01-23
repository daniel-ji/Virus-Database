export interface Sequence {
	id: string;
	name: string;
	description: string;
	created_at: string;
	updated_at: string;
	filename: string;
	filepath: string;
}

export interface SequenceState {
	id: string;
	sequence: Sequence;
	oldSequence: Sequence;
}