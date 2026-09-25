import { useRef, useState } from "react";
import { FiPlay, FiRefreshCw } from "react-icons/fi";
import { LRUCache } from "./lib/LRUCache";
import CacheState from "./components/CacheState";
import OperationLog from "./components/OperationLog";

const DEFAULT_CAPACITY = 2;

export default function App() {
  const [capacity, setCapacity] = useState(DEFAULT_CAPACITY);
  const cacheRef = useRef(new LRUCache(DEFAULT_CAPACITY));
  const [entries, setEntries] = useState([]);
  const [log, setLog] = useState([]);
  const [putKey, setPutKey] = useState("");
  const [putValue, setPutValue] = useState("");
  const [getKey, setGetKey] = useState("");

  const sync = () => setEntries(cacheRef.current.entries());
  const pushLog = (line) => setLog((l) => [...l, line]);

  const reset = (newCapacity = capacity) => {
    cacheRef.current = new LRUCache(newCapacity);
    setEntries([]);
    setLog([]);
  };

  const handlePut = () => {
    if (!putKey) return;
    cacheRef.current.put(putKey, putValue);
    pushLog(`put("${putKey}", "${putValue}")`);
    sync();
    setPutKey("");
    setPutValue("");
  };

  const handleGet = () => {
    if (!getKey) return;
    const result = cacheRef.current.get(getKey);
    pushLog(`get("${getKey}")  ->  ${result}`);
    sync();
    setGetKey("");
  };

  const runAssignmentExample = () => {
    reset(2);
    const cache = new LRUCache(2);
    cacheRef.current = cache;

    const steps = [];
    cache.put("A", 10);
    steps.push('put("A", 10)');
    cache.put("B", 20);
    steps.push('put("B", 20)');
    steps.push(`get("A")  ->  ${cache.get("A")}`);
    cache.put("C", 30);
    steps.push('put("C", 30)   // evicts "B" (least recently used)');
    steps.push(`get("B")  ->  ${cache.get("B")}`);
    steps.push(`get("C")  ->  ${cache.get("C")}`);
    steps.push(`get("A")  ->  ${cache.get("A")}`);

    setLog(steps);
    setEntries(cache.entries());
  };

  return (
    <div className="min-h-screen bg-base-200 flex justify-center">
      <div className="w-full max-w-2xl px-4 py-8 flex flex-col gap-5">
        <header>
          <h1 className="text-black text-2xl font-bold">LRU Cache — Live Demo</h1>
          <p className="text-black text-base mt-1">
            Backed by <code className="font-mono">src/lib/LRUCache.js</code> — O(1) average
            get()/put() using a single JavaScript Map.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-center gap-3">
          <label className="text-black text-base font-medium">Capacity</label>
          <input
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value) || 1)}
            className="input input-bordered input-sm w-20 text-black"
          />
          <button onClick={() => reset(capacity)} className="btn btn-sm btn-outline gap-1 text-black">
            <FiRefreshCw size={14} /> Reset cache
          </button>
          <button onClick={runAssignmentExample} className="btn btn-sm btn-primary gap-1">
            <FiPlay size={14} /> Run assignment example
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-black text-base font-medium mb-2">put(key, value)</p>
            <div className="flex gap-2">
              <input
                placeholder="key"
                value={putKey}
                onChange={(e) => setPutKey(e.target.value)}
                className="input input-bordered input-sm w-1/2 text-black"
              />
              <input
                placeholder="value"
                value={putValue}
                onChange={(e) => setPutValue(e.target.value)}
                className="input input-bordered input-sm w-1/2 text-black"
              />
            </div>
            <button onClick={handlePut} className="btn btn-sm btn-primary mt-2 w-full">
              Put
            </button>
          </div>

          <div>
            <p className="text-black text-base font-medium mb-2">get(key)</p>
            <input
              placeholder="key"
              value={getKey}
              onChange={(e) => setGetKey(e.target.value)}
              className="input input-bordered input-sm w-full text-black"
            />
            <button onClick={handleGet} className="btn btn-sm btn-outline mt-2 w-full text-black">
              Get
            </button>
          </div>
        </div>

        <CacheState entries={entries} capacity={capacity} />
        <OperationLog log={log} />
      </div>
    </div>
  );
}
