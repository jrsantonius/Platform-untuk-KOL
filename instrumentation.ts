export async function register() {
  // Node.js 22+ adds a partial `localStorage` global without proper Web Storage methods.
  // This breaks Next.js dev overlay during SSR. Remove it so typeof checks return 'undefined'.
  if (typeof (globalThis as Record<string, unknown>).localStorage !== "undefined") {
    try {
      delete (globalThis as Record<string, unknown>).localStorage;
    } catch {
      (globalThis as Record<string, unknown>).localStorage = undefined;
    }
  }
}
