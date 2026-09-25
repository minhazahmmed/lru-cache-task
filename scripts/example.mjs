import { LRUCache } from "../src/lib/LRUCache.js";
import { LRUCacheWithTTL } from "../src/lib/LRUCacheWithTTL.js";

function log(line) {
  console.log(line);
}

function assertEqual(actual, expected, label) {
  const pass = actual === expected;
  log(`  ${pass ? "PASS" : "FAIL"}  ${label}  =>  got ${actual}, expected ${expected}`);
}

log("=== Task 2: LRU Cache — Example from assignment ===\n");

const cache = new LRUCache(2);

log('cache = LRUCache(2)');

cache.put("A", 10);
log('cache.put("A", 10)');

cache.put("B", 20);
log('cache.put("B", 20)');

let r = cache.get("A");
log(`cache.get("A")       -> ${r}`);
assertEqual(r, 10, 'get("A")');

cache.put("C", 30); // capacity exceeded -> evicts "B" (least recently used)
log('cache.put("C", 30)');

r = cache.get("B");
log(`cache.get("B")       -> ${r}`);
assertEqual(r, -1, 'get("B") after eviction');

r = cache.get("C");
log(`cache.get("C")       -> ${r}`);
assertEqual(r, 30, 'get("C")');

r = cache.get("A");
log(`cache.get("A")       -> ${r}`);
assertEqual(r, 10, 'get("A") still present');

log("\n=== Extra edge-case tests ===\n");

// Updating an existing key should not evict anything and should refresh recency.
const c2 = new LRUCache(2);
c2.put("X", 1);
c2.put("Y", 2);
c2.put("X", 100); // update existing key, X becomes most recent
c2.put("Z", 3); // capacity exceeded -> evicts "Y" (not "X", since X was refreshed)
assertEqual(c2.get("Y"), -1, "update-refreshes-recency: Y evicted, not X");
assertEqual(c2.get("X"), 100, "update-refreshes-recency: X still present with new value");
assertEqual(c2.get("Z"), 3, "update-refreshes-recency: Z present");

// get() on a missing key returns -1 without throwing.
const c3 = new LRUCache(1);
assertEqual(c3.get("missing"), -1, "get on empty cache returns -1");

// Invalid capacity should throw.
try {
  new LRUCache(0);
  log("  FAIL  capacity=0 should throw");
} catch (e) {
  log("  PASS  capacity=0 throws: " + e.message);
}

log("\n=== Bonus: TTL / expiration demo ===\n");

const ttlCache = new LRUCacheWithTTL(2);
ttlCache.put("session", "abc123", 50); // expires in 50ms
log('ttlCache.put("session", "abc123", ttlMs=50)');
log(`Immediately after put -> ${ttlCache.get("session")}`);

await new Promise((res) => setTimeout(res, 80));

log(`After 80ms (expired)  -> ${ttlCache.get("session")}`);
assertEqual(ttlCache.get("session"), -1, "TTL: entry expired and treated as miss");

log("\n=== Done ===");
