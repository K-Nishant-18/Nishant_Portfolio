export interface MyEntry {
  id: number;
  editToken: string;
}

const STORAGE_KEY = 'myGuestbookEntries';

// Reads the list of entries this browser created. Legacy entries created before
// the edit-token system (plain numbers) are dropped: without a token they can no
// longer be deleted server-side.
export function loadMyEntries(): MyEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is MyEntry =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as MyEntry).id === 'number' &&
        typeof (item as MyEntry).editToken === 'string'
    );
  } catch {
    return [];
  }
}

export function saveMyEntries(entries: MyEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Ignore storage errors (private mode, quota, etc.)
  }
}