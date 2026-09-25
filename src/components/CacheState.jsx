export default function CacheState({ entries, capacity }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-black text-base">Current cache state</h2>
        <span className="text-black text-sm">
          {entries.length} / {capacity} slots used
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="text-black text-sm">Cache is empty.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {entries.map(([key, value], index) => (
            <div
              key={key}
              className={`badge badge-lg gap-1 text-black text-sm border ${
                index === entries.length - 1
                  ? "bg-primary/10 border-primary"
                  : "bg-base-200 border-base-300"
              }`}
            >
              <span className="font-semibold">{String(key)}</span>
              <span>= {String(value)}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-black text-sm mt-3">
        Left = least recently used &nbsp;→&nbsp; Right (highlighted) = most recently used
      </p>
    </div>
  );
}
