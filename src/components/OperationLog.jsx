export default function OperationLog({ log }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <h2 className="font-semibold text-black text-base mb-3">Operation log</h2>
      {log.length === 0 ? (
        <p className="text-black text-sm">
          Run the example or try your own put/get operations below.
        </p>
      ) : (
        <ol className="space-y-1.5">
          {log.map((entry, i) => (
            <li key={i} className="flex items-start gap-2 font-mono text-sm text-black">
              <span className="text-black/40 w-6 text-right shrink-0">{i + 1}.</span>
              <span>{entry}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
