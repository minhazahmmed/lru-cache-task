/**
 * LRUCacheWithTTL (optional bonus)
 * ---------------------------------
 * Same LRU behavior as LRUCache, plus optional per-entry expiration.
 *
 * Approach: each entry stores { value, expiresAt }. Expiration is
 * checked LAZILY — only when a key is accessed via get() (or "seen"
 * via put() overwriting it). If the entry is expired, it's treated as
 * a miss (removed, returns -1) instead of being returned.
 *
 * Trade-offs of lazy expiration (vs. an active sweep with setInterval):
 *   + No background timer, no extra CPU when the cache is idle.
 *   + Still O(1) average per get()/put() — one extra Date.now() + compare.
 *   - An expired entry that is never accessed again just sits in memory
 *     (and counts toward `capacity`) until it's evicted by normal LRU
 *     pressure or overwritten. For a cache with a low write rate and
 *     long TTLs, this can waste slots that "should" be free.
 *   - An alternative (active expiration via setInterval sweeping all
 *     entries) reclaims memory sooner but costs a periodic O(capacity)
 *     scan and doesn't fit a plain browser/Node script as cleanly.
 * For this assessment's scope (in-memory, short-lived demo), lazy
 * expiration is the simpler, sufficient choice.
 */
export class LRUCacheWithTTL {
  constructor(capacity) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error("Capacity must be a positive integer");
    }
    this.capacity = capacity;
    /** @type {Map<any, {value:any, expiresAt:number|null}>} */
    this.map = new Map();
  }

  _isExpired(entry) {
    return entry.expiresAt !== null && entry.expiresAt <= Date.now();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const entry = this.map.get(key);
    if (this._isExpired(entry)) {
      this.map.delete(key);
      return -1;
    }
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }

  /**
   * @param {*} key
   * @param {*} value
   * @param {number|null} ttlMs - milliseconds until expiry, or null for no expiry
   */
  put(key, value, ttlMs = null) {
    const expiresAt = ttlMs != null ? Date.now() + ttlMs : null;

    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const lruKey = this.map.keys().next().value;
      this.map.delete(lruKey);
    }
    this.map.set(key, { value, expiresAt });
  }

  get size() {
    return this.map.size;
  }

  entries() {
    return Array.from(this.map.entries()).map(([k, v]) => [k, v.value, v.expiresAt]);
  }
}
