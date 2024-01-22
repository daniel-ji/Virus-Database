export interface Sequence {
	id: string;
	name: string;
	description: string;
	created_at: string; // TODO: use Date instead
	updated_at: string;
	filename: string;
	filepath: string;
}