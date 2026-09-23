export default function Skeleton() {
  return (
    <div
      className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-md dark:bg-black/50"
      aria-hidden="true"
    >
      <div className="h-48 w-full bg-gray-200 dark:bg-white/10" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-white/10" />
        <div className="flex justify-between gap-2">
          <div className="h-3 w-1/5 rounded bg-gray-200 dark:bg-white/10" />
          <div className="h-3 w-1/5 rounded bg-gray-200 dark:bg-white/10" />
          <div className="h-3 w-1/5 rounded bg-gray-200 dark:bg-white/10" />
          <div className="h-3 w-1/5 rounded bg-gray-200 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}
