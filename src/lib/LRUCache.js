/**
 * LRUCache
 * --------
 * Least Recently Used cache with O(1) average time get() and put().
 *
 * Data structure: a single JavaScript Map.
 * Why a Map and not a hashmap + hand-rolled doubly linked list?
 *   - A JS Map already preserves insertion order, and re-inserting an
 *     existing key moves it to the END of that iteration order.
 *   - Map.get / Map.set / Map.delete / Map.has are all O(1) average.
 *   - That means "insertion order" doubles as "recency order" for free:
 *     the FRONT of the Map is always the least recently used key, and the
 *     BACK is always the most recently used key. We never need to walk
 *     the structure to find the LRU entry — Map.keys().next().value
 *     gives it directly.
 *   - This gets us the same O(1) behavior as a classic HashMap + Doubly
 *     Linked List design, without writing or maintaining the linked list
 *     ourselves.
 *
 * How LRU ordering is maintained:
 *   - get(key): if present, delete + re-set the entry so it jumps to the
 *     back (most recently used position), then return its value.
 *   - put(key, value): if the key exists, delete it first (so it can be
 *     re-inserted at the back). If the key is new and the cache is at
 *     capacity, evict the front-most entry (map.keys().next().value)
 *     before inserting the new one at the back.
 *
 * Time complexity: O(1) average for both get() and put()
 *   (Map operations are O(1) average in V8; no loops over cache contents).
 * Space complexity: O(capacity) — the cache never holds more than
 *   `capacity` entries.
 */
export class LRUCache {
  constructor(capacity) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error("Capacity must be a positive integer");
    }
    this.capacity = capacity;
    /** @type {Map<any, any>} insertion order === recency order */
    this.map = new Map();
  }

  /**
   * Returns the stored value for `key`, or -1 if the key doesn't exist.
   * A successful get refreshes the key's recency (moves it to the back).
   */
  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value); // re-insert -> now the most recently used
    return value;
  }

  /**
   * Inserts or updates a key/value pair. If the cache is at capacity and
   * `key` is new, the least recently used entry is evicted first.
   */
  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key); // remove old position so it moves to the back
    } else if (this.map.size >= this.capacity) {
      const lruKey = this.map.keys().next().value; // front = least recently used
      this.map.delete(lruKey);
    }
    this.map.set(key, value);
  }

  /** Current number of entries in the cache. */
  get size() {
    return this.map.size;
  }

  /**
   * Debug/demo helper: returns [key, value] pairs ordered from least
   * recently used to most recently used. Does not affect recency itself.
   */
  entries() {
    return Array.from(this.map.entries());
  }
}
