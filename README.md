# Task 2 — LRU Cache

A Least Recently Used (LRU) cache supporting `Cache(capacity)`, `get(key)`,
and `put(key, value)`, implemented in JavaScript.

## Data structure used, and why

A single [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

A JS `Map` already preserves **insertion order**, and re-inserting an
existing key moves it to the **end** of that order. Combined with
`Map.get` / `set` / `delete` / `has` all being O(1) average, this means
insertion order doubles as recency order for free:

- The **front** of the Map (`map.keys().next().value`) is always the
  **least recently used** key.
- The **back** of the Map is always the **most recently used** key.

This gives the same O(1) behavior as the classic "HashMap + Doubly
Linked List" LRU design, without writing or maintaining a linked list by
hand — the Map's native ordering *is* the linked list.

## How LRU ordering is maintained

- **`get(key)`**: if the key exists, delete it and re-`set` it with the
  same value (moves it to the back / most-recent position), then return
  the value. If it doesn't exist, return `-1`.
- **`put(key, value)`**: if the key already exists, delete it first (so
  it can be re-inserted at the back). If the key is new and the cache is
  already at `capacity`, evict the front-most entry (the LRU one) before
  inserting the new key at the back.

## Complexity

- **Time:** O(1) average for both `get()` and `put()` — no loops over
  the cache's contents; every operation is a constant number of Map
  calls.
- **Space:** O(capacity) — the cache never holds more than `capacity`
  entries at once.

## Bonus: TTL / expiration (`LRUCacheWithTTL`)

`src/lib/LRUCacheWithTTL.js` extends the same idea with optional
per-entry expiration: `put(key, value, ttlMs)` stores `{ value,
expiresAt }`. Expiration is checked **lazily**, only when a key is
accessed — if expired, it's deleted and treated as a miss.

**Trade-off:** lazy expiration avoids any background timer/CPU cost
when idle, but an expired entry that's never accessed again stays in
memory (counting toward `capacity`) until normal LRU pressure evicts
it. An active sweep (`setInterval` scanning all entries) would reclaim
memory sooner, at the cost of a periodic O(capacity) scan. For this
assessment's scope, lazy expiration is the simpler and sufficient
choice.

## How to run

### 1. Console output (for the required Output Screenshot)

```bash
npm install
npm run example
```

This runs `scripts/example.mjs`, which reproduces the assignment's exact
example (`A`, `B`, `A`, `C`, `B`, `C`, `A`), plus edge-case tests
(updating an existing key, get on empty cache, invalid capacity) and the
TTL bonus demo — all with real, unedited console output.

### 2. Visual demo (browser)

```bash
npm run dev
```

Opens an interactive page where you can run `put`/`get` manually or
click "Run assignment example" to replay the exact scripted sequence
and see the cache state + operation log update live.

## Project structure

```
src/lib/LRUCache.js          core implementation
src/lib/LRUCacheWithTTL.js   bonus: TTL/expiration variant
scripts/example.mjs          Node test/example script (console output)
src/App.jsx                  interactive browser demo (React + Tailwind)
src/components/              CacheState, OperationLog display components
```
