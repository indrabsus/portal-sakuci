/**
 * Supabase/PostgREST membatasi maksimal 1000 baris per request secara default.
 * Helper ini melakukan paginasi otomatis lewat .range() supaya bisa mengambil
 * seluruh baris meskipun jumlahnya lebih dari 1000.
 */
export async function fetchAllRows<T>(
  buildQuery: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
  pageSize = 1000,
): Promise<T[]> {
  const all: T[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await buildQuery(from, from + pageSize - 1);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;

    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return all;
}
