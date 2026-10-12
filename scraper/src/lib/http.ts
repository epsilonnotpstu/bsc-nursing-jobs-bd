// HTTP helpers: polite fetch with timeout + retry. Broken gov.bd SSL chains are fixed
// by NODE_EXTRA_CA_CERTS (certs/extra-ca.pem), never by disabling verification.

const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36 BScNursingJobsBD/0.1";

export interface FetchOptions {
  timeoutMs?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchWithRetry(url: string, opts: FetchOptions = {}): Promise<Response> {
  const { timeoutMs = 30_000, retries = 2, headers = {} } = opts;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        // Some hospital sites return 406 without a browser-like Accept header.
        headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8", "Accept-Language": "bn,en;q=0.8", ...headers },
        signal: AbortSignal.timeout(timeoutMs),
        redirect: "follow",
      });
      // Retry only on transient server errors.
      if (res.status >= 500 && attempt < retries) {
        lastErr = new Error(`HTTP ${res.status} for ${url}`);
      } else {
        return res;
      }
    } catch (err) {
      lastErr = err;
    }
    await sleep(1500 * 2 ** attempt);
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

async function ensureOk(url: string, opts?: FetchOptions): Promise<Response> {
  const res = await fetchWithRetry(url, opts);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res;
}

export async function getText(url: string, opts?: FetchOptions): Promise<string> {
  return (await ensureOk(url, opts)).text();
}

export async function getJson<T>(url: string, opts?: FetchOptions): Promise<T> {
  return (await ensureOk(url, opts)).json() as Promise<T>;
}

export async function getBytes(url: string, opts?: FetchOptions): Promise<Uint8Array> {
  return new Uint8Array(await (await ensureOk(url, opts)).arrayBuffer());
}

/** Run async tasks with limited concurrency and a small delay between starts. */
export async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
  delayMs = 300,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
      if (delayMs) await sleep(delayMs);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
