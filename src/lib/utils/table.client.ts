import type { Writable } from 'svelte/store';
import { get } from 'svelte/store';

/**
 * For sorting some entries by a field. Helper function for table data views.
 * 
 * @param currentSortField - The current field to sort by
 * @param currentSortOrder - The current sort order
 * @param entries - The entries to sort
 * @param entrySubfield - The subfield of the entry to sort by (if the object values are nested)
 * @param field - The field to sort by
 * @param forceSortDesc - If true, force the sort order to be descending
 */
export const sortViewBy = (currentSortField: Writable<string>, currentSortOrder: Writable<number>, entries: Writable<any[]>, entrySubfield: string | null,
	field: string, forceSortDesc: boolean = false) => {
	if (field === get(currentSortField) && !forceSortDesc) {
		currentSortOrder.set(get(currentSortOrder) * -1);
	} else {
		currentSortField.set(field);
		currentSortOrder.set(1);
	}

	get(entries).sort((a, b) => {
		let aField = entrySubfield ? a[entrySubfield][field] : a[field];
		let bField = entrySubfield ? b[entrySubfield][field] : b[field];
		aField = typeof aField === "string" ? aField.toLowerCase() : aField;
		bField = typeof bField === "string" ? bField.toLowerCase() : bField;
		if (aField < bField) {
			return get(currentSortOrder) * -1;
		}
		if (aField > bField) {
			return get(currentSortOrder);
		}
		return 0;
	});

	entries.set(get(entries));
};