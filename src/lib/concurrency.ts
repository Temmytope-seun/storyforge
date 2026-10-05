/** Runs `tasks` with at most `limit` running concurrently, preserving input order in the result. */
export async function runWithConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  limit: number
): Promise<Array<{ status: "fulfilled"; value: T } | { status: "rejected"; reason: unknown }>> {
  const results: Array<{ status: "fulfilled"; value: T } | { status: "rejected"; reason: unknown }> =
    new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const index = nextIndex++;
      if (index >= tasks.length) return;
      try {
        const value = await tasks[index]();
        results[index] = { status: "fulfilled", value };
      } catch (reason) {
        results[index] = { status: "rejected", reason };
      }
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}
