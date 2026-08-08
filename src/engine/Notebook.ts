/** Append-only, verbatim record of what they told you, and when.
 *  The horror is the ladder of contradictions — so entries are never
 *  deduplicated, edited, or reordered. */
export interface NotebookEntry {
  time: string;
  text: string;
}

export class Notebook {
  private list: NotebookEntry[] = [];

  add(time: string, text: string): void {
    this.list.push({ time, text });
  }

  entries(): ReadonlyArray<NotebookEntry> {
    return [...this.list];
  }
}
