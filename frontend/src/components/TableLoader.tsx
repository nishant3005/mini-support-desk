const ROWS = 8;

function SkeletonCell({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-4 rounded bg-slate-200 animate-pulse ${className}`}
      style={{ animationDuration: "1.5s" }}
    />
  );
}

export function TableLoader() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200" role="table" aria-busy="true">
        <thead className="bg-slate-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600"
            >
              Title
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600"
            >
              Priority
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600"
            >
              Created
            </th>
            <th scope="col" className="relative px-4 py-3">
              <span className="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {Array.from({ length: ROWS }).map((_, i) => (
            <tr key={i} className="animate-pulse" style={{ animationDuration: "1.5s" }}>
              <td className="px-4 py-3">
                <SkeletonCell className="max-w-[200px]" />
              </td>
              <td className="px-4 py-3">
                <SkeletonCell className="w-16 rounded-full" />
              </td>
              <td className="px-4 py-3">
                <SkeletonCell className="w-14 rounded-full" />
              </td>
              <td className="px-4 py-3">
                <SkeletonCell className="w-24" />
              </td>
              <td className="px-4 py-3 text-right">
                <SkeletonCell className="inline-block w-12" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
