export default function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2" aria-hidden>
      <span className="h-px w-16 bg-stone-300 dark:bg-stone-700" />
      <span className="h-1.5 w-1.5 rotate-45 bg-clay-500" />
      <span className="h-px w-16 bg-stone-300 dark:bg-stone-700" />
    </div>
  )
}
